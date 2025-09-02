"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    // โหลดหมวดหมู่
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // โหลดสินค้าทั้งหมด
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleCategoryClick = async (id) => {
    setActiveCategory(id);
    const res = await fetch(`/api/products?categoryId=${id}`);
    const data = await res.json();
    setProducts(data);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 p-4 bg-gray-100">
        <h2 className="font-bold mb-2">หมวดหมู่</h2>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`cursor-pointer p-2 rounded ${
                activeCategory === cat.id ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Product List */}
      <main className="w-3/4 p-4 grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-2 rounded shadow">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <h3 className="font-bold">{product.name}</h3>
            <p>{product.price} บาท</p>
          </div>
        ))}
      </main>
    </div>
  );
}
