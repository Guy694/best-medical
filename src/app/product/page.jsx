"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);

      const uniqueCategories = Array.from(new Set(data.map(p => p.category.name)));
      setCategories(uniqueCategories);
    }

    fetchProducts();
  }, []);

  const filteredProducts = filterCategory === "All"
    ? products
    : products.filter(p => p.category.name === filterCategory);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    alert(`${product.name} ถูกเพิ่มลงตะกร้าแล้ว`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">สินค้า</h1>

      {/* Filter by Category */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilterCategory("All")} className="px-3 py-1 bg-gray-300 rounded">
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover mb-2"
              />
            )}
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold mt-2">ราคา: {product.price} บาท</p>
            <p>หมวดหมู่: {product.category.name}</p>
            <p>คงเหลือ: {product.stock}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">ตะกร้าสินค้า</h2>
        {cart.length === 0 && <p>ไม่มีสินค้าในตะกร้า</p>}
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between border p-2 mb-2 rounded">
            <span>{item.name}</span>
            <span>{item.price} บาท</span>
          </div>
        ))}
      </div>
    </div>
  );
}
