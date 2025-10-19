import React from 'react';
import { CreditCard, Smartphone, Building2, Wallet, Shield, Lock, Check } from 'lucide-react';

const Payment = ({ totalAmount, onPayment }) => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Passenger Details</span>
        </button>
      </div>
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
