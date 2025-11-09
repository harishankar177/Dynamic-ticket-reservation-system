import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Smartphone,
  Wallet,
  QrCode,
  CheckCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";

const Payment = ({ totalAmount = 0, onPayment }) => {
  const [method, setMethod] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const upiId = "yourupi@bank";
  const payeeName = "Train Booking System";
  const amount = totalAmount || 0;

  const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrData
  )}`;

  // countdown for QR
  useEffect(() => {
    let timer;
    if (qrVisible && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      alert("⏰ QR code expired. Please regenerate again.");
      setQrVisible(false);
      setTimeLeft(120);
    }
    return () => clearInterval(timer);
  }, [qrVisible, timeLeft]);

  const handlePayment = async () => {
    try {
      // First show processing
      const processingPopup = document.createElement('div');
      processingPopup.className = 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50';
      processingPopup.innerHTML = `
        <div class="bg-white rounded-2xl p-8 shadow-2xl animate-bounce">
          <p class="text-xl font-semibold text-gray-800">Processing Payment...</p>
        </div>
      `;
      document.body.appendChild(processingPopup);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove processing popup
      processingPopup.remove();
      
      // Show success state
      setIsPaid(true);
      
      // Call the provided onPayment callback
      if (onPayment) {
        await onPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // success page with 3D booking confirmation animation
  if (isPaid) {
    return (
      <div 
        id="successOverlay"
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        style={{ animation: 'fade-in 0.3s ease-out' }}
      >
        <div 
          id="successPopup"
          className="animate-success-popup bg-white rounded-2xl p-12 shadow-2xl transform perspective-1000">
          <div className="relative w-[400px]">
            {/* Floating checkmark background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-success-circle opacity-25"></div>
                <div className="bg-white rounded-full p-4 shadow-2xl animate-float">
                  <div className="relative transform animate-success-checkmark">
                    <CheckCircle size={48} className="text-green-500" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main content with 3D effect */}
            <div className="text-center transform animate-content-popup mt-8">
              {/* Booking Confirmed Text */}
              <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-title-reveal">
                Booking Confirmed!
              </h2>

              {/* Train ticket visual */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-100 shadow-inner mb-8 transform hover:rotate-y-12 transition-transform duration-500">
                <p className="text-xl text-gray-700 mb-4 animate-reveal-up">
                  Your train ticket has been successfully booked.
                </p>
                
                {/* Booking ID with shine effect */}
                <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-4 relative overflow-hidden group">
                  <div className="absolute inset-0 animate-shine"></div>
                  <p className="text-gray-600">Booking ID:</p>
                  <p className="font-mono text-lg font-semibold text-blue-800">
                    RB{Date.now()}
                  </p>
                </div>

                {/* Amount section */}
                <div className="bg-green-50 rounded-xl p-4 animate-reveal-up delay-200">
                  <p className="text-green-800 font-medium">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{amount}</p>
                </div>
              </div>

              {/* Continue button */}
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-blue-600 rounded-xl blur group-hover:blur-xl transition-all"></div>
                <button
                  onClick={() => {
                    // Add exit animation
                    const overlay = document.getElementById('successOverlay');
                    const popup = document.getElementById('successPopup');
                    
                    if (overlay && popup) {
                      // First rotate and scale up
                      popup.style.animation = 'success-popup-exit 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                      
                      // After the popup animation starts, fade out the overlay
                      setTimeout(() => {
                        overlay.style.animation = 'fade-in 0.5s ease-out reverse forwards';
                      }, 300);
                      
                      // Wait for animations to complete, then navigate
                      setTimeout(() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = "/ticket-confirmation";
                        }
                      }, 800);
                    }
                  }}
                  className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform animate-bounce-subtle"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white rounded-2xl shadow-lg border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Complete Your Payment
        </h2>
      </div>

      {/* Amount */}
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700">
          Total Amount:{" "}
          <span className="font-semibold text-blue-700">₹{amount}</span>
        </p>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { name: "UPI", icon: <Smartphone size={22} />, color: "text-green-600" },
          { name: "Credit / Debit Card", icon: <CreditCard size={22} />, color: "text-blue-600" },
          { name: "Wallet", icon: <Wallet size={22} />, color: "text-yellow-600" },
        ].map((m) => (
          <div
            key={m.name}
            onClick={() => {
              setMethod(m.name);
              setQrVisible(false);
              setTimeLeft(120);
            }}
            className={`p-4 border rounded-xl flex items-center justify-center gap-3 cursor-pointer ${
              method === m.name ? "border-blue-600 bg-blue-50" : ""
            }`}
          >
            <span className={m.color}>{m.icon}</span>
            <span className="font-medium">{m.name}</span>
          </div>
        ))}
      </div>

      {/* ---------- 3D UPI Section ---------- */}
      {method === "UPI" && (
        <div className="p-8 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-2xl text-center transform transition-all hover:scale-[1.02] hover:rotate-1 duration-500">
          {!qrVisible ? (
            <>
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg">
                <p className="text-white text-lg font-medium mb-4">
                  Select your UPI app to continue:
                </p>
                <div className="grid grid-cols-3 gap-6 mb-6 max-w-md mx-auto">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/1200px-Google_Pay_Logo_%282020%29.svg.png"
                      alt="Google Pay"
                      className="h-8 object-contain mb-2"
                    />
                    <p className="text-gray-700 text-sm font-medium">Google Pay</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png"
                      alt="Paytm"
                      className="h-8 object-contain mb-2"
                    />
                    <p className="text-gray-700 text-sm font-medium">Paytm</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png"
                      alt="PhonePe"
                      className="h-8 object-contain mb-2"
                    />
                    <p className="text-gray-700 text-sm font-medium">PhonePe</p>
                  </div>
                </div>
                <button
                  onClick={() => setQrVisible(true)}
                  className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-200 transition-all"
                >
                  Generate QR Code
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-xl inline-block transform hover:rotate-2 transition">
                <QrCode size={36} className="text-green-700 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Scan to Pay
                </h3>
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 mx-auto mb-3 border rounded-lg shadow-lg"
                />
                <p className="text-sm text-gray-600 mb-1">
                  UPI ID: <span className="font-semibold">{upiId}</span>
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Amount:{" "}
                  <span className="font-semibold text-green-700">₹{amount}</span>
                </p>
                <div className="flex items-center justify-center gap-2 mb-4 text-red-600">
                  <Clock size={18} />
                  <span className="font-medium">
                    Expires in {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <button
                  onClick={handlePayment}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
                >
                  Confirm Payment
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------- 3D Credit/Debit Card Section ---------- */}
      {method === "Credit / Debit Card" && (
        <div className="border rounded-xl p-6 bg-gray-50 shadow-inner">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Enter Card Details
          </h3>
          <div className="relative w-80 h-48 mx-auto mb-6 perspective">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 rounded-xl shadow-xl transform transition-transform duration-500 hover:rotate-y-6">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-yellow-400 w-10 h-8 rounded-sm" />
                <span className="text-sm font-semibold tracking-widest">
                  VISA
                </span>
              </div>
              <div className="text-lg tracking-widest mb-3">
                {cardNumber || "#### #### #### ####"}
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="uppercase opacity-70 text-xs">Card Holder</p>
                  <p className="font-semibold">{cardName || "YOUR NAME"}</p>
                </div>
                <div>
                  <p className="uppercase opacity-70 text-xs">Expires</p>
                  <p className="font-semibold">12/28</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="password"
                placeholder="CVV"
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={handlePayment}
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all w-full"
          >
            Pay ₹{amount}
          </button>
        </div>
      )}

      {/* ---------- 3D Wallet Section ---------- */}
      {method === "Wallet" && (
        <div className="p-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl text-center transform hover:scale-[1.02] transition-all duration-500">
          <h3 className="text-xl font-semibold text-white mb-4">
            Choose your Wallet
          </h3>
          <div className="grid grid-cols-3 gap-6 mb-6 max-w-md mx-auto">
            <div className="bg-white p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png"
                alt="Paytm"
                className="h-8 object-contain mb-2"
              />
              <p className="text-gray-700 text-sm font-medium">Paytm Wallet</p>
            </div>
            <div className="bg-white p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png"
                alt="PhonePe"
                className="h-8 object-contain mb-2"
              />
              <p className="text-gray-700 text-sm font-medium">PhonePe Wallet</p>
            </div>
            <div className="bg-white p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Amazon_Pay_logo.svg/2560px-Amazon_Pay_logo.svg.png"
                alt="Amazon Pay"
                className="h-8 object-contain mb-2"
              />
              <p className="text-gray-700 text-sm font-medium">Amazon Pay</p>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-200 transition-all"
          >
            Pay ₹{amount}
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
