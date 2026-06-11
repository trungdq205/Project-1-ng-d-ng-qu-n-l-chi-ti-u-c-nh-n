import React from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, LabelList
} from 'recharts';

import { getExpenseColor } from './colors';
import { getTranslation, formatCurrency, formatCurrencyCompact } from './utils';

export const ChartsRow = ({ categoryData, weeklyData, incomeData, language = 'vi', currency = 'VND' }) => {
  // language and currency are received as props to reactively trigger re-render

  // Tính tổng để lấy phần trăm
  const totalExpense = categoryData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 1;

  const isNoData = !categoryData || categoryData.length === 0;

  const pieData = !isNoData 
    ? categoryData.map((item, idx) => ({
        name: item.name,
        value: Math.round((Number(item.amount) / totalExpense) * 100),
        color: getExpenseColor(item.name, idx)
      })) 
    : [{ name: getTranslation('noSpendingData', language), value: 100, color: '#fee2e2' }];

  // Biểu đồ tuần: Thu nhập và Chi tiêu
  const barData = (weeklyData || [
    { name: 'Tuần 1', income: 0, expense: 0 },
    { name: 'Tuần 2', income: 0, expense: 0 },
    { name: 'Tuần 3', income: 0, expense: 0 },
    { name: 'Tuần 4', income: 0, expense: 0 },
  ]).map(item => {
    let translatedName = item.name;
    if (language === 'en') {
      translatedName = item.name.replace('Tuần', 'Week');
    }
    return {
      ...item,
      name: translatedName
    };
  });

  const customTooltipStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    fontWeight: '500',
    padding: '8px 12px'
  };

  const RADIAN = Math.PI / 180;
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    if (isNoData) return null;
    const pct = pieData[index].value;
    // Lát nhỏ (≤10%): label bên ngoài với đường nối
    if (pct <= 10) {
      const outerX = cx + (outerRadius + 14) * Math.cos(-midAngle * RADIAN);
      const outerY = cy + (outerRadius + 14) * Math.sin(-midAngle * RADIAN);
      const labelX = cx + (outerRadius + 30) * Math.cos(-midAngle * RADIAN);
      const labelY = cy + (outerRadius + 30) * Math.sin(-midAngle * RADIAN);
      const anchor = labelX > cx ? 'start' : 'end';
      return (
        <g>
          <line x1={outerX} y1={outerY} x2={labelX} y2={labelY} stroke={pieData[index].color} strokeWidth={1.5} />
          <text x={labelX} y={labelY} fill={pieData[index].color} textAnchor={anchor} dominantBaseline="central" fontSize={11} fontWeight="bold">
            {`${pct}%`}
          </text>
        </g>
      );
    }
    // Lát lớn: label bên trong
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${pct}%`}
      </text>
    );
  };

  // === Dữ liệu biểu đồ Thu nhập ===
  const INCOME_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
  const totalIncome = incomeData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 1;
  const isNoIncomeData = !incomeData || incomeData.length === 0;

  const incomePieData = !isNoIncomeData
    ? incomeData.map((item, idx) => ({
        name: item.name,
        value: Number(item.amount),
        percent: Math.round((Number(item.amount) / totalIncome) * 100),
        color: item.color || INCOME_COLORS[idx % INCOME_COLORS.length]
      }))
    : [{ name: getTranslation('noIncomeData', language), value: 100, percent: 100, color: '#e2e8f0' }];

  const renderIncomePieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    if (isNoIncomeData) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${incomePieData[index].percent}%`}
      </text>
    );
  };

  return (
    <>
      {/* HÀNG 1: Phân bổ Chi tiêu + Phân bổ Thu nhập (ngang hàng) */}
      <div className="charts-row">
        <div className="glass-card chart-card">
          <div className="chart-title">{getTranslation('spendingAllocation', language)}</div>
          <div className="chart-content" style={{ height: '260px', position: 'relative' }}>
            {isNoData ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#fee2e2" strokeWidth="20" opacity="0.6" />
                </svg>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>{getTranslation('noSpendingData', language)}</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={pieData}
                    cx="40%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                    minAngle={20}
                    labelLine={false}
                    label={renderPieLabel}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} itemStyle={{color: '#1e293b'}} formatter={(value) => `${value}%`} />
                  <Legend 
                     layout="vertical" 
                     verticalAlign="middle" 
                     align="right" 
                     iconType="circle"
                     wrapperStyle={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, lineHeight: '2' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card chart-card">
          <div className="chart-title">{getTranslation('incomeAllocation', language)}</div>
          <div className="chart-content" style={{ height: '260px', position: 'relative' }}>
            {isNoIncomeData ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#d1fae5" strokeWidth="20" opacity="0.6" />
                </svg>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>{getTranslation('noIncomeData', language)}</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={incomePieData}
                    cx="40%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                    labelLine={false}
                    label={renderIncomePieLabel}
                  >
                    {incomePieData.map((entry, index) => (
                      <Cell key={`income-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#1e293b' }} formatter={(value) => formatCurrency(value, currency, language)} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, lineHeight: '2' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* HÀNG 2: Thống kê thu nhập và chi tiêu theo tuần (full width) */}
      <div className="glass-card" style={{ marginTop: '24px' }}>
        <div className="chart-title">{getTranslation('weeklyStats', language)}</div>
        <div className="chart-content" style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: '0.85rem', fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{fontSize: '0.85rem', fill: '#64748b'}} width={80} axisLine={false} tickLine={false} tickFormatter={(tick) => formatCurrencyCompact(tick, currency, language)} />
              <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={customTooltipStyle} formatter={(value) => formatCurrency(value, currency, language)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.9rem', color: '#64748b', paddingBottom: '10px' }} verticalAlign="top" height={40} />
              <Bar name={getTranslation('income', language)} dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20}>
                <LabelList dataKey="income" position="top" fill="#64748b" fontSize={10} fontWeight={600} formatter={(v) => { if(!v) return ''; const f = formatCurrencyCompact(v, currency, language); return f.replace(' VNĐ', ''); }} />
              </Bar>
              <Bar name={getTranslation('expense', language)} dataKey="expense" fill="#E53935" radius={[4, 4, 0, 0]} barSize={20}>
                <LabelList dataKey="expense" position="top" fill="#64748b" fontSize={10} fontWeight={600} formatter={(v) => { if(!v) return ''; const f = formatCurrencyCompact(v, currency, language); return f.replace(' VNĐ', ''); }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

// === BIỂU ĐỒ PHÂN BỔ THU NHẬP ===
const INCOME_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

export const IncomeAllocationChart = ({ incomeData }) => {
  const totalIncome = incomeData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 1;
  const isNoData = !incomeData || incomeData.length === 0;

  const pieData = !isNoData
    ? incomeData.map((item, idx) => ({
        name: item.name,
        value: Number(item.amount),
        percent: Math.round((Number(item.amount) / totalIncome) * 100),
        color: item.color || INCOME_COLORS[idx % INCOME_COLORS.length]
      }))
    : [{ name: getTranslation('noIncomeData'), value: 100, percent: 100, color: '#e2e8f0' }];

  const RADIAN = Math.PI / 180;
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    if (isNoData) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {`${pieData[index].percent}%`}
      </text>
    );
  };

  const customTooltipStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    fontWeight: '500',
    padding: '8px 12px'
  };

  return (
    <div className="glass-card chart-card">
      <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          color: 'white', fontSize: '14px', fontWeight: 700
        }}>₫</span>
        {getTranslation('incomeAllocation')}
      </div>
      <div className="chart-content" style={{ height: '260px', position: 'relative' }}>
        {isNoData ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="45" fill="none" stroke="#d1fae5" strokeWidth="20" opacity="0.6" />
            </svg>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>{getTranslation('noIncomeData')}</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <filter id="incomePieShadow" height="130%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10b981" floodOpacity="0.15"/>
                </filter>
              </defs>
              <Pie
                data={pieData}
                cx="40%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={6}
                labelLine={false}
                label={renderPieLabel}
                filter="url(#incomePieShadow)"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`income-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={customTooltipStyle}
                itemStyle={{ color: '#1e293b' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, lineHeight: '2' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export const TrendLineChart = () => {
  const currency = localStorage.getItem('currency') || 'VND';
  const language = localStorage.getItem('language') || 'vi';

  // Tạo dữ liệu mock phù hợp với tiền tệ đang chọn
  const lineData = React.useMemo(() => {
    const data = [];
    const scale = currency === 'USD' ? 1 : 26000;
    let balance = 500 * scale;
    let savings = 600 * scale;
    const days = [1, 3, 5, 7, 9, 10, 12, 13, 14, 15, 17, 19, 21];
    
    for (let i = 0; i < days.length; i++) {
      balance += (Math.abs(Math.sin(i + 1)) * 800 + 200) * scale;
      savings += (Math.abs(Math.cos(i + 2)) * 600 + 100) * scale;
      if (i === 7) balance -= 1000 * scale;

      data.push({
        day: days[i].toString(),
        Balance: Math.round(balance),
        Savings: Math.round(savings)
      });
    }
    return data;
  }, [currency]);

  return (
      <div className="glass-card" style={{ minHeight: '320px', paddingRight: '24px' }}>
        <div className="chart-title">{getTranslation('balanceSavingsTrend')}</div>
        <div className="chart-content" style={{ height: '320px', marginTop: '20px' }}>
           <ResponsiveContainer width="100%" height="100%">
             <LineChart
               data={lineData}
               margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
             >
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
               <XAxis dataKey="day" tick={{fontSize: '0.85rem', fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
               <YAxis tick={{fontSize: '0.85rem', fill: '#64748b'}} axisLine={false} tickLine={false} width={70} tickFormatter={(tick) => formatCurrencyCompact(tick)} />
               <Tooltip 
                  contentStyle={{background: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'}} 
                  formatter={(value) => formatCurrency(value)} 
               />
               <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: "0.9rem", color: "#64748b", paddingBottom: "10px"}} verticalAlign="top" height={40} />
               
               <defs>
                 <filter id="shadowBalance" height="200%">
                   <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#3b82f6" floodOpacity="0.2"/>
                 </filter>
                 <filter id="shadowSavings" height="200%">
                   <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#10b981" floodOpacity="0.2"/>
                 </filter>
               </defs>

               <Line type="monotone" dataKey="Balance" name={language === 'vi' ? 'Số dư' : 'Balance'} stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} filter="url(#shadowBalance)" />
               <Line type="monotone" dataKey="Savings" name={language === 'vi' ? 'Tiết kiệm' : 'Savings'} stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} filter="url(#shadowSavings)" />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>
  );
};

