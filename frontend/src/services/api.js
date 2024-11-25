import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Đăng nhập
export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
};

// Đăng ký
export const register = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};

// Lấy danh sách bộ sưu tập
export const fetchCollections = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/collections`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Tạo bộ sưu tập
export const createCollection = async (data, token) => {
    const response = await axios.post(`${API_BASE_URL}/collections/create`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

// Tạo Certificate NFT
export const createCertificateNFT = async (data, token) => {
    const response = await axios.post(`${API_BASE_URL}/nfts/certificate`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Tạo Medicine NFT
export const createMedicineNFT = async (data, token) => {
    const response = await axios.post(`${API_BASE_URL}/nfts/medicine`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Lấy danh sách NFT
export const fetchNFTs = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/nfts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Lấy chi tiết NFT
export const fetchNFTById = async (id, token) => {
    const response = await axios.get(`${API_BASE_URL}/nfts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Lấy danh sách NFT theo bộ sưu tập
export const getNFTsByCollection = async (collectionId, token) => {
    const response = await axios.get(`${API_BASE_URL}/collections/${collectionId}/nfts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Rao bán NFT
export const sellNFT = async (nftId, price, currency, token) => {
    const response = await axios.put(
        `${API_BASE_URL}/nfts/${nftId}/sell`,
        { price, currency },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

// Lấy danh sách NFT trên Market
export const fetchMarketNFTs = async () => {
    const response = await axios.get(`${API_BASE_URL}/market/nfts`);
    return response.data;
};
export const fetchPurchaseHistory = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/purchase-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };