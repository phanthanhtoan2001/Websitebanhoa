import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CardFeature from './CardFeature'
import FilterProducts from './FilterProducts'

const AllProduct = ({ heading, loading }) => {
    const productData = useSelector((state) => state.product.productList)

    const loadingArrayFeature = new Array(10).fill(null)

    // Một mảng các danh mục để sử dụng làm tùy chọn bộ lọc
    const categories = ["rose", "orchid", "lily", "apricot", "lotus", "hibiscus"]

    // Sử dụng useState hook để đặt giá trị bộ lọc mặc định
    const [filterBy, setFilterBy] = useState("")
    // Sử dụng useState hook để đặt trạng thái ban đầu của dataFilter bằng tất cả các sản phẩm
    const [dataFilter, setDataFilter] = useState([])

    // Sử dụng useEffect để thực hiện setDataFilter với giá trị ban đầu là productList lấy từ store.
    useEffect(() => {
        setDataFilter(productData)
    }, [productData])

    // Hàm xử lý các thay đổi tùy chọn bộ lọc danh mục
    const handleFilterProduct = (category) => {
        setFilterBy(category)
        const filter = productData.filter(
            (e) => e.category.toLowerCase() === category.toLowerCase()
        );
        setDataFilter(() => {
            return [...filter];
        });
    };

    return (
        <div className="my-5 mt-20">
            <h2 className="font-bold text-3xl text-slate-800 mb-4">
                {heading}
            </h2>
            <div className='flex gap-4 justify-center overflow-scroll scrollbar-none'>
                <FilterProducts categoryList={categories} onClick={(category) => handleFilterProduct(category)} />
            </div>

            <div className="flex flex-wrap justify-center gap-5 my-8">
                {dataFilter[0] ? (dataFilter.map((e) => (
                    <CardFeature
                        key={e._id}
                        id={e._id}
                        image={e.image}
                        name={e.name}
                        category={e.category}
                        price={e.price}
                    />
                )
                )) : (
                    loadingArrayFeature.map((e, index) => (
                        <CardFeature loading="Loading..." key={index + "cartLoading"} />
                    )
                    ))
                }
            </div>
        </div>
    )
}

export default AllProduct