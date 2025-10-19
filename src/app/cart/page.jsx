"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Nav";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Trash2, Package, Mail, ArrowLeft, Truck, Store } from "lucide-react";



const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [shipping, setShipping] = useState("ems");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cartData = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
    setCart(cartData);
    
    // ดึงอีเมลผู้ใช้จาก localStorage ถ้ามีการเข้าสู่ระบบ
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserEmail(userData.email || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

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
    
    if (isSubmitting) return; // ป้องกันการกดซ้ำ
    
    setIsSubmitting(true);
    console.log('Submitting order...');
    
    try {
      const formData = new FormData(e.target);
      console.log('Form data prepared:', {
        email: formData.get('order_email'),
        totalPrice: formData.get('totalPrice'),
        shipping: formData.get('shipping'),
        cartItems: cart.length
      });
      
      const res = await fetch('/api/cart/sendOrder', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers.get('content-type'));
      
      // อ่าน response text ก่อนเพื่อดู error
      const responseText = await res.text();
      console.log('Response text:', responseText);
      
      if (!res.ok) {
        let errorMessage = 'เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            console.error('Error details:', errorData.details);
          }
        } catch (e) {
          console.error('Could not parse error response:', responseText);
        }
        throw new Error(errorMessage);
      }
      
      const result = JSON.parse(responseText);
      console.log('Response data:', result);
      
      if (result.orderId) {
        setCart([]);
        Cookies.set("cart", JSON.stringify([]), { expires: 7 });
        router.push(`/orderNumber/${result.orderId}`);
      } else if (result.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
      setIsSubmitting(false);
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-purple-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              ตะกร้าสินค้า
            </h1>
          </div>
          <p className="text-gray-600 ml-1">จัดการสินค้าในตะกร้าของคุณ</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/50">

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
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-lg text-gray-500 font-medium mb-6">ตะกร้าสินค้าว่างเปล่า</p>
            <Link href="/product" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
              เลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                  <img 
                    src={item.image || "/image.png"} 
                    alt={item.name} 
                    className="w-full md:w-28 h-28 object-cover rounded-xl border-2 border-gray-200" 
                  />
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                      <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        ราคา: <span className="font-bold text-pink-600">{item.price.toLocaleString()} ฿</span>
                      </p>
                      <p className="text-gray-600">
                        จำนวน: <span className="font-bold text-gray-800">{item.quantity} ชิ้น</span>
                      </p>
                      <p className="text-gray-600">
                        ค่าจัดส่ง: <span className="font-bold text-blue-600">{(item.delivery * item.quantity).toLocaleString()} ฿</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">รวม</p>
                      <p className="text-2xl font-bold text-pink-600">
                        {(item.price * item.quantity).toLocaleString()} ฿
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
              
              {cart.length > 0 && (
                <div className="mt-6">
                  <Link href="/product" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <ArrowLeft className="w-5 h-5" />
                    เลือกซื้อสินค้าต่อ
                  </Link>
                </div>
              )}
            </div>
          </div>

        {/* Summary Section */}
        {cart.length > 0 && (
          <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/50 sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              สรุปคำสั่งซื้อ
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>ยอดรวมสินค้า</span>
                <span className="font-bold text-pink-600">{cartTotal.toLocaleString()} ฿</span>
              </div>

              <div className="border-t pt-3">
                <span className="font-semibold text-gray-800 mb-3 block">วิธีการจัดส่ง</span>
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shipping === option.id}
                        onChange={(e) => setShipping(e.target.value)}
                        className="w-4 h-4 accent-pink-500"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        {option.id === "ems" ? (
                          <Truck className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Store className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-gray-700">{option.label}</span>
                      </div>
                      {option.cost > 0 && (
                        <span className="text-blue-600 font-bold">{option.cost} ฿</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">ยอดรวมทั้งหมด</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {total.toLocaleString()} ฿
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="totalPrice" value={total} />
              <input type="hidden" name="cart" value={JSON.stringify(cart)} />
              <input type="hidden" name="shipping" value={shipping} />
              
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  กรุณากรอกอีเมลเพื่อจัดส่งเลขคำสั่งซื้อ <span className="text-pink-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="order_email" 
                  placeholder="example@email.com" 
                  className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all" 
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังดำเนินการ...
                  </span>
                ) : (
                  'ดำเนินการสั่งซื้อ'
                )}
              </button>
            </form>

          </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

