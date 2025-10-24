const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8800,
  password: "Password1!",
  database: "ecommerce",
});

pool.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to database:", err);
    return;
  }
  console.log("✅ Connected to database");
})