const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'finapp_db';

async function initDB() {
  try {
    console.log('Đang kết nối tới MySQL...');
    // Kết nối không chỉ định database để tạo DB nếu chưa có
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });

    console.log(`Đang kiểm tra và tạo database '${DB_NAME}' nếu chưa tồn tại...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    // Sử dụng database vừa tạo
    await connection.query(`USE \`${DB_NAME}\``);
    
    console.log('Đang tạo các bảng dữ liệu...');
    // Tạo bảng users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tạo bảng categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type ENUM('income', 'expense') NOT NULL,
        color VARCHAR(20) DEFAULT '#000000',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tạo bảng transactions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category_id INT NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);

    console.log('Đang chèn dữ liệu mẫu (Seed Data)...');
    
    // Seed user mặc định
    const [userRows] = await connection.query(`SELECT id FROM users WHERE email = 'test@finapp.vn'`);
    let userId;
    if (userRows.length === 0) {
      const passwordHash = await bcrypt.hash('123456', 10);
      const [result] = await connection.query(
        `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
        ['Người dùng Mẫu', 'test@finapp.vn', passwordHash]
      );
      userId = result.insertId;
      console.log('Đã tạo người dùng mẫu: test@finapp.vn / 123456');
    } else {
      userId = userRows[0].id;
    }

    // Seed Categories
    const [catRows] = await connection.query(`SELECT COUNT(*) as count FROM categories`);
    if (catRows[0].count === 0) {
      const categories = [
        ['Lương', 'income', '#3b82f6'],
        ['Tiền thưởng', 'income', '#06b6d4'],
        ['Ăn uống', 'expense', '#ef4444'],
        ['Di chuyển', 'expense', '#f59e0b'],
        ['Giải trí', 'expense', '#f97316'],
        ['Hóa đơn', 'expense', '#e11d48'],
        ['Mua sắm', 'expense', '#ec4899']
      ];
      
      for (const cat of categories) {
        await connection.query(
          `INSERT INTO categories (name, type, color) VALUES (?, ?, ?)`,
          cat
        );
      }
      console.log('Đã tạo danh mục thu/chi.');
    }

    // Seed Transactions
    const [txRows] = await connection.query(`SELECT COUNT(*) as count FROM transactions WHERE user_id = ?`, [userId]);
    if (txRows[0].count === 0) {
      const currentYear = new Date().getFullYear();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      
      // Lấy danh sách category_id
      const [cats] = await connection.query(`SELECT id, name FROM categories`);
      const getCatId = (name) => cats.find(c => c.name === name)?.id;

      const salaryId = getCatId('Lương');
      const foodId = getCatId('Ăn uống');
      const transportId = getCatId('Di chuyển');
      const utilId = getCatId('Hóa đơn');

      const transactions = [
        [userId, salaryId, 25000000, `${currentYear}-${currentMonth}-05`, 'Lương tháng này'],
        [userId, utilId, 1500000, `${currentYear}-${currentMonth}-08`, 'Tiền điện nước'],
        [userId, foodId, 500000, `${currentYear}-${currentMonth}-10`, 'Đi ăn với bạn bè'],
        [userId, transportId, 300000, `${currentYear}-${currentMonth}-12`, 'Đổ xăng'],
        [userId, foodId, 200000, `${currentYear}-${currentMonth}-15`, 'Ăn trưa'],
      ];

      for (const tx of transactions) {
        if (tx[1] /* category_id */) {
          await connection.query(
            `INSERT INTO transactions (user_id, category_id, amount, date, description) VALUES (?, ?, ?, ?, ?)`,
            tx
          );
        }
      }
      console.log('Đã chèn giao dịch mẫu.');
    }

    console.log('Hoàn thành khởi tạo Database!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi khởi tạo Database:', error);
    process.exit(1);
  }
}

initDB();
