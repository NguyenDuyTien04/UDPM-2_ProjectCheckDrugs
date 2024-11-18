const axios = require('axios');

// Base URL cho GameShift API
const BASE_URL = 'https://api.gameshift.dev/nx';
const API_KEY = process.env.GAMESHIFT_API_KEY;

// Kiểm tra API Key
if (!API_KEY) {
  throw new Error("API Key không tồn tại trong file .env. Vui lòng kiểm tra lại!");
}

/**
 * Tạo tài khoản GameShift
 * @param {Object} userData - Dữ liệu người dùng (email, walletAddress, referenceId)
 */
exports.createGameShiftUser = async (userData) => {
  try {
    console.log("Dữ liệu gửi tới GameShift API:", userData);

    const response = await axios.post(`${BASE_URL}/users`, userData, {
      headers: {
        'x-api-key': API_KEY,
        accept: 'application/json',
      },
    });

    console.log('GameShift - Tạo tài khoản thành công:', response.data);

    return response.data; // Trả về dữ liệu từ GameShift nếu thành công
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;

    console.error(`Lỗi khi gọi GameShift API (Tạo tài khoản): [${statusCode}] ${errorMessage}`);
    if (error.response) {
      console.error("Phản hồi từ GameShift API:", error.response.data);
    }

    // Ném lỗi chi tiết để Controller xử lý
    throw new Error(`GameShift Error: ${errorMessage}`);
  }
};
/**
 * Xử lý thanh toán qua GameShift
 * @param {string} buyerWallet - Địa chỉ ví người mua
 * @param {string} sellerWallet - Địa chỉ ví người bán
 * @param {number} amount - Số lượng SOL cần thanh toán
 */
exports.processPayment = async (buyerWallet, sellerWallet, amount) => {
  try {
    console.log("Xử lý thanh toán qua GameShift:", { buyerWallet, sellerWallet, amount });

    const response = await axios.post(`${BASE_URL}/payments`, { buyerWallet, sellerWallet, amount }, {
      headers: {
        'x-api-key': API_KEY,
        accept: 'application/json',
      },
    });

    console.log('GameShift - Thanh toán thành công:', response.data);

    return response.data; // Trả về dữ liệu thanh toán nếu thành công
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;

    console.error(`Lỗi khi gọi GameShift API (Thanh toán): [${statusCode}] ${errorMessage}`);
    if (error.response) {
      console.error("Phản hồi từ GameShift API:", error.response.data);
    }

    // Ném lỗi chi tiết để Controller xử lý
    throw new Error(`GameShift Error: ${errorMessage}`);
  }
};

/**
 * Lấy thông tin người dùng từ GameShift
 * @param {string} referenceId - ID tham chiếu (địa chỉ ví)
 */
exports.fetchUser = async (referenceId) => {
  try {
    console.log("Lấy thông tin người dùng từ GameShift với Reference ID:", referenceId);

    const response = await axios.get(`${BASE_URL}/users/${referenceId}`, {
      headers: {
        'x-api-key': API_KEY,
        accept: 'application/json',
      },
    });

    console.log('GameShift - Lấy thông tin người dùng thành công:', response.data);

    return response.data; // Trả về dữ liệu người dùng nếu thành công
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;

    console.error(`Lỗi khi gọi GameShift API (Lấy thông tin người dùng): [${statusCode}] ${errorMessage}`);
    if (error.response) {
      console.error("Phản hồi từ GameShift API:", error.response.data);
    }

    // Ném lỗi chi tiết để Controller xử lý
    throw new Error(`GameShift Error: ${errorMessage}`);
  }
};

