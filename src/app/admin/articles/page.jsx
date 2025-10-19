"use client";
import { useState, useEffect } from 'react';
import Navbar from '../../components/Nav';
import Sidebar from '../../components/Sidebar';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Calendar, Upload,
  Search, Filter, Save, X, Clock, User, Tag
} from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    status: 'draft',
    published_at: ''
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/articles?status=all&page=1&limit=50');
      const data = await response.json();
      
      console.log('Articles API response:', data);
      
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        console.error('API Error:', data.error);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadBanner = async () => {
    if (!bannerFile) return null;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', bannerFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.success) {
        return data.url;
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
    } finally {
      setUploading(false);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('กรุณากรอกชื่อบทความ');
      return;
    }
    if (!formData.content.trim()) {
      alert('กรุณากรอกเนื้อหาบทความ');
      return;
    }

    setUploading(true);
    
    let bannerUrl = editingArticle?.banner || '';
    if (bannerFile) {
      const uploadedUrl = await uploadBanner();
      if (uploadedUrl) {
        bannerUrl = uploadedUrl;
      } else {
        alert('การอัปโหลดรูปภาพล้มเหลว');
        setUploading(false);
        return;
      }
    }

    const articleData = {
      ...formData,
      banner: bannerUrl,
      excerpt: formData.excerpt || formData.content.substring(0, 200) + '...'
    };

    try {
      const url = editingArticle 
        ? `/api/articles/${editingArticle.id}` 
        : '/api/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';

      console.log('Saving article:', { method, url, articleData });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      // เช็คว่า response เป็น JSON หรือไม่
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        alert('เกิดข้อผิดพลาด: Server ตอบกลับไม่ถูกต้อง (ไม่ใช่ JSON)');
        return;
      }

      const data = await response.json();
      
      console.log('Save response:', data);
      
      if (response.ok && data.success) {
        await fetchArticles();
        resetForm();
        setShowModal(false);
        alert(editingArticle ? 'แก้ไขบทความสำเร็จ' : 'สร้างบทความสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาด: ' + (data.message || data.error || 'Unknown error'));
        console.error('Save error:', data);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category || '',
      status: article.status,
      published_at: article.published_at ? 
        new Date(article.published_at).toISOString().slice(0, 16) : ''
    });
    setBannerPreview(article.banner || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบบทความนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;

    setLoading(true);
    try {
      console.log('Deleting article:', id);
      
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      // เช็คว่า response เป็น JSON หรือไม่
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        alert('เกิดข้อผิดพลาด: Server ตอบกลับไม่ถูกต้อง (ไม่ใช่ JSON)');
        return;
      }

      const data = await response.json();
      
      console.log('Delete response:', data);
      
      if (response.ok && data.success) {
        await fetchArticles();
        alert('ลบบทความสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาด: ' + (data.message || data.error || 'Unknown error'));
        console.error('Delete error:', data);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('เกิดข้อผิดพลาดในการลบ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    
    try {
      console.log('Toggling status:', { articleId: article.id, currentStatus: article.status, newStatus });
      
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          title: article.title,
          content: article.content
        }),
      });

      // เช็คว่า response เป็น JSON หรือไม่
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        alert('เกิดข้อผิดพลาด: Server ตอบกลับไม่ถูกต้อง (ไม่ใช่ JSON)');
        return;
      }

      const data = await response.json();
      
      console.log('Toggle status response:', data);
      
      if (response.ok && data.success) {
        await fetchArticles();
        alert(`เปลี่ยนสถานะเป็น "${newStatus === 'published' ? 'เผยแพร่' : 'แบบร่าง'}" สำเร็จ`);
      } else {
        alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ: ' + (data.message || data.error || 'Unknown error'));
        console.error('Toggle status error:', data);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      status: 'draft',
      published_at: ''
    });
    setBannerFile(null);
    setBannerPreview('');
    setEditingArticle(null);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || article.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === "loading") {
    return <div className="text-gray- min-h-screen flex items-center justify-center">
      <div className="text-xl">กำลังโหลด...</div>
    </div>;
  }

 

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        {/* Main content */}
        <div className="flex-1 min-w-0 p-4 md:p-6">
          <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4 md:p-6 mt-4">
            {/* Hamburger for mobile */}
            <button className="md:hidden mb-4 px-3 py-2 bg-gray-200 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800">จัดการบทความ</h1>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                เพิ่มบทความใหม่
              </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="ค้นหาบทความ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">สถานะทั้งหมด</option>
                  {/* <option value="draft">แบบร่าง</option> */}
                  <option value="published">เผยแพร่</option>
                  <option value="scheduled">ตั้งเวลา</option>
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-full inline-block align-middle">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      กำลังโหลดข้อมูล...
                    </div>
                  </div>
                ) : filteredArticles.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    ไม่พบบทความ
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          บทความ
                        </th>
                        <th className="py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          หมวดหมู่
                        </th>
                        <th className="py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่
                        </th>
                        <th className="py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {article.banner && (
                                <img
                                  src={article.banner}
                                  alt={article.title}
                                  className="w-16 h-16 object-cover rounded-lg mr-4"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                  {article.title}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {article.excerpt}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {article.category && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {article.category}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : article.status === 'scheduled'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {article.status === 'published' ? 'เผยแพร่' : 
                               article.status === 'scheduled' ? 'ตั้งเวลา' : 'แบบร่าง'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(article.published_at || article.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleStatus(article)}
                                className={`p-2 rounded-lg transition-colors ${
                                  article.status === 'published'
                                    ? 'text-green-600 hover:bg-green-100'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title={article.status === 'published' ? 'ซ่อน' : 'เผยแพร่'}
                              >
                                {article.status === 'published' ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              
                              <button
                                onClick={() => handleEdit(article)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="แก้ไข"
                              >
                                <Edit size={16} />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="ลบ"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="text-gray-700 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingArticle ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปปก
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {bannerPreview && (
                  <div className="mt-2">
                    <img
                      src={bannerPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หัวข้อ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="เช่น สุขภาพ, เวชภัณฑ์"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สรุปย่อ
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="สรุปย่อของบทความ (ถ้าไม่ระบุจะใช้ 200 ตัวอักษรแรกของเนื้อหา)"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เนื้อหา *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สถานะ
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {/* <option value="draft">แบบร่าง</option> */}
                    <option value="published">เผยแพร่ทันที</option>
                    <option value="scheduled">ตั้งเวลาเผยแพร่</option>
                  </select>
                </div>

                {/* Publish Date */}
                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      วันที่เผยแพร่
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={(e) => setFormData({...formData, published_at: e.target.value})}
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={16} />
                  {uploading ? 'กำลังอัปโหลด...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}