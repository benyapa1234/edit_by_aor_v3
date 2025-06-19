import dotenv from "dotenv";
dotenv.config();
import mariadb from "mariadb";
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 50,
  initSql: "SET NAMES utf8mb4",
  allowPublicKeyRetrieval: true,
  ssl: false,
});

pool
  .getConnection()
  .then((conn) => {
    console.log(`Connected to database with threadID: ${conn.threadId}`);
    conn.release();
  })
  .catch((err) => {
    console.error("Error connecting to Database:", err);
  });

export default pool;
