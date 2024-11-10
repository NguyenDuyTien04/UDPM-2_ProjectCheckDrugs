import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const loginUser = async (email, matKhau) => {
  return axios.post(`${API_URL}/auth/login`, { email, matKhau }).then((response) => {
    // Lưu token và vai trò vào localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.vaiTro); // Lưu vai trò người dùng
    localStorage.setItem('userId', response.data.id); // Lưu user ID để so sánh quyền sở hữu
    
    return response;
  });
};


export const getMedicineList = async () => {
  const response = await axios.get(`${API_URL}/thuoc/list`);
  return response.data;
};

export const addMedicine = async (medicineData, token) => {
  return axios.post(`${API_URL}/thuoc/add`, medicineData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};