import React from 'react';

const AddDrug = () => {
  return (
    <div>
      <h2>Thêm Thuốc</h2>
      <form>
        <div>
          <label>Tên Thuốc:</label>
          <input type="text" name="tenThuoc" />
        </div>
        <div>
          <label>Số Lô:</label>
          <input type="text" name="soLo" />
        </div>
        <div>
          <label>Mã QR:</label>
          <input type="text" name="maQR" />
        </div>
        <div>
          <label>Ngày Sản Xuất:</label>
          <input type="date" name="ngaySanXuat" />
        </div>
        <div>
          <label>Ngày Hết Hạn:</label>
          <input type="date" name="ngayHetHan" />
        </div>
        <div>
          <label>Giá (SOL):</label>
          <input type="number" name="gia" />
        </div>
        <button type="submit">Thêm Thuốc</button>
      </form>
    </div>
  );
};

export default AddDrug;
