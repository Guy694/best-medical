import Footter from "./components/Footter";
import Navbar from "./components/Nav";
import Sidebar from "./components/sidebar";
import "./globals.css";
import { Prompt } from "next/font/google";

const prompt = Prompt({
  subsets: ["thai", "latin"], // รองรับภาษาไทย
  weight: ["400", "700"], // น้ำหนักตัวอักษร
  display: "swap",
});
export const metadata = {
  title: "ระบบรับสมัครงาน โรงเรียนสาธิตมหาวิทยาลัยทักษิณ ฝ่ายมัธยม",
  description: "ระบบรับสมัครงาน โรงเรียนสาธิตมหาวิทยาลัยทักษิณ ฝ่ายมัธยม",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
    other: [
      {
        rel: "icon",
        url: "/logo.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/logo.png",
        sizes: "16x16",
      },
    ],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <div className="flex h-screen">
          {/* <Sidebar role="user" /> */}
          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* <Navbar /> */}
            <main className="flex-1 overflow-y-auto  bg-gray-100">
              {children}
            </main>
          </div>
        </div>
        <Footter />
      </body>
    </html>
  );
}
