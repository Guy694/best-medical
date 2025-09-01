"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Nav";
import Footter from './../components/Footter';

const products = [
  {
    id: 1,
    name: "หูฟังแพทย์",
    image: "https://cdn.pixabay.com/photo/2013/07/13/13/34/diagnostics-161140_1280.png",
    price: 1500,
    discount: 10,
    stock: 20,
  },
  {
    id: 2,
    name: "ปรอทวัดไข้",
    image: "https://cdn.pixabay.com/photo/2012/04/18/12/07/thermometer-36852_1280.png",
    price: 300,
    discount: 5,
    stock: 50,
  },
  {
    id: 3,
    name: "ถังออกซิเจน",
    image: "https://www.หลีอ๊อกซิเจน.com/wp-content/uploads/2020/07/medo2-6q.jpg",
    price: 200,
    discount: 0,
    stock: 30,
  },
   {
    id: 4,
    name: "เข็มฉีดยา",
    image: "https://oncemedicaldevice.com/wp-content/uploads/2022/03/2440-Converted-1.png",
    price: 200,
    discount: 0,
    stock: 30,
  },
   {
    id: 5,
    name: "เครื่องวัดความดัน",
    image: "https://media.allonline.7eleven.co.th/pdthumb/205853_Exta_0362_01.jpg",
    price: 200,
    discount: 0,
    stock: 30,
  },
];


export default function priduct_medical() {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart([...cart, product]);
        alert(`${product.name} ถูกเพิ่มลงตะกร้าแล้ว!`);
    };
    const [loading, setLoading] = useState(true);
    return (
        <div className="bg-white">
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
               
                         <section id="products" className="py-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-700">สินค้าทั้งหมด</h2>
        </div>
        <div className="text-center">
        </div>
      </section>
                    <br />
                    <div className=" text-black w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 white">
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                className="block w-full md:w-1/2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- ค้นหาหมวดสินค้า --</option>
                                <option value="option1">ตัวเลือก 1</option>
                                <option value="option2">ตัวเลือก 2</option>
                                <option value="option3">ตัวเลือก 3</option>
                            </select>

                            <select
                                className="block w-full md:w-1/2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- ค้นหาสินค้า --</option>
                                <option value="option1">ตัวเลือก 1</option>
                                <option value="option2">ตัวเลือก 2</option>
                                <option value="option3">ตัวเลือก 3</option>
                            </select>
                            <button className="bg-green-600 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-200">
                                ค้นหา
                            </button>
                        </div>
                    </div>
 <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-64 object-contain"
          />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <div className="flex items-center gap-2">
                {product.discount > 0 ? (
                  <>
                    <span className="text-red-600 font-bold">
                      ฿{(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <span className="line-through text-gray-400">
                      ฿{product.price}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">฿{product.price}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                จำนวนคงเหลือ: {product.stock}
              </p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-full transition duration-200"
            >
              ใส่ตะกร้า
            </button>
          </div>
        </div>
      ))}
    </div>
                </div>

            </div>
           <Footter/>
        </div>
    );
}


