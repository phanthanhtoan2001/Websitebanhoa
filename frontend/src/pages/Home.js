import React from "react";
import { useSelector } from "react-redux";
import MotorBike from "../assets/motorbike.png"
import HomeCard from "../components/HomeCard";

const Home = () => {
    const productData = useSelector((state) => state.product.productList)
    console.log(productData)

    const homeProducCartList = productData.slice(0, 5)

    return (
        <div className="p-2 md:p-4">
            <div className="md:flex gap-4 py-2">
                <div className="md:w-1/2">
                    <div className="flex gap-3 bg-green-300 w-52 px-2 py-3 item-center rounded-full">
                        <p className="text-sm font-bold text-slate-900 py-2" style={{ fontSize: "22px" }}>Motorbike Delivery</p>
                        <img src={MotorBike} className="h-14" />
                    </div>
                    <h2 className="md:text-8xl font-bold py-3">Shop Flower Faster Delivery in <span className="text-green-600">Your Home</span></h2>
                    <p className="py-4 px-2 text-base">Ordering flowers online brings users many different risks. You should consider and research carefully to choose for yourself the best quality reputable flower delivery address. Our website is trusted by many users because it always brings customers quality fresh flowers, actual samples like the picture, beautiful colors. In addition, you also get free delivery within Saigon city depending on the distance.</p>
                    <button className="font-bold bg-red-500 text-slate-200 px-4 py-2 rounded-md" style={{ fontSize: "18px" }}>Order now</button>
                </div>

                <div className="md:w-1/2 flex flex-wrap gap-5 p-4 justify-center">
                    {
                        homeProducCartList[0] && homeProducCartList.map(e => {
                            return (
                                <HomeCard
                                    key={e.id}
                                    image={e.image}
                                    name={e.name}
                                    price={e.price}
                                    category={e.category}
                                />
                            )
                        })
                    }
                </div>
            </div>

            <div className="">
                <h2 className="font-bold text-3xl text-slate-800">Rose Flowers</h2>
                <div className="">

                </div>
            </div>
        </div>
    )
}

export default Home;