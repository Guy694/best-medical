"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/app/components/Nav";
import { Facebook, Copy } from "lucide-react";
import Breadcrumb from "@/app/components/Breadcrumb";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
export default function ProductPage() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "คำอธิบาย" },
    { label: "ข้อมูลเพิ่มเติม" },
    { label: "บทวิจารณ์ (0)" },
  ];



  // ฟังก์ชันเพิ่มสินค้า
  function addToCart(product) {
    // อ่านตะกร้าจาก cookie
    const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
    // เพิ่มสินค้าใหม่
    cart.push({
      id: product.id,
      name: product.pro_name,
      price: product.price,
      image: product.imageUrl,
      quantity: quantity,
      delivery: product.delivery || 0
    });
    // เซฟกลับไปที่ cookie
    Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
    alert("เพิ่มสินค้าเข้าตะกร้าแล้ว!");
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data);
          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0]);
          }
        } else {
          setError(data.error || "ไม่พบสินค้า");
        }
      } catch (err) {
        setError(err.message);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>กำลังโหลด...</div>;

  const hasPromotion = product?.promotion?.discount_value > 0;
  const finalPrice = hasPromotion
    ? product.promotion.discount_type === "amount"
      ? product.price - product.promotion.discount_value
      : product.price - (product.price * product.promotion.discount_value) / 100
    : product.price;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "หน้าหลัก", href: "/" },
              {
                label: product?.cate_name || "อื่นๆ",
                href: `/category/${product?.cate_name ? encodeURIComponent(product.cate_name) : "scale"}`
              },
              { label: product?.pro_name || "อื่นๆ" }
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-3xl shadow">
            {/* รูปสินค้า */}
            <div>
              <div className="border border-gray-300 p-4 rounded-xl w-full h-96 relative">
                <Image
                  src={product.imageUrl || "/image.png"}
                  alt={product.pro_name}
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                />
              </div>
              <div className="flex gap-2 mt-4">
                {Array.isArray(product.images) && product.images.length > 0 && product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`border p-1 rounded cursor-pointer ${mainImage === img ? "border-blue-500" : ""
                      }`}
                    onClick={() => setMainImage(img)}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* รายละเอียดสินค้า */}
            <div>
              <h1 className="text-2xl font-bold mb-2 text-gray-700">
                {product.pro_name}
              </h1>
              <p className="text-gray-600 mb-2">รหัสสินค้า: {product.codename}</p>

              {hasPromotion ? (
                <div>
                  <p className="text-gray-400 line-through">
                    {parseFloat(product.price) === 0 ? 'x.xx' : product.price.toLocaleString()} บาท
                  </p>
                  <p className="text-red-500 text-2xl font-bold">
                    {parseFloat(finalPrice) === 0 ? 'x.xx' : finalPrice.toLocaleString()} บาท
                  </p>
                </div>
              ) : (
                <p className="text-2xl text-gray-700 font-bold">
                  {parseFloat(product.price) === 0 ? 'x.xx' : product.price.toLocaleString()} บาท
                </p>
              )}

              {/* <p className="mb-4 text-gray-600">{product.description}</p> */}

              <div className="flex items-center gap-2 mb-4 text-gray-700">
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-center border rounded px-2 py-1"
                />
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className={`px-6 py-2 rounded mb-4 ${parseFloat(product.price) === 0
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-800'
                  }`}
                onClick={() => parseFloat(product.price) !== 0 && addToCart(product)}
                disabled={parseFloat(product.price) === 0}
              >
                {parseFloat(product.price) === 0 ? 'ติดต่อสอบถามราคา' : 'หยิบใส่ตะกร้า'}
              </button>

              <div className="flex gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
                  onClick={() => {
                    const shareUrl = window.location.href;
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                      )}`,
                      "_blank",
                      "noopener,noreferrer,width=600,height=400"
                    );
                  }}
                >
                  <Facebook className="inline-block" /> แชร์บนเฟสบุ๊ค
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 border border-gray-300 flex items-center gap-2"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      alert('คัดลอกลิงก์เรียบร้อยแล้ว!');
                    } else {
                      alert('เบราว์เซอร์ไม่รองรับการคัดลอกลิงก์');
                    }
                  }}
                >
                  <Copy className="inline-block h-5 w-5" />
                  คัดลอกลิงก์
                </button>
              </div>
            </div>
          </div>

          <br />
          <div className="bg-white rounded-2xl shadow p-4">
            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  className={`px-6 py-2 font-medium ${activeTab === idx
                    ? "border-b-2 border-blue-600 text-blue-700"
                    : "text-gray-600"
                    }`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 0 && (
                <div>
                  <h2 className="font-bold text-lg mb-4 text-gray-700">
                    คุณสมบัติ
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    {Array.isArray(product.description)
                      ? product.description.map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                      ))
                      : typeof product.description === 'string'
                        ? product.description.split(/\r?\n|,|\u2022|\*/).map((desc, idx) => desc.trim() && <li key={idx}>{desc.trim()}</li>)
                        : null}
                  </ul>
                </div>
              )}
              {activeTab === 1 && (
                <div className="text-gray-700">
                  <p>ข้อมูลเพิ่มเติมเกี่ยวกับสินค้า...</p>
                </div>
              )}
              {activeTab === 2 && (
                <div className="text-gray-700">
                  <p>ยังไม่มีบทวิจารณ์</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
