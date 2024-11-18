// userRoutes
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/create', async (req, res) => {
  const { tokenName, description, recipientAddress } = req.body;

  try {
    const response = await axios.post('https://api.gameshift.dev/nx/mint', {
      tokenName,
      description,
      recipientAddress,
    }, {
      headers: {
        'x-api-key': process.env.GAMESHIFT_API_KEY,
        accept: 'application/json',
      },
    });

    res.status(201).json({ message: 'NFT được tạo thành công!', data: response.data });
  } catch (error) {
    console.error('Lỗi khi tạo NFT:', error.response?.data || error.message);
    res.status(500).json({ message: 'Lỗi khi tạo NFT.' });
  }
});

module.exports = router;
