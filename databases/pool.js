import "dotenv/config";
import mysql2 from "mysql2/promise";

const getPool = async () => {
  const pool = mysql2.createPool({
    host: process.env.POOL_HOST,
    user: process.env.POOL_USER,
    password: process.env.POOL_PASSWORD,
    database: process.env.POOL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return pool;
};

export default getPool;
