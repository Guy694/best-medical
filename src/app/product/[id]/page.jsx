"use client";
import { useState } from "react";
import Image from "next/image";
import { div } from "framer-motion/client";
import Navbar from "@/app/components/Nav";
import { Facebook } from 'lucide-react';

const productData = {
  id: "RMM-BGM011",
  name: "เครื่องตรวจน้ำตาลในเลือด BLUEDOT รุ่น B-GM162 มีเสียงพูดภาษาไทย",
  price: 1000,
  promotion:{
    discount_type: "amount", 
    discount_value: 300,     
  },
  brand: "Blue Dot",
  description:
    "เครื่องวัดระดับน้ำตาลในเลือด BLUEDOT รุ่น B-GM162 ที่มาพร้อมฟังก์ชันเสียงรายงานผลเป็นภาษาไทย การันตีคุณภาพด้วยการรับประกันตลอดอายุการใช้งาน เหมาะสำหรับการตรวจระดับน้ำตาลในเลือดอย่างสะดวกและรวดเร็ว",
  images: [
    "/image.png",
  ],
  property:[
    { name: "คุณสมบัติ 1", value: "รายละเอียดคุณสมบัติ 1" },
    { name: "คุณสมบัติ 2", value: "รายละเอียดคุณสมบัติ 2" },
    { name: "คุณสมบัติ 3", value: "รายละเอียดคุณสมบัติ 3" },
  ],
  waranty: "รับประกันตลอดอายุการใช้งาน"
};



export default function ProductPage() {

  
  const hasPromotion = productData.promotion && productData.promotion.discount_value > 0;
  const finalPrice = hasPromotion
    ? productData.promotion.discount_type === "amount"
      ? productData.price - productData.promotion.discount_value
      : productData.price - (productData.price * productData.promotion.discount_value) / 100
    : productData.price;

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(productData.images[0]);

  return (
    <div className="bg-white">
      <Navbar />
   <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* รูปสินค้า */}
        <div>
          <div className="border p-4 rounded-lg w-full h-96 relative">
              <Image
                src={mainImage}
                alt={productData.name}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
              />
            </div>
          <div className="flex gap-2 mt-4">
            {/* {productData.images.map((img, idx) => (
              <div
                key={idx}
                className={`border p-1 rounded cursor-pointer ${
                  mainImage === img ? "border-blue-500" : ""
                }`}
                onClick={() => setMainImage(img)}
              >
                <Image src={img} alt="" width={80} height={80} className="object-contain"/>
              </div>
            ))} */}
          </div>
        </div>

        {/* รายละเอียดสินค้า */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
          <p className="text-gray-600 mb-2">รหัสสินค้า: {productData.id}</p>
            {hasPromotion ? (
        <div>
          <p className="text-gray-400 line-through">฿{productData.price.toLocaleString()}</p>
          <p className="text-red-500 text-2xl font-bold">฿{finalPrice.toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-2xl font-bold">฿{productData.price.toLocaleString()}</p>
      )}
          <p className="mb-4">{productData.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-800 mb-4">
            หยิบใส่ตะกร้า
          </button>

          <div className="flex gap-4">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800" 
              onClick={() => {
                const shareUrl = window.location.href;
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                  '_blank',
                  'noopener,noreferrer,width=600,height=400'
                );
              }}
            >
             <span><Facebook className="inline-block" /></span> แชร์บนเฟสบุ๊ค
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="max-w-7xl mx-auto space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-2xl font-semibold text-blue-800 mb-4">คุณสมบัติ</h4>
              <ul className="list-disc list-inside">
                {productData.property.map((prop, index) => (
                  <li key={index}>
                    <span className="font-medium">{prop.name}:</span> {prop.value}
                  </li>
                ))}
              </ul>
              <br />
               <h4 className="text-2xl font-semibold text-blue-800 mb-4">การรับประกัน</h4>
               <p>{productData.waranty}</p>
            </section>
          </div>
    </div>
    </div>
    </div>
  );
}
