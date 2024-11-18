import axios from "axios";

// URL cơ bản cho API backend
const BASE_URL = "http://localhost:5000/api/auth";

// Hàm đăng nhập
export const login = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, data);
    return response.data; // Trả về dữ liệu thành công từ server
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.response?.data || error.message);
    throw error;
  }
};

// Hàm đăng ký người dùng mới (gọi API backend)
export const register = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data);
    return response.data; // Trả về dữ liệu thành công từ server
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.response?.data || error.message);
    throw error;
  }
};

// Hàm lấy hoặc tạo người dùng từ GameShift
export const fetchOrRegister = async (walletAddress, email) => {
  try {
    // Gọi API để fetch thông tin người dùng từ backend
    const response = await axios.get(`${BASE_URL}/gameshift-user/${walletAddress}`);
    return response.data; // Trả về thông tin người dùng nếu tồn tại
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const data = {
        email,
        walletAddress,
        referenceId: walletAddress, // Sử dụng địa chỉ ví làm referenceId
      };
      const registerResponse = await register(data);
      return registerResponse; // Trả về thông tin sau khi đăng ký
    }

    throw err; // Quăng lỗi nếu không phải lỗi 404
  }
};
