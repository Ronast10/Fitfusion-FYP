import React, { forwardRef } from 'react';
import './Receipt.css';

const Receipt = forwardRef(({ items, total, discountTotal }, ref) => {
  return (
    <div ref={ref} className="receipt-content">
      <div className="receipt-header">
        <h1>Invoice</h1>
        <p><strong>FitFusion Nepal</strong><br/>Kathmandu, Nepal<br/>info@fitfusion.com.np</p>
      </div>
      
      <table className="receipt-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Original</th>
            <th>Discount</th>
            <th>Final Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>Rs. {item.originalPrice}</td>
              <td style={{ color: 'red' }}>- Rs. {item.discount}</td>
              <td>Rs. {item.price}</td>
            </tr>
          ))}
          
          <tr className="total-row">
            <td colSpan="2"></td>
            <td><strong>Grand Total</strong></td>
            <td><strong>Rs. {total}</strong></td>
          </tr>
        </tbody>
      </table>

      {discountTotal > 0 && (
        <div className="savings-summary">
          <p><strong>Total Savings:</strong> Rs. {discountTotal}</p>
        </div>
      )}

      <p className="footer-note">
        This is a verified digital receipt. Please keep this for your records. 
        A delivery representative will contact you shortly to coordinate arrival.
      </p>
    </div>
  );
});

export default Receipt;