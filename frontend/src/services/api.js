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

export const getDrugs = async () => {
    const response = await axios.get(`${API_BASE_URL}/drugs`);
    return response.data;
};

export const addDrug = async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/drugs/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getNFTs = async () => {
    const response = await axios.get(`${API_BASE_URL}/nfts`);
    return response.data;
};