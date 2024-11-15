router.post('/create', async (req, res) => {
    const { tokenName, description, recipientAddress } = req.body;
  
    try {
      // Sử dụng Gameshift hoặc Solana SDK để tạo NFT
      const response = await axios.post('https://api.gameshift.dev/nx/mint', {
        tokenName,
        description,
        recipientAddress,
      }, {
        headers: {
          'x-api-key': process.env.GAMESHIFT_API_KEY,
          'Content-Type': 'application/json',
        }
      });
  
      res.status(201).json({ message: 'NFT đã tạo thành công', data: response.data });
    } catch (err) {
      console.error('Lỗi khi tạo NFT:', err.message);
      res.status(500).json({ message: 'Lỗi khi tạo NFT' });
    }
  });
  