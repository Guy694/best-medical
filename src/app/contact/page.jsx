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
      icon: "📍",
      title: "ที่อยู่",
      content: "345, ตำบล เขาเจียก อำเภอเมืองพัทลุง พัทลุง 93000",
      link: "https://maps.app.goo.gl/zgro1tHX8LgHdqcXA",
    },
    {
      icon: "📱",
      title: "มือถือ",
      content: "099 478 2641",
      link: "tel:0994782641",
    },
    {
      icon: "📧",
      title: "อีเมล",
      content: "best_medical@hotmail.com",
      link: "best_medical@hotmail.com",
    },
    {
      icon: "🌐",
      title: "เว็บไซต์",
      content: "www.best-medical-bm.com",
      link: "https://www.best-medical-bm.com",
    },
    {
      icon: "🕒",
      title: "เวลาทำการ",
      content: "จันทร์ - เสาร์: 08:00 - 17:00\nอาทิตย์: ปิด",
      link: null,
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "https://www.facebook.com/p/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97-%E0%B9%80%E0%B8%9A%E0%B8%AA%E0%B8%97-%E0%B9%80%E0%B8%A1%E0%B8%94%E0%B8%B4%E0%B8%84%E0%B8%AD%E0%B8%A5-%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94-100070566921817/" },
    { name: "LINE ID", icon: "▶️", url: "https://youtube.com/company" },

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
      <div className="min-h-screen bg-gray-50">
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
                    className={`p-4 rounded-lg mb-6 ${
                      submitMessage.includes("เรียบร้อย")
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
                        className=" text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className=" text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="กรุณาระบุรายละเอียดข้อความของคุณ..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 rounded-md font-medium transition duration-200 ${
                        isSubmitting
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
                  <h2 className="text-2xl font-bold text-gray-800">แผนที่</h2>
                  <p className="text-gray-600 mt-2">
                    ตำแหน่ง บริษัท เบสท เมดิคอล จำกัด (สาขาพัทลุง)
                  </p>
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
                    title="Company Location Map"
                  />
                </div>

                {/* Map Footer */}
                <div className="p-4 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <p className="text-sm text-gray-600">
                      📍 อยู่ภายใน ตัวเมืองพัทลุง
                    </p>
                    <a
                      href="https://maps.app.goo.gl/zgro1tHX8LgHdqcXA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
                    >
                      เปิดใน Google Maps →
                    </a>
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
