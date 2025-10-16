"use client";
import { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Nav";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    article: "",
    detail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitMessage("ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด");
        setFormData({ name: "", email: "", phone: "", article: "", detail: "" }); // reset form
      } else {
        setSubmitMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      setSubmitMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(""), 5000);
    }
  };

  const contactInfo = [
    {
      icon: "🏢",
      title: "สำนักงานใหญ่",
      content: "เลขที่ 83 หมู่บ้านพฤกษา 95 เอ หมู่ที่ 9 ต.บางม่วง อ.บางใหญ่ จ.นนทบุรี 11140",
      link: "https://maps.app.goo.gl/ujvLQj1d5YeWPKRw5",
    },
    {
      icon: "📞",
      title: "โทรศัพท์สำนักงานใหญ่",
      content: "02-403-3145",
      link: "tel:024033145",
    },
    {
      icon: "🏪",
      title: "สาขาพัทลุง",
      content: "345 หมู่ที่ 2 ต.เขาเจียก อ.เมือง จ.พัทลุง 93000",
      link: "https://maps.app.goo.gl/zgro1tHX8LgHdqcXA",
    },
    {
      icon: "�",
      title: "โทรศัพท์สาขาพัทลุง",
      content: "074-606-389",
      link: "tel:074606389",
    },
    {
      icon: "📧",
      title: "อีเมล",
      content: "best_medical@hotmail.com",
      link: "mailto:best_medical@hotmail.com",
    },
    {
      icon: "🕒",
      title: "เวลาทำการ",
      content: "จันทร์ - เสาร์: 08:00 - 17:00\nอาทิตย์: ปิด",
      link: null,
    },
  ];

  const adminContacts = [
    {
      name: "แอดมิน",
      phone: "084-312-3061",
      tel: "0843123061",
      qrCode: "/contact/line-qr1.jpg", // ใช้รูป QR ที่คุณอัปโหลด
    },
    {
      name: "แอดมิน",
      phone: "080-919-4186",
      tel: "0809194186",
      qrCode: "/contact/line-qr2.jpg",
    },
    {
      name: "แอดมิน",
      phone: "083-425-2332",
      tel: "0834252332",
      qrCode: "/contact/line-qr3.jpg",
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "https://www.facebook.com/p/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97-%E0%B9%80%E0%B8%9A%E0%B8%AA%E0%B8%97-%E0%B9%80%E0%B8%A1%E0%B8%94%E0%B8%B4%E0%B8%84%E0%B8%AD%E0%B8%A5-%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94-100070566921817/" },

  ];

  return (
    <>
      <Navbar />
      <Head>
        <title>ติดต่อเรา</title>
        <meta
          name="description"
          content="ติดต่อเราได้ทุกช่องทาง พร้อมแผนที่และข้อมูลติดต่อครบครัน"
        />
      </Head>
      <br />
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

      <div className='min-h-screen'>
        {/* Hero Section */}

        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 shadow-2xl rounded-xl max-w-7xl mx-auto px-4 ">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">ติดต่อเรา</h1>

            <p className="text-xl md:text-2xl opacity-90"></p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg mb-8">
                <div className="header bg-gradient-to-bl from-blue-600 to-blue-900 p-2 rounded-t-3xl ">
                  <h2 className="text-2xl font-semibold text-white p-6 text-center"> ข้อมูลติดต่อ</h2>
                </div>
                <div className="p-7">

                  <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-blue-600 hover:text-blue-800 transition duration-200"
                              target={
                                info.link.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                info.link.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-gray-600 whitespace-pre-line">
                              {info.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="header bg-gradient-to-bl from-blue-600 to-blue-900 p-2 rounded-t-3xl ">
                  <h3 className="text-2xl font-semibold text-white p-6 text-center"> ติดตามเราได้ที่</h3>
                </div>
                <div className="p-7">
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition duration-200"
                      >
                        <span className="text-lg">{social.icon}</span>
                        <span className="text-gray-700 font-medium">
                          {social.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admin LINE Contacts */}
              <div className="bg-white rounded-lg shadow-lg">
                <div className="header bg-gradient-to-bl from-blue-600 to-blue-900 p-2 rounded-t-3xl">
                  <h3 className="text-2xl font-semibold text-white p-6 text-center">ติดต่อแอดมิน LINE</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    {adminContacts.map((admin, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* QR Code */}
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-200">
                              <img
                                src={admin.qrCode}
                                alt={`LINE QR ${admin.name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden w-full h-full items-center justify-center text-gray-400 text-xs">
                                QR Code
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="flex-1 text-center sm:text-left">
                            <h4 className="font-bold text-lg text-gray-800 mb-2">{admin.name}</h4>
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                              <span className="text-2xl">📱</span>
                              <a
                                href={`tel:${admin.tel}`}
                                className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                              >
                                {admin.phone}
                              </a>
                            </div>
                            <p className="text-sm text-gray-500">สแกน QR Code เพื่อเพิ่มเพื่อน LINE</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form and Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg">

                <div className="header bg-gradient-to-bl from-blue-600 to-blue-900 p-2 rounded-t-3xl ">
                  <h2 className="text-2xl font-semibold text-white p-6 text-center">  ส่งข้อความถึงเรา</h2>
                </div>
                <div className="p-7">

                  {submitMessage && (
                    <div
                      className={`p-4 rounded-lg mb-6 ${submitMessage.includes("เรียบร้อย")
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ชื่อ-นามสกุล *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="กรุณากรอกชื่อ-นามสกุล"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          อีเมล *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          เบอร์โทรศัพท์
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="08X-XXX-XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          หัวข้อ *
                        </label>
                        <select
                          name="article"
                          value={formData.article}
                          onChange={handleInputChange}
                          required
                          className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">เลือกหัวข้อ</option>
                          <option value="general">สอบถามทั่วไป</option>
                          <option value="support">ขอความช่วยเหลือ</option>
                          <option value="business">ติดต่อเรื่องธุรกิจ</option>
                          <option value="complaint">ร้องเรียน</option>
                          <option value="suggestion">เสนอแนะ</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ข้อความ *
                      </label>
                      <textarea
                        name="detail"
                        value={formData.detail}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="กรุณาระบุรายละเอียดข้อความของคุณ..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 rounded-md font-medium transition duration-200 ${isSubmitting
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            กำลังส่ง...
                          </span>
                        ) : (
                          "ส่งข้อความ"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">แผนที่สาขา (สำนักงานใหญ่)</h2>
                </div>

                {/* Google Maps Embed */}
                <div className="relative h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1936.9551135479894!2d100.40520473847619!3d13.844426996639301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2910bbdc679fb%3A0x5820b1c0b1260c3c!2z4Lia4Lij4Li04Lip4Lix4LiXIOC5gOC4muC4quC4lyDguYDguKHguJTguLTguITguK3guKUg4LiI4Liz4LiB4Lix4LiUICjguKrguLPguJnguLHguIHguIfguLLguJnguYPguKvguI3guYgp!5e0!3m2!1sth!2sth!4v1760620866582!5m2!1sth!2sth"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Best Medical Phatthalung Branch"
                  />
                </div>

                {/* Map Footer */}
                <div className="p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-sm text-gray-800 font-medium">
                        📍 บริษัท เบสท เมดิคอล จำกัด (สำนักงานใหญ่)
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        สำนักงานใหญ่
                        เลขที่ 83  หมู่บ้านพฤกษา 95 เอ   หมู่ที่ 9  ต.บางม่วง
                        อ.บางใหญ่  จ.นนทบุรี 11140
                      </p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/zgro1tHX8LgHdqcXA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200 flex items-center gap-1"
                    >
                      เปิดใน Google Maps
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">แผนที่สาขา (พัทลุง)</h2>
                </div>

                {/* Google Maps Embed */}
                <div className="relative h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4912.3197340329625!2d100.04943139999999!3d7.621475400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d7cfd8d3d1b9f%3A0xbee54681de6e8792!2z4Lia4Lij4Li04Lip4Lix4LiXIOC5gOC4muC4quC4lyDguYDguKHguJTguLTguITguK3guKUg4LiI4Liz4LiB4Lix4LiUICjguKrguLLguILguLLguJ7guLHguJfguKXguLjguIcp!5e1!3m2!1sth!2sth!4v1756434412181!5m2!1sth!2sth"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Best Medical Phatthalung Branch"
                  />
                </div>

                {/* Map Footer */}
                <div className="p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-sm text-gray-800 font-medium">
                        📍 บริษัท เบสท เมดิคอล จำกัด (สาขาพัทลุง)
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        345 หมู่ที่ 2 ต.เขาเจียก อ.เมือง จ.พัทลุง 93000
                      </p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/zgro1tHX8LgHdqcXA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200 flex items-center gap-1"
                    >
                      เปิดใน Google Maps
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      
    </>
  );
}
