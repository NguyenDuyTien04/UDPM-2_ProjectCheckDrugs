import axios from "axios";

const API_KEY = process.env.REACT_APP_GAMESHIFT_API_KEY; // Sử dụng biến môi trường React
const API_URL = "https://api.gameshift.dev/nx";

// Kiểm tra API Key trước khi thực hiện bất kỳ yêu cầu nào
if (!API_KEY) {
  console.error("Lỗi: API Key không được cung cấp. Vui lòng kiểm tra tệp .env và khai báo REACT_APP_GAMESHIFT_API_KEY.");
  throw new Error("API Key không tồn tại.");
}

// Hàm lấy thông tin người dùng từ GameShift
export const fetchGameShiftUser = async (referenceId) => {
  try {
    console.log("Đang gọi API fetchGameShiftUser với referenceId:", referenceId);
    const response = await axios.get(`${API_URL}/users/${referenceId}`, {
      headers: {
        accept: "application/json",
        "x-api-key": API_KEY,
      },
    });
    console.log("Phản hồi từ GameShift API (fetchUser):", response.data);
    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Lỗi khi fetch user từ GameShift:", err.response.data);
    } else {
      console.error("Lỗi khi fetch user từ GameShift:", err.message);
    }
    throw err;
  }
};

// Hàm tạo tài khoản trên GameShift
export const createGameShiftUser = async (data) => {
  try {
    console.log("Đang gọi API createGameShiftUser với dữ liệu:", data);
    const response = await axios.post(`${API_URL}/users`, data, {
      headers: {
        accept: "application/json",
        "x-api-key": process.env.REACT_APP_GAMESHIFT_API_KEY,
      },
    });
    console.log("Phản hồi từ GameShift API (createUser):", response.data);
    return response.data;
  } catch (err) {
    // Xử lý lỗi 409 (Conflict)
    if (err.response?.status === 409) {
      console.error("Email đã tồn tại trên GameShift:", err.response.data.message);
      throw new Error("Email đã tồn tại trên GameShift. Vui lòng sử dụng email khác.");
    }
    console.error("Lỗi khi tạo tài khoản GameShift:", err.response?.data || err.message);
    throw err;
  }
};
