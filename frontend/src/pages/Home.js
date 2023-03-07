import React, { useRef } from "react";
import { useSelector } from "react-redux";
import MotorBike from "../assets/motorbike.png"
import Flowers from "../assets/flowers.png"
import Friendly from "../assets/friendly.png"
import HomeCard from "../components/HomeCard";
import CardFeature from "../components/CardFeature";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr"

const Home = () => {
    const productData = useSelector((state) => state.product.productList)
    console.log(productData)

    const homeProducCartList = productData.slice(0, 5)

    const homeProducCartListRose = productData.filter(e => e.category === "rose", [])
    console.log(homeProducCartListRose)

    const loadingArray = new Array(5).fill(null)
    const loadingArrayFeature = new Array(10).fill(null)

    const slideProductRef = useRef()
    const nextProduct = () => {
        slideProductRef.current.scrollLeft += 200;
    };

    const previousProduct = () => {
        slideProductRef.current.scrollLeft -= 200;
    };

    return (
        <div className="p-2 md:p-4">
            <div className="md:flex gap-4 py-2">
                <div className="md:w-1/2">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div className="flex gap-3 bg-purple-300 w-52 px-2 py-3 item-center rounded-full" style={{ marginRight: '40px' }}>
                            <p className="text-sm font-bold text-slate-900 py-2 ml-2" style={{ fontSize: "22px" }}>Motorbike Delivery</p>
                            <img src={MotorBike} className="h-14" />
                        </div>
                        <div className="flex gap-3 bg-pink-300 w-52 px-2 py-3 item-center rounded-full" style={{ marginLeft: '40px', marginRight: '40px' }}>
                            <p className="text-sm font-bold text-slate-900 py-2 ml-2" style={{ fontSize: "22px" }}>Flowers Beautiful</p>
                            <img src={Flowers} className="h-14" />
                        </div>
                        <div className="flex gap-3 bg-orange-300 w-52 px-2 py-3 item-center rounded-full" style={{ marginLeft: '40px' }}>
                            <p className="text-sm font-bold text-slate-900 py-2 ml-2" style={{ fontSize: "22px" }}>Friendly Interface</p>
                            <img src={Friendly} className="h-14 px-2 mt-1" />
                        </div>
                    </div>

                    <h2 className="md:text-8xl font-bold py-3">Shop Flower Faster Delivery in <span className="text-green-600">Your Home</span></h2>
                    <p className="py-4 px-2 text-base">Ordering flowers online brings users many different risks. You should consider and research carefully to choose for yourself the best quality reputable flower delivery address. Our website is trusted by many users because it always brings customers quality fresh flowers, actual samples like the picture, beautiful colors. In addition, you also get free delivery within Saigon city depending on the distance.</p>
                    <button className="font-bold bg-red-500 text-slate-200 px-4 py-2 rounded-md hover:bg-blue-500" style={{ fontSize: "18px" }}>Order now</button>
                </div>

                <div className="md:w-1/2 flex flex-wrap gap-5 p-4">
                    {
                        homeProducCartList[0] ? homeProducCartList.map(e => {
                            return (
                                <HomeCard
                                    key={e._id}
                                    image={e.image}
                                    name={e.name}
                                    price={e.price}
                                    category={e.category}
                                />
                            )
                        }) : loadingArray.map((e, index) => {
                            return (
                                <HomeCard
                                    key={index}
                                    loading={"Loading..."}
                                />
                            )
                        })
                    }
                </div>
            </div>

            <div className="">
                <div className="flex w-full items-center">
                    <h2 className="font-bold text-3xl text-slate-800 mb-4">Rose Flowers</h2>
                    <div className="ml-auto flex gap-4">
                        <button className="text-4xl bg-green-300 hover:bg-red-300 p-1 rounded-full" onClick={previousProduct}><GrFormPreviousLink /></button>
                        <button className="text-4xl bg-green-300 hover:bg-red-300 p-1 rounded-full" onClick={nextProduct}><GrFormNextLink /></button>
                    </div>
                </div>
                <div className="flex gap-5 overflow-x-scroll scrollbar-none" style={{ scrollBehavior: 'smooth', willChange: "transform" }} ref={slideProductRef}>
                    {
                        homeProducCartListRose[0] ? homeProducCartListRose.map(e => {
                            return (
                                <CardFeature
                                    key={e._id}
                                    name={e.name}
                                    category={e.category}
                                    price={e.price}
                                    image={e.image}
                                />
                            )
                        }) : loadingArrayFeature.map(e => <CardFeature loading="Loading..." />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Home;