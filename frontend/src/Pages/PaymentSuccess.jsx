import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying Payment...");
  const [loading, setLoading] = useState(true);
  const [paymentTypeDisplay, setPaymentTypeDisplay] = useState("shop");

  useEffect(() => {
    const verify = async () => {
      const email = localStorage.getItem("userEmail");
      const eSewaData = searchParams.get("data");
      const khaltiPidx = searchParams.get("pidx"); 
      const gateway = searchParams.get("gateway");  
      
      // 1. Capture type from URL param (Khalti route) or fallback to localStorage (eSewa route)
      const currentPaymentType = searchParams.get("type") || localStorage.getItem("paymentType") || "shop";
      setPaymentTypeDisplay(currentPaymentType);

      // 💡 FIX: Instantly wipe the local storage entry clean!
      // This ensures the next checkout starts completely fresh without remembering old choices.
      localStorage.removeItem("paymentType");

      if (!email) {
        console.error("Missing user email context");
        return navigate("/membership");
      }

      try {
        let responseStatus = "";

        // ==============================================================================
        // 1. KHALTI VERIFICATION FLOW
        // ==============================================================================
        if (gateway === "khalti" || khaltiPidx) {
          if (!khaltiPidx) {
            console.error("Missing Khalti pidx token");
            return navigate("/membership");
          }

          const res = await axios.post("http://localhost:5000/api/khalti/khalti-verify", {
            pidx: khaltiPidx,
            email: email
          });
          
          responseStatus = res.data.status; 
        } 
        // ==============================================================================
        // 2. ESEWA VERIFICATION FLOW (Default Fallback)
        // ==============================================================================
        else {
          if (!eSewaData) {
            console.error("Missing eSewa validation payload data");
            return navigate("/membership");
          }

          const res = await axios.post("http://localhost:5000/api/esewa/verify-payment", {
            data: eSewaData,
            email: email 
          });

          responseStatus = res.data.status; 
        }

        // ==============================================================================
        // 3. UNIFIED PROFILE / STORE SYNC LOGIC
        // ==============================================================================
        if (responseStatus === "COMPLETE") {
          console.log("Payment successfully verified on secure server-side pipeline");
          
          if (currentPaymentType === "membership") {
            console.log("Membership purchase - updating membership status");
            setLoading(false);
            setStatus("✓ Payment Successful!");
            setTimeout(() => navigate("/profile"), 2000);
          } else {
            console.log("Shop purchase - updating purchase history");
            const cartitems = JSON.parse(localStorage.getItem("cart") || "[]");
            
            await axios.post("http://localhost:5000/api/auth/complete-purchase", {
              email: email,
              cartItems: cartitems 
            });
            
            localStorage.removeItem("cart");
            setLoading(false);
            setStatus("✓ Payment Successful!");
            setTimeout(() => navigate("/cart"), 2000);
          }
        } else {
          setStatus("Payment verification failed.");
          setTimeout(() => navigate("/membership"), 3000);
        }
      } catch (err) {
        console.error("Verification Loop Failure Error:", err);
        setStatus("Server error during verification.");
        setTimeout(() => navigate("/membership"), 3000);
      }
    };
    
    verify();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "Arial" }}>
      <div style={{ 
        maxWidth: "400px", 
        margin: "0 auto", 
        padding: "40px", 
        borderRadius: "15px", 
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        backgroundColor: "#fff"
      }}>
        <h2 style={{ color: loading ? "#333" : "green" }}>{status}</h2>
        {loading ? (
          <p>Connecting to secure server channels to confirm your transaction...</p>
        ) : paymentTypeDisplay === "membership" ? (
          <p>Your FitFusion membership is now active! Redirecting to your profile...</p>
        ) : (
          <p>Transaction completed successfully! Redirecting to the cart page...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;