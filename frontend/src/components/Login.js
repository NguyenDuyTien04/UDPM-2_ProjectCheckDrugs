import React, { useState } from 'react';
import { loginUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';  // Import CSS cho giao diện login

function Login() {
  const [credentials, setCredentials] = useState({ email: '', matKhau: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials.email, credentials.matKhau);
      const { token, vaiTro } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', vaiTro);
      alert('Đăng nhập thành công!');
      navigate('/');
    } catch (err) {
      alert('Đăng nhập thất bại!');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');  // Chuyển hướng tới trang quên mật khẩu
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Đăng Nhập</h2>
      <div className="card shadow-lg p-4 rounded">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="form-group mt-3">
            <label>Mật Khẩu</label>
            <input
              type="password"
              name="matKhau"
              className="form-control"
              value={credentials.matKhau}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4">
            Đăng Nhập
          </button>
        </form>
        <div className="mt-3">
          <button 
            className="btn btn-link" 
            onClick={handleForgotPassword}
            style={{ textDecoration: 'none', color: '#007bff' }}
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
