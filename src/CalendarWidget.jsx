import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getExpenseColor } from './colors';
import { getTranslation, formatCurrency } from './utils';

const CalendarWidget = ({ selectedMonth, setSelectedMonth, transactionDays = [], monthlyTransactions = [], language = 'vi', currency = 'VND' }) => {
  // language and currency are received as props to reactively trigger re-render
  
  const daysOfWeek = language === 'vi'
    ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const monthNames = language === 'vi' 
    ? ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(parseInt((selectedMonth || '2026-03').split('-')[0], 10));
  
  const [yearStr, monthStr] = (selectedMonth || '2026-03').split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const handlePrevMonth = () => {
    let newM = month - 1;
    let newY = year;
    if (newM < 1) { newM = 12; newY--; }
    if(setSelectedMonth) setSelectedMonth(`${newY}-${String(newM).padStart(2, '0')}`);
  };
  
  const handleNextMonth = () => {
    let newM = month + 1;
    let newY = year;
    if (newM > 12) { newM = 1; newY++; }
    if(setSelectedMonth) setSelectedMonth(`${newY}-${String(newM).padStart(2, '0')}`);
  };
  
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const daysPrevMonth = new Date(year, month - 1, 0).getDate();
  
  const days = [];
  
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ num: daysPrevMonth - i, otherMonth: true });
  }
  
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === month;

  const [selectedDay, setSelectedDay] = useState(isCurrentMonth ? today.getDate() : 1);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ 
      num: i, 
      event: transactionDays.includes(i),
      active: i === selectedDay
    });
  }
  
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ num: i, otherMonth: true });
  }

  return (
    <div className="glass-card calendar-widget">
      <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <Calendar size={20} color="var(--accent-blue)" /> {getTranslation('spendingCalendar')}
      </div>
      
      <div className="calendar-header" style={{ marginBottom: '24px', fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={handlePrevMonth} className="nav-btn" style={{ padding: '8px', borderRadius: '50%', background: 'var(--input-bg)', color: 'var(--text-dark)', border: '1px solid var(--input-border)' }}><ChevronLeft size={18} /></button>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span 
            onClick={() => { setShowPicker(!showPicker); setPickerYear(year); }}
            style={{ fontWeight: '700', color: 'var(--text-dark)', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--input-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {language === 'vi' ? `Tháng ${String(month).padStart(2, '0')}, ${year}` : `Month ${String(month).padStart(2, '0')}, ${year}`}
          </span>
          
          {showPicker && (
            <div style={{ 
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', 
              background: 'var(--secondary-bg)', border: 'var(--glass-border)', borderRadius: '16px', 
              padding: '16px', boxShadow: 'var(--glass-shadow)', zIndex: 100, width: '250px', marginTop: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <button onClick={() => setPickerYear(y => y - 1)} style={{ padding: '8px', borderRadius: '50%', background: 'var(--input-bg)', border: '1px solid var(--input-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}><ChevronLeft size={16} color="var(--text-dark)" /></button>
                <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-dark)' }}>{language === 'vi' ? `Năm ${pickerYear}` : `Year ${pickerYear}`}</span>
                <button onClick={() => setPickerYear(y => y + 1)} style={{ padding: '8px', borderRadius: '50%', background: 'var(--input-bg)', border: '1px solid var(--input-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}><ChevronRight size={16} color="var(--text-dark)" /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => {
                  const isSelected = m === month && pickerYear === year;
                  return (
                    <button 
                      key={m}
                      onClick={() => {
                        if(setSelectedMonth) setSelectedMonth(`${pickerYear}-${String(m).padStart(2, '0')}`);
                        setShowPicker(false);
                      }}
                      style={{ 
                        padding: '10px 0', borderRadius: '10px', border: 'none', 
                        background: isSelected ? 'var(--accent-blue)' : 'var(--input-bg)',
                        color: isSelected ? 'white' : 'var(--text-dark)', 
                        cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--input-border)'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--input-bg)'; }}
                    >
                      {monthNames[m - 1]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <button onClick={handleNextMonth} className="nav-btn" style={{ padding: '8px', borderRadius: '50%', background: 'var(--input-bg)', color: 'var(--text-dark)', border: '1px solid var(--input-border)' }}><ChevronRight size={18} /></button>
      </div>

      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '16px 0' }}>
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-name" style={{ fontWeight: '600', color: '#94a3b8', marginBottom: '12px' }}>{day}</div>
        ))}

        {days.map((day, index) => {
            const isEvent = day.event;
            const isActive = day.active;
            const isOther = day.otherMonth;
            
            return (
              <div key={index} style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '44px',
                width: '44px',
                margin: '0 auto',
                borderRadius: '14px',
                cursor: 'pointer',
                fontWeight: isActive ? '700' : '500',
                color: isOther ? 'var(--text-light)' : (isActive ? 'white' : 'var(--text-dark)'),
                opacity: isOther ? 0.4 : 1,
                background: isActive ? 'var(--gradient-savings)' : 'transparent',
                boxShadow: isActive ? '0 8px 20px -6px rgba(59, 130, 246, 0.5)' : 'none',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                if (!isOther) setSelectedDay(prev => prev === day.num ? null : day.num);
              }}
              onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.background = 'var(--primary-bg)'; }}
              onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {day.num}
                {isEvent && !isActive && (
                  <div style={{ position: 'absolute', bottom: '6px', width: '4px', height: '4px', borderRadius: '50%', background: '#f43f5e' }} />
                )}
                {isEvent && isActive && (
                  <div style={{ position: 'absolute', bottom: '6px', width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />
                )}
              </div>
            );
        })}

      </div>

      {/* Chi tiết giao dịch ngày được chọn */}
      {selectedDay !== null && (
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--input-border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-dark)' }}>
            {language === 'vi' ? `Chi tiết ngày ${selectedDay}/${month}/${year}` : `Details for ${selectedDay}/${month}/${year}`}
          </h3>
          
          {(() => {
            const txForDay = monthlyTransactions.filter(tx => Number(tx.event_day) === selectedDay);

            return txForDay.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', fontSize: '0.95rem' }}>
                {getTranslation('noTransactionsForDay')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {txForDay.map(t => {
                    const dotColor = t.type === 'expense' ? getExpenseColor(t.category_name) : t.color;
                    return (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor }}></div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{t.category_name}</div>
                        {t.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '2px' }}>{t.description}</div>}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency, language)}
                    </div>
                  </div>
                    );
                  })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
