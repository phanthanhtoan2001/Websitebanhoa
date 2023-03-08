import React, { useState } from "react";
import RoseIcon from "../assets/icon-rose.png";
import LotusIcon from "../assets/icon-lotus.png";
import ApricotIcon from "../assets/icon-apricot.png";
import LilyIcon from "../assets/icon-lily.png";
import OrchidIcon from "../assets/icon-orchid.png";
import HibiscusIcon from "../assets/icon-hibiscus.png";

const FilterProducts = ({ categoryList, onClick }) => {
    // const [products, setProducts] = useState([]); // Tạo biến trạng thái để lưu danh sách sản phẩm

    // const handleClick = (category) => {
    //     // Xử lý sự kiện click category filter
    //     const filteredProducts = products.filter((product) =>
    //         product.categories.includes(category)
    //     );
    //     setProducts(filteredProducts);
    //     onClick(filteredProducts); // Gọi hàm onClick và truyền vào danh sách sản phẩm lọc
    // };

    return (
        <div className="flex justify-center space-x-8 w-full md:space-x-10 mx-auto">
            {categoryList.map((category) => (
                <div key={category} className="flex flex-col items-center" style={{ width: "10rem" }}>
                    <div onClick={() => onClick(category)}>
                        <div className="text-3xl p-5 bg-yellow-500 rounded-full inline-flex items-center justify-center cursor-pointer">
                            {category === "rose" && (
                                <img src={RoseIcon} alt="Rose icon" className="w-16 h-16" />
                            )}
                            {category === "orchid" && (
                                <img src={OrchidIcon} alt="Orchid icon" className="w-16 h-16" />
                            )}
                            {category === "lily" && (
                                <img src={LilyIcon} alt="Lily icon" className="w-16 h-16" />
                            )}
                            {category === "apricot" && (
                                <img src={ApricotIcon} alt="Apricot icon" className="w-16 h-16" />
                            )}
                            {category === "lotus" && (
                                <img src={LotusIcon} alt="Lotus icon" className="w-16 h-16" />
                            )}
                            {category === "hibiscus" && (
                                <img src={HibiscusIcon} alt="Hibicus icon" className="w-16 h-16" />
                            )}
                        </div>
                        <div className="mt-2 text-xl font-medium text-center capitalize">
                            {category}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FilterProducts;
