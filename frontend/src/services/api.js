import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};
// Lấy ra bộ sưu tập
export const fetchCollections = async (token) => {
    console.log("API_BASE_URL:", API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/collections/list`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    console.log("Token đang sử dụng:", token);
    return response.data;
};

export const createCollection = async (token, data) => {

    const response = await axios.post(`${API_BASE_URL}/collections/create`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;

};

// Tạo Certificate NFT
export const createCertificateNFT = async (data, token) => {
    const response = await axios.post(`${API_BASE_URL}/nft/certificate/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Tạo Medicine NFT
export const createMedicineNFT = async (data, token) => {
    const response = await axios.post(`${API_BASE_URL}/nft/medicine/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Lấy danh sách NFT
export const fetchNFTs = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/nft/list`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Lấy chi tiết NFT
export const fetchNFTById = async (id, token) => {
    const response = await axios.get(`${API_BASE_URL}/nft/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Lấy danh sách NFT từ bộ sưu tập
export const getNFTsByCollection = async (collectionId, token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/nft/collection/${collectionId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy NFT từ bộ sưu tập:", error.response || error.message);
        throw error;
    }
};
// Rao bán NFT
export const sellNFT = async (nftId, price, currency, token) => {
    const response = await axios.put(
        `${API_BASE_URL}/nft/sell/${nftId}`,
        { price, currency },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};


// Lấy danh sách NFT trên Market
export const fetchMarketNFTs = async () => {
    const response = await axios.get(`${API_BASE_URL}/nft/market`);
    return response.data;
};

