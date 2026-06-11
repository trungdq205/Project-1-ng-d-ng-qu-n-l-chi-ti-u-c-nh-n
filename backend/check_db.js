const mysql = require('mysql2/promise');
const db = mysql.createPool({ host: 'localhost', user: 'root', password: '123456', database: 'finapp_db' });
async function run() {
  const [rows] = await db.query("SELECT t.id, t.amount, t.date, c.name, c.type FROM transactions t JOIN categories c ON t.category_id = c.id;");
  console.log(rows);
  process.exit();
}
run();
