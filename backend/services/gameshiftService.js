const axios = require('axios');

// Base URL cho GameShift API
const BASE_URL = 'https://api.gameshift.dev/nx';
const API_KEY = process.env.GAMESHIFT_API_KEY;

if (!API_KEY) {
  throw new Error('API Key không được tìm thấy. Vui lòng kiểm tra file .env.');
}

// Hàm xử lý lỗi chung
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
    handleError(error);
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
    handleError(error);
  }
};

// Hàm tạo Collection trên GameShift
exports.createCollection = async (collectionData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/asset-collections`,
      collectionData,
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    console.log("Response từ GameShift API:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ GameShift API (response):', error.response.data);
      throw new Error(`GameShift API Error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      console.error('Lỗi từ GameShift API (request):', error.request);
      throw new Error('Không nhận được phản hồi từ GameShift API.');
    } else {
      console.error('Lỗi khi gọi GameShift API:', error.message);
      throw new Error(`GameShift API Error: ${error.message}`);
    }
  }
};

// Hàm retry nếu lỗi
const retryRequest = async (fn, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports.retryRequest = retryRequest;

// Hàm lấy tất cả bộ sưu tập từ GameShift
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
    handleError(error);
  }
};

// Tạo NFT trên GameShift
exports.createNFT = async (nftData) => {
  try {
    console.log('Payload gửi lên GameShift:', nftData);
    const response = await axios.post(
      `${BASE_URL}/unique-assets`,
      nftData,
      {
        headers: {
          'x-api-key': API_KEY, // Thay bằng API Key của bạn
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    console.log('Phản hồi từ GameShift khi tạo NFT:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ GameShift API (response):', error.response.data);
    } else if (error.request) {
      console.error('Lỗi từ GameShift API (request):', error.request);
    } else {
      console.error('Lỗi khi gọi GameShift API:', error.message);
    }
    throw new Error(`GameShift Error: ${error.message}`);
  }
};
// Lấy danh sách NFT trong bộ sưu tập
exports.getNFTsByCollection = async (collectionId) => {
  try {
    const response = await axios.get(`${BASE_URL}/items`, {
      headers: {
        'accept': 'application/json',
        'x-api-key': API_KEY, // API Key để xác thực
      },
      params: {
        collectionId, // Truyền collectionId qua query
      },
    });

    console.log('Phản hồi từ GameShift API:', response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ GameShift API (response):', error.response.data);
    } else if (error.request) {
      console.error('Lỗi từ GameShift API (request):', error.request);
    } else {
      console.error('Lỗi khi gọi GameShift API:', error.message);
    }
    throw new Error(`GameShift Error: ${error.message}`);
  }
};

// Lấy tất cả NFT từ GameShift
exports.fetchAllNFTs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/unique-assets`, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      },
    });
    console.log('Phản hồi từ GameShift khi lấy danh sách NFT:', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy thông tin chi tiết một NFT
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
    handleError(error);
  }
};

// Rao bán NFT
exports.sellNFT = async ({ assetId, price }) => {
  try {
    const url = `${BASE_URL}/unique-assets/${assetId}/list-for-sale`;
    const response = await axios.post(
      url,
      { price }, // Định dạng đúng { currencyId, naturalAmount }
      {
        headers: {
          accept: 'application/json',
          'x-api-key': API_KEY,
          'content-type': 'application/json',
        },
      }
    );

    console.log('Phản hồi từ GameShift khi rao bán NFT:', response.data);
    return response.data; // Trả về phản hồi từ GameShift
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

// Lấy danh sách NFT đang được rao bán từ GameShift
exports.fetchNFTsForSale = async (page = 1, perPage = 50) => {
  try {
    const response = await axios.get(`${BASE_URL}/items`, {
      params: {
        forSale: true,
        page,
        perPage,
      },
      headers: {
        'x-api-key': API_KEY,
        Accept: 'application/json',
      },
    });

    console.log('Phản hồi từ GameShift khi lấy danh sách NFT đang được rao bán:', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
//thu hồi 
exports.cancelNFTListing = async (assetId) => {
  try {
    const url = `${BASE_URL}/unique-assets/${assetId}/cancel-listing`;
    const response = await axios.post(
      url,
      {}, // Không yêu cầu body
      {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    console.log('Phản hồi từ GameShift khi thu hồi NFT:', response.data);
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

// Lấy tất cả giao dịch của người dùng
exports.fetchUserTransactions = async (referenceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${referenceId}/transactions`, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      },
    });
    console.log('Phản hồi từ GameShift khi lấy giao dịch người dùng:', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Mua NFT
exports.buyNFT = async ({ assetId, buyerId }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/unique-assets/${assetId}/buy`,
      { buyerId },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    console.log('Phản hồi từ GameShift khi mua NFT:', response.data);
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

// Lấy thông tin chi tiết một Transaction từ GameShift
exports.fetchTransactionById = async (transactionId) => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/${transactionId}`, {
      headers: {
        'x-api-key': API_KEY,
        Accept: 'application/json',
      },
    });
    console.log('Phản hồi từ GameShift khi lấy thông tin giao dịch:', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
