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
// Hàm tạo bộ sưu tập
exports.createCollection = async (collectionData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/asset-collections`, // Đảm bảo endpoint đúng
      collectionData,                  // Dữ liệu gửi lên
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    console.log('Phản hồi từ GameShift API:', response.data);

    // Trả về dữ liệu của Collection (bao gồm `id` thay vì `collectionId`)
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ GameShift API:', error.response.data);
      throw new Error(`GameShift Error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('Không nhận được phản hồi từ GameShift API:', error.request);
      throw new Error('Không nhận được phản hồi từ GameShift API.');
    } else {
      console.error('Lỗi khi gọi GameShift API:', error.message);
      throw new Error(`GameShift Error: ${error.message}`);
    }
  }
};

// Tạo NFT
exports.createNFT = async (nftData) => {
  try {
    const response = await axios.post(`${BASE_URL}/unique-assets`, nftData, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log('Phản hồi từ GameShift khi tạo NFT:', response.data);
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
// Hàn gọi ra các bộ sưu tập
exports.fetchCollectionsFromGameShift = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/asset-collections`, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      },
    });

    console.log('Phản hồi từ GameShift khi lấy danh sách bộ sưu tập:', response.data);
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
// Hàm lấy ra các NFT
exports.fetchNFTFromGameShift = async (nftId) => {
  try {
    const response = await axios.get(`${BASE_URL}/unique-assets/${nftId}`, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      },
    });

    console.log('Phản hồi từ GameShift khi lấy chi tiết NFT:', response.data);
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
// Hàm để rao bán NFT
exports.sellNFT = async ({ assetId, price }) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/unique-assets/${assetId}/sell`, // Endpoint để rao bán NFT
      { price }, // Gửi giá của NFT trong body
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    console.log('Phản hồi từ GameShift khi rao bán NFT:', response.data);

    return response.data; // Trả về dữ liệu từ GameShift
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