import React, { useEffect, useState } from "react";
import { fetchUserNFTs, sellNFT } from "../services/api";
import { useUserContext } from "../context/UserContext"; // Lấy context
import "./styles/UserNFTs.css";

const UserNFTs = () => {
    const { user } = useUserContext(); // Lấy thông tin user từ context
    const [currencies, setCurrencies] = useState([]);
    const [nfts, setNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("USDC");

    useEffect(() => {
        if (!user?.token) {
            console.error("Token không tồn tại. Vui lòng đăng nhập.");
            return;
        }

        const loadUserNFTs = async () => {
            try {
                const assets = await fetchUserNFTs(user.token); // Sử dụng token để lấy dữ liệu
                console.log("Dữ liệu tài sản của người dùng:", assets);
    
                // Phân loại tài sản thành Currency và UniqueAsset
                const currencyAssets = assets.filter((item) => item.type === "Currency");
                const nftAssets = assets.filter((item) => item.type === "UniqueAsset");
    
                setCurrencies(currencyAssets);
                setNFTs(nftAssets);
            } catch (error) {
                console.error("Lỗi khi tải NFT:", error.message);
                alert("Không thể tải tài sản của người dùng.");
            } finally {
                setLoading(false);
            }
        };

        loadUserNFTs();
    }, [user?.token]);

    const handleSellNFT = async () => {
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            alert("Vui lòng nhập giá hợp lệ!");
            return;
        }

        try {
            await sellNFT(
                { assetId: selectedNFT.item.id, naturalAmount: price, currencyId: currency },
                user.token
            );
            alert("NFT đã được rao bán thành công!");
            setNFTs((prevNFTs) =>
                prevNFTs.map((nft) =>
                    nft.item.id === selectedNFT.item.id
                        ? { ...nft, item: { ...nft.item, forSale: true } }
                        : nft
                )
            );
            closeSellModal();
        } catch (error) {
            console.error("Lỗi khi rao bán NFT:", error.message);
            alert("Không thể rao bán NFT.");
        }
    };

    const openSellModal = (nft) => {
        setSelectedNFT(nft);
        setPrice("");
        setCurrency("USDC");
        setIsModalOpen(true);
    };

    const closeSellModal = () => {
        setSelectedNFT(null);
        setIsModalOpen(false);
    };

    if (!user?.token) {
        return <p>Vui lòng đăng nhập để xem tài sản của bạn.</p>;
    }

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="user-nfts-container">
            <h2>Tài sản của bạn</h2>

            <div className="currency-section">
                <h3>Số dư</h3>
                <div className="currency-list">
                    {currencies.map((currency) => (
                        <div key={currency.item.id} className="currency-card">
                            <h4>
                                {currency.item.name} ({currency.item.symbol})
                            </h4>
                            <p>Số lượng: {currency.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="nft-section">
                <h3>Danh sách NFT</h3>
                <div className="nft-list">
                    {nfts.map((nft) => (
                        <div key={nft.item.id} className="nft-card">
                            <img
                                src={nft.item.imageUrl || "placeholder-image.jpg"}
                                alt={nft.item.name || "NFT"}
                            />
                            <h4>{nft.item.name || "Không có tên"}</h4>
                            <p>{nft.item.description || "Không có mô tả"}</p>
                            <button className="btn-details">Xem chi tiết</button>
                            <button
                                className="btn-sell"
                                onClick={() => openSellModal(nft)}
                                disabled={nft.item.forSale}
                            >
                                {nft.item.forSale ? "Đã rao bán" : "Rao bán"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Rao bán NFT</h3>
                        <p>Bạn đang rao bán NFT: "{selectedNFT?.item.name}"</p>
                        <label>
                            Nhập giá bán:
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Nhập giá..."
                            />
                        </label>
                        <label>
                            Chọn loại tiền:
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="USDC">USDC</option>
                                <option value="SOL">SOL</option>
                            </select>
                        </label>
                        <button className="btn-confirm" onClick={handleSellNFT}>
                            Xác nhận
                        </button>
                        <button className="btn-cancel" onClick={closeSellModal}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserNFTs;
