"use client";
import { Menu, X, Globe, User, ShoppingCart, Bell, Briefcase, ShieldCheck, Truck, Store, ArrowBigRightDash, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react";
import Link from "next/link";
import Navbar from "./components/Nav";
import Image from "next/image";
import { p } from "framer-motion/client";



export default function Home() {

  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [newproducts, setnewProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [error, setError] = useState(null);
  const [promotion, setPromotion] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/product/new'); // เรียก API
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลสินค้าได้');
        const data = await res.json();
        setnewProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategory() {
      try {
        const res = await fetch('/api/categories'); // เรียก API
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    async function fetchPromotion() {
      try {
        const res = await fetch('/api/product/promotion'); // เรียก API
        if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลสินค้าได้');
        const data = await res.json();
        setPromotion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    fetchCategory();
    fetchPromotion();

  }, []); // รันแค่ครั้งแรก

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  };






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

    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className=" bg-gradient-to-r from-blue-900 to-blue-800 text-white py-5 md:py-16  rounded-xl shadow-xl">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="โลโก้"
                  width={120} 
                  height={120}
                  className="w-24 h-24 md:w-48 md:h-48"
                />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">บริษัท เบสท เมดิคอล จำกัด</h1>
              <h1 className="text-xl md:text-3xl font-bold mb-2">ศูนย์รวมอุปกรณ์การแพทย์ ครบวงจร</h1>
              <p className="text-xl md:text-2xl opacity-90"></p>
            </div>
          </div>
          <br />
          
          <div className=" grid grid-cols-1 bg-white  rounded-xl p-6 md:flex items-center space-x-6 max-w-7xl mx-auto shadow">
            {/* โลโก้ */}
            <img 
              src="/banner.png"
              alt="หกห"
              className="w-32 h-32 object-contain rounded-lg"
            />

            {/* ข้อมูลร้าน */}
            <div className=" md:flex-1">
              <h1 className="md:text-2xl font-bold text-green-500">
                ร้านขายอุปกรณ์การแพทย์ <span className="text-blue-900">บริษัท เบสท เมดิคอล จำกัด</span>
              </h1>
              <p className="text-gray-700 mt-2">
                แหล่งรวมอุปกรณ์ทางการแพทย์ เครื่องมือสำหรับการตรวจรักษา ผลิตภัณฑ์ดูแลสุขภาพ ผู้ป่วย ผู้สูงอายุ รวมถึงครุภัณฑ์และเวชภัณฑ์ที่ใช้ในโรงพยาบาล คลินิก และสถานพยาบาลต่าง ๆ นอกจากนี้ยังมีเครื่องมือวิทยาศาสตร์ อุปกรณ์กู้ชีพ กู้ภัยฉุกเฉิน จากผู้ผลิตและแบรนด์คุณภาพระดับโลก พร้อมให้บริการจัดหาสินค้าตามความต้องการของลูกค้าอย่างครบวงจรในที่เดียว
              </p>

              {/* ปุ่ม */}
              <div className="flex space-x-4 mt-5">
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

          <section className="py-6">
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

   <section className="py-10 max-w-full mx-auto bg-white p-6 rounded-xl shadow">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-700">หมวดหมู่สินค้า</h2>
    <a href="categories" className="text-white bg-green-500 p-1 rounded-4xl hover:bg-green-600">
      ดูหมวดหมู่สินค้าทั้งหมด
    </a>
  </div>

 <div className="relative">
  <div className="flex gap-2 overflow-x-auto pb-4">
    {category.map((category) => (
      <div
        key={category.id}
        className="min-w-[160px] md:min-w-[260px] p-3 border-gray-400 rounded-2xl shadow-sm hover:shadow-lg transition bg-white relative"
      >
       
         <div className="flex justify-center mb-2 md:mb-4">
  <div className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] flex items-center justify-center">
          <Image
            src={category.cate_img}
            alt={category.cate_name}
            width={120}
            height={120}
             className="object-cover w-full h-full rounded-lg"
          />
        </div>   </div>
        <p className="text-xs md:text-lg uppercase mb-1 text-center bg-gradient-to-bl from-blue-900 to-blue-700 text-white font-bold rounded-b-2xl p-1">{category.cate_name}</p>
        <div className="absolute inset-0 flex items-center justify-center gap-2 md:gap-3 opacity-0 hover:opacity-100 transition bg-white/70 rounded-2xl">
          <button className="p-2 bg-green-500 text-white rounded-full shadow hover:text-white">
            <Eye size={40} />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
</section>

<br />


  <section className="py-10 max-w-full mx-auto bg-white p-6 rounded-xl shadow">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-700">สินค้าเข้าใหม่</h2>
    <a href="product" className="text-white bg-green-500 p-1 rounded-4xl hover:bg-green-600">
      ดูสินค้าทั้งหมด
    </a>
  </div>

 <div className="relative">
  <div className="flex gap-2 overflow-x-auto pb-4">
  {Array.isArray(newproducts) && newproducts.map((product) => (
      <div
        key={product.id}
        className="min-w-[160px] md:min-w-[260px] p-3 md:p-4 border-gray-400 rounded-2xl shadow-sm hover:shadow-lg transition bg-white relative"
      >
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.discount}%
          </span>
        )}
  <div className="flex justify-center mb-2 md:mb-4">
  <div className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] flex items-center justify-center">
    <Image
      src={product.imageUrl}
      alt={product.pro_name}
      width={120}
      height={120}
      className="object-cover w-full h-full rounded-lg"
    />
  </div>
</div>
        <p className="text-gray-800 text-xs uppercase mb-1">{product.category}</p>
        <h3 className="text-xs text-gray-800 md:text-sm font-semibold line-clamp-2 mb-2">{product.pro_name}</h3>
        <div className="mb-2">
          <span className="text-base text-gray-800 md:text-lg font-bold">{product.price} บาท</span>
          {product.oldPrice && (
            <span className="text-gray-800 line-through ml-2">${product.oldPrice}</span>
          )}
        </div>
        <p className="text-xs text-green-600">(คงเหลือ {product.stock})</p>
        <div className="absolute inset-0 flex items-center justify-center gap-2 md:gap-3 opacity-0 hover:opacity-100 transition bg-white/70 rounded-2xl">
            <button className="p-2 bg-green-500 text-white rounded-full shadow hover:text-white">
            <Link href={`/product/${product.id}`} passHref>
              <Eye size={40} />
            </Link>
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
</section>
<br />

ิ<br />
<section className="py-10 max-w-full mx-auto bg-white p-6 rounded-xl shadow">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-700">สินค้าโปรโมชั่น</h2>
    {promotion.length === 0 ? (
      <div></div>
    ) : (
    <a href="products" className="text-white bg-green-500 p-1 rounded-4xl hover:bg-green-600">
      ดูสินค้าทั้งหมด
    </a>
    )}
  </div>

 <div className="relative">
  <div className="flex gap-2 overflow-x-auto pb-4">
    {promotion.length === 0 ? (
      <div className="w-full text-center text-gray-500 py-8">ยังไม่มีรายการโปรโมชัน</div>
    ) : (
      promotion.map((promotion) => (
        <div
          key={promotion.id}
          className="min-w-[160px] md:min-w-[260px] p-3 md:p-4 border-gray-400 rounded-2xl shadow-sm hover:shadow-lg transition bg-white relative"
        >
          {promotion.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {promotion.discount}%
            </span>
          )}
          <div className="flex justify-center mb-2 md:mb-4">
            <Image
              src={promotion.imageUrl}
              alt={promotion.name}
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <p className="text-gray-800 text-xs uppercase mb-1">{promotion.category}</p>
          <h3 className="text-xs text-gray-800 md:text-sm font-semibold line-clamp-2 mb-2">{promotion.name}</h3>
          <div className="mb-2">
            <span className="text-base text-gray-800 md:text-lg font-bold">{promotion.price} บาท</span>
            {promotion.oldPrice && (
              <span className="text-gray-800 line-through ml-2">${promotion.oldPrice}</span>
            )}
          </div>
          <p className="text-xs text-green-600">({promotion.stock})</p>
          <div className="absolute inset-0 flex items-center justify-center gap-2 md:gap-3 opacity-0 hover:opacity-100 transition bg-white/70 rounded-2xl">
            <button className="p-2 bg-green-500 text-white rounded-full shadow hover:text-white">
              <Eye size={40} />
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>
</section>
          {/* <section id="products" className="py-6 bg-gray-50">
            <div className="max-w-7xl mx-auto text-center border-8 p-5 rounded-2xl border-red-500 bg-white shadow-lg">
              <h2 className="text-3xl font-bold mb-10 text-red-500">สินค้าโปรโมชั่น</h2>
              <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
  {promotionProducts.map((i) => (
    <div
      key={i.id}
      className="min-w-[280px] bg-white p-6 rounded-xl shadow hover:shadow-lg flex-shrink-0"
    >
      <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">
        <img src={i.image} alt={i.name} className="w-24 h-24 object-contain" />
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
          </section> */}
          <div className="text-center">
            <br />


          </div>
          



          <br />
          {/* รีวิวลูกค้า */}
          {/* <section className="py-16">
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
          </section> */}

        </div>

      </div>

    </div>
  );
}