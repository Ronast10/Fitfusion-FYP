import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const PaypalPayment = ({ amount, onBack, onSuccess }) => {
  return (
    <div className="gateway-container">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="gateway-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
      </div>

      <h3 style={{ color: "white", textAlign: "center" }}>Total: ${amount}</h3>

      {/* Put your Client ID from the screenshot here */}
      <PayPalScriptProvider options={{ "client-id": "AeecNa24kpt9ikA3xFJ7YC4ZngNm4zuwYj9vL9utjIyjYdwOoqDadYkKCW2D7tnS3esqi5hSpLus9pK6" }}>
        <PayPalButtons
          style={{ layout: "vertical", color: "gold", shape: "rect" }}
          createOrder={async () => {
            try {
              const res = await axios.post("http://localhost:5000/api/paypal/create-order", {
                amount: amount,
              });
              return res.data.id;
            } catch (err) {
              console.error("Order error:", err);
            }
          }}
          onApprove={async (data, actions) => {
            return actions.order.capture().then((details) => {
              alert(`Transaction completed by ${details.payer.name.given_name}`);
              onSuccess(); // This runs your success logic (like clearing the cart)
            });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalPayment;