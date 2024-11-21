const axios = require('axios');

// Base URL cho GameShift API
const BASE_URL = 'https://api.gameshift.dev/nx';
const API_KEY = process.env.GAMESHIFT_API_KEY;

if (!API_KEY) {
  throw new Error('API Key không được tìm thấy. Vui lòng kiểm tra file .env.');
}

// Hàm đăng ký người dùng trên GameShift
exports.createGameShiftUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users`, userData, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Phản hồi từ GameShift khi tạo user:', response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ GameShift API:', error.response.data);
      throw new Error(`GameShift Error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('Không nhận được phản hồi từ GameShift:', error.request);
      throw new Error('Không nhận được phản hồi từ GameShift API.');
    } else {
      console.error('Lỗi khi gọi GameShift API:', error.message);
      throw new Error(`GameShift Error: ${error.message}`);
    }
  }
};

// Hàm lấy thông tin người dùng từ GameShift
exports.fetchUserFromGameShift = async (referenceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${referenceId}`, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      },
    });

    console.log('Phản hồi từ GameShift khi fetch user:', response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ GameShift API:', error.response.data);
      throw new Error(`GameShift Error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('Không nhận được phản hồi từ GameShift:', error.request);
      throw new Error('Không nhận được phản hồi từ GameShift API.');
    } else {
      console.error('Lỗi khi gọi GameShift API:', error.message);
      throw new Error(`GameShift Error: ${error.message}`);
    }
  }
};
exports.createCollection = async (collectionData) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!collectionData.name || !collectionData.description || !collectionData.image) {
      throw new Error("Thiếu thông tin bắt buộc: name, description, hoặc imageUrl.");
    }

    const response = await axios.post(
      `${BASE_URL}/collections`, // Endpoint để tạo Collection
      {
        name: collectionData.name,       // Tên Collection
        description: collectionData.description, // Mô tả Collection
        imageUrl: collectionData.image, // URL hình ảnh đại diện
      },
      {
        headers: {
          'x-api-key': API_KEY,            // API Key của bạn
          'Content-Type': 'application/json', // Kiểu nội dung JSON
          'Accept': 'application/json',       // Chấp nhận định dạng JSON
        },
      }
    );

    console.log("Phản hồi từ GameShift API:", response.data);

    return response.data; // Trả về dữ liệu từ API GameShift
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ GameShift API:", error.response.data);
      throw new Error(`GameShift Error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error("Không nhận được phản hồi từ GameShift:", error.request);
      throw new Error("Không nhận được phản hồi từ GameShift API.");
    } else {
      console.error("Lỗi khi gọi GameShift API:", error.message);
      throw new Error(`GameShift Error: ${error.message}`);
    }
  }
};


