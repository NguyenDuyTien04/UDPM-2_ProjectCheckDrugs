// Login.js (Login Form)
import React, { useState } from 'react';
import { loginUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Đăng Nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={credentials.email} onChange={handleChange} required />
        </div>
        <div className="form-group mt-3">
          <label>Mật Khẩu</label>
          <input type="password" name="matKhau" className="form-control" value={credentials.matKhau} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary mt-4">Đăng Nhập</button>
      </form>
    </div>
  );
}

export default Login;