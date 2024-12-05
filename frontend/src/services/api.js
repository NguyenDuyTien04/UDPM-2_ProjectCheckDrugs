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

        console.log("Dữ liệu trả về từ API:", response.data);

        // Trả về mảng dữ liệu từ response.data
        return response.data.data || [];
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
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo bộ sưu tập:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Tạo NFT
export const createNFT = async (nftData, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/nft/create`,
        {
          collectionId: nftData.collectionId,
          description: nftData.description,
          name: nftData.name,
          imageUrl: nftData.imageUrl,
          royaltyReferenceId: nftData.royaltyReferenceId,
          royaltyAddress: nftData.royaltyAddress,
          royaltyShare: nftData.royaltyShare || 10 // Default to 10% if not specified
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
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

export const fetchMarketNFTs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/nft/for-sale`);
        console.log("Dữ liệu từ API:", response.data);

        // Kiểm tra nếu `response.data.data` tồn tại và là một mảng
        const nftList =
            response.data.data && Array.isArray(response.data.data.data)
                ? response.data.data.data.map((entry) => entry.item) // Lấy `item` từ mỗi object
                : [];
        console.log("Danh sách NFT từ Market:", nftList);
        return nftList;
    } catch (error) {
        console.error(
            "Lỗi khi lấy danh sách NFT trên Market:",
            error.response?.data?.message || error.message
        );
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

// NFT USER
export const fetchUserNFTs = async (token) => {
    console.log("Token được sử dụng:", token); // Log token kiểm tra
    try {
        const response = await axios.get(`${API_BASE_URL}/nft/user-nfts`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Log dữ liệu trả về
        console.log("Dữ liệu trả về từ API:", response.data);

        // Truy cập dữ liệu bên trong `data.data`
        if (!response.data || !response.data.data || !Array.isArray(response.data.data.data)) {
            throw new Error("Dữ liệu trả về không hợp lệ");
        }

        return response.data.data.data; // Trả về mảng tài sản bên trong `data.data`
    } catch (error) {
        console.error("Lỗi khi lấy danh sách NFT:", error.response?.data?.message || error.message);
        throw error;
    }
};



export const sellNFT = async ({ assetId, naturalAmount, currencyId }, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/nft/sell/${assetId}`, // Đảm bảo `assetId` là ID thực
            { naturalAmount, currencyId }, // Dữ liệu gửi kèm trong body
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Token được gửi đúng
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Phản hồi từ API rao bán NFT:", response.data);
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error(
            "Lỗi khi rao bán NFT:",
            error.response?.data?.message || error.message
        );
        throw error;
    }
};
export const buyNFT = async (nftId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token không tồn tại. Không thể thực hiện giao dịch.");
        throw new Error("Token không tồn tại.");
    }

    try {
        const response = await axios.post(
            `${API_BASE_URL}/nft/buy/${nftId}`,
            {}, // Body để trống nếu không có dữ liệu
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token qua headers
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            "Lỗi khi mua NFT:",
            error.response?.data?.message || error.message
        );
        throw error;
    }
};
// / Lấy danh sách NFT từ Collection ID
export const fetchNFTsByCollection = async (collectionId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/nft/${collectionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Trả về dữ liệu
    } catch (error) {
        console.error(
            "Lỗi khi lấy danh sách NFT:",
            error.response?.data?.message || error.message
        );
        throw error;
    }
};
// API: Lấy thông tin chi tiết NFT
export const fetchNFTDetails = async (nftId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/nft/details/${nftId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin chi tiết NFT:", error.response?.data?.message || error.message);
        throw error;
    }
};
export const cancelNFTListing = async (nftId, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/nft/cancel/${nftId}`, // Đường dẫn API
            {}, // Body rỗng nếu không cần
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            "Lỗi khi hủy NFT:",
            error.response?.data?.message || error.message
        );
        throw error;
    }
};