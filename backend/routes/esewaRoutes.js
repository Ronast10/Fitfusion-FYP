import express from "express";
import { generateHmacSha256Hash } from "../../backend/signature.js";
import User from "../models/User.js";

const router = express.Router();

// 1. Route to create the signature
router.post("/create-signature", async (req, res) => {
  const { amount, transaction_uuid } = req.body;
  
  // FIX: Force 2 decimal places (e.g., 4000 -> "4000.00")
  // eSewa V2 signature verification fails if this format is missing
  const formattedAmount = Number(amount).toFixed(2);
  
  // FIX: Signature string must strictly follow this order and format
  const data = `total_amount=${formattedAmount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

  const signature = generateHmacSha256Hash(data, process.env.ESEWA_SECRET_KEY);

  return res.json({
    signature,
    product_code: process.env.ESEWA_PRODUCT_CODE,
    total_amount: formattedAmount // Send this formatted amount to frontend
  });
});

// 2. Route to verify and UPDATE database
router.post("/verify-payment", async (req, res) => {
  try {
    const { data, email } = req.body;
    // Decode base64 data from eSewa
    const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    if (decodedData.status === "COMPLETE") {
      // FIX: Use parseFloat to handle potential decimals and Math.round for safe integer conversion
      const amount = Math.round(parseFloat(decodedData.total_amount));
      let months = 0;
      let status = "Free Member";

      if (amount === 4000) {
        status = "Pro Member";
        months = 3;
      } else if (amount === 7000) {
        status = "Elite Member";
        months = 6;
      }

      if (months > 0 && email) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + months);

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
      }

      return res.json({ status: "COMPLETE", decodedData });
    }
    
    res.status(400).json({ status: "FAILED" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;