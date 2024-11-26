import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Cài đặt mặc định cho axios (Authorization header)
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

// Đăng nhập
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Đăng ký
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Lấy danh sách bộ sưu tập
export const fetchCollections = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/collections`, {
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token qua header
            },
        });
        console.log("response",response);
        return response.data.data;
        
    } catch (error) {
        console.error("Lỗi khi lấy bộ sưu tập:", error.response?.data?.message || error.message);
        throw error;
    }
};


// Tạo bộ sưu tập
export const createCollection = async (data, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/collections/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`, // Truyền token trong header
                "Content-Type": "application/json", // Đảm bảo đúng định dạng JSON
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo bộ sưu tập:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Tạo NFT
export const createNFT = async (formData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/nft/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createNFT:', error.response?.data?.message || error.message);
    throw error;
  }
};

// lấy get nft
export const fetchNFTs = async (token) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/nft`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      console.log('API response:', response); // Kiểm tra chi tiết response

      // Điều chỉnh logic kiểm tra
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
          throw new Error('Dữ liệu trả về không hợp lệ.');
      }

      return response.data.data; // Trả về mảng NFT
  } catch (error) {
      console.error("Lỗi khi lấy danh sách NFT:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
      });

      throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Không thể lấy danh sách NFT'
      );
  }
};



// Rao bán NFT
export const sellNFT = async (nftId, priceData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/nft/sell/${nftId}`, priceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi rao bán NFT:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Hủy NFT Listing
export const cancelNFTListing = async (nftId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/nft/cancel/${nftId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi hủy NFT:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Mua NFT
export const buyNFT = async (nftId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/nft/buy/${nftId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi mua NFT:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Lấy danh sách NFT từ GameShift và lưu vào MongoDB (nếu chưa tồn tại)
export const fetchGameShiftNFTs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/nft/gameshift/list`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy NFT từ GameShift:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Lấy danh sách NFT trên Market (không cần token)
export const fetchMarketNFTs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nft/for-sale`);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách NFT trên Market:", error.response?.data?.message || error.message);
      throw error;
    }
  };
  

// Lấy danh sách NFT trong một bộ sưu tập
export const getNFTsByCollection = async (collectionId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nft/collection`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { collectionId },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách NFT:", error.response?.data?.message || error.message);
      throw error;
    }
  };
// Lấy lịch sử giao dịch của người dùng
export const fetchPurchaseHistory = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token xác thực
        },
      });
      return response.data; // API trả về danh sách giao dịch
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử giao dịch:", error.response?.data || error.message);
      throw error;
    }
  };