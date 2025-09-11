"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Nav";
import Breadcrumb from "@/app/components/Breadcrumb";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showMenu, setShowMenu] = useState(false);


  const subCategories = {
    "อุปกรณ์วินิจฉัยโรค": [
      "เครื่องวัดความดันโลหิต",
      "เครื่องตรวจน้ำตาลในเลือด",
      "เครื่องตรวจคลื่นไฟฟ้าหัวใจ (ECG)",
      "เครื่องตรวจคลื่นสมอง (EEG)",
      "เครื่องเอกซเรย์ (X-Ray)",
      "เครื่องอัลตราซาวด์ (Ultrasound)",
      "เครื่อง CT Scan / MRI",
      "เครื่องวัดออกซิเจนปลายนิ้ว (Pulse Oximeter)",
      "หูฟังแพทย์ (Stethoscope)",
      "เทอร์โมมิเตอร์ดิจิตอล / อินฟราเรด",
    ],
    "อุปกรณ์ช่วยชีวิตและกู้ชีพ": [
      "เครื่องกระตุกหัวใจไฟฟ้า (AED)",
      "เครื่องช่วยหายใจ (Ventilator)",
      "ถังออกซิเจน / อุปกรณ์ให้ออกซิเจน",
      "ชุดปฐมพยาบาล (First Aid Kit)",
      "เฝือก (Splint)",
      "เปลพยาบาล (Stretcher)",
      "เครื่องดูดเสมหะ (Suction Machine)",
      "กระเป๋าพยาบาลฉุกเฉิน",
    ],
    "อุปกรณ์ผ่าตัด": [
      "มีดผ่าตัด (Scalpel)",
      "กรรไกรผ่าตัด",
      "คีมจับ / คีมผ่าตัด (Forceps)",
      "เข็มและด้ายเย็บแผล (Sutures)",
      "เครื่องจี้ไฟฟ้า (Electrosurgical Unit)",
      "โต๊ะผ่าตัด",
      "ชุดเครื่องมือผ่าตัดสแตนเลส",
    ],
    "อุปกรณ์ทำแผลและดูแลผู้ป่วย": [
      "ผ้าก๊อซ / สำลี",
      "พลาสเตอร์ยา",
      "น้ำยาฆ่าเชื้อ (Alcohol, Povidone-iodine)",
      "ถุงมือแพทย์ (Latex/Nitrile Gloves)",
      "หน้ากากอนามัย / N95",
      "ชุด PPE",
      "ไม้กดลิ้น",
      "เครื่องวัดไข้",
      "ถุงเก็บปัสสาวะ (Urine Bag)",
      "สายสวนปัสสาวะ (Catheter)",
    ],
    "อุปกรณ์กายภาพบำบัดและฟื้นฟู": [
      "เครื่องกระตุ้นไฟฟ้ากล้ามเนื้อ (TENS Unit)",
      "เครื่องอัลตราซาวด์กายภาพ",
      "เครื่องออกกำลังกายผู้ป่วย",
      "Walker / ไม้เท้า / รถเข็นผู้ป่วย",
      "เตียงผู้ป่วยไฟฟ้า",
      "เบาะลมป้องกันแผลกดทับ",
    ],
    "อุปกรณ์ทันตกรรม": [
      "เก้าอี้ทำฟัน",
      "เครื่องกรอฟัน",
      "เครื่องเอกซเรย์ฟัน",
      "อุปกรณ์ขูดหินปูน",
      "เครื่องดูดน้ำลาย",
      "วัสดุอุดฟัน",
    ],
    "อุปกรณ์ห้องปฏิบัติการ": [
      "กล้องจุลทรรศน์ (Microscope)",
      "ตู้ปลอดเชื้อ (Laminar Flow Cabinet)",
      "เครื่องปั่นเหวี่ยง (Centrifuge)",
      "เครื่องตรวจเลือดอัตโนมัติ",
      "ตู้แช่ยา / ตู้แช่วัคซีน",
      "เครื่องตรวจการตั้งครรภ์ (Test Kit)",
      "เครื่องตรวจโควิด (Antigen / PCR Kit)",
    ],
    "เวชภัณฑ์และอุปกรณ์ทั่วไป": [
      "เข็มฉีดยา / กระบอกฉีดยา",
      "สายน้ำเกลือ / ชุดให้น้ำเกลือ (IV Set)",
      "ถุงมือปลอดเชื้อ",
      "หน้ากาก / Face Shield",
      "ผ้าคลุมผ่าตัด",
      "ถังขยะติดเชื้อ / กล่องทิ้งเข็ม",
    ],
  };

  const Allproducts = [

    // ตัวอย่างสินค้า
    { id: 1, name: "เครื่องวัดความดันโลหิต", category: { name: "อุปกรณ์วินิจฉัยโรค" }, price: 1500, image: "/images/product1.jpg" },
    { id: 2, name: "เครื่องตรวจน้ำตาลในเลือด", category: { name: "อุปกรณ์วินิจฉัยโรค" }, price: 1200, image: "/images/product2.jpg" },
    { id: 3, name: "เครื่องกระตุกหัวใจไฟฟ้า (AED)", category: { name: "อุปกรณ์ช่วยชีวิตและกู้ชีพ" }, price: 50000, image: "/images/product3.jpg" },
    { id: 4, name: "เครื่องช่วยหายใจ (Ventilator)", category: { name: "อุปกรณ์ช่วยชีวิตและกู้ชีพ" }, price: 75000, image: "/images/product4.jpg" },
    { id: 5, name: "มีดผ่าตัด (Scalpel)", category: { name: "อุปกรณ์ผ่าตัด" }, price: 300, image: "/images/product5.jpg" },
    { id: 6, name: "กรรไกรผ่าตัด", category: { name: "อุปกรณ์ผ่าตัด" }, price: 450, image: "/images/product6.jpg" },
    { id: 7, name: "ผ้าก๊อซ / สำลี", category: { name: "อุปกรณ์ทำแผลและดูแลผู้ป่วย" }, price: 100, image: "/images/product7.jpg" },
    { id: 8, name: "พลาสเตอร์ยา", category: { name: "อุปกรณ์ทำแผลและดูแลผู้ป่วย" }, price: 80, image: "/images/product8.jpg" },
    { id: 9, name: "เครื่องกระตุ้นไฟฟ้ากล้ามเนื้อ (TENS Unit)", category: { name: "อุปกรณ์กายภาพบำบัดและฟื้นฟู" }, price: 2000, image: "/images/product9.jpg" },
    { id: 10, name: "เครื่องอัลตราซาวด์กายภาพ", category: { name: "อุปกรณ์กายภาพบำบัดและฟื้นฟู" }, price: 3000, image: "/images/product10.jpg" },
    { id: 11, name: "เก้าอี้ทำฟัน", category: { name: "อุปกรณ์ทันตกรรม" }, price: 15000, image: "/images/product11.jpg" },
    { id: 12, name: "เครื่องกรอฟัน", category: { name: "อุปกรณ์ทันตกรรม" }, price: 8000, image: "/images/product12.jpg" },
    { id: 13, name: "กล้องจุลทรรศน์ (Microscope)", category: { name: "อุปกรณ์ห้องปฏิบัติการ" }, price: 12000, image: "/images/product13.jpg" },
    { id: 14, name: "ตู้ปลอดเชื้อ (Laminar Flow Cabinet)", category: { name: "อุปกรณ์ห้องปฏิบัติการ" }, price: 25000, image: "/images/product14.jpg" },
    { id: 15, name: "เข็มฉีดยา / กระบอกฉีดยา", category: { name: "เวชภัณฑ์และอุปกรณ์ทั่วไป" }, price: 50, image: "/images/product15.jpg" },
    { id: 16, name: "สายน้ำเกลือ / ชุดให้น้ำเกลือ (IV Set)", category: { name: "เวชภัณฑ์และอุปกรณ์ทั่วไป" }, price: 200, image: "/images/product16.jpg" },
  ]



  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <Breadcrumb
          items={[
            { label: "หน้าหลัก", href: "/" },
            { label: "สินค้าทั้งหมด" }
          ]}
        />
        <h1 className="text-3xl font-bold mb-6">สินค้า</h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <aside className="col-span-3">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">หมวดหมู่สินค้า</h2>
              <ul>
                {Object.keys(subCategories).map((category) => (
                  <li key={category} className="mb-2">
                    <Link href={`/product?category=${category}`} className="text-blue-600 hover:underline">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
              

            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">ตะกร้าสินค้า</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">ตะกร้าสินค้าว่างเปล่า</p>
              ) : (
                <ul>
                  {cart.map((item, index) => (
                    <li key={index} className="mb-2 flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.price} บาท</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
          <main className="col-span-9 bg-white rounded-xl shadow p-6">
            
          </main>
        </div>
      </div>
    </div>
  );
}
