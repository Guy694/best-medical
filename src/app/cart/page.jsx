"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Nav";
import { image } from "framer-motion/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";



const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [shipping, setShipping] = useState("ems");
  const totalDelivery = cart.reduce((sum, item) => sum + (item.quantity * item.delivery || 0), 0);
  const shippingOptions = [

    { id: "ems", label: "ค่าบริการจัดส่ง", cost: totalDelivery },
    { id: "store", label: "รับสินค้าหน้าร้าน", cost: 0 },
  ];
  // รวมราคาสินค้าทั้งหมดในตะกร้า

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)) + shippingOptions.find((s) => s.id === shipping).cost, 0);

  



  useEffect(() => {
    const cartData = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
    setCart(cartData);
  }, []);

  const handleRemoveItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    Cookies.set("cart", JSON.stringify(newCart), { expires: 7 });
    setCart(newCart); // อัปเดต state
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch('/api/cart/sendOrder', {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();
    if (result.orderId) {
      setCart([]);
      Cookies.set("cart", JSON.stringify([]), { expires: 7 });
      router.push(`/orderNumber/${result.orderId}`); // ไปหน้าแสดงข้อมูล
    }
  };




  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
      />
      <br />
      <div className="max-w-7xl mx-auto p-6 bg-white text-gray-800 shadow-md rounded-3xl">
        <h2 className="text-xl font-bold mb-4">ตะกร้าสินค้า</h2>

        {/* Product List */}
        {/* {cartproducts.map((product) => (
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
      ))} */}

        {cart.length === 0 ? (
          <p className="text-gray-600 justify-center items-center text-center">ตะกร้าสินค้าว่างเปล่า</p>
        ) : (
          <ul>
            {cart.map((item, idx) => (
              <li key={idx}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <img src={item.image || "/image.png"} alt={item.name} className="w-24 h-24 object-cover mr-4" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">ราคา: {item.price.toLocaleString()} ฿</p>
                      <p className="text-gray-600">จำนวน: {item.quantity}</p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="bg-red-600 p-1 px-4 rounded-2xl text-white hover:bg-red-800"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700 text-right">ราคา: {(item.price * item.quantity).toLocaleString()} บาท
                    <div className="text-gray-700 text-right">ค่าจัดส่ง: {(item.delivery * item.quantity).toLocaleString()} บาท
                    </div>
                  </div>
                </div>

                <div>

                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-4 mb-4">
          <a href="/product" className="px-4 py-2 text-center bg-amber-500 rounded-2xl text-white">← เลือกซื้อสินค้าต่อ</a>

        </div>

        {cart.length > 0 && (
          <div className="border p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold mb-2">ยอดรวม</h3>
            <div className="flex justify-between mb-2">
              <span>ยอดรวม</span>
              <span className="text-red-600 font-bold">{cartTotal.toLocaleString()} บาท</span>
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

            <form onSubmit={handleSubmit}>
              <input type="hidden" name="totalPrice" value={total} />
              <input type="hidden" name="cart" value={JSON.stringify(cart)} />
              <input type="hidden" name="shipping" value={shipping} />
              <label htmlFor="" className="text-gray-700">กรุณากรอกอีเมลเพื่อจัดส่งเลขคำสั่งซื้อ <span className="text-red-600">*</span></label>
              <input type="text" name="order_email" placeholder="กรอกอีเมล" className="border p-2 w-full mb-2 rounded-3xl" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
              <button type="submit" className="w-full bg-red-600 text-white py-2 mb-4 rounded-2xl hover:bg-red-800">
                ดำเนินการสั่งซื้อ
              </button>
            </form>

          </div>
        )}
      </div> </div>
  );
};

export default Checkout;

