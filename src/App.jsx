import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart as PieChartIcon, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Component
} from 'lucide-react';
import './App.css';
import CalendarWidget from './CalendarWidget';
import SummaryStats from './SummaryStats';
import { ChartsRow } from './Charts';
import FinBot from './FinBot';
import Login from './Login';
import Transactions from './Transactions';
import Reports from './Reports';
import SettingsView from './SettingsView';
import { getTranslation, formatCurrency } from './utils';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{"name": "User"}'));

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'VND');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'vi');
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => {
    return localStorage.getItem('monthlyBudgetLimit') ? Number(localStorage.getItem('monthlyBudgetLimit')) : 10000000;
  });
  const [savingsTargetRate, setSavingsTargetRate] = useState(() => {
    return localStorage.getItem('savingsTargetRate') ? Number(localStorage.getItem('savingsTargetRate')) : 20;
  });

  useEffect(() => {
    document.body.className = '';
    if (theme === 'nebula-dark') {
      document.body.classList.add('theme-nebula-dark');
    } else if (theme === 'deep-emerald') {
      document.body.classList.add('theme-deep-emerald');
    }
  }, [theme]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    currentBalance: 0,
    expenseByCat: [],
    incomeByCat: []
  });

  const checkAuthAndFetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(prev => {
        if (prev) return false;
        return prev;
      });
      return;
    }
    
    try {
      const [year, month] = selectedMonth.split('-');
      const res = await fetch(`http://localhost:5000/api/dashboard/summary?month=${month}&year=${year}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Không thể kết nối đến backend', err);
    }
  }, [selectedMonth]);

  const handleTransactionAdded = (dateString) => {
    if (dateString) {
      const newMonth = dateString.substring(0, 7); // Vd: "2026-04"
      if (newMonth !== selectedMonth) {
        setSelectedMonth(newMonth); // Cập nhật state (tự động trigger useEffect phía dưới)
      } else {
        checkAuthAndFetchData();
      }
    } else {
      checkAuthAndFetchData();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuthAndFetchData();
  }, [checkAuthAndFetchData]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser({ name: 'User' });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    checkAuthAndFetchData();
    setUser(JSON.parse(localStorage.getItem('user') || '{"name": "User"}'));
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Thanh điều hướng bên trái */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Component size={32} color="#60a5fa" />
          <span>FinApp</span>
        </div>
        
        <nav className="sidebar-menu">
          <a href="#" className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
            <LayoutDashboard size={20} />
            <span>{getTranslation('overview')}</span>
          </a>
          <a href="#" className={`menu-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('transactions'); }}>
            <Wallet size={20} />
            <span>{getTranslation('transactions')}</span>
          </a>
          <a href="#" className={`menu-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('reports'); }}>
            <PieChartIcon size={20} />
            <span>{getTranslation('reports')}</span>
          </a>
          <a href="#" className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} style={{ marginTop: 'auto' }} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
            <Settings size={20} />
            <span>{getTranslation('settings')}</span>
          </a>
          <a href="#" className="menu-item" onClick={handleLogout}>
            <LogOut size={20} />
            <span>{getTranslation('logout')}</span>
          </a>
        </nav>
      </aside>

      {/* Khu vực hiển thị chính */}
      <main className="main-area scrollbar-hide">
        {/* Tiêu đề trên cùng */}
        <header className="top-header animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="page-title">
            {activeTab === 'overview' ? getTranslation('overviewReport') : activeTab === 'transactions' ? getTranslation('manageTransactions') : activeTab === 'reports' ? getTranslation('detailedReports') : activeTab === 'settings' ? getTranslation('settingsTitle') : getTranslation('finapp')}
          </div>
          
          <div className="header-right">
            <div className="balance-indicator">
              <span className="balance-label">{getTranslation('currentBalance')}</span>
              <span className="balance-amount">{formatCurrency(dashboardData.currentBalance)}</span>
            </div>
            <div className="user-profile">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</div>
              <Bell size={18} color="#64748b" style={{ marginLeft: '8px' }} />
            </div>
          </div>
        </header>

        {activeTab === 'overview' ? (
          <div className="dashboard-grid">
            {/* Cột trái - Lịch */}
            <div className="dashboard-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CalendarWidget 
                key={`${selectedMonth}-${language}-${currency}`} 
                selectedMonth={selectedMonth} 
                setSelectedMonth={setSelectedMonth} 
                transactionDays={dashboardData.transactionDays} 
                monthlyTransactions={dashboardData.recentTransactions} 
                language={language}
                currency={currency}
              />
            </div>

            {/* Cột phải - Thống kê & Biểu đồ */}
            <div className="dashboard-right">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <SummaryStats 
                   totalIncome={dashboardData.totalIncome} 
                   totalExpense={dashboardData.totalExpense} 
                   currentBalance={dashboardData.currentBalance} 
                   monthlyBudgetLimit={monthlyBudgetLimit}
                   savingsTargetRate={savingsTargetRate}
                   language={language}
                   currency={currency}
                />
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <ChartsRow 
                   categoryData={dashboardData.expenseByCat} 
                   weeklyData={dashboardData.weeklyData} 
                   incomeData={dashboardData.incomeByCat} 
                   language={language}
                   currency={currency}
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'transactions' ? (
          <Transactions 
            onTransactionAdded={handleTransactionAdded} 
            language={language} 
            currency={currency} 
          />
        ) : activeTab === 'reports' ? (
          <Reports 
            language={language} 
            currency={currency} 
          />
        ) : activeTab === 'settings' ? (
          <SettingsView 
            user={user} 
            setUser={setUser} 
            theme={theme}
            setTheme={setTheme}
            currency={currency}
            setCurrency={setCurrency}
            language={language}
            setLanguage={setLanguage}
            monthlyBudgetLimit={monthlyBudgetLimit}
            setMonthlyBudgetLimit={setMonthlyBudgetLimit}
            savingsTargetRate={savingsTargetRate}
            setSavingsTargetRate={setSavingsTargetRate}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Component size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
            <p>{getTranslation('developing')}</p>
          </div>
        )}
      </main>

      {/* Trợ lý FinBot */}
      <FinBot dashboardData={dashboardData} />
    </div>
  );
}

export default App;
