// === BẢNG MÀU DANH MỤC CHI TIÊU ===
// Quy tắc: KHÔNG dùng màu đỏ cho danh mục — đỏ chỉ xuất hiện ở biểu đồ tuần
export const EXPENSE_CATEGORY_COLORS = {
  'Ăn uống':   '#F57C00',  // 🟠 Cam đậm (Deep Orange)
  'Di chuyển': '#FBC02D',  // 🟡 Vàng tươi (Vivid Yellow)
  'Giải trí':  '#AB47BC',  // 🟣 Tím (Purple)
  'Hóa đơn':   '#EC407A',  // 💗 Hồng nóng (Hot Pink)
  'Mua sắm':   '#8D6E63',  // 🟤 Nâu ấm (Warm Brown)
};

// Dãy màu dự phòng — cũng không có đỏ
const EXPENSE_FALLBACK_COLORS = [
  '#F57C00', '#FBC02D', '#AB47BC', '#EC407A', '#8D6E63',
  '#EF6C00', '#F9A825', '#9C27B0', '#F06292', '#795548'
];

// Hàm lấy màu cho một danh mục chi tiêu
export const getExpenseColor = (categoryName, index = 0) => {
  return EXPENSE_CATEGORY_COLORS[categoryName] || EXPENSE_FALLBACK_COLORS[index % EXPENSE_FALLBACK_COLORS.length];
};
