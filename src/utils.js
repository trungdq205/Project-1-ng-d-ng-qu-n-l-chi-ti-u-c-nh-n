const TRANSLATIONS = {
  vi: {
    overview: 'Tổng quan',
    transactions: 'Giao dịch',
    reports: 'Báo cáo',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    currentBalance: 'Số dư hiện tại',
    totalIncome: 'Tổng Thu',
    totalExpense: 'Tổng Chi',
    savingsRate: 'Tỷ lệ Tiết kiệm',
    budgetWarning: 'Vượt hạn mức chi tiêu!',
    budgetOk: 'Chi tiêu trong hạn mức',
    savingsTargetWarning: 'Chưa đạt mục tiêu tiết kiệm',
    savingsTargetOk: 'Đạt mục tiêu tiết kiệm',
    overviewReport: 'Báo cáo Tổng quan',
    manageTransactions: 'Quản lý Giao dịch',
    detailedReports: 'Báo cáo Chi tiết',
    settingsTitle: 'Cấu hình Cài đặt',
    systemSettings: 'Cài đặt Hệ thống',
    finapp: 'FinApp',
    developing: 'Tính năng đang phát triển...',
    profileTitle: 'Thông tin cá nhân',
    securityTitle: 'Đổi mật khẩu',
    preferencesTitle: 'Tùy biến Hệ thống & Tài chính',
    fullName: 'Họ và tên',
    emailAddress: 'Địa chỉ Email',
    saveChanges: 'Lưu Thay đổi',
    currentPassword: 'Mật khẩu hiện tại',
    newPassword: 'Mật khẩu mới',
    confirmPassword: 'Xác nhận mật khẩu mới',
    updatePassword: 'Cập nhật Mật khẩu',
    themeLabel: 'Chủ đề giao diện',
    themeLight: 'Glassmorphic Light (Mặc định)',
    themeNebulaDark: 'Nebula Dark (Bóng tối Kỳ ảo)',
    themeDeepEmerald: 'Deep Emerald (Xanh Lục Bảo)',
    currencyLabel: 'Tiền tệ',
    languageLabel: 'Ngôn ngữ',
    monthlyBudgetLabel: 'Hạn mức Chi tiêu tháng',
    monthlySavingsLabel: 'Mục tiêu Tiết kiệm tháng',
    savePreferences: 'Lưu cấu hình tùy chọn',
    budgetLimitHint: 'Nhận cảnh báo nếu tổng chi tiêu tháng vượt hạn mức này.',
    savingsLimitHint: 'Mục tiêu tỷ lệ phần trăm tiền tiết kiệm trên tổng thu nhập tháng.',
    passwordErrorFields: 'Vui lòng điền đầy đủ các thông tin mật khẩu',
    passwordErrorMismatch: 'Mật khẩu mới không trùng khớp',
    passwordErrorLength: 'Mật khẩu mới phải từ 6 ký tự trở lên',
    profileErrorFields: 'Vui lòng điền đầy đủ tên và email',
    profileSuccessMsg: 'Cập nhật thông tin cá nhân thành công!',
    securitySuccessMsg: 'Đổi mật khẩu thành công!',
    preferencesSuccessMsg: 'Lưu cấu hình ưu tiên thành công!',
    loadingSave: 'Đang lưu...',
    loadingPassword: 'Đang đổi...',
    week: 'Tuần',
    thu: 'Thu',
    chi: 'Chi',
    topCategories: 'Top chi tiêu theo hạng mục',
    cashflowReport: 'Dòng tiền 6 tháng gần nhất',
    topSpendingThisMonth: 'Chi tiêu nhiều nhất tháng này',
    noData: 'Không có dữ liệu chi tiêu',
    transactionList: 'Danh sách Giao dịch',
    addTransaction: 'Thêm giao dịch mới',
    category: 'Danh mục',
    amount: 'Số tiền',
    date: 'Ngày thực hiện',
    description: 'Mô tả (Không bắt buộc)',
    addBtn: 'Thêm Giao dịch',
    deleteSuccess: 'Đã xóa giao dịch',
    deleteError: 'Lỗi xóa giao dịch',
    filterByMonth: 'Lọc theo tháng',
    historyTitle: 'Lịch sử giao dịch',
    addButton: 'Thêm Mới',
    dateHeader: 'Ngày',
    categoryHeader: 'Danh mục',
    detailsHeader: 'Chi tiết',
    amountHeader: 'Số tiền',
    actionHeader: 'Hành động',
    noTransactions: 'Chưa có giao dịch nào',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa giao dịch này?',
    alertFillAll: 'Vui lòng điền đủ thông tin',
    alertAddFail: 'Thêm giao dịch thất bại',
    spendingCalendar: 'Lịch Chi Tiêu',
    noTransactionsForDay: 'Ngày này chưa có giao dịch',
    detailsForDay: 'Chi tiết ngày',
    spendingAllocation: 'Phân bổ Chi tiêu',
    incomeAllocation: 'Phân bổ Thu nhập',
    weeklyStats: 'Thống kê Thu nhập & Chi tiêu theo tuần',
    noSpendingData: 'Chưa có chi tiêu trong tháng này',
    noIncomeData: 'Chưa có thu nhập trong tháng này',
    balanceSavingsTrend: 'Xu hướng Số dư & Tiết kiệm',
    netWorthTrend: 'Xu hướng Tài sản ròng (Net Worth)',
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    netWorth: 'Tích lũy ròng',
    topSpendMonth: 'Top {index} Tốn kém (Tháng này)',
    deepAnalysis: 'Phân tích Tài chính Chuyên sâu',
    loadingReport: 'Đang tải báo cáo...',
    noTopSpends: 'Tuyệt vời, bạn chưa có dữ liệu tiêu xài nào gây tốn kém!',
    cancelBtn: 'Hủy',
    saveTxBtn: 'Lưu giao dịch',
    notePlaceholder: 'Mua đồ tạp hóa...',
    amountPlaceholder: 'Ví dụ: 50000',
    amountLabel: 'Số tiền',
    loadingSaveTx: 'Đang lưu...'
  },
  en: {
    overview: 'Overview',
    transactions: 'Transactions',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
    currentBalance: 'Current Balance',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    savingsRate: 'Savings Rate',
    budgetWarning: 'Budget exceeded!',
    budgetOk: 'Within budget limit',
    savingsTargetWarning: 'Below savings target',
    savingsTargetOk: 'Savings target achieved',
    overviewReport: 'Overview Dashboard',
    manageTransactions: 'Manage Transactions',
    detailedReports: 'Detailed Reports',
    settingsTitle: 'Settings Configuration',
    systemSettings: 'System Settings',
    finapp: 'FinApp',
    developing: 'Feature under development...',
    profileTitle: 'Personal Profile',
    securityTitle: 'Change Password',
    preferencesTitle: 'System & Financial Customization',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    saveChanges: 'Save Changes',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    themeLabel: 'UI Theme',
    themeLight: 'Glassmorphic Light (Default)',
    themeNebulaDark: 'Nebula Dark (Mystic Shadow)',
    themeDeepEmerald: 'Deep Emerald (Vibrant Jade)',
    currencyLabel: 'Currency',
    languageLabel: 'Language',
    monthlyBudgetLabel: 'Monthly Spending Limit',
    monthlySavingsLabel: 'Monthly Savings Target',
    savePreferences: 'Save Preferences',
    budgetLimitHint: 'Get alerts when monthly spending exceeds this limit.',
    savingsLimitHint: 'Percentage of monthly income targeted for savings.',
    passwordErrorFields: 'Please fill in all password fields',
    passwordErrorMismatch: 'New passwords do not match',
    passwordErrorLength: 'New password must be at least 6 characters',
    profileErrorFields: 'Please fill in both name and email',
    profileSuccessMsg: 'Profile updated successfully!',
    securitySuccessMsg: 'Password updated successfully!',
    preferencesSuccessMsg: 'Preferences saved successfully!',
    loadingSave: 'Saving...',
    loadingPassword: 'Updating...',
    week: 'Week',
    thu: 'Income',
    chi: 'Expense',
    topCategories: 'Top Expense Categories',
    cashflowReport: 'Cash Flow (Last 6 Months)',
    topSpendingThisMonth: 'Top Spending This Month',
    noData: 'No spending data',
    transactionList: 'Transaction List',
    addTransaction: 'Add New Transaction',
    category: 'Category',
    amount: 'Amount',
    date: 'Date',
    description: 'Description (Optional)',
    addBtn: 'Add Transaction',
    deleteSuccess: 'Transaction deleted',
    deleteError: 'Error deleting transaction',
    filterByMonth: 'Filter by month',
    historyTitle: 'Transaction History',
    addButton: 'Add New',
    dateHeader: 'Date',
    categoryHeader: 'Category',
    detailsHeader: 'Details',
    amountHeader: 'Amount',
    actionHeader: 'Action',
    noTransactions: 'No transactions yet',
    deleteConfirm: 'Are you sure you want to delete this transaction?',
    alertFillAll: 'Please fill in all fields',
    alertAddFail: 'Failed to add transaction',
    spendingCalendar: 'Spending Calendar',
    noTransactionsForDay: 'No transactions for this day',
    detailsForDay: 'Details for',
    spendingAllocation: 'Spending Allocation',
    incomeAllocation: 'Income Allocation',
    weeklyStats: 'Weekly Income & Expense Statistics',
    noSpendingData: 'No spending this month',
    noIncomeData: 'No income this month',
    balanceSavingsTrend: 'Balance & Savings Trend',
    netWorthTrend: 'Net Worth Trend',
    income: 'Income',
    expense: 'Expense',
    netWorth: 'Net Worth',
    topSpendMonth: 'Top {index} Spending (This Month)',
    deepAnalysis: 'In-depth Financial Analysis',
    loadingReport: 'Loading report...',
    noTopSpends: 'Great, you have no expensive spending data yet!',
    cancelBtn: 'Cancel',
    saveTxBtn: 'Save Transaction',
    notePlaceholder: 'Groceries, rent, etc...',
    amountPlaceholder: 'e.g. 50000',
    amountLabel: 'Amount',
    loadingSaveTx: 'Saving...'
  }
};

export const formatCurrency = (amount, currency, language) => {
  const activeCurrency = currency || localStorage.getItem('currency') || 'VND';
  const activeLanguage = language || localStorage.getItem('language') || 'vi';
  
  if (activeCurrency === 'USD') {
    // 1 USD = 26000 VND
    const usdAmount = amount / 26000;
    return new Intl.NumberFormat(activeLanguage === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(usdAmount);
  } else {
    const formatted = new Intl.NumberFormat(activeLanguage === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
    return formatted.replace('₫', 'VNĐ');
  }
};

export const formatCurrencyCompact = (amount, currency, language) => {
  const activeCurrency = currency || localStorage.getItem('currency') || 'VND';
  const activeLanguage = language || localStorage.getItem('language') || 'vi';
  
  if (activeCurrency === 'USD') {
    const usdAmount = amount / 26000;
    const sign = usdAmount < 0 ? '-' : '';
    const absUsd = Math.abs(usdAmount);
    if (absUsd >= 1000000) {
      return `${sign}$${(absUsd / 1000000).toFixed(1)}M`;
    }
    if (absUsd >= 1000) {
      return `${sign}$${(absUsd / 1000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat(activeLanguage === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(usdAmount);
  } else {
    const sign = amount < 0 ? '-' : '';
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `${sign}${(absAmount / 1000000).toFixed(1)}M VNĐ`;
    }
    if (absAmount >= 1000) {
      return `${sign}${Math.round(absAmount / 1000)}k VNĐ`;
    }
    return `${sign}${absAmount} VNĐ`;
  }
};

export const getTranslation = (key, language) => {
  const activeLanguage = language || localStorage.getItem('language') || 'vi';
  return TRANSLATIONS[activeLanguage]?.[key] || TRANSLATIONS['vi']?.[key] || key;
};

