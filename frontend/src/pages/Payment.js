import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import InfoProductCart from '../components/InfoProductCart'

const Payment = () => {
    const productCartItem = useSelector((state) => state.product.cartItem) // Lấy cart item từ redux store
    const totalPrice = productCartItem.reduce(
        (acc, curr) => acc + parseFloat(curr.total.replace(/\./g, '').replace(',', '.')),
        0
    ).toLocaleString('vi', { style: 'decimal', minimumFractionDigits: 0 })

    const totalQuantity = productCartItem.reduce((acc, curr) => acc + parseInt(curr.quanity), 0)

    const userEmail = useSelector(state => state.user.email)
    const firstName = useSelector(state => state.user.firstName)
    const lastName = useSelector(state => state.user.lastName)
    const fullName = firstName + " " + lastName

    // Đặt giá trị mặc định cho ngày giao hàng
    const [deliveryDate, setDeliveryDate] = useState(getDeliveryDateStr(3))

    function getDeliveryDateStr(addDaysCount) {
        // Lấy ngày hôm nay
        const today = new Date()

        // Thêm số ngày cần thêm vào ngày hiện tại
        today.setDate(today.getDate() + addDaysCount)

        // Chuyển đổi đối tượng Ngày thành chuỗi yyyy-mm-dd được định dạng trong thẻ input type="date"
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const dd = String(today.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }

    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneNumberValid, setPhoneNumberValid] = useState(true)

    const validatePhoneNumber = (phoneNumber) => {
        // Đầu số điện thoại VN
        const vnPhonePattern = /^(09|08|07|05|03)([0-9]{8})$/

        return vnPhonePattern.test(phoneNumber)
    }

    const onPhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value)
        setPhoneNumberValid(validatePhoneNumber(event.target.value))
    }

    const [showBankAccountInfo, setShowBankAccountInfo] = useState(false)
    const [showMomoAccountInfo, setShowMomoAccountInfo] = useState(false)

    function handlePaymentMethodChange(event) {
        if (event.target.value === 'creditcard') {
            setShowBankAccountInfo(true)
            setShowMomoAccountInfo(false)
        } else if (event.target.value === 'momo') {
            setShowBankAccountInfo(false)
            setShowMomoAccountInfo(true)
        } else {
            setShowBankAccountInfo(false)
            setShowMomoAccountInfo(false)
        }
    }

    return (
        <div className='flex justify-between mt-2'>
            <div className='p-4 bg-green-200 rounded-lg shadow-xl ml-auto mx-auto flex flex-col' style={{ width: '50%', height: 'auto' }}>
                <h2 className='text-3xl font-bold text-blue-600 p-3 border-b-2 border-blue-200'>Payment Information</h2>
                <form className='flex flex-col flex-grow-1 w-full p-4'>
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='fullname'>Fullname</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' type='text' id='fullname' name='fullname' readOnly required value={fullName} />
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='email'>Email</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' type='email' id='email' name='email' readOnly required value={userEmail} />
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='address'>Address</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' id='address' name='address' rows='3' required></input>
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='phone'>Phone number</label>
                    <input
                        className={`border-gray-300 border-2 rounded-md p-2 mb-4 ${phoneNumberValid ? "" : "border-red-500"}`}
                        type='tel'
                        id='phone'
                        name='phone'
                        required
                        value={phoneNumber}
                        onChange={onPhoneNumberChange}
                    />
                    {!phoneNumberValid && <p className="text-red-500 mb-2">Please enter a valid Vietnamese phone number.</p>}
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='delivery'>Delivery date</label>
                    {/* Sử dụng deliveryDate để thiết lập giá trị mặc định và kết nối với state của useState */}
                    <input
                        className='border-gray-300 border-2 rounded-md p-2 mb-4'
                        type='date'
                        id='delivery'
                        name='delivery'
                        required
                        value={deliveryDate}     // Sử dụng giá trị từ state
                        min={getDeliveryDateStr(3)}   // Thiết lập ngày tối thiểu với giá trị 3 ngày sau ngày hiện tại
                    />
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='message'>Notice</label>
                    <textarea className='border-gray-300 border-2 rounded-md p-2 mb-4' id='message' name='message' rows='3'></textarea>
                    <div>
                        <label className='text-base font-medium text-gray-700 mb-2 mr-3' htmlFor='paymentMethod'>
                            Payment methods
                        </label>
                        <select
                            className='border-gray-300 border-2 rounded-md p-2 mb-4'
                            id='paymentMethod'
                            name='paymentMethod'
                            required
                            onChange={handlePaymentMethodChange}
                        >
                            <option>Select payment method</option>
                            <option value='momo'>Momo</option>
                            <option value='creditcard'>Bank transfer</option>
                        </select>
                        {showMomoAccountInfo && (
                            <div>
                                Momo Account Information:
                                <ul>
                                    <li>Account holder: Lê Tấn Huy</li>
                                    <li>Account number: 0396450824</li>
                                </ul>
                            </div>
                        )}
                        {showBankAccountInfo && (
                            <div>
                                Bank Account Information:
                                <ul>
                                    <li>Account holder: Lê Tấn Huy</li>
                                    <li>Account number: 005 1000 563 521</li>
                                    <li>Bank name: VIETCOMBANK</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </form>
                <div className='w-full text-2xl font-bold py-2 text-white bg-red-400 mt-auto text-center'>
                    <Link to="/payment">
                        <button>Payment</button>
                    </Link>
                </div>
            </div>
            <div className='mr-12'>
                <div className='mb-5'>
                    {
                        productCartItem.map(e => {
                            return (
                                <InfoProductCart
                                    name={e.name}
                                    category={e.category}
                                    quanity={e.quanity}
                                    total={e.total}
                                />
                            )
                        })
                    }
                </div>
                <div className='w-96 p-4 bg-green-200 rounded-lg shadow-xl ml-auto mx-auto flex flex-col' style={{ height: 'auto' }}>
                    <h2 className='text-3xl font-bold text-blue-600 p-3 border-b-2 border-blue-200'>Order Summary</h2>
                    <div className='flex flex-col flex-grow-1 w-full p-4'>
                        <div className='flex items-center mb-2'>
                            <p className='text-base font-medium text-gray-700'>Total Quantity:</p>
                            <p className='ml-auto text-lg font-semibold text-gray-900'>{totalQuantity}</p>
                        </div>
                        <div className='flex items-center'>
                            <p className='text-base font-medium text-gray-700'>Total Price:</p>
                            <p className='ml-auto text-lg font-semibold text-green-800'>{totalPrice}<span className='text-green-600'> VNĐ</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment