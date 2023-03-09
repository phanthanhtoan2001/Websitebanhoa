import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiUploadCloud } from "react-icons/fi"
import { ImagetoBase64 } from '../utility/ImagetoBase64'

const NewProduct = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: ""
  })

  // Xử lý khi giá trị của các input thay đổi
  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  // Chuyển đổi hình ảnh thành base64 và cập nhật state
  const uploadImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0])

    setData((preve) => {
      return {
        ...preve,
        image: data
      }
    })
  }

  // Gửi dữ liệu sản phẩm lên server
  const handleSubmit = async (e) => {
    e.preventDefault() // Ngăn không cho trình duyệt tự động submit form
    console.log(data)

    const { name, image, category, price } = data

    if (name && image && category && price.includes(".") && price) {
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/uploadProduct`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const fetchRes = await fetchData.json()

      console.log(fetchRes)
      toast(fetchRes.message, {
        style: { backgroundColor: '#00FF7F', color: 'white' }
      }) // Thông báo đã upload sản phẩm thành công

      setData(() => {
        return {
          name: "",
          category: "",
          image: "",
          price: "",
          description: ""
        }
      })

      if (!data.price.includes(".")) {
        toast("Please enter a valid price", {
          style: { background: 'red', color: 'white' }
        })
      }  // Thông báo khi giá không hợp lệ
    } else {
      toast("Enter required fields", {
        style: { background: 'red', color: 'white' }
      }) // Thông báo khi chưa điền đầy đủ thông tin yêu cầu
    }
  }

  return (
    <div className='p-4'>
      <form className='m-auto w-full max-w-md shadow flex flex-col p-3 bg-white' onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type={"text"} name="name" className='bg-slate-200 p-1 mt-1 mb-3' onChange={handleOnChange} value={data.name} />

        <label htmlFor='category'>Category</label>
        <select className='bg-slate-200 p-1 mt-1 mb-3' id='category' name='category' onChange={handleOnChange} value={data.category}>
          <option value={"other"}>Select category</option>
          <option value={"rose"}>Rose</option> {/* Hoa hồng */}
          <option value={"orchid"}>Orchid</option> {/* Hoa lan */}
          <option value={"lily"}>Lily</option> {/* Hoa loa kèn */}
          <option value={"apricot"}>Apricot blossom</option> {/* Hoa mai */}
          <option value={"lotus"}>Lotus</option> {/* Hoa sen */}
          <option value={"hibiscus"}>Hibiscus blossom</option> {/* Hoa dâm bụt */}
        </select>

        <label htmlFor='image'>Image
          <div className='h-40 w-full rounded mt-1 mb-3 rounded flex items-center justify-center cursor-pointer' style={{ background: '#99CCCC' }}>
            {
              data.image ? <img src={data.image} className='h-full' /> : <span className='text-4xl'><FiUploadCloud size={60} /></span>
            }
            <input type="file" id="image" onChange={uploadImage} accept='image/*' className="hidden" />
          </div>
        </label>

        <label htmlFor='price'>Price</label>
        <input type={"text"} className='bg-slate-200 p-1 mt-1 mb-3' name='price' onChange={handleOnChange} value={data.price} />

        <label htmlFor='description'>Description</label>
        <textarea rows={3} className='bg-slate-200 p-1 mt-1 mb-3 resize-none' name='description' onChange={handleOnChange} value={data.description}></textarea>

        <button className='bg-blue-500 hover:bg-green-500 text-white text-lg font-medium drop-shadow'>SAVE</button>
      </form>
    </div>
  )
}

export default NewProduct