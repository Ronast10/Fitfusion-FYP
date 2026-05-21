import React, { forwardRef } from 'react';
import './Receipt.css';

const Receipt = forwardRef(({ items, total }, ref) => {
  return (
    <div ref={ref} className="receipt-content">
      <div className="receipt-header">
        <h1>Invoice</h1>
        <p><strong>FitFusion Nepal</strong><br/>Kathmandu, Nepal<br/>support@fitfusion.com</p>
      </div>
      
      <table className="receipt-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>Rs. {item.price}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td>Grand Total</td>
            <td>Rs. {total}</td>
          </tr>
        </tbody>
      </table>

      <p className="footer-note">
        This is a verified digital receipt. Please keep this for your records. 
        A delivery representative will contact you shortly to coordinate arrival.
      </p>
    </div>
  );
});

export default Receipt;