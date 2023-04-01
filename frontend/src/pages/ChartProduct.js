import React, { useState } from 'react';
import Chart from "chart.js/auto"; // quan trọng
import { Pie } from "react-chartjs-2";
const labels = ["January", "February", "March", "April", "May", "June"];
const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
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
      data: [0, 10, 5, 2, 20, 30, 45],
    },
  ],
};
const ChartProduct = () => {
  return (

    <div style={{ display: "flex", backgroundColor: "white", width: "100%", height: "100%" }}>

      <div style={{ width: "40%", height: "100%"}}>
        <h2 style={{ marginLeft: "20%", fontFamily: "Arial,sans-serif", fontSize: "28px", color: "#333", textShadow: "1px 1px #ccc" }}>Thống kê sản phẩm bán chạy</h2>
        <Pie data={data} />
      </div>

      <div style={{ width: "100%", height: "100%"}}>
        <h2 style={{ marginLeft: "20%", fontFamily: "Arial,sans-serif", fontSize: "28px", color: "#333", textShadow: "1px 1px #ccc" }}>Thống kê sản phẩm bán chạy</h2>
        <table style={{ border: "1px solid black", width: "100%", backgroundColor: "white", height: "100%" }}>
          <thead>
            <tr style={{ padding: "8px", textAlign: "center", border: "1px solid black" }}>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{  padding: "8px", textAlign: "center", border: "1px solid black", backgroundColor: "#f2f2f2" }}>
              <td>John</td>
              <td>25</td>
              <td>New York</td>
            </tr>
            <tr style={{  padding: "8px", textAlign: "center", border: "1px solid black", backgroundColor: "#f2f2f2" }}>
              <td>John</td>
              <td>25</td>
              <td>New York</td>
            </tr>
            <tr style={{  padding: "8px", textAlign: "center", border: "1px solid black", backgroundColor: "#f2f2f2" }}>
              <td>John</td>
              <td>25</td>
              <td>New York</td>
            </tr>
            <tr style={{  padding: "8px", textAlign: "center", border: "1px solid black", backgroundColor: "#f2f2f2" }}>
              <td>John</td>
              <td>25</td>
              <td>New York</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};
export default ChartProduct;