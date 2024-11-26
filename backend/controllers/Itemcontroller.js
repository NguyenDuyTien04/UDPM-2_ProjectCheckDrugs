const axios = require('axios');
const cache = require('memory-cache'); // Dùng thư viện memory-cache để lưu trữ dữ liệu tạm thời


// Hàm xử lý lỗi
const handleError = (error) => {
  if (error.response) {
    console.error('Lỗi từ GameShift:', error.response.data);
    throw new Error(`Lỗi từ GameShift: ${error.response.data.message || 'Lỗi không xác định'}`);
  } else if (error.request) {
    console.error('Không nhận được phản hồi từ GameShift:', error.request);
    throw new Error('Không nhận được phản hồi từ GameShift API');
  } else {
    console.error('Lỗi khi gọi GameShift API:', error.message);
    throw new Error(`Lỗi khi gọi GameShift API: ${error.message}`);
  }
};

// Controller: Lấy thông tin chi tiết một NFT từ GameShift
exports.fetchNFTFromGameShift = async (req, res) => {
  const { nftId } = req.params; // Lấy nftId từ tham số URL

  // Kiểm tra xem dữ liệu NFT có trong cache không
  const cachedNFT = cache.get(nftId);
  if (cachedNFT) {
    console.log('Trả về dữ liệu NFT từ cache');
    return res.status(200).json({
      message: 'Lấy thông tin NFT thành công từ cache',
      data: cachedNFT,
    });
  }

  try {
    // Gửi yêu cầu đến GameShift API để lấy chi tiết NFT
    const response = await axios.get(`${BASE_URL}/unique-assets/${nftId}`, {
      headers: {
        'x-api-key': API_KEY, // Sử dụng API key từ config
        'Accept': 'application/json',
      },
    });

    console.log('Phản hồi từ GameShift khi lấy chi tiết NFT:', response.data);

    // Lưu trữ dữ liệu vào cache để lần sau có thể lấy nhanh hơn
    cache.put(nftId, response.data, 3600000); // Lưu trong cache 1 giờ

    return res.status(200).json({
      message: 'Lấy thông tin NFT thành công',
      data: response.data,
    });
  } catch (error) {
    handleError(error);
    return res.status(500).json({
      message: 'Không thể lấy thông tin NFT',
      error: error.message,
    });
  }
};
