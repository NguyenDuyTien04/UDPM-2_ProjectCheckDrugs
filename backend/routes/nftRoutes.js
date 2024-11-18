const express = require('express');
const router = express.Router();
const axios = require('axios');

// Tạo NFT mới
router.post('/create', async (req, res) => {
  const { tokenName, description, recipientAddress } = req.body;

  try {
    const response = await axios.post(
      'https://api.gameshift.dev/nx/mint',
      { tokenName, description, recipientAddress },
      { headers: { 'x-api-key': process.env.GAMESHIFT_API_KEY } }
    );

    res.status(201).json({ message: 'NFT được tạo thành công!', data: response.data });
  } catch (err) {
    console.error('Lỗi tạo NFT:', err.message);
    res.status(500).json({ message: 'Lỗi tạo NFT.', error: err.message });
  }
});

module.exports = router;
