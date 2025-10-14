import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

console.log('Database Config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  port: dbConfig.port,
  database: dbConfig.database
});

// สร้าง connection pool
const pool = mysql.createPool(dbConfig);

// Export pool เป็น default
export default pool;

// Export query function
export async function query(sql, params = []) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    connection.release();
  }
}