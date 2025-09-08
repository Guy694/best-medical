"use client";
import { Menu, X, Globe, User, ShoppingCart, Bell, Briefcase, ShieldCheck, Truck, Store, ArrowBigRightDash, Car } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/Nav";
import Img from "next/image";
import { p } from "framer-motion/client";
import Carousel from "./components/carousel_article";


export default function Home() {
  const [loading, setLoading] = useState(true);

  const bestsellerProducts = [
    {
      id: 1, name: "สินค้า 1", description: "รายละเอียดสินค้า 1", price: 1000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 2, name: "สินค้า 2", description: "รายละเอียดสินค้า 2", price: 2000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 3, name: "สินค้า 3", description: "รายละเอียดสินค้า 3", price: 3000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 4, name: "สินค้า 4", description: "รายละเอียดสินค้า 4", price: 4000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 5, name: "สินค้า 5", description: "รายละเอียดสินค้า 5", price: 5000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
  ];



  const recomendProducts = [
    {
      id: 1, name: "สินค้า 1", description: "รายละเอียดสินค้า 1", price: 1000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 2, name: "สินค้า 2", description: "รายละเอียดสินค้า 2", price: 2000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 3, name: "สินค้า 3", description: "รายละเอียดสินค้า 3", price: 3000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
  ]


  const promotionProducts = [
    {
      id: 1, name: "สินค้า 1", description: "รายละเอียดสินค้า 1", price: 1000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 2, name: "สินค้า 2", description: "รายละเอียดสินค้า 2", price: 2000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 3, name: "สินค้า 3", description: "รายละเอียดสินค้า 3", price: 3000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
  ]

  const Allproduct = [
    {
      id: 1, name: "สินค้า 1", description: "รายละเอียดสินค้า 1", price: 1000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 2, name: "สินค้า 2", description: "รายละเอียดสินค้า 2", price: 2000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
    {
      id: 3, name: "สินค้า 3", description: "รายละเอียดสินค้า 3", price: 3000, image: "/image.png", promotion: {
        discount_type: "amount",
        discount_value: 300,
      },
    },
  ]

  const hasPromotionbestsellerProducts = bestsellerProducts.promotion && bestsellerProducts.promotion.discount_value > 0;
  const finalPrice = hasPromotionbestsellerProducts
    ? bestsellerProducts.promotion.discount_type === "amount"
      ? bestsellerProducts.price - bestsellerProducts.promotion.discount_value
      : bestsellerProducts.price - (bestsellerProducts.price * bestsellerProducts.promotion.discount_value) / 100
    : bestsellerProducts.price;


  const hasPromotionRecomendProducts = recomendProducts.promotion && recomendProducts.promotion.discount_value > 0;
  const finalPriceRecomendProducts = hasPromotionRecomendProducts
    ? recomendProducts.promotion.discount_type === "amount"
      ? recomendProducts.price - recomendProducts.promotion.discount_value
      : recomendProducts.price - (recomendProducts.price * recomendProducts.promotion.discount_value) / 100
    : recomendProducts.price;




  const articles = [
    { id: 1, article_title: "บทความสุขภาพ 1", article_content: "สรุปเนื้อหาบทความสุขภาพ 1", article_banner: "/image.png" },
    { id: 2, article_title: "บทความสุขภาพ 2", article_content: "สรุปเนื้อหาบทความสุขภาพ 2", article_banner: "/image.png" },
    { id: 3, article_title: "บทความสุขภาพ 3", article_content: "สรุปเนื้อหาบทความสุขภาพ 3", article_banner: "/image.png" },
    { id: 4, article_title: "บทความสุขภาพ 4", article_content: "สรุปเนื้อหาบทความสุขภาพ 4", article_banner: "/image.png" },
    { id: 5, article_title: "บทความสุขภาพ 5", article_content: "สรุปเนื้อหาบทความสุขภาพ 5", article_banner: "/image.png" },
    { id: 6, article_title: "บทความสุขภาพ 6", article_content: "สรุปเนื้อหาบทความสุขภาพ 6", article_banner: "/image.png" },
    { id: 7, article_title: "บทความสุขภาพ 7", article_content: "สรุปเนื้อหาบทความสุขภาพ 7", article_banner: "/image.png" },
  ]

  return (

    <div className="bg-white">


      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">


          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 shadow-2xl rounded-xl ">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center mb-4">
                <Img
                  src="/logo.png"
                  alt="โลโก้"
                  width={200}
                  height={200}
                ></Img>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">บริษัท เบสท เมดิคอล จำกัด</h1>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">ศูนย์รวมอุปกรณ์การแพทย์ ครบวงจร</h1>
              <p className="text-xl md:text-2xl opacity-90"></p>
            </div>
          </div>
          <br />
          <div className="max-w-7xl mx-auto bg-white shadow rounded-xl p-6 flex items-center space-x-6">
            {/* โลโก้ */}
            <img
              src="/banner.png"
              alt="Rakmor Logo"
              className="w-90 h-90 object-contain rounded-lg"
            />

            {/* ข้อมูลร้าน */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-green-500">
                ร้านขายอุปกรณ์การแพทย์ <span className="text-blue-900">บริษัท เบสท เมดิคอล จำกัด</span>
              </h1>
              <p className="text-gray-700 mt-2">
                แหล่งรวมอุปกรณ์ทางการแพทย์ เครื่องมือสำหรับการตรวจรักษา ผลิตภัณฑ์ดูแลสุขภาพ ผู้ป่วย ผู้สูงอายุ รวมถึงครุภัณฑ์และเวชภัณฑ์ที่ใช้ในโรงพยาบาล คลินิก และสถานพยาบาลต่าง ๆ นอกจากนี้ยังมีเครื่องมือวิทยาศาสตร์ อุปกรณ์กู้ชีพ กู้ภัยฉุกเฉิน จากผู้ผลิตและแบรนด์คุณภาพระดับโลก พร้อมให้บริการจัดหาสินค้าตามความต้องการของลูกค้าอย่างครบวงจรในที่เดียว
              </p>

              {/* ปุ่ม */}
              <div className="flex space-x-3 mt-4">
                <a
                  href="#"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  แอดไลน์
                </a>
                <a
                  href="#"
                  className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  แชทผ่านเฟสบุ๊ค
                </a>
                <a
                  href="#"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  ติดต่อเรา
                </a>
              </div>
            </div>
          </div>

          <section className="py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto text-center grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow">
                <div className="flex justify-center items-center h-20">
                  <Store className="w-15 h-15 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600">สินค้าครบครัน</h3>
                <p className="mt-2 text-gray-600">เลือกจากกว่า 5,000 รายการ</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow ">
                <div className="flex justify-center items-center h-20">
                  <Truck className="w-15 h-15 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600">จัดส่งทั่วประเทศ</h3>
                <p className="mt-2 text-gray-600">รวดเร็ว ปลอดภัย ถึงมือลูกค้า</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <div className="flex justify-center items-center h-20">
                  <ShieldCheck className="w-15 h-15 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600">รับประกันสินค้าแท้</h3>
                <p className="mt-2 text-gray-600">มั่นใจคุณภาพทุกชิ้น</p>
              </div>
            </div>
          </section>
          <section id="products" className="py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto text-center border-8 p-5 rounded-2xl border-red-500 bg-white shadow-lg">
              <h2 className="text-3xl font-bold mb-10 text-red-500">สินค้าโปรโมชั่น</h2>
              <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {promotionProducts.map((i) => (
                  <div
                    key={i.id}
                    className="min-w-[280px] bg-white p-6 rounded-xl shadow hover:shadow-lg flex-shrink-0"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                      <img src={i.image} alt={i.name} className="w-full h-full object-fill" />
                    </div>
                    <h3 className="text-lg font-semibold">สินค้า {i.name}</h3>
                    <p className="text-gray-600">{i.description}</p>
                    <p className="text-gray-600">{i.price} บาท</p>
                    <button className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                ))}
              </div>
                 <a
              href=""
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 inline-flex items-center gap-3 mx-auto"
            >
              ดูรายการเพิ่มเติมที่นี่ <ArrowBigRightDash />
            </a>
            </div>
          </section>
          <div className="text-center">
            <br />

         
          </div>
          <section id="products" className="py-6 bg-white rounded-2xl shadow-lg">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-10 text-gray-700">สินค้าแนะนำ</h2>
              <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {recomendProducts.map((i) => (
                  <div
                    key={i.id}
                    className="min-w-[280px] bg-white p-6 rounded-xl shadow hover:shadow-lg flex-shrink-0 "
                  >
                    <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                      <img src={i.image} alt={i.name} className="w-full h-full object-fill" />
                    </div>
                    <h3 className="text-lg font-semibold">สินค้า {i.name}</h3>
                    <p className="text-gray-600">{i.description}</p>
                    <p className="text-gray-600">{i.price} บาท</p>
                    <button className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                ))}
              </div>
                 <a
              href=""
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 inline-flex items-center gap-3 mx-auto"
            >
              ดูรายการเพิ่มเติมที่นี่ <ArrowBigRightDash />
            </a>
            </div>
          </section>
          <div className="text-center">
            <br />

        
          </div>
          <section id="products" className="py-6 bg-white rounded-2xl shadow-lg">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-10 text-gray-700">สินค้าขายดี</h2>
              <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {bestsellerProducts.map((i) => (
                  <div
                    key={i.id}
                    className="min-w-[280px] bg-white p-6 rounded-xl shadow hover:shadow-lg flex-shrink-0"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                      <img src={i.image} alt={i.name} className="w-full h-full object-fill" />
                    </div>
                    <h3 className="text-lg font-semibold">สินค้า {i.name}</h3>
                    <p className="text-gray-600">{i.description}</p>
                    <p className="text-gray-600">{i.price} บาท</p>
                    <button className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                ))}
              </div>
              
            <a
              href=""
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 inline-flex items-center gap-3 mx-auto"
            >
              ดูรายการเพิ่มเติมที่นี่ <ArrowBigRightDash />
            </a>
            </div>
          </section>
          <div className="text-center">
            <br />

          </div>

          <section id="products" className="py-6 bg-white rounded-2xl shadow-lg">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-10 text-gray-700">สินค้าขายดี</h2>
              <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {Allproduct.map((i) => (
                  <div
                    key={i.id}
                    className="min-w-[280px] bg-white p-6 rounded-xl shadow hover:shadow-lg flex-shrink-0"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
                      <img src={i.image} alt={i.name} className="w-full h-full object-fill" />
                    </div>
                    <h3 className="text-lg font-semibold">สินค้า {i.name}</h3>
                    <p className="text-gray-600">{i.description}</p>
                    <p className="text-gray-600">{i.price} บาท</p>
                    <button className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <br />

              <a
                href=""
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 inline-flex items-center gap-3 mx-auto"
              >
                ดูรายการเพิ่มเติมที่นี่ <ArrowBigRightDash />
              </a>
            </div>
          </section>






          <br />
          {/* รีวิวลูกค้า */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto text-center bg-white shadow rounded-2xl p-6">
              <h2 className="text-3xl font-bold mb-10 text-gray-700 p-6">เสียงจากลูกค้า</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-xl">
                    <p className="text-gray-600">
                      ⭐⭐⭐⭐⭐ บริการดีมาก สินค้าคุณภาพ ราคาคุ้มค่า
                    </p>
                    <h4 className="mt-4 font-semibold">คุณสมชาย</h4>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}