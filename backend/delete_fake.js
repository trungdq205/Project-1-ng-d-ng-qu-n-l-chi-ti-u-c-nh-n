const mysql = require('mysql2/promise');
const db = mysql.createPool({ host: 'localhost', user: 'root', password: '123456', database: 'finapp_db' });
async function run() {
  const [result] = await db.query("DELETE FROM transactions WHERE amount > 1000000000;");
  console.log("Deleted fake data:", result.affectedRows);
  process.exit();
}
run();
