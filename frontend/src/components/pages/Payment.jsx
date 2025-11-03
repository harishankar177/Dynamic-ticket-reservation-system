import React from 'react';
import { CreditCard, Smartphone, Wallet, QrCode } from 'lucide-react';

const Payment = ({ totalAmount, onPayment }) => {
  return (
    <div className="p-8">
      {/* Back button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back to Passenger Details</span>
        </button>
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment</h2>

      {/* Total amount */}
      <div className="mb-6">
        <p className="text-lg text-gray-700">
          Total Amount: <span className="font-semibold text-blue-700">₹24{totalAmount}</span>
        </p>
      </div>

      {/* Payment methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded-lg flex items-center space-x-4 hover:bg-gray-50 transition-all">
          <CreditCard size={24} className="text-blue-600" />
          <span>Credit/Debit Card</span>
        </div>
        <div className="p-4 border rounded-lg flex items-center space-x-4 hover:bg-gray-50 transition-all">
          <Smartphone size={24} className="text-green-600" />
          <span>UPI</span>
        </div>
        <div className="p-4 border rounded-lg flex items-center space-x-4 hover:bg-gray-50 transition-all">
          <Wallet size={24} className="text-yellow-600" />
          <span>Wallet</span>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="border rounded-xl p-6 bg-gray-50 flex flex-col items-center mb-8 shadow-sm">
        <QrCode size={32} className="text-blue-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Scan to Pay via UPI</h3>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=Train%20Booking"
          alt="UPI QR Code"
          className="w-40 h-40 mb-3 border rounded-lg shadow"
        />
        <p className="text-sm text-gray-600 text-center">
          Use any UPI app (PhonePe, Google Pay, Paytm, etc.) to scan and complete your payment.
        </p>
      </div>

      {/* Pay Now Button */}
      <button
        onClick={onPayment}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
