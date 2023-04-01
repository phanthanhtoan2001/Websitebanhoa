import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CardFeature from './CardFeature'
import FilterProducts from './FilterProducts'
import cry from '../assets/khoc.gif';

const AllProduct = ({ heading, loading }) => {
    // Sử dụng useSelector để truy cập dữ liệu từ redux store
    const productData = useSelector(state => state.product.productList)

    // Tạo một mảng gồm 10 phần tử null để hiển thị loading
    const loadingArrayFeature = new Array(10).fill(null)

    // Một mảng danh mục để sử dụng làm tùy chọn bộ lọc
    const categories = ["rose", "orchid", "lily", "apricot", "lotus", "hibiscus"]

    // Sử dụng hook useState để đặt giá trị bộ lọc mặc định và cập nhật bộ lọc tùy thuộc vào user interaction.
    const [filterBy, setFilterBy] = useState("")

    // Sử dụng hook useState để thiết lập trạng thái ban đầu của dataFilter với tất cả các sản phẩm
    const [dataFilter, setDataFilter] = useState(productData)

    // Sử dụng hook useState để quản lý trạng thái của ô tìm kiếm trên giao diện người dùng
    const [searchText, setSearchText] = useState("")

    // Sử dụng hook useState để quản lý trạng thái khi nhập từ khóa tìm kiếm. 
    // Khi state này được đổi thành "true", component sẽ hiển thị kết quả tìm kiếm, ngược lại nếu là "false", sẽ hiển thị toàn bộ sản phẩm
    const [searching, setSearching] = useState(false);

    // Sử dụng hook useState để thiết lập trạng thái thông báo đã tìm thấy kết quả hay chưa
    const [resultFound, setResultFound] = useState(false);

    // Xử lý thay đổi văn bản tìm kiếm
    const handleSearchTextChange = event => {
        setSearchText(event.target.value);
        setSearching(true); // đặt searching thành true mỗi khi người dùng nhập văn bản mới.

        // Reset thông báo kết quả tìm kiếm.
        setResultFound(false);
    };

    // Xử lý hiển thị tất cả nút bấm, đặt lại giá trị của filterBy và searchText về giá trị ban đầu.
    const handleShowAll = () => {
        setFilterBy("")
        setSearchText("")
    }

    // Xử lý bộ lọc danh mục sản phẩm dựa trên category.
    const handleFilterProduct = category => {
        setFilterBy(category)
        setDataFilter(
            searchText.length === 0
                ? productData.filter(e =>
                    e.category.toLowerCase() === category.toLowerCase()
                )
                : searchProductByName(searchText).filter(
                    e => e.category.toLowerCase() === category.toLowerCase()
                )
        )
    }

    // Hàm tiện ích để tìm kiếm sản phẩm bằng text.
    // Hàm này sẽ trả về các sản phẩm có tên chứa từ khóa trong searchText.
    const searchProductByName = searchText => {
        return productData.filter(e =>
            e.name.toLowerCase().includes(searchText.toLowerCase())
        )
    }

    // Sử dụng useEffect để cập nhật danh sách sản phẩm theo searchText hoặc loại sản phẩm đã chọn.
    // Nếu không có searchText được nhập, cập nhật dataFilter từ productList theo giá trị filterBy.
    // Nếu có searchText, gọi hàm searchProductByName để lọc kết quả, sau đó lọc kết quả phù hợp với giá trị filterBy (searching=false).
    useEffect(() => {
        if (searchText.length === 0) {
            setDataFilter(
                filterBy.length === 0 ? productData : productData.filter(
                    e => e.category.toLowerCase() === filterBy.toLowerCase()
                )
            )
        } else {
            // Hiển thị trạng thái tải
            setSearching(true);
            setTimeout(() => {
                const filteredProducts = searchProductByName(searchText).filter(
                    e => filterBy.length === 0 || e.category.toLowerCase() === filterBy.toLowerCase()
                );
                // Đặt dataFilter sử dụng mảng tạm thời để giữ tất cả các sản phẩm mà không xóa bất kỳ
                setDataFilter([...filteredProducts]);
                // Ẩn trạng thái tải
                setSearching(false);
            }, 2000);
        }
    }, [productData, filterBy, searchText]);

    return (
        <div className="my-5 mt-20">
            <h2 className="font-bold text-3xl text-slate-800 mb-4">{heading}</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 overflow-scroll scrollbar-none mt-5 mb-5">
                {/* Thêm ô nhập tìm kiếm sản phẩm */}
                <input
                    type="text"
                    className="border border-gray-300 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent w-full sm:w-1/2 md:w-1/4"
                    placeholder="Search flower name..."
                    value={searchText}
                    onChange={handleSearchTextChange}
                />
                {/* Thêm nút "Hiển thị tất cả" */}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleShowAll}
                >
                    Show All
                </button>
            </div>
            <div className="flex gap-4 justify-center overflow-scroll scrollbar-none">
                <FilterProducts
                    categoryList={categories}
                    onClick={category => handleFilterProduct(category)}
                />
            </div>
            <div className="flex flex-wrap justify-center gap-5 my-8">
                {
                    searching ? (
                        loadingArrayFeature.map((e, index) => (
                            <CardFeature loading="Loading..." key={index + "cartLoading"} />
                        ))
                    ) : dataFilter.length > 0 ? (
                        dataFilter.map(e => (
                            <CardFeature
                                key={e._id}
                                id={e._id}
                                image={e.image}
                                name={e.name}
                                category={e.category}
                                price={e.price}
                            />
                        ))
                    ) : searchText !== "" ? (
                        <div style={{ width: '1000px', height: '500px' }} className='bg-pink-100 p-2 flex justify-center gap-5 rounded-md border-2 border-slate-400'>
                            <div className='flex flex-col'>
                                <p className='text-2xl font-bold italic'>Xin lỗi, sản phẩm bạn tìm không có ở cửa hàng chúng tôi. Xin hãy chọn sản phẩm khác</p>
                                <div className='mt-10 flex justify-center'>
                                    <img src={cry} className='w-full max-w-sm' />
                                </div>
                            </div>
                        </div>
                    ) : (
                        loadingArrayFeature.map((e, index) => (
                            <CardFeature loading="Loading..." key={index + "cartLoading"} />
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default AllProduct
