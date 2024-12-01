// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import "./styles/ShippingTracking.css";

// const ShippingTracking = () => {
//   const [shippingData, setShippingData] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({});

//   useEffect(() => {
//     const fetchShippingData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/shipments");
//         const result = await response.json();
//         if (result.success) {
//           setShippingData(result.data);
//           calculateStatusCounts(result.data);
//         } else {
//           alert("Không thể tải dữ liệu vận chuyển.");
//         }
//       } catch (error) {
//         console.error("Lỗi khi gọi API:", error);
//       }
//     };

//     fetchShippingData();
//   }, []);

//   // Xử lý dữ liệu để đếm số lượng trạng thái
//   const calculateStatusCounts = (data) => {
//     const counts = data.reduce((acc, shipment) => {
//       acc[shipment.status] = (acc[shipment.status] || 0) + 1;
//       return acc;
//     }, {});
//     setStatusCounts(counts);
//   };

//   // Dữ liệu biểu đồ
//   const chartData = {
//     labels: Object.keys(statusCounts),
//     datasets: [
//       {
//         label: "Số lượng trạng thái",
//         data: Object.values(statusCounts),
//         backgroundColor: [
//           "#4CAF50", // Màu xanh cho trạng thái hoàn thành
//           "#FFC107", // Màu vàng cho trạng thái đang xử lý
//           "#F44336", // Màu đỏ cho trạng thái thất bại
//         ],
//         borderColor: "#ddd",
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Theo dõi vận chuyển</h2>

//       {shippingData.length === 0 ? (
//         <p>Đang tải dữ liệu...</p>
//       ) : (
//         <>
//           {/* Biểu đồ trạng thái */}
//           <div className="chart-container" style={{ marginBottom: "20px" }}>
//             <h3>Thống kê trạng thái</h3>
//             <Bar
//               data={chartData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: "top",
//                   },
//                   title: {
//                     display: true,
//                     text: "Thống kê trạng thái vận chuyển",
//                   },
//                 },
//               }}
//             />
//           </div>

//           {/* Bảng dữ liệu vận chuyển */}
//           <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr>
//                 <th>Mã vận chuyển</th>
//                 <th>Người nhận</th>
//                 <th>Số điện thoại</th>
//                 <th>Địa chỉ</th>
//                 <th>Trạng thái</th>
//                 <th>Cập nhật lần cuối</th>
//               </tr>
//             </thead>
//             <tbody>
//               {shippingData.map((shipment) => (
//                 <tr key={shipment.id}>
//                   <td>{shipment.id}</td>
//                   <td>{shipment.recipientName}</td>
//                   <td>{shipment.phone}</td>
//                   <td>{shipment.address}</td>
//                   <td>{shipment.status}</td>
//                   <td>{shipment.lastUpdated}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default ShippingTracking;


import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Đảm bảo đã đăng ký các thành phần cần thiết
import "./styles/ShippingTracking.css";

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ShippingTracking = () => {
  const [shippingData, setShippingData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});

  // Dữ liệu giả
  const fakeData = [
    {
      id: "SHP001",
      recipientName: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      status: "Đang xử lý",
      lastUpdated: "2024-12-01 08:00:00",
    },
    {
      id: "SHP002",
      recipientName: "Trần Thị B",
      phone: "0912345678",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      status: "Hoàn thành",
      lastUpdated: "2024-11-30 15:30:00",
    },
    {
      id: "SHP003",
      recipientName: "Lê Minh C",
      phone: "0923456789",
      address: "789 Đường DEF, Quận 5, TP.HCM",
      status: "Thất bại",
      lastUpdated: "2024-11-29 12:45:00",
    },
    {
      id: "SHP004",
      recipientName: "Phạm Quang D",
      phone: "0934567890",
      address: "101 Đường GHI, Quận 7, TP.HCM",
      status: "Đang xử lý",
      lastUpdated: "2024-12-01 09:00:00",
    },
    {
      id: "SHP005",
      recipientName: "Nguyễn Thị E",
      phone: "0945678901",
      address: "202 Đường JKL, Quận 10, TP.HCM",
      status: "Hoàn thành",
      lastUpdated: "2024-11-30 17:20:00",
    },
    {
      id: "SHP006",
      recipientName: "Hoàng Văn F",
      phone: "0956789012",
      address: "303 Đường MNO, Quận 11, TP.HCM",
      status: "Thất bại",
      lastUpdated: "2024-11-29 14:00:00",
    },
  ];

  // Dữ liệu giả cho biểu đồ
  const fakeStatusCounts = {
    "Hoàn thành": 2,
    "Đang xử lý": 2,
    "Thất bại": 2,
  };

  useEffect(() => {
    // Giả lập API trả về dữ liệu giả
    const result = {
      success: true,
      data: fakeData,
    };
    if (result.success) {
      setShippingData(result.data);
      setStatusCounts(fakeStatusCounts);
    } else {
      alert("Không thể tải dữ liệu vận chuyển.");
    }
  }, []);

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: Object.keys(statusCounts), // "Hoàn thành", "Đang xử lý", "Thất bại"
    datasets: [
      {
        label: "Số lượng trạng thái",
        data: Object.values(statusCounts), // [2, 2, 2]
        backgroundColor: [
          "rgba(76, 175, 80, 0.6)", // Màu xanh cho trạng thái hoàn thành
          "rgba(255, 193, 7, 0.6)", // Màu vàng cho trạng thái đang xử lý
          "rgba(244, 67, 54, 0.6)", // Màu đỏ cho trạng thái thất bại
        ],
        borderColor: [
          "rgba(76, 175, 80, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(244, 67, 54, 1)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(76, 175, 80, 0.8)",
          "rgba(255, 193, 7, 0.8)",
          "rgba(244, 67, 54, 0.8)",
        ],
        hoverBorderColor: [
          "rgba(76, 175, 80, 1)",
          "rgba(255, 193, 7, 1)",
          "rgba(244, 67, 54, 1)",
        ],
      },
    ],
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Theo dõi vận chuyển</h2>

      {shippingData.length === 0 ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Biểu đồ trạng thái */}
          <div className="chart-container" style={{ marginBottom: "30px" }}>
            <h3 style={{ textAlign: "center", color: "#333" }}>Thống kê trạng thái</h3>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 14,
                        weight: "bold",
                      },
                    },
                  },
                  title: {
                    display: true,
                    text: "Thống kê trạng thái vận chuyển",
                    font: {
                      size: 16,
                      weight: "bold",
                    },
                    color: "#333",
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Trạng thái",
                      font: {
                        size: 14,
                        weight: "bold",
                      },
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Số lượng",
                      font: {
                        size: 14,
                        weight: "bold",
                      },
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          {/* Bảng dữ liệu vận chuyển */}
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "30px",
              borderColor: "#ddd",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f4f4f4",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                <th>Mã vận chuyển</th>
                <th>Người nhận</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Cập nhật lần cuối</th>
              </tr>
            </thead>
            <tbody>
              {shippingData.map((shipment) => (
                <tr
                  key={shipment.id}
                  style={{
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <td>{shipment.id}</td>
                  <td>{shipment.recipientName}</td>
                  <td>{shipment.phone}</td>
                  <td>{shipment.address}</td>
                  <td>{shipment.status}</td>
                  <td>{shipment.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ShippingTracking;

