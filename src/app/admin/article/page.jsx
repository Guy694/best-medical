'use client';

import { useState, useEffect } from 'react';
import TiptapEditor from '../../components/TiptapEditor';
import Navbar from '@/app/components/Nav';

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchArticles = async () => {
    const res = await fetch('/api/articles');
    const data = await res.json();
    setArticles(data);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSave = async () => {
    if (editingId) {
      // แก้ไข
      await fetch(`/api/articles/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      setEditingId(null);
    } else {
      // เพิ่มใหม่
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
    }
    setTitle('');
    setContent('');
    fetchArticles();
  };

  const handleEdit = (article) => {
    setTitle(article.title);
    setContent(article.content);
    setEditingId(article.id);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    fetchArticles();
  };

  return (
    <div className=" bg-white">
        <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold mb-4">Tiptap CRUD Example</h1>

      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
  onClick={() => {
    const url = prompt('Enter image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }}
  className="bg-gray-200 px-2 py-1 rounded mb-2"
>
  Add Image
</button>

      <TiptapEditor content={content} onUpdate={setContent} />

      <button
        onClick={handleSave}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {editingId ? 'Update' : 'Save'}
      </button>

      <h2 className="text-xl font-bold mt-6">Articles</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id} className="border p-2 my-2 rounded">
            <h3 className="font-semibold">{article.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
            <button
              onClick={() => handleEdit(article)}
              className="mr-2 mt-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(article.id)}
              className="mt-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div></div></div>
  );
}
