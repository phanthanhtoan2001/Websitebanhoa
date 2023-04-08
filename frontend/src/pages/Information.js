import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { ImagetoBase64 } from '../utility/ImagetoBase64'
import { FiUploadCloud } from "react-icons/fi"

const Information = () => {
    // useState để lưu giữ các state của component
    const [email, setEmail] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [image, setImage] = React.useState('')

    // Sử dụng hook useParams để lấy giá trị tham số trên URL
    const params = useParams()

    // Sử dụng hook useNavigate để điều hướng sang trang khác
    const navigate = useNavigate()

    // Sử dụng useEffect để gọi API và lấy chi tiết sản phẩm dựa trên tham số trên URL khi component được render
    useEffect(() => {
        getUserDetail()
    }, [])

    // Gọi API để lấy chi tiết sản phẩm dựa trên tham số trên URL và cập nhật các state tương ứng
    const getUserDetail = async () => {
        console.warn(params)
        let result = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/users/${params.id}`)
        result = await result.json()
        console.warn(result)
        setEmail(result.email)
        setFirstName(result.firstName)
        setLastName(result.lastName)
        setImage(result.image)
    }

    // Hàm xử lý khi người dùng click nút cập nhật sản phẩm
    // Hàm xử lý khi người dùng click nút cập nhật sản phẩm
    const handleUpdateUser = async () => {
        console.warn(email, firstName, lastName, image)

        // Kiểm tra điều kiện để đảm bảo các trường bắt buộc được điền và giá tiền hợp lệ
        if (!email || !firstName || !lastName || !image) {
            toast("Enter required fields")
            return
        }

        try {
            // Gọi API để cập nhật thông tin sản phẩm
            let result = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/users/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify({ email, firstName, lastName, image }),
                headers: {
                    "Content-type": "application/json"
                }
            })
            result = await result.json()
            console.log('Update user result: ', result)
            navigate('/') // Điều hướng về trang chủ sau khi cập nhật thành công
        } catch (err) {
            console.error(err)
        }
    }

    const uploadImage = async (e) => {
        const data = await ImagetoBase64(e.target.files[0])
        setImage(data)
    }

    return (
        <div className="p-4">
            <form className="m-auto w-full max-w-md shadow flex flex-col p-3 bg-white" onSubmit={handleUpdateUser}>
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
                <label htmlFor="name">Email</label>
                <input type="email" id="email" name="email" className="bg-slate-200 p-1 mt-1 mb-3" onChange={(e) => {
                    setEmail(e.target.value)
                }} value={email} disabled />

                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" name="firstname" className="bg-slate-200 p-1 mt-1 mb-3" onChange={(e) => {
                    setFirstName(e.target.value)
                }} value={firstName} />

                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" name="lastname" className="bg-slate-200 p-1 mt-1 mb-3" onChange={(e) => {
                    setLastName(e.target.value)
                }} value={lastName} />

                <button className="bg-blue-500 hover:bg-green-500 text-white text-lg font-medium drop-shadow">
                    SAVE
                </button>
            </form>
        </div>
    )
}

export default Information