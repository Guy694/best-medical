"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from "lucide-react";

export default function ContactsManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedContact, setExpandedContact] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ดึงข้อมูล contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      console.log('Fetching contacts...');
      const response = await fetch('/api/admin/contacts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.success) {
        setContacts(data.contacts || []);
      } else {
        console.error('API returned error:', data.error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ลบข้อความ
  const handleDelete = async (contactId) => {
    if (!confirm('คุณต้องการลบข้อความนี้หรือไม่?')) {
      return;
    }

    setDeleting(contactId);
    try {
      const response = await fetch(`/api/admin/contacts?id=${contactId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
        if (expandedContact === contactId) {
          setExpandedContact(null);
        }
        alert('ลบข้อความสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการลบข้อความ: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อความ');
    } finally {
      setDeleting(null);
    }
  };

  // กรองและค้นหาข้อมูล
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === "" || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.detail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || contact.article === filterType;

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // แปลงประเภทข้อความ
  const getArticleLabel = (article) => {
    const articleMap = {
      'general': 'สอบถามทั่วไป',
      'support': 'ขอความช่วยเหลือ',
      'business': 'ติดต่อเรื่องธุรกิจ',
      'complaint': 'ร้องเรียน',
      'suggestion': 'เสนอแนะ'
    };
    return articleMap[article] || article;
  };

  // สีตามประเภทข้อความ
  const getArticleColor = (article) => {
    const colorMap = {
      'general': 'bg-blue-100 text-blue-800',
      'support': 'bg-yellow-100 text-yellow-800',
      'business': 'bg-green-100 text-green-800',
      'complaint': 'bg-red-100 text-red-800',
      'suggestion': 'bg-purple-100 text-purple-800'
    };
    return colorMap[article] || 'bg-gray-100 text-gray-800';
  };

  // จัดรูปแบบวันที่
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

  useEffect(() => {
    fetchContacts();
  }, []);

  const uniqueArticles = [...new Set(contacts.map(contact => contact.article))];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 md:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <MessageSquare className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-7 h-7 text-pink-600" />
                    ข้อความจากลูกค้า
                  </h1>
                  <p className="text-gray-600 text-sm">จัดการข้อความที่ส่งมาจากลูกค้า</p>
                </div>
              </div>
              
              <button
                onClick={fetchContacts}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อ, อีเมล, หรือข้อความ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter by article type */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">ทุกประเภท</option>
                  {uniqueArticles.map(article => (
                    <option key={article} value={article}>
                      {getArticleLabel(article)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">ใหม่สุดก่อน</option>
                  <option value="asc">เก่าสุดก่อน</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              แสดง {filteredContacts.length} จาก {contacts.length} ข้อความ
            </div>
          </div>

          {/* Contacts List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อความ</h3>
              <p className="text-gray-600">ยังไม่มีข้อความจากลูกค้าในระบบ</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  {/* Contact Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getArticleColor(contact.article)}`}>
                            {getArticleLabel(contact.article)}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(contact.createdAt)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => setExpandedContact(expandedContact === contact.id ? null : contact.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          {expandedContact === contact.id ? 
                            <ChevronUp className="w-5 h-5" /> : 
                            <ChevronDown className="w-5 h-5" />
                          }
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          disabled={deleting === contact.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === contact.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedContact === contact.id && (
                    <div className="p-6 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-3">ข้อความ:</h4>
                      <div className="bg-white rounded-lg p-4 border">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {contact.detail}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}