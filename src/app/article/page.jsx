"use client";
import { useState, useEffect } from 'react';
import Navbar from '../components/Nav';
import Link from 'next/link';
import { 
  Calendar, Clock, Eye, User, ArrowRight, Search, 
  Filter, Tag, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: 'published',
        page: currentPage,
        limit: 6
      });

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles || []);
        setPagination(data.pagination || {});
        
        // Extract categories
        const uniqueCategories = [...new Set(
          data.articles
            .filter(article => article.category)
            .map(article => article.category)
        )];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    // เช็คว่าบทความนี้ควรแสดงหรือไม่ (เผยแพร่แล้วและเวลาแสดงถึงแล้ว)
    const isPublished = article.status === 'published';
    const isTimeToShow = !article.published_at || new Date(article.published_at) <= new Date();
    
    return matchesSearch && matchesCategory && isPublished && isTimeToShow;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'เมื่อสักครู่';
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;
    return formatDate(dateString);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen relative overflow-hidden">
      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
      <Navbar />
      <div className="min-h-screen">
        {/* Banner Image Section */}
        <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden pb-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Banner Image (ถ้ามี) หรือใช้ gradient */}
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{
                 backgroundImage: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(29, 78, 216, 0.8) 100%)',
               }}>
          </div>

          {/* Content Overlay */}
          <div className="relative pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-4 w-full">
              <div className="text-center text-white">
                <div className="inline-block mb-4">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                    📚 ความรู้และบทความ
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                  บทความและข่าวสาร
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  ติดตามข่าวสารและความรู้เกี่ยวกับสุขภาพและเวชภัณฑ์
                </p>
                
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative mb-8">
                  <input
                    type="text"
                    placeholder="ค้นหาบทความ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/95 backdrop-blur-sm px-6 py-4 pr-14 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 shadow-xl"
                  />
                  <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-blue-600" size={24} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold">{articles.length}</div>
                    <div className="text-sm text-blue-100">บทความทั้งหมด</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold">{categories.length}</div>
                    <div className="text-sm text-blue-100">หมวดหมู่</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm text-blue-100">อัพเดตข่าวสาร</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-24">
              <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
            </svg>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <span className="font-medium text-gray-700">หมวดหมู่:</span>
              </div>
              
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full transition ${
                  !selectedCategory 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ทั้งหมด
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                      {article.banner ? (
                        <img
                          src={article.banner}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Placeholder when no image */}
                      <div 
                        className={`absolute inset-0 flex items-center justify-center ${article.banner ? 'hidden' : 'flex'}`}
                        style={{display: article.banner ? 'none' : 'flex'}}
                      >
                        <div className="text-center">
                          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-400 font-medium">บทความ</p>
                        </div>
                      </div>
                      {/* Category Badge on Image */}
                      {article.category && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-blue-800 shadow-sm">
                            <Tag size={12} className="mr-1" />
                            {article.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={`/article/${article.id}`}>
                          {article.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{article.author_firstname} {article.author_lastname}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{timeAgo(article.published_at || article.createdAt)}</span>
                          </div>
                        </div>
                        
                        {article.views > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{article.views}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link
                        href={`/article/${article.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        อ่านต่อ
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                    ก่อนหน้า
                  </button>
                  
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ถัดไป
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบบทความ</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory 
                  ? 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่' 
                  : 'ยังไม่มีบทความในระบบ'}
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
