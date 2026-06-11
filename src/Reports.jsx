import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { getExpenseColor } from './colors';
import { getTranslation, formatCurrency, formatCurrencyCompact } from './utils';

const Reports = ({ language = 'vi', currency = 'VND' }) => {
  const [reportData, setReportData] = useState({ trendData: [], allTimeData: [], topSpends: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/reports/trends', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } catch (error) {
        console.error('Lỗi tải báo cáo:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const customTooltipStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    fontWeight: '500',
    padding: '8px 12px'
  };

  // Tính số dư luỹ kế cho LineChart từ toàn bộ dữ liệu allTimeData
  let cumulativeBalance = 0;
  const lineData = (reportData.allTimeData || reportData.trendData).map(item => {
    cumulativeBalance += (item.Thu - item.Chi);
    return {
      name: item.name,
      Số_Dư: cumulativeBalance
    };
  });

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>{getTranslation('loadingReport', language)}</div>;
  }

  return (
    <div className="reports-container animate-fade-in-up" style={{ padding: '0 40px', paddingBottom: '40px', maxWidth: '1600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-dark)' }}>{getTranslation('deepAnalysis', language)}</h2>
      
      {/* HÀNG 1: Cảnh báo Top Spends */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {reportData.topSpends.map((spend, index) => {
          const spendColor = getExpenseColor(spend.name, index);
          return (
          <div key={index} className="glass-card stat-card" style={{ padding: '20px', borderLeft: `4px solid ${spendColor}` }}>
            <div className="stat-icon-wrapper" style={{ background: `${spendColor}15`, color: spendColor, width: '48px', height: '48px' }}>
              <AlertCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">{getTranslation('topSpendMonth', language).replace('{index}', (index + 1).toString())}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>{spend.name}</div>
              <div style={{ fontSize: '1.1rem', color: '#f43f5e', fontWeight: 600 }}>-{formatCurrency(spend.total, currency, language)}</div>
            </div>
          </div>
          );
        })}
        {reportData.topSpends.length === 0 && (
           <div className="glass-card" style={{ gridColumn: 'span 3', padding: '20px', textAlign: 'center', color: '#64748b' }}>
              {getTranslation('noTopSpends', language)}
           </div>
        )}
      </div>

      {/* HÀNG 2: Biểu đồ cột kép Thu Chi 6 tháng */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <div className="chart-title">{getTranslation('cashflowReport', language)}</div>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: '0.85rem', fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: '0.85rem', fill: '#64748b'}} width={85} axisLine={false} tickLine={false} tickFormatter={(tick) => formatCurrencyCompact(tick, currency, language)} />
              <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={customTooltipStyle} formatter={(value) => formatCurrency(value, currency, language)} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar name={getTranslation('income', language)} dataKey="Thu" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
              <Bar name={getTranslation('expense', language)} dataKey="Chi" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HÀNG 3: Biểu đồ đường Tích luỹ tài sản */}
      <div className="glass-card">
        <div className="chart-title">{getTranslation('netWorthTrend', language)}</div>
        <div style={{ height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <filter id="shadowBalance" height="200%">
                  <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#3b82f6" floodOpacity="0.3"/>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: '0.85rem', fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: '0.85rem', fill: '#64748b'}} width={85} axisLine={false} tickLine={false} tickFormatter={(tick) => formatCurrencyCompact(tick, currency, language)} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(value) => formatCurrency(value, currency, language)} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="Số_Dư" name={getTranslation('netWorth', language)} stroke="#3b82f6" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }} filter="url(#shadowBalance)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Reports;
