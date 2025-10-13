"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Nav';
import Link from 'next/link';
import { 
  Calendar, Clock, Eye, User, ArrowLeft, Tag, Share2,
  Facebook, Twitter, Copy, Check
} from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id);
    }
  }, [params.id]);

  const fetchArticle = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles?id=${id}`);
      const data = await response.json();

      if (data.success) {
        setArticle(data.article);
      } else {
        setError(data.message || 'ไม่พบบทความ');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('เกิดข้อผิดพลาดในการโหลดบทความ');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(article?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">
              {error || 'ไม่พบบทความ'}
            </h1>
            <Link
              href="/article"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft size={20} className="mr-2" />
              กลับไปหน้าบทความ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            href="/article"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้าบทความ
          </Link>

          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Article Banner */}
            {article.banner && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={article.banner}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Category */}
              {article.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Tag size={14} className="mr-1" />
                    {article.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{article.author_firstname} {article.author_lastname}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(article.published_at || article.createdAt)}</span>
                </div>
                
                {article.views > 0 && (
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>{article.views.toLocaleString()} ครั้ง</span>
                  </div>
                )}
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gray-600 font-medium">แชร์:</span>
                <button
                  onClick={shareToFacebook}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={16} />
                  Facebook
                </button>
                <button
                  onClick={shareToTwitter}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Twitter size={16} />
                  Twitter
                </button>
                <button
                  onClick={copyUrl}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
                </button>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {article.content ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
                    className="text-gray-700 leading-relaxed space-y-4"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
          </article>

          {/* Related Articles or Back to List */}
          <div className="mt-12 text-center">
            <Link
              href="/article"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              ดูบทความอื่นๆ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}