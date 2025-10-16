import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(req) {
  const results = [];
  
  // ทดสอบโฟลเดอร์ต่างๆ
  const folders = [
    { name: 'pdimage', path: path.join(process.cwd(), "public", "pdimage") },
    { name: 'categoryimg', path: path.join(process.cwd(), "public", "categoryimg") },
    { name: 'contact', path: path.join(process.cwd(), "public", "contact") },
    { name: 'payments', path: path.join(process.cwd(), "public", "payments") },
  ];

  for (const folder of folders) {
    const result = {
      folder: folder.name,
      path: folder.path,
      exists: false,
      writable: false,
      error: null
    };

    try {
      // ตรวจสอบว่าโฟลเดอร์มีอยู่หรือไม่
      result.exists = existsSync(folder.path);

      // ถ้าไม่มี ลองสร้าง
      if (!result.exists) {
        await mkdir(folder.path, { recursive: true });
        result.exists = true;
        result.created = true;
      }

      // ทดสอบเขียนไฟล์
      const testFile = path.join(folder.path, `test_${Date.now()}.txt`);
      await writeFile(testFile, "This is a test file");
      result.writable = true;
      result.testFile = testFile;

      // ลบไฟล์ทดสอบ
      const fs = require('fs');
      fs.unlinkSync(testFile);

    } catch (error) {
      result.error = {
        message: error.message,
        code: error.code,
        errno: error.errno
      };
    }

    results.push(result);
  }

  // สรุปผล
  const summary = {
    timestamp: new Date().toISOString(),
    platform: process.platform,
    nodeVersion: process.version,
    cwd: process.cwd(),
    results: results,
    allWritable: results.every(r => r.writable),
    errors: results.filter(r => r.error).length
  };

  return new Response(JSON.stringify(summary, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
