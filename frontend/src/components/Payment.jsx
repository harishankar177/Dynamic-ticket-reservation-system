import React from 'react';
import { CreditCard, Smartphone, Building2, Wallet, Shield, Lock, Check } from 'lucide-react';

const Payment = ({ totalAmount, onPayment }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment</h2>
      
      <div className="mb-6">
        <p className="text-lg text-gray-700">Total Amount: ₹{totalAmount}</p>
      </div>
      
      {/* Payment methods (just illustrative) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-lg flex items-center space-x-4">
          <CreditCard size={24} />
          <span>Credit/Debit Card</span>
        </div>
        <div className="p-4 border rounded-lg flex items-center space-x-4">
          <Smartphone size={24} />
          <span>UPI</span>
        </div>
        <div className="p-4 border rounded-lg flex items-center space-x-4">
          <Wallet size={24} />
          <span>Wallet</span>
        </div>
      </div>

      <button
        onClick={onPayment}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
