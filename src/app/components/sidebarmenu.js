import { FaUser, FaChartBar, FaBox, FaCog, FaNewspaper } from "react-icons/fa";
import { BsAndroid2 } from "react-icons/bs";

export const sidebarMenu = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FaChartBar /> },
    { label: "Users", path: "/users", icon: <FaUser /> }, // จัดการผู้ใช้
    { label: "aplicant", path: "/aplicant", icon: <BsAndroid2 /> }, //จัดการผู้สมัคร
    { label: "jobs", path: "/admin/jobs", icon: <FaBox /> }, //จัดการงาน
    { label: "News", path: "/admin/news", icon: <FaNewspaper /> }, //จัดการข่าวสาร
  ],
  user: [
    { label: "jobs", path: "/jobs", icon: <FaBox /> }, // ดูงานที่เปิดรับ
    { label: "Account", path: "/account", icon: <FaUser /> }, // จัดการบัญชีผู้ใช้
    { label: "Dashboard", path: "/dashboard", icon: <FaChartBar /> }, // แดชบอร์ดผู้ใช้
  ],
};
