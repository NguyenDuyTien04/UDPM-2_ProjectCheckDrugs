import axios from 'axios';

// Cấu hình axios
const drugApi = axios.create({
  baseURL: 'http://localhost:5000/api/drugs', // Đường dẫn tới API backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default drugApi;
