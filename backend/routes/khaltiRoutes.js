import express from "express";
import axios from "axios";
import User from "../models/User.js";

const router = express.Router();

// ==============================================================================
// 1. ROUTE TO INITIATE KHALTI PAYMENT
// ==============================================================================
router.post("/khalti-initiate", async (req, res) => {
  try {
    const { amount, transaction_uuid, purchase_order_name, email } = req.body;

    // Khalti demands the amount to be an INTEGER value in PAISA (Rs. 1 = 100 Paisa)
    const amountInPaisa = Math.round(parseFloat(amount) * 100);

    const isMembership = purchase_order_name.toLowerCase().includes("membership") || 
                         purchase_order_name.toLowerCase().includes("plan");
    const purchaseType = isMembership ? "membership" : "shop";

    const payload = {
      return_url: `http://localhost:5173/payment-success?gateway=khalti&email=${encodeURIComponent(email)}&type=${purchaseType}`,
      website_url: "http://localhost:5173",
      amount: amountInPaisa,
      purchase_order_id: transaction_uuid,
      purchase_order_name: purchase_order_name || "Fitness Membership Plan",
    };

    const config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      config
    );

    return res.json(response.data);

  } catch (error) {
    console.error("❌ Khalti Initiation Server Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to securely initialize Khalti processing" });
  }
});

// ==============================================================================
// 2. ROUTE TO VERIFY AND UPDATE DATABASE (Fixed Khalti Response Mapping)
// ==============================================================================
router.post("/khalti-verify", async (req, res) => {
  try {
    const { pidx, email } = req.body;

    if (!pidx) {
      return res.status(400).json({ status: "FAILED", message: "Missing transaction pidx parameter" });
    }

    const config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };

    // Isolated server-to-server lookup check with Khalti
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      config
    );

    // Verify if transaction state shows "Completed"
    if (response.data.status === "Completed") {
      
      // FIX: Khalti returns 'total_amount' in paisa. Converting it back to Rupees cleanly.
      const amountInRupees = Math.round(parseFloat(response.data.total_amount) / 100);
      
      let months = 0;
      let status = "Free Member";

      // Match the calculated integer value to package thresholds
      if (amountInRupees === 4000) {
        status = "Pro Member";
        months = 3;
      } else if (amountInRupees === 7000) {
        status = "Elite Member";
        months = 6;
      }

      if (months > 0 && email) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + months);

        // Atomic operation execution matching your eSewa workflow rules
        const updatedUser = await User.findOneAndUpdate(
          { email: email.trim().toLowerCase() }, 
          {
            $set: {
              "membershipData.membershipStatus": status,
              "membershipData.isMember": true,
              "membershipData.subscriptionDate": new Date(),
              "membershipData.planExpiry": expiryDate,
            },
          },
          { new: true }
        );

        if (updatedUser) {
          console.log(`✅ Success: Updated ${email} to ${status}`);
        } else {
          console.log(`❌ Fail: User ${email} not found in database`);
        }
      } else {
        console.log(`ℹ️ Trace: Months unassigned. Amount calculated: Rs. ${amountInRupees} for email: ${email}`);
      }

      return res.json({ status: "COMPLETE", decodedData: response.data });
    }
    
    res.status(400).json({ status: "FAILED" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;