import "./globals.css";
import { Prompt } from "next/font/google";
import Providers from "./components/Providers";
import SiteChrome from "./components/SiteChrome";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-prompt",
});

const SITE_URL = process.env.SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "บริษัท เบสท เมดิคอล จำกัด | ศูนย์รวมอุปกรณ์การแพทย์ครบวงจร",
    template: "%s | เบสท เมดิคอล",
  },
  description:
    "จำหน่ายอุปกรณ์การแพทย์ เครื่องมือตรวจรักษา ผลิตภัณฑ์ดูแลผู้ป่วยและผู้สูงอายุ ครุภัณฑ์และเวชภัณฑ์สำหรับโรงพยาบาลและคลินิก จัดส่งทั่วประเทศ",
  keywords: ["อุปกรณ์การแพทย์", "เครื่องมือแพทย์", "เบสท เมดิคอล", "Best Medical", "เครื่องผลิตออกซิเจน", "รถเข็นผู้ป่วย"],
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  openGraph: {
    title: "บริษัท เบสท เมดิคอล จำกัด",
    description: "ศูนย์รวมอุปกรณ์การแพทย์ครบวงจร จัดส่งทั่วประเทศ",
    images: ["/banner.png"],
    type: "website",
    locale: "th_TH",
  },
};

export const viewport = {
  themeColor: "#1c30bd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={prompt.variable}>
      <body>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
