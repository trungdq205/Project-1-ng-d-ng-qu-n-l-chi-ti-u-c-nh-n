const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'finapp_super_secret_key_123';

app.use(cors());
app.use(express.json());

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Không tìm thấy Token xác thực' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    req.user = user;
    next();
  });
};

// ========================
// API AUTH
// ========================

// 1. Đăng ký tài khoản
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Đăng ký thành công', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// 2. Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ message: 'Tài khoản không tồn tại' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) return res.status(400).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ========================
// API USER PROFILE & SECURITY
// ========================

// 1. Lấy thông tin cá nhân
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [users] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [userId]);
    if (users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// 2. Cập nhật thông tin cá nhân (name, email)
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  try {
    // Kiểm tra trùng lặp email với tài khoản khác
    const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email đã tồn tại ở tài khoản khác' });

    await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    res.json({ message: 'Cập nhật thông tin cá nhân thành công', user: { id: userId, name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// 3. Thay đổi mật khẩu
app.put('/api/user/password', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Vui lòng nhập mật khẩu cũ và mật khẩu mới' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const user = users[0];
    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);
    res.json({ message: 'Thay đổi mật khẩu thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ========================
// API DASHBOARD & TRANSACTIONS
// ========================

// Lấy thống kê tổng quan (Thu, Chi, Số Dư)
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const currentMonth = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;
    const currentYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    const [results] = await db.query(`
      SELECT 
        c.type,
        SUM(t.amount) as total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? 
        AND MONTH(t.date) = ? 
        AND YEAR(t.date) = ?
      GROUP BY c.type
    `, [userId, currentMonth, currentYear]);

    let totalIncome = 0;
    let totalExpense = 0;

    results.forEach(row => {
      if (row.type === 'income') totalIncome += Number(row.total);
      if (row.type === 'expense') totalExpense += Number(row.total);
    });

    // Tính "Số dư hiện tại" từ TOÀN BỘ giao dịch (không phụ thuộc tháng đang xem)
    const [allTimeResult] = await db.query(`
      SELECT 
        SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) as allIncome,
        SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) as allExpense
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `, [userId]);

    const currentBalance = Number(allTimeResult[0].allIncome || 0) - Number(allTimeResult[0].allExpense || 0);

    // Chi tiết theo danh mục (chỉ tính chi phí)
    const [expenseByCat] = await db.query(`
      SELECT c.name as name, SUM(t.amount) as amount, c.color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND c.type = 'expense' 
        AND MONTH(t.date) = ? AND YEAR(t.date) = ?
      GROUP BY c.id
    `, [userId, currentMonth, currentYear]);

    // Chi tiết thu nhập theo danh mục
    const [incomeByCat] = await db.query(`
      SELECT c.name as name, SUM(t.amount) as amount, c.color
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND c.type = 'income' 
        AND MONTH(t.date) = ? AND YEAR(t.date) = ?
      GROUP BY c.id
    `, [userId, currentMonth, currentYear]);

    // Thống kê thu nhập và chi tiêu theo tuần (trong tháng được chọn)
    const [weeklyRaw] = await db.query(`
      SELECT 
        FLOOR((DAY(t.date) - 1) / 7) + 1 AS week,
        c.type,
        SUM(t.amount) as amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
        AND MONTH(t.date) = ? AND YEAR(t.date) = ?
      GROUP BY week, c.type
      ORDER BY week ASC
    `, [userId, currentMonth, currentYear]);

    const weeklyData = [
      { name: 'Tuần 1', income: 0, expense: 0 },
      { name: 'Tuần 2', income: 0, expense: 0 },
      { name: 'Tuần 3', income: 0, expense: 0 },
      { name: 'Tuần 4', income: 0, expense: 0 },
    ];
    weeklyRaw.forEach(row => {
      const weekIndex = Math.min(Number(row.week) - 1, 3);
      if (row.type === 'income') {
        weeklyData[weekIndex].income += Number(row.amount);
      } else if (row.type === 'expense') {
        weeklyData[weekIndex].expense += Number(row.amount);
      }
    });

    // Lấy danh sách các ngày có giao dịch trong tháng
    const [txDaysRaw] = await db.query(`
      SELECT DISTINCT DAY(date) as day
      FROM transactions
      WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
    `, [userId, currentMonth, currentYear]);
    const transactionDays = txDaysRaw.map(r => r.day);

    // Lấy chi tiết các giao dịch trong tháng
    const [recentTransactions] = await db.query(`
      SELECT t.id, t.amount, t.date, t.description, c.name as category_name, c.type, c.color, DAY(t.date) as event_day
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND MONTH(t.date) = ? AND YEAR(t.date) = ?
      ORDER BY t.date DESC, t.id DESC
    `, [userId, currentMonth, currentYear]);

    res.json({
      totalIncome,
      totalExpense,
      currentBalance,
      expenseByCat,
      incomeByCat,
      weeklyData,
      transactionDays,
      recentTransactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy danh sách giao dịch
app.get('/api/transactions', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [transactions] = await db.query(`
      SELECT t.id, t.amount, t.date, t.description, c.name as category_name, c.type, c.color, c.id as category_id
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      ORDER BY t.date DESC, t.id DESC
      LIMIT 100
    `, [userId]);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm giao dịch mới
app.post('/api/transactions', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { category_id, amount, date, description } = req.body;
  
  if (!category_id || !amount || !date) {
    return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin bắt buộc' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, category_id, amount, date, description) VALUES (?, ?, ?, ?, ?)',
      [userId, category_id, amount, date, description || '']
    );
    res.status(201).json({ message: 'Đã thêm giao dịch', transactionId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa giao dịch
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const txId = req.params.id;
  try {
    const [result] = await db.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [txId, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Giao dịch không tồn tại hoặc không có quyền xóa' });
    }
    res.json({ message: 'Đã xóa giao dịch' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy báo cáo xu hướng và top chi tiêu
app.get('/api/reports/trends', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    // Lấy toàn bộ dữ liệu từ trước đến nay cho biểu đồ
    const [monthlyData] = await db.query(`
      SELECT 
        DATE_FORMAT(t.date, '%Y-%m') as monthString,
        SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) as totalExpense
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? 
      GROUP BY monthString
      ORDER BY monthString ASC
    `, [userId]);

    const allTimeData = monthlyData.map(item => ({
      name: `T${item.monthString.split('-')[1]}/${item.monthString.split('-')[0].slice(2)}`,
      Thu: Number(item.totalIncome),
      Chi: Number(item.totalExpense)
    }));

    // Cắt 6 tháng gần nhất cho biểu đồ lưới Dòng tiền để không bị quá chật
    const trendData = allTimeData.slice(-6);

    // 2. Top 3 Hạng mục gây tốn kém nhất tháng hiện tại
    const [topSpends] = await db.query(`
      SELECT c.name, c.color, SUM(t.amount) as total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? 
        AND c.type = 'expense'
        AND MONTH(t.date) = MONTH(CURRENT_DATE()) 
        AND YEAR(t.date) = YEAR(CURRENT_DATE())
      GROUP BY c.id, c.name, c.color
      ORDER BY total DESC
      LIMIT 3
    `, [userId]);

    res.json({
      trendData,
      allTimeData,
      topSpends
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi fetch báo cáo' });
  }
});

// Lấy danh mục
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
