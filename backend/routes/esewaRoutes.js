import express from "express";
import { generateHmacSha256Hash } from "../../backend/signature.js";
import User from "../models/User.js";

const router = express.Router();

// 1. Route to create the signature
router.post("/create-signature", async (req, res) => {
  const { amount, transaction_uuid } = req.body;
  // Ensure no spaces after commas
  const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

  const signature = generateHmacSha256Hash(data, process.env.ESEWA_SECRET_KEY);

  return res.json({
    signature,
    product_code: process.env.ESEWA_PRODUCT_CODE,
  });
});

// 2. Route to verify and UPDATE database
router.post("/verify-payment", async (req, res) => {
  try {
    const { data, email } = req.body;
    const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    if (decodedData.status === "COMPLETE") {
      const amount = parseInt(decodedData.total_amount.replace(/,/g, ''));
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

        // FIX: Using dot notation to update nested object 'membershipData'
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