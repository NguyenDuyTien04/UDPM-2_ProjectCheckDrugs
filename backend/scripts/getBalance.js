// backend/scripts/getBalance.js

const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

async function main() {
  // Kết nối với mạng Devnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Địa chỉ ví công khai
  const publicKey = new PublicKey('BLQfSiUwCoRgEW4yEu6nzSQXvgytSgFR3Tu7kb2naMMt');

  // Lấy số dư tài khoản của ví
  const balance = await connection.getBalance(publicKey);
  console.log(`Số dư tài khoản của ví là: ${balance / 1e9} SOL`);
}

main().catch((err) => {
  console.error(err);
});
