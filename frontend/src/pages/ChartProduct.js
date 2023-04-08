import React, { useState, useEffect } from 'react';
import Chart from "chart.js/auto"; // quan trọng
import { Pie } from "react-chartjs-2";



const labels = [];
const tempdata = [];
const data = {
  labels: labels,
  datasets: [
    {
      label: "Tổng số lượng bán chạy",
      backgroundColor: [
        "#3e95cd",
        "#8e5ea2",
        "#3cba9f",
        "#e8c3b9",
        "#c45850"
      ],
      borderColor: ["#3e95cd",
        "#8e5ea2",
        "#3cba9f",
        "#e8c3b9",
        "#c45850"],
      data: tempdata,
    },
  ],
};
const ChartProduct = () => {
  const [datas, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/chartproduct`);
      const json = await response.json();
      setData(json);


    }
    fetchData();
  }, []);

  if (datas && labels.length <= 4) {
    datas.topProducts.forEach((product) => {
      labels.push(product.name)
      tempdata.push(product.totalQuantity)
    });
  }
  let myList = "";
  const pageNumbers = [];
  if (datas) {
    const filteredbill = datas.allBills.filter(item => {
      return (item.user[0].firstName.toLowerCase().includes(query.toLowerCase()) || item.user[0].lastName.toLowerCase().includes(query.toLowerCase()) || item._id.toLowerCase().includes(query.toLowerCase()));
    });
    // Pagination
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = filteredbill.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredbill.length / itemsPerPage);


    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    myList = currentItems.map((item) => {
      return (
        <tr key={item.id} style={{ padding: "8px", textAlign: "center", border: "1px solid black", backgroundColor: "#f2f2f2" }}>
          <td>{item._id}</td>
          <td>{item.user[0].firstName} {item.user[0].lastName}</td>
          <td>{item.address}</td>
          <td>{item.date}</td>
          <td>{item.note}</td>
          <td>{item.total}</td>
        </tr>
      )
    });
  }


  return (

    <div style={{ display: "flex", backgroundColor: "white", width: "100%", height: "100%" }}>

      <div style={{ width: "40%", height: "100%" }}>
        <h2 style={{ marginLeft: "20%", fontFamily: "Arial,sans-serif", fontSize: "28px", color: "#333", textShadow: "1px 1px #ccc" }}>Thống kê sản phẩm bán chạy</h2>
        <Pie data={data} />
      </div>

      <div style={{ width: "100%", height: "100%", marginRight: "10px" }}>
        <div>
          <h2 style={{ marginLeft: "30%", fontFamily: "Arial,sans-serif", fontSize: "28px", color: "#333", textShadow: "1px 1px #ccc" }}>Thống kê danh sách hóa đơn khách hàng </h2>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 10px 0", }}>
            <label>Tìm kiếm:</label>
            <input style={{ border: "1px solid black", borderRadius: "5px", textAlign: "center" }} type="text" placeholder="Search bill..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <table style={{ border: "1px solid black", width: "100%", backgroundColor: "white", height: "100%" }}>
          <thead>
            <tr style={{ padding: "8px", textAlign: "center", border: "1px solid black" }}>
              <th>Mã hóa đơn</th>
              <th style={{ width: "250px" }}>Tên khách hàng</th>
              <th>Địa chỉ</th>
              <th>Ngày tạo hóa đơn</th>
              <th>Ghi chú</th>
              <th>Tổng Tiền</th>
            </tr>
          </thead>
          <tbody>
            {myList}
          </tbody>
        </table>
        {/* Pagination */}
        <div style={{ margin: "10px 50px 0 0", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          {pageNumbers.map(number => (
            <button style={{ width: "50px", marginBottom: "5px", marginLeft: "5px", fontSize: "16", fontWeight: "bold", backgroundColor: "rgb(242, 242, 242)", border: "none", color: "#333", cursor: "pointer" }} key={number} onClick={() => setCurrentPage(number)}>{number}</button>
          ))}
        </div>
      </div>

    </div>

  );
};
export default ChartProduct;