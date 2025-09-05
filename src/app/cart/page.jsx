"use client";

import { useState } from "react";
import Navbar from "../components/Nav";
import { image } from "framer-motion/client";

const Checkout = () => {
  const [quantity, setQuantity] = useState(12);
  const [coupon, setCoupon] = useState("");
  const price = 1000;
  const shippingOptions = [
    { id: "free", label: "ฟรีค่าจัดส่ง", cost: 0 },
    { id: "ems", label: "ไปรษณีย์ไทย (EMS)", cost: 60 },
    { id: "store", label: "รับสินค้าหน้าร้าน", cost: 0 },
  ];

   const cartproducts = [
    {
    id: "RMM-BGM011",
    name: "เครื่องตรวจน้ำตาลในเลือด BLUEDOT รุ่น B-GM162 มีเสียงพูดภาษาไทย",
    price: 1000,
    promotion: {
      discount_type: "amount",
      discount_value: 300,
    },
    brand: "Blue Dot",
    countproduct: 10,
    image: "/image.png"
  },
  {
    id: "RMM-BGM012",
    name: "เครื่องตรวจน้ำตาลในเลือด ACCU-CHEK รุ่น PERFORMA",
    price: 1200,
    promotion: {
      discount_type: "percent",
      discount_value: 10,
    },
    brand: "Accu-Chek",
    countproduct: 5,
     image: "/image.png"
  },
  ];
  
  const [shipping, setShipping] = useState("free");

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleCouponApply = () => {
    alert(`ใช้คูปอง: ${coupon}`);
  };

  const total = price * quantity + shippingOptions.find((s) => s.id === shipping).cost;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
      />
      <br />
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-3xl">
      <h2 className="text-xl font-bold mb-4">ตะกร้าสินค้า</h2>

      {/* Product List */}
      {cartproducts.map((product) => (
        <div key={product.id} className="flex border-b pb-4 mb-4">
          <img src={product.image} alt="product" className="w-24 h-24 object-cover mr-4" />
          <div className="flex-1">
            <h3 className="font-semibold">
              {product.name}
            </h3>
            <p className="text-red-600 font-bold">{product.price.toLocaleString()} ฿</p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-2 py-1 border"
              >
                -
              </button>
              <span className="px-4">{product.countproduct}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-2 py-1 border"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-red-600 font-bold">{(price * quantity).toLocaleString()} ฿</div>
      </div>
      ))}
     
      <div className="flex gap-4 mb-4">
        <a href="/product" className="px-4 py-2 text-center bg-amber-500 rounded-2xl text-white">← เลือกซื้อสินค้าต่อ</a>

      </div>


      <div className="border p-4 bg-gray-50 rounded-2xl">
        <h3 className="font-semibold mb-2">ยอดรวม</h3>
        <div className="flex justify-between mb-2">
          <span>ยอดรวม</span>
          <span className="text-red-600 font-bold">{(price * quantity).toLocaleString()} ฿</span>
        </div>

        <div className="mb-2">
          <span className="font-semibold">การจัดส่ง</span>
          <div className="mt-1">
            {shippingOptions.map((option) => (
              <label key={option.id} className="block">
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={shipping === option.id}
                  onChange={(e) => setShipping(e.target.value)}
                  className="mr-2"
                />
                {option.label}
                {option.cost > 0 && `: ${option.cost} ฿`}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between font-bold text-red-600 mb-4">
          <span>รวม</span>
          <span>{total.toLocaleString()} ฿</span>
        </div>

        <button className="w-full bg-red-600 text-white py-2 mb-4 พ-4 rounded-2xl hover:bg-red-800" 
        onClick={() => alert('ดำเนินการสั่งซื้อเรียบร้อย')}
        >ดำเนินการสั่งซื้อ</button>

        {/* Coupon */}
        {/* <div>
          <h4 className="font-semibold mb-1">คูปอง</h4>
          <input
            type="text"
            placeholder="รหัสคูปอง"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleCouponApply}
            className="border px-4 py-2 w-full"
          >
            ใช้คูปอง
          </button>
        </div> */}
      </div>
    </div> </div>
  );
};

export default Checkout;

