-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 12, 2025 at 09:08 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `best_medical`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `id` int(11) NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cartitem`
--

CREATE TABLE `cartitem` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `cate_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cate_img` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `cate_name`, `cate_img`, `parentId`) VALUES
(1, 'หมอน', '/categoryimg/mon1.jpg', NULL),
(2, 'สติ๊กเกอร์', '/categoryimg/sticker.jpg', NULL),
(3, 'แบตเตอรี่', '/categoryimg/battery.jpg', NULL),
(7, 'น้ำยาซักผ้า', '/categoryimg/clean.jpg', NULL),
(37, 'แอมบู', '/categoryimg/2.png', NULL),
(38, 'หน้ากาก', '/categoryimg/3.png', NULL),
(40, 'ผลิตภัณฑ์ดูแลระบบทางเดินหายใจ', '/categoryimg/4.png', NULL),
(41, 'อุปกรณ์ทดสอบสมรรถภาพปอด', '/categoryimg/9.png', NULL),
(42, 'เครื่องวัดความดัน', '/categoryimg/12.png', NULL),
(43, 'เครื่องพ่นละอองยา', '/categoryimg/18.png', NULL),
(44, 'ที่นอน', '/categoryimg/22.png', NULL),
(45, 'โต๊ะคร่อมเตียง', '/categoryimg/23.png', NULL),
(46, 'เครื่องปั่นฮีมาโตคริต', '/categoryimg/24.png', NULL),
(47, 'ชุดตรวจหูตา', '/categoryimg/26.png', NULL),
(48, 'โคมไฟ', '/categoryimg/29.png', NULL),
(49, 'หูฟังทางการแพทย์', '/categoryimg/30.png', NULL),
(50, 'เครื่องมือทางสูตินารีเวช', '/categoryimg/34.png', NULL),
(51, 'ถุงบีบเลือด', '/categoryimg/36.png', NULL),
(52, 'สายรัดห้ามเลือด', '/categoryimg/37.png', NULL),
(53, 'ชุดส่องหลอดลม', '/categoryimg/38.png', NULL),
(54, 'เครื่องดูดเสมหะ', '/categoryimg/47.png', NULL),
(55, 'เครื่องผลิตออกซิเจน', '/categoryimg/49.png', NULL),
(56, 'เครื่องวัดออกซิเจนในเลือด', '/categoryimg/52.jpg', NULL),
(57, 'รถเข็นผู้ป่วย', '/categoryimg/54.png', NULL),
(58, 'ที่วัดอุณหภูมิ', '/categoryimg/56.jpg', NULL),
(59, 'เครื่องพ่นยา', '/categoryimg/60.png', NULL),
(60, 'ผ้าอ้อม', '/categoryimg/63.jpg', NULL),
(61, 'Indicator', '/categoryimg/64.jpg', NULL),
(62, 'ผ้าห่อเครื่องมือ', '/categoryimg/67.jpg', NULL),
(63, 'ซองสเตอไรด์', '/categoryimg/68.jpg', NULL),
(64, 'เกจ์ออกซิเจน', '/categoryimg/69.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `article` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` int(11) NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountPercent` int(11) NOT NULL,
  `expireDate` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `order_id` int(11) NOT NULL,
  `order_code` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullName` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `shipping` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `items` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','PAID','SHIPPING','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `shippingAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slipUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `paidAtdate` date DEFAULT NULL,
  `paidAttime` time DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_id`, `order_code`, `order_email`, `fullName`, `totalPrice`, `shipping`, `items`, `status`, `shippingAddress`, `slipUrl`, `paidAtdate`, `paidAttime`, `createdAt`) VALUES
(5, 'ORD1758097854043', 'chakrit.t@tsu.ac.th', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/numya.png\",\"quantity\":5,\"delivery\":\"30.00\"},{\"id\":1,\"name\":\"หมอนใยสังเคราะห์หุ้มหนังเทียม\",\"price\":\"590.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/mon.jpg\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-09-17 15:30:54.000'),
(6, 'ORD1758099125096', 'chakrit.t@tsu.ac.th', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/numya.png\",\"quantity\":5,\"delivery\":\"30.00\"},{\"id\":1,\"name\":\"หมอนใยสังเคราะห์หุ้มหนังเทียม\",\"price\":\"590.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/mon.jpg\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-09-17 15:52:05.000'),
(7, 'ORD1758099126574', 'chakrit.t@tsu.ac.th', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/numya.png\",\"quantity\":5,\"delivery\":\"30.00\"},{\"id\":1,\"name\":\"หมอนใยสังเคราะห์หุ้มหนังเทียม\",\"price\":\"590.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/mon.jpg\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-09-17 15:52:06.000'),
(8, 'ORD1758099305987', 'chakrit.t@tsu.ac.th', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/numya.png\",\"quantity\":5,\"delivery\":\"30.00\"},{\"id\":1,\"name\":\"หมอนใยสังเคราะห์หุ้มหนังเทียม\",\"price\":\"590.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/mon.jpg\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-09-17 15:55:06.000'),
(9, 'ORD1758099413159', 'chakrit.t@tsu.ac.th', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/numya.png\",\"quantity\":5,\"delivery\":\"30.00\"},{\"id\":1,\"name\":\"หมอนใยสังเคราะห์หุ้มหนังเทียม\",\"price\":\"590.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/mon.jpg\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-09-17 15:56:53.000'),
(10, 'ORD1758099460392', 'chakrit.t@tsu.ac.th', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/numya.png\",\"quantity\":5,\"delivery\":\"30.00\"},{\"id\":1,\"name\":\"หมอนใยสังเคราะห์หุ้มหนังเทียม\",\"price\":\"590.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/mon.jpg\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-09-17 15:57:40.000'),
(11, 'ORD1758099760892', 'chakrit.t@tsu.ac.th', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/numya.png\",\"quantity\":5,\"delivery\":\"30.00\"},{\"id\":1,\"name\":\"หมอนใยสังเคราะห์หุ้มหนังเทียม\",\"price\":\"590.00\",\"image\":\"http://172.16.107.247/best-medical/public/pdimage/mon.jpg\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-09-17 16:02:40.000'),
(12, 'ORD1759926529190', 'chakrit694@gmail.com', NULL, '0.00', 'ems', '[{\"id\":3,\"name\":\"แบตเตอรี่ทดแทน\",\"price\":\"0.00\",\"image\":\"/pdimage/bat.jpg\",\"quantity\":3,\"delivery\":\"40.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 19:28:49.000'),
(13, 'ORD1759927268664', 'chakrit694@gmail.com', NULL, '0.00', 'ems', '[{\"id\":3,\"name\":\"แบตเตอรี่ทดแทน\",\"price\":\"0.00\",\"image\":\"/pdimage/bat.jpg\",\"quantity\":3,\"delivery\":\"40.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 19:41:08.000'),
(14, 'ORD1759927447826', 'chakrit694@gmail.com', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":3,\"delivery\":\"30.00\"},{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":4,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 19:44:07.000'),
(15, 'ORD1759927922017', 'chakrit694@gmail.com', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":3,\"delivery\":\"30.00\"},{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":4,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 19:52:02.000'),
(16, 'ORD1759930933332', 'chakrit694@gmail.com', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":3,\"delivery\":\"30.00\"},{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":4,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 20:42:13.000'),
(17, 'ORD1759934579443', 'chakrit694@gmail.com', NULL, '0.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":4,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 21:42:59.000'),
(18, 'ORD1759934841563', 'chakrit694@gmail.com', NULL, '0.00', '\"ems\"', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 21:47:21.000'),
(19, 'ORD1759935072316', 'chakrit694@gmail.com', NULL, '0.00', '{\"id\":\"ems\",\"label\":\"ค่าบริการจัดส่ง\",\"cost\":90}', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 21:51:12.000'),
(20, 'ORD1759935326199', 'chakrit694@gmail.com', NULL, '800.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":4,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-08 21:55:26.000'),
(21, 'ORD1759985791767', 'chakrit694@gmail.com', NULL, '600.00', 'ems', '[{\"id\":7,\"name\":\"น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\\r\\n\",\"price\":\"170.00\",\"image\":\"/pdimage/numya.png\",\"quantity\":3,\"delivery\":\"30.00\"}]', 'PENDING', NULL, '', NULL, NULL, '2025-10-09 11:56:31.000');

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `pro_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `imageUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `warranty` int(11) DEFAULT 0,
  `property` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `pro_size` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `delivery` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'ค่าส่ง',
  `visible` int(1) NOT NULL DEFAULT 0 COMMENT '1.เห็น 0.ไม่เห็น'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `pro_name`, `codename`, `description`, `price`, `stock`, `categoryId`, `imageUrl`, `createdAt`, `warranty`, `property`, `pro_size`, `delivery`, `visible`) VALUES
(1, 'หมอนใยสังเคราะห์หุ้มหนังเทียม', '', 'มีขนาด  39 x 58 ซม.\nภายในทำด้วยใยสังเคราะห์ หุ้มด้วยผ้าบาง\nภายนอกหุ้มผ้าหนังเทียม\nมีซิปสามารถถอดออกทำความสะอาดได้\nหมอนใยสั่งเคราะห์เหมาะสำหรับใช้ในหอผู้ป่วยโรงพยาบาล\n', '590.00', 999, 1, '/pdimage/mon.jpg', '2025-09-14 06:10:23', 0, '0', '', '30.00', 0),
(2, 'หมอนยางพาราหุ้มหนังเทียม', '', 'ใช้สำหรับรองศรีษะเวลานอน \nเหมาะสำหรับผู้ป่วยที่บ้าน , โรงพยาบาล\nคุณสมบัติสินค้า\nมีขนาด   ขนาด 33 x 58 x 10 cm.  (กว้าง x ยาว x สูง )\nผลิตจากยางพาราธรรมชาติ 100% \nภายในทำจากยางพารา หุ้มด้วยผ้าขาวบาง\nภายนอกหุ้มผ้าหนังเทียม\nมีซิปสามารถถอดออกทำความสะอาดได้\nไม่ก่อให้เกิดอาการภูมิแพ้ เนื่องจากไรฝุ่นและแบคทีเรียไม่สามารถอาศัยอยู่ในยางพาราธรรมชาติได้ \nมีความนุ่มและความยืดหยุ่นสูง การคืนตัวดีเยี่ยม ทำให้ลดการกระแทกจากการนอน\nช่วยกระจายแรงกดทับ ช่วยในการไหลเวียนของโลหิต\nรองรับทุกสรีระการนอน รองรับต้นคอและกระดูกสันหลังได้ดี\nช่วยแก้อาการปวดคอ ปวดไหล่\nมีความทนทาน อายุการใช้งานยาวนาน \nสามารถซักด้วยเครื่องซักและปั่นแห้งได้ ตากในที่ร่มได้ แต่ห้ามโดนแสงแดด\nผลิตภัณฑ์ประเทศไทย\n', '990.00', 999, 1, '/pdimage/monyang.jpg', '2025-09-14 06:10:23', 0, '0', '', '30.00', 0),
(4, 'หมอนยางพารา', '', 'ผลิตจากยางพาราธรรมชาติ 100% \r\nภายในทำจากยางพารา หุ้มด้วยผ้าขาวบาง\r\nไม่ก่อให้เกิดอาการภูมิแพ้ เนื่องจากไรฝุ่นและแบคทีเรียไม่สามารถอาศัยอยู่ในยางพาราธรรมชาติได้ \r\nมีความนุ่มและความยืดหยุ่นสูง การคืนตัวดีเยี่ยม ทำให้ลดการกระแทกจากการนอน\r\nช่วยกระจายแรงกดทับ ช่วยในการไหลเวียนของโลหิต\r\nรองรับทุกสรีระการนอน รองรับต้นคอและกระดูกสันหลังได้ดี\r\nช่วยแก้อาการปวดคอ ปวดไหล่\r\nมีความทนทาน อายุการใช้งานยาวนาน \r\nสามารถซักด้วยเครื่องซักและปั่นแห้งได้ ตากในที่ร่มได้ แต่ห้ามโดนแสงแดด\r\nผลิตภัณฑ์ประเทศไทย', '690.00', 999, 1, '/pdimage/mon1.jpg', '2025-09-15 07:56:25', 0, '0', '', '30.00', 0),
(1000, 'น้ำยาซักผ้า เบิร์ดเดย์ กลิ่นกุหลาบ\r\n', '', 'ใช้สำหรับซักผ้า ช่วยขจัดความสกปรกให้ผ้าขาวสะอาด มีกลิ่นหอม ใช้ได้ทั้งซักมือและซักเครื่อง', '170.00', 999, 7, '/pdimage/numya.png', '2025-09-15 07:59:53', 0, '0', '', '30.00', 0),
(1001, 'แบตเตอรี่ทดแทน', '', 'แบตเตอรี่ทดแทนสำหรับเครื่องมือทางการแพทย์แต่ละรุ่น', '0.00', 999, 3, '/pdimage/bat.jpg', '2025-09-15 08:02:33', 0, '0', '', '40.00', 0),
(1002, 'กระดาษสติ๊กเกอร์ความร้อน', '', 'สติ๊กเกอร์ฉลากยา ขนาด 7.5 x 5 เซนติเมตร ม้วนละ 500 ดวง \nสามารถใช้ได้กับเครื่องพิมพ์ ความร้อน Direct Thermal เท่านั้น \nเนื้อกระดาษขาวเงา เป็นกระดาษต่อเนื่อง\nกระดาษเป็นแบบกาวรีมูฟ สามารถลอกออกได้ง่าย และติดใหม่ได้หลายครั้ง\n', '0.00', 999, 2, '/pdimage/nepc.png', '2025-09-15 08:04:01', 0, '0', '', '50.00', 0),
(1003, 'MR-100 Plus Resuscitator\r\nชุดช่วยหายใจมือบีบ ลูกยางบีบวัสดุซิลิโคน (Durable)\r\n\r\n', 'AR0059 Resuscitator set', 'MR-100 Plus Resuscitator\nชุดช่วยหายใจมือบีบ ลูกยางบีบวัสดุซิลิโคน (Durable) \nลูกยางบีบซิลิโคน ถุงสํารองออกซิเจนซิลิโคน\nใช้ซํ้าได้ (Reusable)\nรหัส AR0059 Resuscitator set, adult (สำหรับผู้ใหญ่)\nรหัส AR0056 Resuscitator set, adult w/Pop (สำหรับผู้ใหญ่)\nรหัส AR0057 Resuscitator, child (สำหรับเด็กโต)\nรหัส AR0058 Resuscitator, infant (สำหรับเด็กเล็ก)\n', '0.00', 999, 37, '/pdimage/1.png', '2025-09-17 13:23:18', 0, '0', 'รหัส AR0059 Resuscitator set, adult (สำหรับผู้ใหญ่) รหัส AR0056 Resuscitator set, adult w/Pop (สำหรับผู้ใหญ่) รหัส AR0057 Resuscitator, child (สำหรับเด็กโต) รหัส AR0058 Resuscitator, infant (สำหรับเด็กเล็ก)', '0.00', 1),
(1011, 'เกจ์ออกชิเจน อุปกรณ์ครบชุด\r\n', '', 'Best Air Oxygen Regulator เกจ์ออกชิเจน  อุปกรณ์ครบชุด\r\nสินค้าชุดนี้ประกอบด้วย\r\nเกย์ออกซิเจน ยี่ห้อ BEST AIR จำนวน 1 ตัว\r\nกระบอกใส้น้ำออกซิเจน จำนวน 1 ชิ้น\r\nสาย Cannula (สายออกซิเจนใสจมูก) จำนวน 1 เส้น\r\nจุกพ่นยา จำนวน 1 ชิ้น\r\nประแจ จำนวน 1 ชิ้น', '0.00', 999, 64, '/pdimage/70.jpg', '2025-09-17 13:32:15', 0, NULL, '', '0.00', 1),
(1012, 'เกจ์ออกชิเจน  (กล่องแม่เหล็ก)\r\n', '', 'เกจ์ออกชิเจน Best Air Oxygen Regulator (กล่องแม่เหล็ก)\r\nสินค้าชุดนี้ประกอบด้วย\r\n-เกจ์ออกซิเจน 1 ตัว\r\n-กระบอกใส่น้ำออกซิเจน 1 ชิ้น\r\n-สาย Cannula 1 เส้น\r\n-จุกพ่นยา 1 ชิ้น\r\n-ประแจ 1 ชิ้น', '0.00', 999, 64, '/pdimage/69.jpg', '2025-09-17 13:33:08', 0, NULL, '', '0.00', 1),
(1013, 'ซองสเตอไรด์ ซองเครื่องมือแพทย์', '', 'ซองสเตอไรด์ ซองเครื่องมือแพทย์\r\nคุณลักษณะ\r\nผลิตจากวัสดุ 2 ชนิดประกบกัน คือ กระดาษเกรดทางการแพทย์ และฟิล์มเป็นสีฟ้าใสเกรดที่ใช้ทางการแพทย์\r\nตัวซองสามารถปิดผนึกได้ดี ไม่รั่วซึม\r\nสามารถนำไปซีลได้\r\nใช้สำหรับบรรจุเวชภัณฑ์และเครื่องมือทางการแพทย์เพื่อทำให้ปราศจากเชื้อ\r\nมัสัญลักษณ์บ่งชี้แสดงชัดเจนว่าผลิตภัณฑ์ที่อยู่ในซองได้รับผ่านการฆ่าเชื้อแล้ว\r\nตัวสินค้ามี 2 แบบ คือ แบบชนิดเรียบ และแบบชนิดขยายข้าง', '0.00', 999, 63, '/pdimage/68.jpg', '2025-09-17 13:34:28', 0, NULL, '', '0.00', 1),
(1014, 'ผ้าห่อเครื่องมือทางการแพทย์ ผ้าห่อเซ็ต แบบใช้แล้วทิ้ง', '', 'ผ้าห่อเครื่องมือทางการแพทย์ ผ้าห่อเซ็ต แบบใช้แล้วทิ้ง \r\nNonwoven Sterilization Wrap \r\nผลิตภัณฑ์เป็นเกรดทางการแพทย์เพื่อใช้ในห้อง  CSR ( Central sterile Room ) / CSSD โดยเฉพาะ \r\nสามารถห่อบรรจุภัณฑ์ เพื่อใช้ในกระบวนการทำให้ปราศจากเชื้อ ด้วยระบบ : Steam, Ethylene Oxide, Hydrogen peroxide \r\nเป็นผลิตภัณฑ์ที่ใช้ครั้งเดียวทิ้ง \r\nมี 2 สีให้เลือกใช้งานตามความเหมาะสม และมีความหนาให้เลือก 50 กรัม และ 60 กรัม \r\nผลิตภัณฑ์ทั้งหมดมีขนาด ( CM. )', '0.00', 999, 62, '/pdimage/67.jpg', '2025-09-17 13:35:18', 0, NULL, '', '0.00', 1),
(1015, 'ชุดตรวจหู ตา', '', 'PRIMA CLASSIC Oto/Ophthalmoscope set\r\nชุดตรวจหู ตา\r\nคุณสมบัติทั่วไป\r\nชุดเครื่องมือประกอบด้วย หัวตรวจตา (Ophthalmoscope), หัวตรวจหู (Otoscope) Speculum), ด้ามจับ (Handle) และกล่องใส่ (Case)\r\nใช้กับถ่านไฟฉายขนาดกลาง (Size C) 2 ก้อน\r\nรหัส  808-820-25 PRIMA CLASSIC OTO /OPHTHALMOSCOPE SET with Spare Lamp\r\n', '0.00', 999, 47, '/pdimage/62.png', '2025-09-17 13:37:04', 0, NULL, '', '0.00', 1),
(1016, 'เครื่องพ่นละอองยาแบบพกพา', '', 'M103 Yuwel Mesh Nebulizer\r\nเครื่องพ่นละอองยาแบบพกพา\r\nอัตราการพ่นละอองยา ≥ 0.2 มล./นาที\r\nระดับเสียง ≤ 50 เดซิเบล(เอ)\r\nนํ้าหนักโดยประมาณ 97 กรัม\r\n', '0.00', 999, 59, '/pdimage/61.png', '2025-09-17 13:37:50', 0, NULL, '', '0.00', 1),
(1017, 'เครื่องพ่นละอองยา', '', '403AI Air-compressing Nebulizer\r\nเครื่องพ่นละอองยา\r\nอัตราการพ่นละอองยาสูงสุด ≥ 0.2 มล./นาที\r\nแรงดันสูงสุด ≥ 0.15 เมกะปาสคาล\r\nนํ้าหนักโดยประมาณ 1.2 กิโลกร\r\n', '0.00', 999, 59, '/pdimage/60.png', '2025-09-17 13:38:24', 0, NULL, '', '0.00', 1),
(1018, 'ชุดตรวจหู ตา ri-scope L otoscope /ophthalmoscope ', '', 'ri-scope L otoscope /ophthalmoscope ชุดตรวจหู ตา No. 3745 เครื่องส่องตรวจ หู-ตา Otoscope/Ophthalmoscope\r\nหลอดไฟสำหรับหัวตรวจเป็นแบบ ฮาโลเจน 2.5 โวลล์,         \r\nใช้กับถ่านไฟฉายขนาดกลาง (Size C) 2 ก้อน\r\nชุดตรวจหู (Otoscope) ให้ความสว่างระบบ Fiber Optic ไม่ร้อนบริเวณที่ส่องตรวจ\r\nชุดตรวจตา (Ophthalmoscope) ปรับ Correcting Lenses ได้ตั้งแต่ –35 ถึง +40\r\n', '0.00', 999, 47, '/pdimage/59.png', '2025-09-17 13:39:59', 0, NULL, '', '0.00', 1),
(1019, 'ไฟส่องตรวจแบบสวมศีรษะ ไฟ LED', 'No. 6091', 'ไฟส่องตรวจแบบสวมศีรษะ ไฟ LED\r\nไฟส่องตรวจแบบสวมศีรษะ ไฟ LED ไร้สาย \r\nแถบรัดศีรษะถอดทำความสะอาดง่าย\r\nคุณภาพสูง ไร้สาย\r\n', '0.00', 999, 48, '/pdimage/58.png', '2025-09-17 13:41:04', 0, NULL, '', '0.00', 1),
(1020, 'เครื่องวัดอุณหภูมิแบบอินฟาเรด', 'JPD-FR200', 'เครื่องวัดอุณหภูมิแบบอินฟาเรด\r\nFR200 Infrared thermometer\r\nวัดอุณหภูมิได้ทั้งที่หน้าผากและวัตถุ\r\nช่วงการวัด (ที่หน้าผาก) 35°C - 42.2°C (วัตถุ) 0°C - 100°C\r\nหน่วยความจําเก็บได้ 20 ค่า\r\n', '0.00', 999, 58, '/pdimage/57.jpg', '2025-09-17 13:42:11', 0, NULL, '', '0.00', 1),
(1021, 'เครื่องวัดอุณหภูมิแบบอินฟาเรด', 'JPD-FR202', 'เครื่องวัดอุณหภูมิแบบอินฟาเรด\r\nFR202 Infrared thermometer\r\nวัดอุณหภูมิได้ทั้งที่หน้าผากและวัตถุ\r\nช่วงการวัด (ที่หน้าผาก) 35°C - 42.2°C (วัตถุ) 0°C - 100°C\r\nหน่วยความจําเก็บได้ 20 ค่า\r\n', '0.00', 999, 58, '/pdimage/56.jpg', '2025-09-17 13:43:08', 0, NULL, '', '0.00', 1),
(1022, 'Yuwell Overbed table โต๊ะคร่อมเตียงผู้ป่วย\r\n', 'YU610', 'Yuwell Overbed table \r\nโต๊ะคร่อมเตียงผู้ป่วย  รหัส YU610\r\nใช้เป็นโต๊ะรับประทานอาหารสำหรับผู้ป่วยบนเตียง หรือใช้วางสิ่งของ\r\nพื้นผิวโต๊ะกันน้ำได้\r\nโครงสร้างฐานเป็นเหล็ก\r\nรับน้ำหนักได้ 25 กิโลกรัม\r\nปรับขึ้น – ลงได้สะดวก 71 – 114 cm.\r\nมีล้อ 4 ล้อ สามารถล็อคล้อได้ 2 ล้อ', '0.00', 999, 45, '/pdimage/55.png', '2025-09-17 13:44:14', 0, NULL, '', '0.00', 1),
(1023, 'Jumao Wheelchair รถเข็นผู้ป่วย\r\n', 'W28', 'Jumao Wheelchair\r\nรถเข็นผู้ป่วย  รหัส W28\r\nน้ำหนักรถเข็นผู้ป่วย 17.8 กิโลกรัม\r\nขนาดรถเข็น กว้าง 66 *ยาว 110 *สูง 91.5 ซม.\r\nเบาะนั่งกว้าง 46.5 ซม.  ลึก 41 ซม.  ความสูงพนักพิง 40 ซม. \r\nรองรับน้ำหนักผู้ป่วย 136 กิโลกรัม\r\nโครงสร้างรถเข็นผู้ป่วย : เหล็กชุบ   \r\nมีที่วางขา (legrest) และที่วางเท้า (footplates)พลาสติก ปรับยกได้\r\nเส้นผ่าศูนย์กลางล้อหน้า 8นิ้ว วัสดุPVC\r\nเส้นผ่าศูนย์กลางล้อหลัง 24 นิ้ว วัสดุPU', '0.00', 999, 57, '/pdimage/54.png', '2025-09-17 13:45:10', 0, NULL, '', '0.00', 1),
(1024, 'Pulse Oximeter เครื่องวัดความอิ่มตัวของออกซิเจนในเลือด\r\n', 'JPD-500D', 'Pulse Oximeter เครื่องวัดความอิ่มตัวของออกซิเจนในเลือด\r\nเครื่องวัดออกซิเจปลายนิ้ว Pulse Oximeter Jumper JPD-500D\r\nคุณสมบัติเครื่องวัดออกซิเจนปลายนิ้ว\r\nผ่านมาตรฐานเครื่องมือแพทย์แพทย์ ยุโรป อเมริกา\r\nสินค้าคุณภาพระดับสูง ผลการวัดเที่ยงตรง ใช้ในหน่วยงานทางการแพทย์และโรงพยาบาล \r\nสามารถวัดระดับออกซิเจนในเลือด (SpO2) ได้แม่นยำ โดยมีค่าความถูกต้อง ± 2%\r\nสามารถวัดอัตราการเต้นของหัวใจ pulse rate (PR) และ ค่าการไหลเวียนของเลือด perfusion lndex (PI) \r\nมีเสียงแจ้งเตือน เมื่อ ระดับออกซิเจนในเลือด และอัตราชีพจรผิดปกติ \r\nระบบวัดผลแบบเรียลไทม์ พร้อมบาร์กราฟแสดงผล \r\nหน้าจอ OLED หน้าจอขนาดใหญ่ ปรับความสว่างได้ 5 ระดับ \r\nประหยัดพลังงานด้วยโหมด Auto-off 10 วินาที พร้อมสัญลักษณ์แจ้งเตือนเมื่อแบตเตอรี่ต่ำ\r\n', '0.00', 999, 56, '/pdimage/53.jpg', '2025-09-17 13:46:13', 0, NULL, '', '0.00', 1),
(1025, 'Pulse Oximeter เครื่องวัดความอิ่มตัวของออกซิเจนในเลือด\r\n', 'JPD-500E', 'Pulse Oximeter เครื่องวัดความอิ่มตัวของออกซิเจนในเลือด\r\nเครื่องวัดออกซิเจปลายนิ้ว Pulse Oximeter Jumper JPD-500E\r\nคุณสมบัติ\r\nแสดงค่า SpO2, PR, PR Bar และแจ้งเตือนเมื่อแบตเตอรี่ต่ำ\r\nมีการแจ้งเตือนเมื่อ SpO2 และ PR rate เกินค่าที่กำหนด\r\nแสดงผลบนหน้าจอ LED แบบดิจิตอล\r\nเครื่องปิดอัตโนมัติเมื่อไม่มีสัญญาณเกินกว่า 16 วินาที\r\nช่วงการวัด Sp02 35-100% ความถูกต้อง + 2% (ที่ 70-100%)\r\nช่วงการเตือน ค่า SpO2 ตำกว่า 94%\r\nช่วงการวัด Pulse Rate 25-250 bpm ความถูกต้อง + 2 bpm\r\nช่วงการเตือน ค่า PR ต่ำกว่า 25-250 bpm หรือ สูงกว่า 130 bpm\r\nใช้ถ่านอัลคาไลน์ AAA 1.5 V 2 ก้อน\r\nใช้ไฟน้อยกว่า 35 mA สามารถใช้งานต่อเนื่อง 24 ชั่วโมง\r\nขนาด 62 x 37 x 32 มิลลิเมตร หนักประมาณ 52 กรัม (รวมแบตเตอรี่)', '0.00', 999, 56, '/pdimage/52.jpg', '2025-09-17 13:47:35', 0, NULL, '', '0.00', 1),
(1026, 'Yuyue Mattress Strip Model With 7600 Model Air Pump', 'YUYUE-7600', 'Yuyue Mattress Strip Model With 7600 Model Air Pump\r\nที่นอนลม แบบลอน เพื่อลดสาเหตุการเกิดแผลกดทับ YUYUE รุ่น 7600\r\nคุณสมบัติสินค้า\r\nสามารถป้องกันการเกิดแผลกดทับได้ตั้งแต่ระยะที่ 1-4\r\nช่วยลด การเสียดสีระหว่างที่นอน และผิวของผู้ใช้งาน\r\nช่วยลดสาเหตุการเกิดแผลกดทับจากการนอนเป็นระยะเวลานาน\r\nวัสดุ Nylon ผสม PVC มีความแข็งแรง คงทน อายุการใช้งานยาวนาน\r\nทำงานสลับการพอง-ยุบตัว ทุกๆ 12 นาที\r\nทำงานเงียบระดับเสียงเบากว่า 50 dB\r\nช้กำลังไฟฟ้า 6.5 W\r\nขนาดสินค้า\r\nขนาดกว้าง x ยาว x หนา = 200 x 90 x 9 ซม.\r\nขนาดกล่อง 45 x 23 x 34 ซม.\r\nน้ำหนัก 8.5 กก.\r\n', '0.00', 999, 44, '/pdimage/51.png', '2025-09-17 13:49:06', 0, NULL, '', '0.00', 1),
(1027, 'Oxygen Concentrator เครื่องผลิตออกซิเจน\r\n', '8F-5AW', 'Oxygen Concentrator \r\nเครื่องผลิตออกซิเจน 5 ลิตร รุ่น 8F-5AW\r\nรายละเอียดคุณสมบัติ\r\nอัตราการไหลของออกซิเจน 0-5 ลิตร/นาที\r\nความเข้มข้นออกซิเจน ไม่ตํ่ากว่า 95.5-87%\r\nความดันออกสูงสุด 40-70 kPa\r\nกลไกการลดความดัน 250 kPa ± 25 kPa\r\nระดับความสูง 1,828 เมตร เหนือระดับนํ้าทะเลโดยไม่ทำให้ระดับความเข้มข้นลดลง ที่ระดับความสูง 1,828-4,000 เมตร จะทำให้ประสิทธิภาพตํ่ากว่า 90%\r\nกำลังไฟ 400 วัตต์\r\nใช้กับไฟกระแสสลับ AC220V±10%, 50±2% Hz\r\nระดับเสียงไม่เกิน 52 dB (A)\r\nขนาด 390 x 245 x 500 มม.\r\nน้ำหนัก 15.5 กก.\r\nมีระบบตั้งเวลาปิด เพื่อสะดวกต่อการใช้งาน\r\nหน้าจอ LCD แสดงเวลาการทำงาน, เวลาตั้งปิด\r\nมีระบบรักษาความปลอดภัยหากระบบผิดพลาดหรือความร้อนสูงเกินเครื่องจะดับ\r\nมีแจ้งเตือนไฟฟ้าขัดข้องและความดันผิดปกติ\r\nมีแจ้งเตือน ออกซิเจนตํ่า, ความดันสูงหรือตํ่า, ระบบผิดพลาด, ไม่มีไฟเข้า\r\nคอมเพรสเซอร์มีระบบป้องกันความร้อน\r\nมีรีโมทคอนโทรล ควบคุมการเปิด-ปิด และตั้งเวลา\r\nตัวเครื่องสามารถต่อชุดพ่นละอองยาได้ (เฉพาะรุ่น) โดยให้อัตราการพ่นละอองยาไม่ต่ำกว่า 15 มล./นาที \r\n\r\n\r\n', '0.00', 999, 55, '/pdimage/50.png', '2025-09-17 13:50:45', 0, NULL, '', '0.00', 1),
(1028, 'Oxygen Concentrator เครื่องผลิตออกซิเจน\r\n', '8F - 3AW', 'Oxygen Concentrator \r\nเครื่องผลิตออกซิเจน  ขนาด 3 ลิตร รุ่น 8F - 3AW\r\nอัตราการไหลของออกซิเจน 0-3 ลิตร/นาที\r\nความเข้มข้นออกซิเจน 93±3%\r\nความดันขาออก 20-50 kPa\r\nกลไกการลดความดัน 250 kPa ± 25 kPa\r\nกำลังไฟฟ้า 230 VA\r\nแหล่งจ่ายไฟ AC220V±10%, 50±2% Hz\r\nระดับเสียง ด้านหน้าตัวเครื่อง 42 dB (A) โดยรวมทั้งเครื่อง 46 dB (A)\r\nขนาด (กว้าง) 390 x (ลึก) 245 x (สูง) 500 มม.\r\nน้ำหนัก 11.8 กก.\r\nมีฟังก์ชันตั้งเวลาปิดเครื่อง เพื่อสะดวกต่อการใช้งาน\r\nหน้าจอแสดงเวลาการทำงาน และการตั้งเวลาปิดเครื่อง\r\nมีระบบแจ้งเตือนเพื่อป้องกันอันตรายจากการใช้งาน\r\nแจ้งเตือนเมื่อมีกระแสไฟฟ้าไหลเกินหรือมีการคลายการเชื่อมต่อ\r\nแจ้งเตือนการทำงานของความดันล้มเหลว\r\nแจ้งเตือนเมื่อคอมเพรสเซอร์ทำงานล้มเหลวหรือเมื่อมีความร้อนมากเกินไป\r\nแจ้งเตือนความเข้มข้นของออกซิเจนต่ำ \r\nมีรีโมทคอนโทรล ควบคุมการเปิด-ปิดเครื่อง และตั้งเวลาการใช้งาน\r\nตัวเครื่องสามารถต่อชุดพ่นละอองยาได้ อัตราการพ่นละอองยา 0.15 มล./นาที\r\n \r\n\r\n\r\n\r\n\r\n', '0.00', 999, 55, '/pdimage/49.png', '2025-09-17 13:52:03', 0, NULL, '', '0.00', 1),
(1029, 'Manual suction apparatus เครื่องดูดเสมหะแบบมือบีบ\r\n', '7B-1', 'Manual suction apparatus\r\nเครื่องดูดเสมหะแบบมือบีบ รุ่น 7B-1\r\nสำหรับดูดเสมหะ เลือด ในระบบทางเดินหายใจด้วยแรงดันลบใช้งานง่าย พกพาและเคลื่อนย้ายได้สะดวก สำหรับใช้ในโรงพยาบาล\r\nคุณลักษณะเฉพาะ\r\nแรงดันลบสูงสุด ≥ 0.04 เมกะปาสคาล\r\nอัตราการไหลสูงสุด ≥ 20 ลิตรต่อนาที\r\nขวดเก็บของเหลวมีความจุ 200 มิลลิลิตร\r\nน้ำหนัก 202 กรัม', '0.00', 999, 54, '/pdimage/48.png', '2025-09-17 13:52:43', 0, NULL, '', '0.00', 1),
(1030, 'PRIMA PREMIER set ชุดตรวจหู ตา คอ จมูก\r\n', '808-820-25', 'ชุดเครื่องมือประกอบด้วย หัวตรวจตา (Ophthalmoscope), หัวตรวจหู (Otoscope), หัวตรวจคอ (Laryngeal Stem),หัวตรวจจมูก (Nasal Speculum), ด้ามจับ (Handle) และกล่องใส่ (Case)\r\nใช้กับถ่านไฟฉายขนาดกลาง (Size C) 2 ก้อน\r\n', '0.00', 999, 47, '/pdimage/46.png', '2025-09-17 13:53:59', 0, NULL, '', '0.00', 1),
(1031, 'R7 Resuscitator ชุดช่วยหายใจมือบีบ ลูกยางบีบวัสดุซิลิโคน (Durable) \r\n', '', 'R7 Resuscitator \r\nชุดช่วยหายใจมือบีบ ลูกยางบีบวัสดุซิลิโคน (Durable)\r\nลูกยางบีบซิลิโคน ถุงสํารองออกซิเจนซิลิโคน\r\nใช้ซํ้าได้ (Reusable)\r\nสําหรับผู้ใหญ่  ,เด็กและทารก \r\nรหัส AR0011 Resuscitator, Adult, w/Mask (สำหรับผู้ใหญ่)\r\nรหัส AR0067 Resuscitator, Child, w/Mask, Reservoir (สำหรับเด็กโต)\r\nรหัส AR0070 Resuscitator, Infant, w/Mask (สำหรับเด็กเล็ก)\r\n', '0.00', 999, 37, '/pdimage/2.png', '2025-09-17 14:58:51', 0, NULL, NULL, '0.00', 1),
(1032, 'OM Oxygen Mask หน้ากากสำหรับให้ออกซิเจน สายออกซิเจน ความยาว 2 เมตร พร้อมข้อต่อ\r\n', '', 'OM Oxygen Mask \r\nหน้ากากสำหรับให้ออกซิเจน \r\nหน้ากากสำหรับให้ออกซิเจน สายออกซิเจน ความยาว 2 เมตร พร้อมข้อต่อ\r\nรหัส 3644 OM-2 Oxygen Mask Child w/Tubing (สำหรับเด็กโต)\r\nรหัส 3645 OM-2 Oxygen Mask Adult w/Tubing (สำหรับผู้ใหญ่)\r\n', '0.00', 999, 38, '/pdimage/3.png', '2025-09-17 14:59:32', 0, NULL, NULL, '0.00', 1),
(1033, 'Hi-Oxygen Mask หน้ากากให้ออกซิเจน พร้อมถุงเก็บออกซิเจนสำรอง \r\n', '', 'Hi-Oxygen Mask \r\nหน้ากากให้ออกซิเจน พร้อมถุงเก็บออกซิเจนสำรอง \r\nรหัส 3656 OM-1 Hi-Oxygen Mask Infant w/Tubing (สำหรับเด็กเล็ก)\r\nรหัส 3675 OM-2 Hi-Oxygen Mask Adult w/Tubing (สำหรับผู้ใหญ่)\r\nรหัส 3678 OM-2 Hi-Oxygen Mask Child w/Tubing (สำหรับเด็กโต)\r\n', '0.00', 999, 40, '/pdimage/4.png', '2025-09-17 15:01:09', 0, NULL, NULL, '0.00', 1),
(1034, 'Neb.Easy Nebulizer ชุดพ่นละอองยา\r\n', '', 'Neb.Easy Nebulizer \r\nชุดพ่นละอองยา \r\nรหัส 3566 Neb-Easy Nebulizer Mask Infant (สำหรับเด็กเล็ก)\r\nรหัส 3569 Neb-Easy Nebulizer Mask Adult (สำหรับผู้ใหญ่)\r\nรหัส 3570 Neb-Easy Nebulizer Mask Child w/mask, nebulizer & tubing (สำหรับเด็กโต)\r\nรหัส 3571 Neb-Easy Nebulizer Mask Adult, w/AM-2 Mask &Fits-all tubing (สำหรับผู้ใหญ่)\r\nรหัส 3574 Neb-Easy Nebulizer Mask Child, Fits-all connector (สำหรับเด็กโต)\r\n', '0.00', 999, 40, '/pdimage/5.png', '2025-09-17 15:01:45', 0, NULL, NULL, '0.00', 1),
(1035, 'Trachea Mask หน้ากากสำหรับผู้ป่วยเจาะคอ \r\n', '', 'Trachea Mask หน้ากากสำหรับผู้ป่วยเจาะคอ \r\nรหัส 5201 AM-4 Trachea Mask Child (สำหรับเด็ก)\r\nรหัส 5202 AM-4 Trachea Mask Adult (สำหรับผู้ใหญ่)\r\nรหัส 5203 OM-4 Trachea Mask Child w/Tubing (สำหรับเด็ก)\r\nรหัส 5204 OM-4 Trachea Mask Adult w/Tubing (สำหรับผู้ใหญ่)\r\n', '0.00', 999, 40, '/pdimage/6.png', '2025-09-17 15:02:20', 0, NULL, NULL, '0.00', 1),
(1036, 'AM-2 Aerosol Mask หน้ากากสำหรับพ่นละอองยา ทำจากโพลีไวนิลคลอไรด์ \r\n', '', 'AM-2 Aerosol Mask \r\nหน้ากากสำหรับพ่นละอองยา ทำจากโพลีไวนิลคลอไรด์ \r\nรหัส 3733 AM-2 Aerosol Mask Adult (สำหรับผู้ใหญ่)\r\n', '0.00', 999, 40, '/pdimage/7.png', '2025-09-17 15:03:22', 0, NULL, NULL, '0.00', 1),
(1037, 'Softip Nasal Cannula ท่อให้ออกซิเจนทางรูจมูก\r\n', '', 'Softip Nasal Cannula\r\nท่อให้ออกซิเจนทางรูจมูก\r\nรหัส  3232 Softip-1 Nasal Cannula Child (สำหรับเด็ก)\r\nรหัส  3240 Softip-3 Nasal Cannula Infant (สำหรับเด็กเล็ก)\r\n', '0.00', 999, 40, '/pdimage/8.png', '2025-09-17 15:05:16', 0, NULL, NULL, '0.00', 1),
(1038, 'Peak Expiratory Flow Meter อุปกรณ์ทดสอบสมรรถภาพปอด\r\n', '', 'Peak Expiratory Flow Meter \r\nเครื่องวัดอัตราลมหายใจออกสำหรับผู้ป่วย\r\nคุณสมบัติ\r\nใช้สำหรับตรวจทดสอบสมรรถภาพการทำงานของปอด วัดก่อนและหลังให้ยา สำหรับผู้ป่วยโรค หอบหืด ถุงลมโป่งพอง และโรคอื่นๆ ในระบบทางเดินหายใจ\r\nขนาดเล็กกะทัดรัด พกพาสะดวก\r\nช่วงการวัด 60-800 LPM\r\nความละเอียดในการอ่านค่า 50 LPM\r\n\r\nรหัส  4121 Peak flow Meter Adult 0-800 LPM (สำหรับผู้ใหญ่)\r\nรหัส  4131 Peak Flow Meter Child 0-300 LPM (สำหรับเด็ก)\r\n', '0.00', 999, 41, '/pdimage/9.png', '2025-09-17 15:06:05', 0, NULL, NULL, '0.00', 1),
(1039, 'Oxygen Tubing สายออกซิเจนแบบ Kink resistance \r\n', '', 'Oxygen Tubing \r\nสายออกซิเจนแบบ Kink resistance \r\nรหัส 0007 OXYGEN TUBING', '0.00', 999, 40, '/pdimage/10.png', '2025-09-17 15:06:33', 0, NULL, NULL, '0.00', 1),
(1040, 'VIXONE Pediatric ชุดหน้ากากพ่นละอองยารูปการ์ตูน สำหรับเด็ก\r\n', '', 'VIXONE Pediatric \r\nชุดหน้ากากพ่นละอองยารูปการ์ตูน สำหรับเด็ก\r\nชุดหน้ากากและสายพ่นละอองยา \r\nหน้ากากรูปการ์ตูนให้เด็กผ่อนคลาย\r\nพ่นยาในมุมเอียงได้ถึง 45°\r\nรหัส 0312  VixOne Superspike Nebulizer Mask Kit (Kink resistant) \r\nรหัส 0313 VixOne Superspike Nebulizer Mask Kit (Threaded Nut)\r\n', '0.00', 999, 40, '/pdimage/11.png', '2025-09-17 15:07:15', 0, NULL, NULL, '0.00', 1),
(1041, 'RBP-100 Blood Pressure Monitor เครื่องวัดความดันระบบดิจิทัล มีแบบตั้งโต๊ะ ตั้งพื้น และติดผนัง\r\n', '', 'RBP-100 Blood Pressure Monitor \r\nเครื่องวัดความดันระบบดิจิตอล\r\nวัดความดัน Systolic, Diastolic, ชีพจร\r\nสามารถบันทึกข้อมูลได้ 210 ค่า\r\nรหัส  1740 Table Model  แบบตั้งโต๊ะ\r\nรหัส  1741 Mobile Model  แบบตั้งพื้น\r\nรหัส  1742 Wall Mode  แบบติดผนัง\r\n', '0.00', 999, 42, '/pdimage/12.png', '2025-09-17 15:07:49', 0, NULL, NULL, '0.00', 1),
(1042, 'big ben sphygmomanometer เครื่องวัดความดันแบบเข็ม\r\n', '', 'big ben sphygmomanometer เครื่องวัดความดันแบบเข็ม\r\nเครื่องวัดความดันโลหิตแบบเข็ม\r\nอ่านค่าได้ตั้งแต่ 0-300 มม.ปรอท \r\nทนแรงดันได้ถึง 600 มม.ปรอท\r\nหน้าปัดขนาดใหญ่ อ่านค่าง่าย \r\nวัสดุ Latex-free \r\nรหัส 1453 big ben round desk แบบตั้งโต๊ะ\r\nรหัส 1465 big ben square wall แบบติดผนัง\r\nรหัส 1478 big ben square floor แบบตั้งพื้น\r\n', '0.00', 999, 42, '/pdimage/13.png', '2025-09-17 15:08:32', 0, NULL, NULL, '0.00', 1),
(1043, 'Precisa N shock-proof sphygmomanometer เครื่องวัดความดันโลหิตแบบเข็ม\r\n', '', 'เครื่องวัดความดันโลหิตแบบเข็ม ชนิดพกพา  รุ่น  Precisa N shock-proof sphygmomanometer \r\nคุณสมบัติทางเทคนิค\r\nสเกลบนหน้าปัดแสดงช่วงการวัดตั้งแต่ 0-300 มม.ปรอท ความละเอียด 2 มม.ปรอท\r\nความคลาดเคลื่อนไม่เกิน + 3 มม.ปรอท \r\nทนทานต่อการตกกระแทกที่ความสูง 1 เมตร\r\nอุปกรณ์มีความแข็งแรงทนทาน สามารถรองรับความดันได้ถึง 600 มม. ปรอท \r\nมี Microfilter ป้องกันสิ่งสกปรกเข้าสู่วาล์วและตัวเครื่อง ช่วยยืดอายุการใช้งาน\r\n\r\nรหัส 1364-107 precisa N shock-proof, velcro cuff adult size, 1 tube\r\n', '0.00', 999, 42, '/pdimage/14.png', '2025-09-17 15:09:19', 0, NULL, NULL, '0.00', 1),
(1044, 'e-mega sphygmomanometer เครื่องวัดความดันโลหิตแบบเข็ม \r\n', '', 'เครื่องวัดความดันโลหิตแบบเข็ม  รุ่น  e-mega sphygmomanometer\r\nคุณสมบัติทางเทคนิค\r\nหน้าปัดขนาด ø 63 มิลลิเมตร\r\nมีไมโครฟิลเตอร์ป้องกัันฝุ่น\r\nมีสองสี ขาวและดํา\r\nรหัส 1370-150 e-mega white, disinfectable one-piece cuff, adult size, 1-tube, latex free \r\nรหัส 1375-150 e-mega black, disinfectable one-piece cuff, adult size, 1-tube, latex free\r\n', '0.00', 999, 42, '/pdimage/15.png', '2025-09-17 15:10:05', 0, NULL, NULL, '0.00', 1),
(1045, 'R1 shock-proof sphygmomanometer เครื่องวัดความดันโลหิตแบบเข็ม\r\n', '', 'เครื่องวัดความดันโลหิตแบบเข็ม  รุ่น  R1 shock-proof sphygmomanometer \r\nคุณสมบัติทางเทคนิค\r\nเครื่องวัดความดันโลหิตแบบเข็มทนต่อการตกกระแทกจากที่สูง ค่าผิดพลาดสูงสุดเพียง ± 3 มม.ปรอท \r\nหน้าปัดขนาด ø 52 มิลลิเมตร\r\nทนทานต่อการตกจากที่สูงระดับ 1.2 เมตร\r\nรหัส 1251-107 R1 shock-proof white, 1-tube, velcro cuff adult size\r\n', '0.00', 999, 42, '/pdimage/16.png', '2025-09-17 15:11:07', 0, NULL, NULL, '0.00', 1),
(1046, 'Precisa N sphygmomanometer เครื่องวัดความดันโลหิตแบบเข็ม\r\n', '', 'Precisa N sphygmomanometer\r\nเครื่องวัดความดันโลหิตแบบเข็ม  \r\nคุณสมบัติทางเทคนิค\r\nวัสดุอะลูมิเนียมและสแตนเลส อ่านค่าได้ตั้งแต่ 0-300 มม.ปรอท ทนแรงดันได้ถึง 600 มม.ปรอท \r\nรหัส 1362 precisa N aluminium, adult size velcro cuff, 1 tube\r\n', '0.00', 999, 42, '/pdimage/17.png', '2025-09-17 15:11:50', 0, NULL, NULL, '0.00', 1),
(1047, 'Air Pro 3000 Plus Nebulizer เครื่องพ่นละอองยา \r\n', '', 'Air Pro 3000 Plus Nebulizer \r\nเครื่องพ่นละอองยา\r\nคุณสมบัติทางเทคนิค \r\nอัตราการไหลของอากาศ 14 l/min, แรงดันสูงสุด 3.5±0.5 บาร์ \r\nอัตราการพ่นละอองยา 0.29 (min) และ 0.65 (max) มล./นาที เมื่อใช้งานที่แรงดัน 1.45 bar \r\nนํ้าหนักโดยประมาณ 2.4 กก.\r\n\r\n', '0.00', 999, 43, '/pdimage/18.png', '2025-09-17 15:12:32', 0, NULL, NULL, '0.00', 1),
(1048, 'CO03P00 Lella the Ladybug เครื่องพ่นละอองยา  \r\n', '', 'CO03P00 Lella the Ladybug \r\nเครื่องพ่นละอองยา  \r\nคุณสมบัติทางเทคนิค\r\nอัตราการไหลของอากาศ 10 l/min, แรงดันสูงสุด 2.5 บาร์,\r\nอัตราการ พ่นละอองยา 0.32 (standard) และ 0.42 (high speed) มล./นาที', '0.00', 999, 43, '/pdimage/19.png', '2025-09-17 15:13:03', 0, NULL, NULL, '0.00', 1),
(1049, 'DF30P00 Delphinus nebulizer เครื่องพ่นละอองยา\r\n', '', 'DF30P00 Delphinus nebulizer \r\nเครื่องพ่นละอองยา \r\nคุณสมบัติทางเทคนิค\r\nอัตราการไหลของอากาศ 10 ลิตร/นาที, แรงดันสูงสุด 2.6±0.4 บาร์ \r\nอัตราการพ่นละอองยา 0.23 (min) และ 0.53 (max) มล./นาที \r\nนํ้าหนักโดยประมาณ 2.1 กิโลกรัม', '0.00', 999, 43, '/pdimage/20.png', '2025-09-17 15:13:36', 0, NULL, NULL, '0.00', 1),
(1050, 'EL37P00 Nebulair+ Nebulizer เครื่องพ่นละอองยา\r\n', '', 'EL37P00 Nebulair+ Nebulizer \r\nเครื่องพ่นละอองยา \r\nคุณสมบัติทางเทคนิค\r\nอัตราการไหลของอากาศ 14 l/min, แรงดันสูงสุด 3.5±0.5 บาร์ \r\nอัตราการพ่นละอองยา 0.29 (min) และ 0.65 (max) มล./นาที \r\nนํ้าหนักโดยประมาณ 2.4 กิโลกรัม', '0.00', 999, 43, '/pdimage/21.png', '2025-09-17 15:14:10', 0, NULL, NULL, '0.00', 1),
(1051, 'MA125C Foam mattress ที่นอนโฟม\r\n', '', 'MA125C CareTek Foam mattress \r\nที่นอนโฟม \r\nคุณสมบัติทางเทคนิค\r\nผ้าคลุมวัสดุโพลียูริเทน รองรับน้ำหนักผู้ป่วยได้ถึง 120 กก. \r\nMA125C CareTek Foam mattress', '0.00', 999, 44, '/pdimage/22.png', '2025-09-17 15:14:58', 0, NULL, NULL, '0.00', 1),
(1052, 'HT110P CareTek Overbed Table โต๊ะคร่อมเตียง \r\n', '', 'HT110P CareTek Overbed Table \r\nโต๊ะคร่อมเตียง \r\nคุณสมบัติทางเทคนิค\r\nปรับความสูงได้ 78-109 ซม. น้ำหนัก 10 กก. \r\nรองรับน้ำหนักได้ 45 กก. วัสดุโพลีเมอร์ ', '0.00', 999, 45, '/pdimage/23.png', '2025-09-17 15:15:33', 0, NULL, NULL, '0.00', 1),
(1053, 'KHT-430B Micro Hematocrit Centrifuge เครื่องปั่นหาเปอร์เซ็นเม็ดเลือดแดงอัดแน่น\r\n', '', 'KHT-430B Micro Hematocrit Centrifuge\r\nเครื่องปั่นหาเปอร์เซ็นเม็ดเลือดแดงอัดแน่น\r\nคุณสมบัติทางเทคนิค\r\nความเร็วรอบในการปั่นสูงสุด 12,000-13,000 รอบ/นาที RCF 14,490-17,005 xg\r\nระบบเบรกอัตโนมัติ \r\nสามารถบรรจุหลอดคาปิราลีได้ 24 หลอด\r\nน้ำหนัก 16 กก.', '0.00', 999, 46, '/pdimage/24.png', '2025-09-17 15:16:43', 0, NULL, NULL, '0.00', 1),
(1054, 'PLC-012E Universal Centrifuge เครื่องปั่นเหวี่ยงตกตะกอน\r\n', '', 'PLC-012E Universal Centrifuge \r\nเครื่องปั่นเหวี่ยงตกตะกอน\r\nคุณสมบัติทางเทคนิค\r\nใช้กับหัวปั่นได้หลายแบบ สวิตช์เบรกไฟฟ้า \r\nความเร็วรอบในการปั่นสูงสุด 12,000 รอบ/นาที\r\nน้ำหนัก 15 กก.', '0.00', 999, 46, '/pdimage/25.png', '2025-09-17 15:17:18', 0, NULL, NULL, '0.00', 1),
(1055, 'pen-scope otoscope/ophthalmoscope ชุดตรวจหู ตา \r\n', '', 'pen-scope otoscope/ophthalmoscope \r\nชุดตรวจหู ตา \r\nคุณสมบัติทางเทคนิค\r\nชุดตรวจหู ตา\r\nด้าม Battery handle type AA, สีดำ\r\nรหัส  2090-200 pen-scope oto-/ophthalmoscope vacuum 2.7 V/XL 2.5 V, black, in pouch\r\n', '0.00', 999, 47, '/pdimage/26.png', '2025-09-17 15:17:56', 0, NULL, NULL, '0.00', 1),
(1056, 'Econom for ENT and ophthalmology ชุดตรวจหู ตา คอ จมูก\r\n', '', 'Econom for ENT and ophthalmology \r\nชุดตรวจหู ตา คอ จมูก  รหัส  2050 econom vacuum 2.7 V, C-handle\r\nคุณสมบัติทางเทคนิค\r\nชุดตรวจหู ตา คอ จมูก\r\nด้าม Battery handle type C  ใช้กับถ่านไฟฉายขนาดกลาง (Size C) 2 ก้อน\r\nชุดตรวจหู (Otoscope)\r\nเลนซ์กระจก กำลังขยาย 3 เท่า\r\nชุดตรวจตา (Ophthalmoscope)\r\nใช้หลอดไฟซีนอน-ขาวนวล ปรับได้ตั้งแต่ –20 ถึง +20\r\nชุดตรวจคอ\r\nใช้ร่วมกับกระจกส่องตรวจ No.3 และ No.4 \r\nชุดตรวจจมูก (Nasal speculum)\r\nมีปุ่มปรับเพิ่ม-ลดแสงสว่างได้  \r\n\r\n', '0.00', 999, 47, '/pdimage/27.png', '2025-09-17 15:18:45', 0, NULL, NULL, '0.00', 1),
(1057, 'ri-scope perfect ชุดตรวจหู ตา คอ จมูก, หลอดไฟ 3.5V LED \r\n', '', 'ri-scope perfect \nชุดตรวจหู ตา คอ จมูก, หลอดไฟ 3.5V LED\nคุณสมบัติทั่วไป\nหลอดไฟสำหรับหัวตรวจเป็น LED 3.5 V สว่าง \nใช้กับถ่านชาร์จ รุ่น ri-accu® L หรือ ใช้กับถ่านอัลคาไลน์ขนาดกลาง (Size C) 2 ก้อน\nบรรจุในกล่องพลาสติกอย่างดี\nรหัส  3819-203 ri-scope perfect Oto- L3/Ophthalmo. L2, LED 3.5V, C handle for ri-accu L', '0.00', 999, 47, '/pdimage/28.png', '2025-09-17 15:19:24', 0, NULL, NULL, '0.00', 1),
(1058, 'ri-pen Diagnostic pupil penlight ปากกาส่องตรวจ\r\n', '', 'ri-pen Diagnostic pupil penlight \r\nปากกาส่องตรวจ\r\nคุณสมบัติทางเทคนิค\r\nไฟส่องสว่างแบบ LED \r\nวัสดุอะลูมิเนียม พร้อมคลิปหนีบโลหะ \r\nรหัส 5075-526 ri-pen, black \r\nรหัส 5074-526 ri-pen, silver \r\nรหัส 5077 ri-pen, red 5071 ri-pen, blue \r\nรหัส 5078 ri-pen, purple \r\nรหัส 5072-526 ri-pen, green\r\n', '0.00', 999, 48, '/pdimage/29.png', '2025-09-17 15:20:58', 0, NULL, NULL, '0.00', 1),
(1059, 'duplex Stethoscope หูฟังทางการแพทย์สำหรับใช้งานทั่วไป \r\n', '', 'duplex Stethoscope \r\nหูฟังทางการแพทย์สำหรับใช้งานทั่วไป \r\nคุณสมบัติทางเทคนิค\r\nวัสดุทองเหลืองชุบโครเมียม Membrane Ø 48 มม. / Bell Ø 36 มม.\r\n \r\nรหัส 4011-01 Stethoscope duplex, black, chrome plated \r\nรหัส 4011-02 Stethoscope duplex, slate grey, chrome plated \r\nรหัส 4011-03 Stethoscope duplex, blue, chrome plated\r\n', '0.00', 999, 49, '/pdimage/30.png', '2025-09-17 15:21:32', 0, NULL, NULL, '0.00', 1),
(1060, 'duplex 2.0 Stethoscope หูฟังทางการแพทย์สำหรับใช้งานทั่วไป \r\n', '', 'duplex 2.0 Stethoscope \r\nหูฟังทางการแพทย์สำหรับใช้งานทั่วไป \r\nคุณสมบัติทางเทคนิค\r\nมี 2 วัสดุให้เลือกใช้ สแตนเลส หรือ อะลูมิเนียม มีหลายสีให้เลือก\r\nหัวตรวจแบบ Double chest-piece ขนาดเมมเบรน Ø 44 มม. \r\nนํ้าหนักโดยประมาณ 151 กรัม (แสตนเลส) และ 97 กรัม (อะลูมิเนียม)- วัสดุอุปกรณ์เป็นชนิด Latex-free\r\nวัสดุสแตนเลส/อะลูมิเนียม Membrane Ø 44 มม. \r\n\r\nรหัส 4210-01 duplex 2.0, stainless steel, black \r\nรหัส 4210-03–4210-04 duplex 2.0, stainless steel, white \r\nรหัส 4210-03–4210-04 duplex 2.0, stainless steel, blue \r\nรหัส 4210-04–4210-04 duplex 2.0, stainless steel, red \r\nรหัส 4200-02 duplex 2.0, Aluminium, white \r\nรหัส 4200-03 duplex 2.0, Aluminium, blue \r\nรหัส 4201-01 duplex 2.0, Aluminium, special edition black\r\n', '0.00', 999, 49, '/pdimage/31.png', '2025-09-17 15:22:16', 0, NULL, NULL, '0.00', 1),
(1061, 'duplex 2.0 baby Stethoscope หูฟังทางการแพทย์สำหรับเด็ก\r\n', '', 'duplex 2.0 baby Stethoscope \r\nหูฟังทางการแพทย์สําหรับเด็กและเด็กเล็ก\r\nคุณสมบัติทางเทคนิค\r\nวัสดุสแตนเลส มี 2 สีให้เลือก แดง และ เขียว\r\nหัวตรวจแบบ Double chest-piece ขนาดเมมเบรน Ø 32 มม., ด้าน Bell Ø 23.5 มม.\r\nนํ้าหนักโดยประมาณ 124 กรัม\r\nวัสดุอุปกรณ์เป็นชนิด Latex-free\r\n\r\nรหัส 4220-04 duplex 2.0 baby, stainless steel, red \r\nรหัส 4220-05 duplex 2.0 baby, stainless steel, green\r\n', '0.00', 999, 49, '/pdimage/32.png', '2025-09-17 15:22:58', 0, NULL, NULL, '0.00', 1),
(1062, 'RVS-100 Vital Signs Monitor เครื่องวัดความดันโลหิตและวัดความอิ่มตัวออกซิเจนและวัดอุณหภูมิร่างกาย\r\n', '', 'RVS-100 Vital Signs Monitor \r\nเครื่องวัดความดันโลหิตและวัดความอิ่มตัวออกซิเจนและวัดอุณหภูมิร่างกายสามารถวัดความดัน, อัตราชีพจร, ออกซิเจนในเลือด, อุณหภูมิ \r\n\r\nรหัส 1960-RRXXU RVS-100, NIBP (Riester) + SpO2 (Riester) \r\nรหัส 1960-RRBXU RVS-100, NIBP (Riester) + SpO2 (Riester) + Predictive Temperature\r\n', '0.00', 999, 42, '/pdimage/33.png', '2025-09-17 15:24:12', 0, NULL, NULL, '0.00', 1),
(1063, 'Graeve Vaginal Speculum อุปกรณ์ส่องตรวจช่องคลอด \r\n', '', 'Graeve Vaginal Speculum \r\nอุปกรณ์ส่องตรวจช่องคลอด \r\nคุณสมบัติทางเทคนิค\r\nวัสดุสแตนเลส Autoclave ได้ถึง 134°C \r\n\r\n5201 graeve Fig. 1 (75 x 20 มม.) \r\n5202 graeve Fig. 2 (95 x 35 มม.) \r\n5203 graeve Fig. 3 (115 x 35 มม.)\r\n', '0.00', 999, 50, '/pdimage/34.png', '2025-09-17 15:24:51', 0, NULL, NULL, '0.00', 1),
(1064, 'Pneumatic Tourniquet ชุดรัดแขนขาเพื่อห้ามเลือด \r\n', '', 'Pneumatic Tourniquet รุ่น  5255\r\nชุดรัดแขนขาเพื่อห้ามเลือด \r\nคุณสมบัติทางเทคนิค\r\nอุปกรณ์บีบถุงเลือดหรือสารละลาย วัสดุผ้าฝ้าย\r\nมาโนมิเตอร์วัสดุเหล็กชุบโครเมียม อ่านค่าได้ถึง 700 มม.ปรอท ', '0.00', 999, 42, '/pdimage/35.png', '2025-09-17 15:25:27', 0, NULL, NULL, '0.00', 1),
(1065, 'metpak pressure infusion cuff อุปกรณ์บีบถุงเลือดหรือสารละลาย\r\n', '', 'metpak pressure infusion cuff \r\nอุปกรณ์บีบถุงเลือดหรือสารละลาย วัสดุผ้าฝ้าย \r\nคุณสมบัติทางเทคนิค\r\nอุปกรณ์บีบถุงเลือดหรือสารละลาย \r\nวัสดุผ้าฝ้าย \r\n\r\n5270 metpak 500 ml \r\n5275 metpak 1000 ml \r\n5270-536 metpak 3000 ml\r\n', '0.00', 999, 51, '/pdimage/36.png', '2025-09-17 15:26:14', 0, NULL, NULL, '0.00', 1),
(1066, 'The ri-clip vein compressor สายรัดแขนสำหรับเจาะเลือด \r\n', '', 'The ri-clip vein compressor \r\nสายรัดแขนสำหรับเจาะเลือด \r\nคุณสมบัติทางเทคนิค\r\nสายรัดแขนสำหรับเจาะเลือด \r\nสามารถนำไปฆ่าเชื้อโดย Autoclave ได้ที่ 120° C/1 bar\r\n\r\n5000 ri-clip\r\n', '0.00', 999, 52, '/pdimage/37.png', '2025-09-17 15:26:54', 0, NULL, NULL, '0.00', 1),
(1067, 'ri-standard Laryngoscope ชุดส่องหลอดลม\r\n', '', 'ri-standard Laryngoscope \nชุดส่องหลอดลม  รุ่น 7040 ri-standard set Macintosh, with C-handle\nคุณสมบัติทั่วไป \n1.เป็นชุดเครื่องมือส่องหลอดลมแบบ CONVENTIONAL (หลอดไฟอยู่ที่ปลายแผ่นส่องตรวจ) \n2.ออกแบบง่ายต่อการใส่ท่อช่วยหายใจและการส่องตรวจ 3. ใช้ถ่านไฟฉายขนาดกลาง (SIZE C) 2 ก้อน \nคุณลักษณะทางเทคนิค \n1.หลอดไฟสูญญากาศ 2.7 โวลต์ อยู่ที่ปลายแผ่นส่องตรวจ \n2.สวิทซ์จะทำงานเมื่อประกอบแผ่นส่องตรวจ (BLADE) เข้ากับด้ามถือ \n3.ด้ามถือเป็นโลหะชุบโครเมียม และแผ่นส่องตรวจเป็น Stainless steel \n4.แผ่นส่องตรวจสามารถ autoclaved ที่ 134 ° C / 273 ° F เป็นเวลา 5 นาที \n5.ฝาปิดด้ามเป็นแบบเกลียวหมุนปิดสนิทใช้งานง่าย สะดวกในการเปลี่ยนถ่าน ทำความสะอาดและดูแลรักษาง่าย \n6.สามารถใช้ประกอบกับชุดส่องตรวจหลอดลมที่เป็นผลิตภัณฑ์มาตรฐานสากล ISO 7376 ได้ทุกยี่ห้อ \n7.แผ่นส่องตรวจมี 3 ขนาด \nแผ่นส่องตรวจแบบโค้ง เบอร์ 2 จำนวน 1 อัน \nแผ่นส่องตรวจแบบโค้ง เบอร์ 3 จำนวน 1 อัน \nแผ่นส่องตรวจแบบโค้ง เบอร์ 4 จำนวน 1 อัน', '0.00', 999, 53, '/pdimage/38.png', '2025-09-17 15:27:32', 0, NULL, NULL, '0.00', 1),
(1068, 'ri-module Laryngoscope ชุดส่องหลอดลม\r\n', '', 'ri-module Laryngoscope \r\nชุดส่องหลอดลม \r\nชุดส่องหลอดลมพร้อมเบลดและด้าม \r\nBattery handle แบบ F.O. \r\nรหัส 8080 ri-modul set Macintosh XL 2.5 V with C-handle and blades 2, 3, 4 \r\nรหัส 8140 ri-modul Macintosh F.O. XL 3.5V with C-handle and blades 2, 3, 4 + ri-accu L + ri-charger L 230V \r\nรหัส 8081 ri-modul Macintosh F.O. LED 2.5V with C-handle not rechargeable and blades 2, 3, 4 \r\nรหัส 8142 ri-modul Macintosh F.O. LED 3.5V with C-handle and blades 2, 3, 4 + ri-accu L + ri-charger L 230V\r\n', '0.00', 999, 53, '/pdimage/39.png', '2025-09-17 15:28:42', 0, NULL, NULL, '0.00', 1),
(1069, 'ri-module Laryngoscope ชุดส่องหลอดลม', '', 'ri-integral Laryngoscope \r\nชุดส่องหลอดลม\r\nชุดส่องหลอดลมพร้อมเบลดและด้าม \r\nBattery handle แบบ F.O. \r\n\r\nรหัส 8040 ri-integral set Macintosh XL 2.5 V, with C-handle, blades 2, 3, 4 \r\nรหัส 8120 ri-integral Macintosh F.O. XL 3.5V with C-handle and blades 2, 3, 4 + ri-accu L + ri-charger L 230V \r\nรหัส 8041 ri-integral Macintosh F.O. LED 2.5V with C-handle not rechargeable and blades 2, 3, 4 \r\nรหัส 8122 ri-integral Macintosh F.O. LED 3.5V with C-handle and blades 2, 3, 4 + ri-accu L + ri-charger L 230V\r\n', '0.00', 999, 53, '/pdimage/40.png', '2025-09-17 15:29:22', 0, NULL, NULL, '0.00', 1),
(1070, 'ri-modul Miller F.O. blade เบลดตรงส่องหลอดลม แบบ Fiber optic (ไม่หุ้มท่อ) \r\n', '', 'ri-modul Miller F.O. blade \r\nเบลดตรงส่องหลอดลม แบบ Fiber optic (ไม่หุ้มท่อ) \r\nรหัส 12274  Size 00\r\nรหัส 12275  Size 0\r\nรหัส 12276  Size 1\r\nรหัส 12277  Size 2\r\nรหัส 12278  Size 3\r\nรหัส 12279  Size 4\r\n', '0.00', 999, 53, '/pdimage/41.png', '2025-09-17 15:29:49', 0, NULL, NULL, '0.00', 1),
(1071, 'ri-modul Macintosh F.O. blade เบลดโค้งส่องหลอดลม แบบ Fiber optic (ไม่หุ้มท่อ) \r\n', '', 'ri-modul Macintosh F.O. blade \r\nเบลดโค้งส่องหลอดลม แบบ Fiber optic (ไม่หุ้มท่อ) \r\nรหัส 12260  Size 0\r\nรหัส 12261  Size 1\r\nรหัส 12262  Size 2\r\nรหัส 12263  Size 3\r\nรหัส 12264  Size 4\r\n', '0.00', 999, 53, '/pdimage/42.png', '2025-09-17 15:30:44', 0, NULL, NULL, '0.00', 1),
(1072, 'ri-integral Miller F.O. BLADE เบลดตรงส่องหลอดลม แบบ Fiber optic (หุ้มท่อ) \r\n', '', 'ri-integral Miller F.O. BLADE \r\nเบลดตรงส่องหลอดลม แบบ Fiber optic (หุ้มท่อ) \r\nรหัส 12240  Size 00\r\nรหัส 12241  Size 0\r\nรหัส 12242  Size 1\r\nรหัส 12243  Size 2\r\nรหัส 12244  Size 3\r\nรหัส 12245  Size 4\r\n', '0.00', 999, 53, '/pdimage/43.png', '2025-09-17 15:31:13', 0, NULL, NULL, '0.00', 1),
(1073, 'ri-integral Macintosh F.O. BLADEเบลดโค้งส่องหลอดลม แบบ Fiber optic (หุ้มท่อ) \r\n', '', 'ri-integral Macintosh F.O. BLADE\r\nเบลดโค้งส่องหลอดลม แบบ Fiber optic (หุ้มท่อ) \r\nรหัส 12230  Size 00\r\nรหัส 12231  Size 0\r\nรหัส 12232  Size 1\r\nรหัส 12233  Size 2\r\nรหัส 12234  Size 3\r\nรหัส 12235  Size 4\r\n', '0.00', 999, 53, '/pdimage/44.png', '2025-09-17 15:31:44', 0, NULL, NULL, '0.00', 1),
(1074, 'Battery handles for F.O. laryngoscope ด้ามแบตเตอรี่สำหรับชุดส่องหลอดลม แบบ Fiber Optic', '', 'Battery handles for F.O. laryngoscope \r\nด้ามแบตเตอรี่สำหรับชุดส่องหลอดลม แบบ Fiber Optic \r\nรหัส 12301 C-handle XL 3.5 V diam. 28 mm rechargeable for blades with integrated or detachable F.O. \r\nรหัส 12306 AA-handle XL 2.5 V diam. 19 mm not rechargeable for blades with integrated or detachable F.O. \r\nรหัส 12305 C-handle XL 2.5 V diam. 28 mm not rechargeable for blades with integrated or detachable F.O. \r\nรหัส 12309 AA-handle diam. 32 mm short not rechargeable, XL 2.5 V for blades with F.O. \r\nรหัส 12311 C-handle with 2.5V high performance LED, for F.O. laryngoscopes+ri-dispo, not rechargeable \r\nรหัส 12312 AA-handle with 2.5V high performance LED, for F.O. laryngoscopes+ri-dispo, not rechargeable \r\nรหัส 12314 C-handle with 3.5V high performance LED, for F.O. laryngoscopes+ri-dispo, rechargeable\r\n', '0.00', 999, 53, '/pdimage/45.png', '2025-09-17 15:32:19', 0, NULL, NULL, '0.00', 1),
(1075, 'Portable Phlegm Suction Unit เครื่องดูดเสมหะ \r\n', '', 'Portable Phlegm Suction Unit \r\nเครื่องดูดเสมหะ \r\nเครื่องดูดเสมหะ รุ่น 7E-A และ 7E-D (มีแบตเตอรี่) \r\nอัตราการดูดเสมหะ ≥ 15 ลิตร/นาที \r\nแรงดันลบในการดูดสูงสุด ≥ 0.075 เมกะปาสค\r\nรุ่น 7E-A\r\nรุ่น 7E-D (มีแบตเตอรี่)\r\n', '0.00', 999, 54, '/pdimage/47.png', '2025-09-17 15:33:02', 0, NULL, NULL, '0.00', 1),
(1077, 'Indicator Tape Plasma (Sterilization)เป็นเทปกาวที่บ่งชี้ทางเคมีใช้สำหรับติดผ้าห่อเครื่องมือทางการแพทย์\r\n', '', 'Indicator Tape Plasma (Sterilization)\r\nเป็นเทปกาวที่บ่งชี้ทางเคมีใช้สำหรับติดผ้าห่อเครื่องมือทางการแพทย์ที่ใช้ในการทำให้ปราศจากเชื้อ หากได้รับการสเตอไรด์แล้วก็จะเปลี่ยนสีไปตามที่กำหนด\r\nIndicator Tape | PLASMA จะเปลี่ยนจากสีม่วงเป็นสีแดง\r\nมีขนาด\r\n12 มิลิเมตร x ความยาว 50 เมตร\r\n19 มิลิเมตร x ความยาว 50 เมตร\r\n25 มิลิเมตร x ความยาว 50 เมตร', '0.00', 999, 61, '/pdimage/66.jpg', '2025-09-17 15:52:49', 0, NULL, NULL, '0.00', 1),
(1078, 'Indicator Tape EO  (Sterilization) เป็นเทปกาวที่บ่งชี้ทางเคมีใช้สำหรับติดผ้าห่อเครื่องมือทางการแพทย์\r\n', '', 'Indicator Tape EO  (Sterilization)\r\nเป็นเทปกาวที่บ่งชี้ทางเคมีใช้สำหรับติดผ้าห่อเครื่องมือทางการแพทย์ที่ใช้ในการทำให้ปราศจากเชื้อ หากได้รับการสเตอไรด์แล้วก็จะเปลี่ยนสีไปตามที่กำหนด\r\nIndicator Tape | EO จะเปลี่ยนจากสีน้ำตาลเป็นสีเขียว\r\nมีขนาด\r\n12 มิลิเมตร x ความยาว 50 เมตร\r\n19 มิลิเมตร x ความยาว 50 เมตร\r\n25 มิลิเมตร x ความยาว 50 เมตร', '0.00', 999, 61, '/pdimage/65.jpg', '2025-09-17 15:53:27', 0, NULL, NULL, '0.00', 1),
(1079, 'Indicator Tape  Autoclave   (Sterilization) เป็นเทปกาวที่บ่งชี้ทางเคมีใช้สำหรับติดผ้าห่อเครื่องมือทางการแพทย์\r\n', '', 'Indicator Tape  Autoclave   (Sterilization)\r\nเป็นเทปกาวที่บ่งชี้ทางเคมีใช้สำหรับติดผ้าห่อเครื่องมือทางการแพทย์ที่ใช้ในการทำให้ปราศจากเชื้อ หากได้รับการสเตอไรด์แล้วก็จะเปลี่ยนสีไปตามที่กำหนด\r\nสินค้า\r\nIndicator Tape | STEAM จะเปลี่ยนจากสีขาวนวลเป็นสีดำ\r\nมีขนาด\r\n12 มิลิเมตร x ความยาว 50 เมตร\r\n19 มิลิเมตร x ความยาว 50 เมตร\r\n25 มิลิเมตร x ความยาว 50 เมตร', '0.00', 999, 61, '/pdimage/64.jpg', '2025-09-17 15:54:06', 0, NULL, NULL, '0.00', 1),
(1080, 'Adult Sec ผ้าอ้อมผู้ใหญ่ แบบเทป ', '', 'Adult Sec ผ้าอ้อมผู้ใหญ่ แบบเทป \r\nเหมาะสำหรับผู้สูงอายุ ผู้ป่วยติดเตียง และผู้มีปัญหาปัสสาวะเล็ดหรือกลั้นปัสสาวะไม่ได้\r\nคุณสมบัติ \r\nซึมซับเร็ว  , แห้งสบาย  ,ไม่อับชื้น มีขอบขากันรั่วซึมลดแบคทีเรีย & กลิ่น\r\nมีแถบแสดงความเปียกชื้น\r\nเจล SAP ดูดซับสูง\r\nซึมซับได้ 1,200 cc\r\nขนาด\r\nไซส์ M-L 10 ชิ้น  รอบเอว 29-46 นิ้ว (74-117 ซม.)\r\nไซส์ L-XL 10 ชิ้น  รอบเอว 40-55 นิ้ว (102-140 ซม.)', '0.00', 999, 60, '/pdimage/63.jpg', '2025-09-17 15:54:40', 0, NULL, NULL, '0.00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `productpromotion`
--

CREATE TABLE `productpromotion` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `promotionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `discount` double NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `trackingNumber` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('WAITING','IN_TRANSIT','DELIVERED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('CUSTOMER','ADMIN','STAFF') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('def8cdb5-d118-4105-b347-e63551972e18', 'a1282457bfcf3c116eb575a21a3abf15a5aa8cadf104e3a4c27ddc49d481fb80', '2025-09-14 06:03:03.925', '20250914060303_init', NULL, NULL, '2025-09-14 06:03:03.629', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CartItem_userId_fkey` (`userId`),
  ADD KEY `CartItem_productId_fkey` (`productId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Category_parentId_fkey` (`parentId`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Coupon_code_key` (`code`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `productpromotion`
--
ALTER TABLE `productpromotion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductPromotion_productId_fkey` (`productId`),
  ADD KEY `ProductPromotion_promotionId_fkey` (`promotionId`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Review_userId_fkey` (`userId`),
  ADD KEY `Review_productId_fkey` (`productId`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Shipping_orderId_key` (`orderId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cartitem`
--
ALTER TABLE `cartitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1086;

--
-- AUTO_INCREMENT for table `productpromotion`
--
ALTER TABLE `productpromotion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `CartItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`order_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `productpromotion`
--
ALTER TABLE `productpromotion`
  ADD CONSTRAINT `ProductPromotion_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductPromotion_promotionId_fkey` FOREIGN KEY (`promotionId`) REFERENCES `promotion` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
  ADD CONSTRAINT `Shipping_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`order_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
