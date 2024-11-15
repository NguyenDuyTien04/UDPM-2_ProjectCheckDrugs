import React, { useState } from 'react';
import { sendOTP } from '../utils/api';
import './css/ForgotPassword.css'; // Import CSS cho ForgotPassword

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // Bước để chuyển giao diện
  const [fakeOTP, setFakeOTP] = useState(''); // OTP giả

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendOTP(email); // Gửi OTP vào email
      setFakeOTP('123456'); // Fake OTP
      setStep(2); // Chuyển sang bước nhập OTP
      setMessage('OTP đã được gửi vào email của bạn!');
    } catch (err) {
      setMessage('Lỗi khi gửi OTP. Vui lòng thử lại.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp === fakeOTP) {
      setMessage('Mã OTP chính xác! Bạn có thể thay đổi mật khẩu.');
    } else {
      setMessage('Mã OTP không chính xác.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Quên Mật Khẩu</h2>
      <div className="card shadow-lg p-4 rounded">
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="Nhập email của bạn"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-4">
              Gửi OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label>Mã OTP (6 chữ số)</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={handleOtpChange}
                required
                placeholder="Nhập mã OTP đã gửi"
              />
            </div>
            <button type="submit" className="btn btn-success btn-block mt-4">
              Xác nhận OTP
            </button>
          </form>
        )}
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
    </div>
  );
}

export default ForgotPassword;
