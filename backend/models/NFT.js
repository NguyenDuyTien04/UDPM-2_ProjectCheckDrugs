const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true // Tên của NFT
        },
        description: {
            type: String,
            required: true // Mô tả của NFT
        },
        imageUrl: {
            type: String,
            required: true // URL hình ảnh của NFT
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection", // Liên kết với Collection
            required: true
        },
        gameShiftAssetId: {
            type: String,
            unique: true,
            required: true // ID của NFT trên GameShift
        },
        price: {
            type: Number,
            required: true // Giá của NFT
        },
        ownerWallet: {
            type: String,
            required: true // Địa chỉ ví của người sở hữu NFT
        },
        isActive: {
            type: Boolean,
            default: true // Trạng thái hoạt động
        },
        forSale: { type: Boolean, default: false }, // Đánh dấu NFT đang được rao bán
        type: {
            type: String,
            enum: ['certificate', 'medicine'], // 'certificate' (giấy chứng nhận), 'medicine' (sản phẩm thuốc)
            required: true,
        },
        currency: {
            type: String,
            enum: ["SOL", "USDC"],
            required: true,
            default: "SOL", // Mặc định là SOL
        },
    },
    {
        timestamps: true // Tự động thêm `createdAt` và `updatedAt`
    }
);

module.exports = mongoose.model("NFT", nftSchema);
