const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8800,
  password: "Password1!",
  database: "ecommerce",
});

const batchSize = 10000;
const totalSize = 1000000;
let currentId = 1;

const insertBatch = async () => {
  if (currentId > totalSize) {
    console.log("✅ Done inserting all data!");
    pool.end();
    return;
  }

  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `Product ${currentId}`;
    const age = Math.floor(Math.random() * 100);
    const address = `Address ${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;

  pool.query(sql, [values], (err) => {
    if (err) {
      console.error("❌ Error inserting batch:", err);
      pool.end();
      return;
    }
    console.log(`✅ Inserted batch up to ID ${currentId}`);
    insertBatch();
  });
};

insertBatch();
