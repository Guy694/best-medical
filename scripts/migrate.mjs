#!/usr/bin/env node
// Idempotent database upgrade for Best Medical.
// Usage:  npm run db:migrate          (reads .env.local / .env)
// Safe to run many times – every step checks information_schema first.
import mysql from "mysql2/promise";
import fs from "fs";

for (const f of [".env.local", ".env"]) {
  if (fs.existsSync(f)) {
    try { process.loadEnvFile(f); } catch {}
  }
}

const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  charset: "utf8mb4",
  multipleStatements: false,
});
const schema = process.env.DB_NAME;
const log = (...a) => console.log("•", ...a);

async function columns(table) {
  const [rows] = await db.execute(
    "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, EXTRA, COLUMN_KEY FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=?",
    [schema, table]
  );
  return Object.fromEntries(rows.map((r) => [r.COLUMN_NAME, r]));
}
async function tableExists(table) {
  const [r] = await db.execute(
    "SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?",
    [schema, table]
  );
  return r.length > 0;
}
async function indexExists(table, name) {
  const [r] = await db.execute(
    "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND INDEX_NAME=?",
    [schema, table, name]
  );
  return r.length > 0;
}
async function addColumn(table, name, ddl) {
  const cols = await columns(table);
  if (!cols[name]) {
    await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${ddl}`);
    log(`added ${table}.${name}`);
  }
}

// 1) AUTO_INCREMENT primary keys (imports from phpMyAdmin sometimes lose them)
const pkTables = {
  user: "id", product: "id", category: "id", order: "order_id", orderitem: "id",
  contact: "id", order_status_history: "id", coupon: "id", payment: "id",
  promotion: "id", productpromotion: "id", review: "id", shipping: "id",
};
for (const [table, col] of Object.entries(pkTables)) {
  if (!(await tableExists(table))) continue;
  const c = (await columns(table))[col];
  if (!c || c.EXTRA.includes("auto_increment")) continue;
  if (c.COLUMN_KEY !== "PRI") {
    log(`skip ${table}.${col}: not a primary key`);
    continue;
  }
  const [[zero]] = await db.query(`SELECT COUNT(*) n FROM \`${table}\` WHERE \`${col}\` = 0`);
  if (zero.n > 0) {
    const [[mx]] = await db.query(`SELECT COALESCE(MAX(\`${col}\`),0)+1 n FROM \`${table}\``);
    await db.query(`UPDATE \`${table}\` SET \`${col}\` = ? WHERE \`${col}\` = 0`, [mx.n]);
  }
  await db.query(`ALTER TABLE \`${table}\` MODIFY \`${col}\` INT(11) NOT NULL AUTO_INCREMENT`);
  log(`enabled AUTO_INCREMENT on ${table}.${col}`);
}

// 2) order table improvements
if (await tableExists("order")) {
  const cols = await columns("order");
  if (cols.transfer_slip_file && cols.transfer_slip_file.IS_NULLABLE === "NO") {
    await db.query("ALTER TABLE `order` MODIFY `transfer_slip_file` TEXT NULL");
    log("order.transfer_slip_file now nullable");
  }
  if (cols.order_phone && cols.order_phone.COLUMN_TYPE !== "varchar(20)") {
    await db.query("ALTER TABLE `order` MODIFY `order_phone` VARCHAR(20) NULL");
    log("order.order_phone widened to 20");
  }
  if (cols.shippingAddress && cols.shippingAddress.COLUMN_TYPE === "varchar(191)") {
    await db.query("ALTER TABLE `order` MODIFY `shippingAddress` TEXT NULL");
    log("order.shippingAddress -> TEXT");
  }
  await addColumn("order", "user_id", "INT NULL AFTER `order_email`");
  await addColumn("order", "shipping_cost", "DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER `shipping`");
  await addColumn("order", "tracking_number", "VARCHAR(100) NULL");
  await addColumn("order", "shipping_company", "VARCHAR(100) NULL");
  await addColumn("order", "stock_deducted", "TINYINT(1) NOT NULL DEFAULT 0");
  await addColumn("order", "updatedAt", "DATETIME(3) NULL");

  if (!(await indexExists("order", "uq_order_code"))) {
    const [dups] = await db.query("SELECT order_code FROM `order` GROUP BY order_code HAVING COUNT(*) > 1");
    if (dups.length) log(`WARNING: duplicate order codes, unique index skipped: ${dups.map((d) => d.order_code).join(", ")}`);
    else {
      await db.query("CREATE UNIQUE INDEX uq_order_code ON `order` (order_code)");
      log("unique index order.order_code");
    }
  }
  if (!(await indexExists("order", "idx_order_email"))) {
    await db.query("CREATE INDEX idx_order_email ON `order` (order_email)");
    log("index order.order_email");
  }
  if (!(await indexExists("order", "idx_order_created"))) {
    await db.query("CREATE INDEX idx_order_created ON `order` (createdAt)");
    log("index order.createdAt");
  }
}

// 3) user: password reset
if (await tableExists("user")) {
  await addColumn("user", "reset_token", "VARCHAR(128) NULL");
  await addColumn("user", "reset_expires", "DATETIME NULL");
}

// 4) contact.detail was varchar(191) – long messages failed to save
if (await tableExists("contact")) {
  const c = (await columns("contact")).detail;
  if (c && c.COLUMN_TYPE.startsWith("varchar")) {
    await db.query("ALTER TABLE `contact` MODIFY `detail` TEXT NULL");
    log("contact.detail -> TEXT");
  }
  await addColumn("contact", "is_read", "TINYINT(1) NOT NULL DEFAULT 0");
}

// 5) product: make sure flags exist
if (await tableExists("product")) {
  await addColumn("product", "visible", "INT(1) NOT NULL DEFAULT 0 COMMENT '0 = แสดง, 1 = ซ่อน'");
  await addColumn("product", "delivery", "DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'ค่าส่งต่อชิ้น'");
}

// 6) payment notification log
await db.query(`CREATE TABLE IF NOT EXISTS payment_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  order_code VARCHAR(60) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NULL,
  amount DECIMAL(10,2) NOT NULL,
  transfer_date DATE NOT NULL,
  transfer_time TIME NOT NULL,
  transfer_slip_file VARCHAR(255) NULL,
  shipping_address TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pn_order (order_id),
  INDEX idx_pn_code (order_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
log("payment_notifications ready");

// 7) order status history table (for fresh installs)
await db.query(`CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  order_code VARCHAR(60) NULL,
  status ENUM('PENDING','PAID','SHIPPING','COMPLETED','CANCELLED') NOT NULL,
  previous_status ENUM('PENDING','PAID','SHIPPING','COMPLETED','CANCELLED') NULL,
  note TEXT NULL,
  changed_by VARCHAR(100) NULL,
  changed_by_user_id INT NULL,
  tracking_number VARCHAR(100) NULL,
  shipping_company VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_order_code (order_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

// 8) analytics (self-hosted visitor statistics). Times stored in UTC.
await db.query(`CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  event VARCHAR(30) NOT NULL,
  visitor_id CHAR(16) NOT NULL,
  session_id CHAR(16) NOT NULL,
  path VARCHAR(255) NULL,
  product_id INT NULL,
  search VARCHAR(100) NULL,
  referrer VARCHAR(255) NULL,
  source VARCHAR(100) NULL,
  device VARCHAR(10) NULL,
  browser VARCHAR(20) NULL,
  os VARCHAR(20) NULL,
  is_new TINYINT(1) NOT NULL DEFAULT 0,
  value DECIMAL(12,2) NULL,
  ref_code VARCHAR(60) NULL,
  created_at DATETIME NOT NULL,
  INDEX idx_ae_time (created_at),
  INDEX idx_ae_event_time (event, created_at),
  INDEX idx_ae_session (session_id),
  INDEX idx_ae_product (product_id, event)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
log("analytics_events ready");

// ---------------------------------------------------------------------------
// 9) Payment slips: legacy files in public/payments were world-readable.
//    Copy them to private storage/payments (staff-only via /api/media),
//    verify each copy, then remove the public copy and repoint the DB.
// ---------------------------------------------------------------------------
{
  const path = await import("path");
  const pubDir = path.join(process.cwd(), "public", "payments");
  const privDir = path.join(process.cwd(), "storage", "payments");
  if (fs.existsSync(pubDir)) {
    fs.mkdirSync(privDir, { recursive: true });
    let moved = 0;
    for (const name of fs.readdirSync(pubDir)) {
      if (name.startsWith(".")) continue;
      const src = path.join(pubDir, name);
      const dst = path.join(privDir, name);
      if (!fs.statSync(src).isFile()) continue;
      if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
      if (fs.statSync(dst).size === fs.statSync(src).size) {
        fs.unlinkSync(src);
        moved++;
      }
    }
    if (moved) log(`moved ${moved} payment slip(s) to storage/payments`);
    if (fs.readdirSync(pubDir).filter((n) => !n.startsWith(".")).length === 0) fs.rmSync(pubDir, { recursive: true, force: true });
  }
  for (const [table, col] of [["order", "transfer_slip_file"], ["payment_notifications", "transfer_slip_file"]]) {
    const [r] = await db.query(
      `UPDATE \`${table}\` SET \`${col}\` = CONCAT('/api/media/payments/', SUBSTRING_INDEX(\`${col}\`, '/', -1))
       WHERE \`${col}\` REGEXP '(^|/)payments/[^/]+$' AND \`${col}\` NOT LIKE '/api/media/%'`
    );
    if (r.affectedRows) log(`repointed ${r.affectedRows} slip path(s) in ${table}`);
  }
}

await db.end();
console.log("✔ Database is up to date");
