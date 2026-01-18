import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2108", // 🔴 PUT YOUR REAL PASSWORD
  database: "japanese_project",
  port: 5432,
});

export default pool;
