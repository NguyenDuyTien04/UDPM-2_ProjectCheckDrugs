// backend/services/gameshiftService.js
const https = require('https');

async function registerUser(referenceId, email, walletAddress) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            hostname: 'api.gameshift.dev',
            port: null,
            path: '/nx/users',
            headers: {
                accept: 'application/json',
                'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI4YzZhZTQwMy04ZGRhLTQzODAtOGFjOS05ZjRiYzUwYmU2NTQiLCJzdWIiOiIyY2RmNzRkZS0wZTAyLTQxYTItYjA0NC00N2E5YWNlZTBjOGIiLCJpYXQiOjE3MzE1NzU3NTd9.6kZE4C3rkmv4KJSuj_xwW4jo86AYeh6TTDjW-aMcHrI', // Thay thế YOUR_API_KEY bằng API Key của bạn
                'content-type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Đăng ký thất bại: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Lỗi yêu cầu: ${e.message}`));
        });

        req.write(JSON.stringify({
            referenceId,
            email,
            externalWalletAddress: walletAddress
        }));
        req.end();
    });
}

module.exports = { registerUser };
