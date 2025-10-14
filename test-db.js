import mysql from 'mysql2/promise';

const testConnection = async () => {
  try {
    console.log('🔄 กำลังทดสอบการเชื่อมต่อ MySQL...');
    
    const connection = await mysql.createConnection({
      host: '199.21.175.91',
      port: 3306,
      user: 'skyline694',
      password: '29012540',
      database: 'best_medical'
    });

    console.log('✅ เชื่อมต่อสำเร็จ!');
    
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('📊 Query ทดสอบ:', rows);
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 ตารางในฐานข้อมูล:', tables);
    
    await connection.end();
    console.log('✅ ปิดการเชื่อมต่อเรียบร้อย');
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    console.error('📝 Error code:', error.code);
    console.error('📝 Error errno:', error.errno);
    
    if (error.code === 'ETIMEDOUT') {
      console.log('\n💡 แนะนำ:');
      console.log('1. ตรวจสอบ Firewall บน server (ufw allow 3306)');
      console.log('2. ตรวจสอบ bind-address ใน MySQL config');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 แนะนำ: MySQL service อาจยังไม่ทำงาน');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 แนะนำ: Username หรือ Password ผิด');
    }
  }
};

testConnection();
