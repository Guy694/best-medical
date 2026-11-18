import mysql from "mysql2/promise";

// Reuse one pool across hot reloads in development.
const globalForDb = globalThis;

const pool =
  globalForDb.__bmPool ||
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") globalForDb.__bmPool = pool;

export default pool;

export async function query(sql, params = []) {
  const [results] = await pool.execute(sql, params);
  return results;
}

/** Run `fn(conn)` inside a transaction. */
export async function transaction(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback().catch(() => {});
    throw err;
  } finally {
    conn.release();
  }
}
