export default function Footter() {
  return (
    <footer className="bg-sky-700 text-gray-300 px-6 py-10 ">
      {/* Branding / Logo */}
      <div>
        <h2 className="text-xl font-bold text-white mb-3">
          บริษัท เบสท เมดิคอล จำกัด (สาขาพัทลุง)
        </h2>
        <p className="text-xl">ร้านอุปกรณ์การแพทย์ ครบวงจร</p>
      </div>

      {/* Links */}
      {/* <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Services</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div> */}

      {/* Social Media */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">
          ตามข่าวสารเพิ่มเติมได้ที่
        </h3>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/p/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97-%E0%B9%80%E0%B8%9A%E0%B8%AA%E0%B8%97-%E0%B9%80%E0%B8%A1%E0%B8%94%E0%B8%B4%E0%B8%84%E0%B8%AD%E0%B8%A5-%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94-100070566921817/"
            className="hover:text-white"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99h-2.4v-2.88h2.4v-2.2c0-2.38 1.42-3.7 3.6-3.7 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.9h2.64l-.42 2.88h-2.22v6.99A10 10 0 0 0 22 12z" />
            </svg>
          </a>

          {/* <a
            href="https://www.youtube.com/@satitschooltsu7933"
            className="hover:text-white"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 15.5v-7l6 3.5-6 3.5zm12-3.5c0-2.21-.18-3.69-.59-4.76a2.85 2.85 0 0 0-1.61-1.61C18.74 5.18 12 5.18 12 5.18s-6.74 0-7.8.45a2.85 2.85 0 0 0-1.61 1.61C2.18 8.31 2 9.79 2 12s.18 3.69.59 4.76c.26.71.85 1.27 1.61 1.61C5.26 18.82 12 18.82 12 18.82s6.74 0 7.8-.45a2.85 2.85 0 0 0 1.61-1.61c.41-1.07.59-2.55.59-4.76z" />
            </svg>
          </a> */}
          {/* <a href="#" className="hover:text-white" aria-label="TikTok">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M16 8.1c1.1.7 2.3 1 3.6 1.1V5.6a5.3 5.3 0 0 1-3.6-1.4c-.9-.9-1.3-2-1.4-3.2H11v15a3.1 3.1 0 1 1-2.2-3 3 3 0 0 1 1.2.3V9.8A6.2 6.2 0 0 0 4.7 16a6.2 6.2 0 0 0 6.2 6.2c3.4 0 6.1-2.8 6.1-6.2V8.1z" />
            </svg>
          </a> */}
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-white">
        &copy; {new Date().getFullYear()} Dev By Chakrit Thongnuan. All rights
        reserved.
      </div>
    </footer>
  );
}
