import React, { useState } from 'react'
import { FiUploadCloud } from "react-icons/fi"
import { ImagetoBase64 } from '../utility/ImagetoBase64';

const NewProduct = () => {
  const [data, setData] = useState({
    name: "",
    category: "",
    image: "",
    price: "",
    description: ""
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const uploadImage = async (e) => {
    const data = await ImagetoBase64(e.target.files[0])

    setData((preve) => {
      return {
        ...preve,
        image: data
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(data)
  }

  return (
    <div className='p-4'>
      <form className='m-auto w-full max-w-md shadow flex flex-col p-3 bg-white' onSubmit={data}>
        <label htmlFor='name'>Name</label>
        <input type={"text"} name="name" className='bg-slate-200 p-1 mt-1 mb-3' onChange={handleOnChange} />

        <label htmlFor='category'>Category</label>
        <select className='bg-slate-200 p-1 mt-1 mb-3' id='category' name='category' onChange={handleOnChange}>
          <option>Roses</option>
          <option>Orchids</option>
          <option>Lilies</option>
          <option>Apricot blossoms</option>
          <option>Lotus</option>
        </select>

        <label htmlFor='image'>Image
          <div className='h-40 w-full rounded mt-1 mb-3 rounded flex items-center justify-center cursor-pointer' style={{ background: '#99CCCC' }}>
            {
              data.image ? <img src={data.image} className='h-full' /> : <span className='text-4x1'><FiUploadCloud size={60} /></span>
            }
            <input type="file" id="image" onChange={uploadImage} accept='image/*' className="hidden" />
          </div>
        </label>

        <label htmlFor='price'>Price</label>
        <input type={"text"} className='bg-slate-200 p-1 mt-1 mb-3' name='price' onChange={handleOnChange} />

        <label htmlFor='description'>Description</label>
        <textarea rows={3} className='bg-slate-200 p-1 mt-1 mb-3 resize-none' name='description' onChange={handleOnChange}></textarea>

        <button className='bg-blue-500 hover:bg-green-500 text-white text-lg font-medium drop-shadow'>SAVE</button>
      </form>
    </div>
  )
}

export default NewProduct