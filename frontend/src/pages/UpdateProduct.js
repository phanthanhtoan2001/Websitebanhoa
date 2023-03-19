import React, { useState, useEffect } from 'react';
import { FiUploadCloud } from "react-icons/fi"
import { ImagetoBase64 } from '../utility/ImagetoBase64';
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  // useState để lưu giữ các state của component, bao gồm tên, danh mục, ảnh, giá và mô tả sản phẩm
  const [name, setName] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [image, setImage] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [description, setDescription] = React.useState('')

  // Sử dụng hook useParams để lấy giá trị tham số trên URL
  const params = useParams()

  // Sử dụng hook useNavigate để điều hướng sang trang khác
  const navigate = useNavigate()

  // Sử dụng useEffect để gọi API và lấy chi tiết sản phẩm dựa trên tham số trên URL khi component được render
  useEffect(() => {
    getProductDetail()
  }, [])

  // Gọi API để lấy chi tiết sản phẩm dựa trên tham số trên URL và cập nhật các state tương ứng
  const getProductDetail = async () => {
    console.warn(params)
    let result = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/product/${params.id}`)
    result = await result.json()
    console.warn(result)
    setName(result.name)
    setCategory(result.category)
    setImage(result.image)
    setPrice(result.price)
    setDescription(result.description)
  }

  // Hàm xử lý khi người dùng click nút cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    console.warn(name, category, image, price, description)

    // Kiểm tra điều kiện để đảm bảo các trường bắt buộc được điền và giá tiền hợp lệ
    if (!name || !category || !image || !description) {
      toast("Enter required fields")
      return;
    } else if (!price.includes(".")) {
      toast("Please enter a valid price");
      return;
    }

    try {
      // Gọi API để cập nhật thông tin sản phẩm
      let result = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/product/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, category, image, price, description }),
        headers: {
          "Content-type": "application/json"
        }
      })
      result = await result.json()
      navigate('/') // Điều hướng về trang chủ sau khi cập nhật thành công
    } catch (err) {
      console.error(err)
    }
  }

  const uploadImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0])

    setImage((preve) => {
      return {
        ...preve,
        image: data
      }
    })
  }

  return (
    <div className="p-4">
      <form className="m-auto w-full max-w-md shadow flex flex-col p-3 bg-white" onSubmit={handleUpdateProduct}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" className="bg-slate-200 p-1 mt-1 mb-3" onChange={(e) => {
          setName(e.target.value)
        }} value={name} />

        <label htmlFor="category">Category</label>
        <select className="bg-slate-200 p-1 mt-1 mb-3" id="category" name="category" onChange={(e) => {
          setCategory(e.target.value)
        }} value={category}>
          <option value={"other"}>Select category</option>
          <option value={"rose"}>Rose</option> {/* Hoa hồng */}
          <option value={"orchid"}>Orchid</option> {/* Hoa lan */}
          <option value={"lily"}>Lily</option> {/* Hoa loa kèn */}
          <option value={"apricot"}>Apricot blossom</option> {/* Hoa mai */}
          <option value={"lotus"}>Lotus</option> {/* Hoa sen */}
          <option value={"hibiscus"}>Hibiscus blossom</option> {/* Hoa dâm bụt */}
        </select>

        <label htmlFor="image">
          Image
          <div className="h-40 w-full rounded mt-1 mb-3 rounded flex items-center justify-center cursor-pointer" style={{ background: '#99CCCC' }}>
            {image ? (
              <img src={image} className="h-full" />
            ) : (
              <span className="text-4xl">
                <FiUploadCloud size={60} />
              </span>
            )}
            <input
              type="file"
              id="image"
              onChange={uploadImage}
              accept="image/*"
              className="hidden"
            />
          </div>
        </label>

        <label htmlFor="price">Price</label>
        <input type="text" id="price" name="price" className="bg-slate-200 p-1 mt-1 mb-3" onChange={(e) => {
          setPrice(e.target.value)
        }} value={price} />

        <label htmlFor="description">Description</label>
        <textarea rows={3} id="description" name="description" className="bg-slate-200 p-1 mt-1 mb-3 resize-none" onChange={(e) => {
          setDescription(e.target.value)
        }} value={description}></textarea>

        <button className="bg-blue-500 hover:bg-green-500 text-white text-lg font-medium drop-shadow">
          SAVE
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct