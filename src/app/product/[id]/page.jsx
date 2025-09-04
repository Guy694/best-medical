"use client";
import { useState } from "react";
import Image from "next/image";
import { div } from "framer-motion/client";
import Navbar from "@/app/components/Nav";

const productData = {
  id: "RMM-BGM011",
  name: "เครื่องตรวจน้ำตาลในเลือด BLUEDOT รุ่น B-GM162 มีเสียงพูดภาษาไทย",
  price: 1000,
  brand: "Blue Dot",
  description:
    "เครื่องวัดระดับน้ำตาลในเลือด BLUEDOT รุ่น B-GM162 ที่มาพร้อมฟังก์ชันเสียงรายงานผลเป็นภาษาไทย การันตีคุณภาพด้วยการรับประกันตลอดอายุการใช้งาน เหมาะสำหรับการตรวจระดับน้ำตาลในเลือดอย่างสะดวกและรวดเร็ว",
  images: [
    "/product-main.png", // เปลี่ยนเป็น path จริงของรูป
    "/product-1.png",
    "/product-2.png",
    "/product-3.png"
  ],
};

export default function ProductPage() {
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
          <div className="border p-4 rounded-lg">
            <Image
              src={mainImage}
              alt={productData.name}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {productData.images.map((img, idx) => (
              <div
                key={idx}
                className={`border p-1 rounded cursor-pointer ${
                  mainImage === img ? "border-blue-500" : ""
                }`}
                onClick={() => setMainImage(img)}
              >
                <Image src={img} alt="" width={80} height={80} className="object-contain"/>
              </div>
            ))}
          </div>
        </div>

        {/* รายละเอียดสินค้า */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{productData.name}</h1>
          <p className="text-gray-600 mb-2">รหัสสินค้า: {productData.id}</p>
          <p className="text-xl font-semibold text-red-600 mb-4">{productData.price.toLocaleString()} ฿</p>
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
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
              แอดไลน์
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">
              แชร์บนเฟสบุ๊ค
            </button>
          </div>
        </div>
      </div>
    </div></div></div>
  );
}
