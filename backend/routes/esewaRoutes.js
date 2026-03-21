import express from "express";
import { generateHmacSha256Hash } from "../../backend/signature.js";
import User from "../models/User.js"; // IMPORT YOUR USER MODEL

const router = express.Router();

// 1. Route to create the signature for the payment form
router.post("/create-signature", async (req, res) => {
  const { amount, transaction_uuid } = req.body;
  const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

  const signature = generateHmacSha256Hash(
    data,
    process.env.ESEWA_SECRET_KEY
  );

  return res.json({
    signature,
    product_code: process.env.ESEWA_PRODUCT_CODE,
  });
});

// 2. Route to verify the payment after redirect
router.post("/verify-payment", async (req, res) => {
  try {
    const { data, email } = req.body; // RECEIVE EMAIL FROM FRONTEND

    // Decode the base64 string from eSewa
    const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    if (decodedData.status === "COMPLETE") {
      // --- DATABASE UPDATE LOGIC ---
      const amount = parseInt(decodedData.total_amount.replace(/,/g, ''));
      let months = 0;
      let status = "Free Member";

      if (amount === 4000) {
        status = "Pro Member";
        months = 3;
      } else if (amount === 8000) {
        status = "Elite Member";
        months = 6;
      }

      if (months > 0) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + months);

        await User.findOneAndUpdate(
          { email: email }, 
          {
            $set: {
              membershipStatus: status,
              isMember: true,
              subscriptionDate: new Date(),
              planExpiry: expiryDate,
            },
          }
        );
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