import React, { useState, useEffect } from 'react'
import './Invoice.css'
import { Link } from 'react-router-dom';

const Invoice = () => {
  const [billid, setData] = useState(null);
  // const searchParams = new URLSearchParams(location.search);
  // const addValue = searchParams.get('add');
  // console.log(addValue)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idbill = searchParams.get('id');

    async function fetchData() {
      // console.log(idbill)
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/invoicebill?idbill=${idbill}`);
      const json = await response.json();
      setData(json);
      console.log(json)
    }
    fetchData();
  }, []);
  let myLists = "";
  let total = "";
  //const test = ["1","2"]
  const numberWithCommas = (number) => {
    return number.toString().replace(/\./g, '');
  }
  if (billid) {
    console.log(billid)
    const i = 0;
    myLists = billid.map((item) => {
      total = item.bill.total;
      return (
        <tr key={item.id} style={{ padding: "8px", textAlign: "center", border: "1px solid black", backgroundColor: "#f2f2f2" }}>

          <td>{item.product.name} </td>
          <td>{item.quantity} </td>
          <td>{item.product.price} </td>
          <td>{(numberWithCommas(item.product.price) * item.quantity).toLocaleString('vi-VN')}</td>

        </tr>

      )
    });

  }

  return (
    <div className="invoice">
      <h1>Chi tiết hóa đơn </h1>

      <table>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {myLists}
        </tbody>
      </table>
      <div className="total">
        Tổng Tiền: {total}
        <br />
        <Link to={"/chartproduct"}
        >
          Trở về
        </Link>
      </div>

    </div>
  );
}

export default Invoice;
