import Link from "next/link";
import VisitorCounter from "./VisitorCounter";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, BadgeCheck, Headphones } from "lucide-react";

const PERKS = [
  { icon: BadgeCheck, title: "สินค้าคุณภาพ", desc: "จากแบรนด์ที่ได้มาตรฐาน" },
  { icon: Truck, title: "จัดส่งทั่วประเทศ", desc: "รวดเร็ว ปลอดภัย" },
  { icon: ShieldCheck, title: "ชำระเงินปลอดภัย", desc: "ตรวจสอบทุกรายการ" },
  { icon: Headphones, title: "ปรึกษาฟรี", desc: "ทีมงานพร้อมให้คำแนะนำ" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-950 text-brand-100">
      <div className="border-b border-white/10">
        <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-300">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-brand-200">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-xl bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Best Medical" className="h-12 w-auto" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-200">
            บริษัท เบสท เมดิคอล จำกัด ศูนย์รวมอุปกรณ์การแพทย์และสุขภาพครบวงจร พร้อมบริการจัดหาสินค้าตามความต้องการของลูกค้า
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">เมนูลัด</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/product", "สินค้าทั้งหมด"],
              ["/howtopay", "วิธีการสั่งซื้อ/ชำระเงิน"],
              ["/payment-notice", "แจ้งชำระเงิน"],
              ["/paidstatus", "ตรวจสอบสถานะคำสั่งซื้อ"],
              ["/article", "บทความและข่าวสาร"],
              ["/qa", "คำถามที่พบบ่อย"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-brand-200 transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">สาขาพัทลุง</h3>
          <ul className="space-y-3 text-sm text-brand-200">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              345 หมู่ที่ 2 ต.เขาเจียก อ.เมือง จ.พัทลุง 93000
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              <a href="tel:074606389" className="hover:text-white">074-606-389</a>
            </li>
            <li>
              <a href="https://maps.app.goo.gl/zgro1tHX8LgHdqcXA" target="_blank" rel="noopener noreferrer" className="text-accent-300 hover:underline">
                ดูแผนที่ →
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">สำนักงานใหญ่</h3>
          <ul className="space-y-3 text-sm text-brand-200">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              83 หมู่บ้านพฤกษา 95 เอ หมู่ที่ 9 ต.บางม่วง อ.บางใหญ่ จ.นนทบุรี 11140
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              <a href="tel:024033145" className="hover:text-white">02-403-3145</a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              <a href="mailto:best_medical@hotmail.com" className="hover:text-white">best_medical@hotmail.com</a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              จันทร์ - เสาร์ 08:00 - 17:00
            </li>
            <li>
              <a href="https://maps.app.goo.gl/ujvLQj1d5YeWPKRw5" target="_blank" rel="noopener noreferrer" className="text-accent-300 hover:underline">
                ดูแผนที่ →
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-300 sm:flex-row">
          <p>© {new Date().getFullYear()} บริษัท เบสท เมดิคอล จำกัด – All Rights Reserved</p>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
