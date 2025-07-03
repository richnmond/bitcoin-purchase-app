import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [btcPrice, setBtcPrice] = useState(null);
  const [location, setLocation] = useState(null);
  const [history, setHistory] = useState([]);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [purchaseLimit, setPurchaseLimit] = useState(0);

  useEffect(() => {
    const getPrice = async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await res.json();
      setBtcPrice(data.bitcoin.usd);
    };
    getPrice();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude.toFixed(3),
          lon: pos.coords.longitude.toFixed(3),
        });
      },
      () => {
        fetch("https://ipapi.co/json/")
          .then((res) => res.json())                                                                                                                                            
          .then((data) =>
            setLocation({ lat: data.latitude, lon: data.longitude })
          );
      }
    );
  }, []);

  const sendVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setVerificationCode(code);
    alert("Verification code sent to your email (mock): " + code);
    toast.success("Verification code sent!");
  };

  const verifyEmail = () => {
    if (userCode === String(verificationCode)) {
      setEmailVerified(true);
      setLoggedIn(true);
      toast.success("Email verified and logged in.");
    } else {
      toast.error("Incorrect verification code.");
    }
  };

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(otp);
    toast.success("OTP sent! Check the popup.");
    alert("Your OTP is: " + otp);
  };

  const handlePurchase = () => {
    if (purchaseLimit >= 3) {
      return toast.warn("Daily purchase limit reached.");
    }

    if (otpInput !== String(generatedOtp)) {
      return toast.error("Incorrect OTP.");
    }

    const newTx = {
      id: Date.now(),
      amount: 1,
      price: btcPrice,
      location,
      timestamp: new Date().toLocaleString(),
    };

    setHistory([newTx, ...history]);
    setPurchaseLimit(purchaseLimit + 1);
    toast.success("Bitcoin purchase successful! Email sent (mock).✨");
    setOtpInput("");
    setGeneratedOtp(null);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setEmail("");
    setGeneratedOtp(null);
    setOtpInput("");
    setHistory([]);
    setPurchaseLimit(0);
    setEmailVerified(false);
    setVerificationCode(null);
    setUserCode("");
    toast.info("Logged out successfully.");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white p-6 font-sans bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1611078489935-13c7b2e525aa?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md relative">
        <h1 className="text-4xl font-extrabold mb-6 text-yellow-400 text-center">🪙 Purchase Bitcoin</h1>

        <div className="bg-black/70 backdrop-blur-sm p-6 rounded-xl shadow-xl space-y-6">
          {!loggedIn ? (
            <div className="space-y-4">
              <input
                className="p-3 border w-full rounded bg-white/20 text-white placeholder-white"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!verificationCode ? (
                <button
                  onClick={sendVerificationCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                >
                  Send Verification Code
                </button>
              ) : (
                <>
                  <input
                    className="p-3 border w-full rounded bg-white/20 text-white placeholder-white"
                    type="text"
                    placeholder="Enter verification code"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                  />
                  <button
                    onClick={verifyEmail}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                  >
                    Verify & Login
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm">Logged in as <b>{email}</b></p>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-600 underline"
                >
                  Logout
                </button>
              </div>

              <p className="text-sm text-yellow-300">🌍 Location: {location?.lat}, {location?.lon}</p>
              <p className="text-2xl text-green-400 text-center">
                💵 1 BTC = ${btcPrice ?? "Loading..."}
              </p>

              <button
                onClick={generateOTP}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded w-full"
              >
                Get OTP
              </button>

              {generatedOtp && (
                <>
                  <input
                    className="p-3 border w-full rounded bg-white/20 text-white placeholder-white"
                    type="text"
                    placeholder="Enter OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                  <button
                    onClick={handlePurchase}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                  >
                    Confirm Purchase
                  </button>
                </>
              )}

              <hr className="my-4 border-white/30" />
              <h2 className="text-lg font-semibold text-yellow-300">🪙 Purchase History</h2>
              {history.length === 0 ? (
                <p className="text-white/70">No purchases yet.</p>
              ) : (
                <ul className="space-y-2 text-left">
                  {history.map((tx) => (
                    <li
                      key={tx.id}
                      className="bg-white/10 p-3 rounded-lg border border-white/10 text-sm"
                    >
                      <b>{tx.timestamp}</b> - 1 BTC @ ${tx.price} <br />
                      🌐 {tx.location.lat}, {tx.location.lon}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
