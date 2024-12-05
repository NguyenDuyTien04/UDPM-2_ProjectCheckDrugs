// controllers/paymentsController.js
const axios = require('axios');

const BASE_URL = 'https://api.gameshift.dev/nx';
const API_KEY = process.env.GAMESHIFT_API_KEY;

if (!API_KEY) {
  throw new Error('API Key không được tìm thấy. Vui lòng kiểm tra file .env.');
}

const handleError = (error) => {
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
};

// Lấy danh sách thanh toán từ GameShift
exports.getPayments = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/payments`, {
      headers: {
        'x-api-key': API_KEY,
        Accept: 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    handleError(error);
    res.status(500).json({ message: error.message });
  }
};
