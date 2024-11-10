// PhantomConnectButton.js
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import './css/PhantomConnectButton.css';

function PhantomConnectButton() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Vị trí mặc định

  // Kết nối với Phantom Wallet
  useEffect(() => {
    if (window.solana) {
      window.solana.on('connect', () => {
        console.log('Connected to Phantom Wallet');
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const resp = await window.solana.connect();
        setWalletAddress(resp.publicKey.toString().substring(0, 5)); // Lấy 5 ký tự đầu của mã ví
        console.log('Connected account:', resp.publicKey.toString());
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); // Thông báo sẽ biến mất sau 3 giây
      } catch (err) {
        console.error('Lỗi khi kết nối ví Phantom:', err.message);
      }
    } else {
      alert('Bạn cần cài đặt ví Phantom để sử dụng chức năng này.');
    }
  };

  // Di chuyển nút
  useEffect(() => {
    const button = buttonRef.current;

    let offsetX, offsetY;

    const handleMouseDown = (e) => {
      offsetX = e.clientX - button.getBoundingClientRect().left;
      offsetY = e.clientY - button.getBoundingClientRect().top;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    button.addEventListener('mousedown', handleMouseDown);

    return () => {
      button.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div>
      <button
        ref={buttonRef}
        className="phantom-connect-button"
        onClick={connectWallet}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <FontAwesomeIcon icon={faWallet} className="wallet-icon" />
        <span className="wallet-text">{walletAddress ? `Đã kết nối: ${walletAddress}...` : 'Kết nối Ví Phantom'}</span>
      </button>

      {showNotification && (
        <div className="phantom-notification">
          Kết nối ví thành công!
        </div>
      )}
    </div>
  );
}

export default PhantomConnectButton;
