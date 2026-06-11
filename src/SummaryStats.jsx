import React from 'react';
import { ArrowDownToLine, ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency, getTranslation } from './utils';

const SummaryStats = ({ 
  totalIncome, 
  totalExpense, 
  monthlyBudgetLimit = 10000000, 
  savingsTargetRate = 20,
  language = 'vi',
  currency = 'VND'
}) => {
  const budgetLimit = monthlyBudgetLimit;
  const targetRate = savingsTargetRate;

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
  
  const isBudgetExceeded = totalExpense > budgetLimit;
  const budgetUsagePercent = Math.min(100, Math.round((totalExpense / budgetLimit) * 100));
  const remainingBudget = Math.max(0, budgetLimit - totalExpense);

  const isSavingsTargetMet = savingsRate >= targetRate;
  const savingsProgressPercent = Math.min(100, Math.round((savingsRate / (targetRate || 1)) * 100));

  return (
    <div className="summary-cards-wrapper">
      {/* CARD 1: TỔNG THU */}
      <div className="glass-card stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="stat-icon-wrapper" style={{ background: 'var(--gradient-income)', boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)' }}>
            <ArrowDownToLine size={28} />
          </div>
          <div className="stat-info">
            <div className="stat-title">{getTranslation('totalIncome', language)}</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(totalIncome, currency, language)}</div>
          </div>
        </div>
      </div>
      
      {/* CARD 2: TỔNG CHI */}
      <div className="glass-card stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="stat-icon-wrapper" style={{ background: 'var(--gradient-expense)', boxShadow: '0 8px 20px -5px rgba(244, 63, 94, 0.4)' }}>
            <ArrowUpRight size={28} />
          </div>
          <div className="stat-info">
            <div className="stat-title">{getTranslation('totalExpense', language)}</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(totalExpense, currency, language)}</div>
          </div>
        </div>
        
        {/* Budget Status */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isBudgetExceeded ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {isBudgetExceeded ? (
                <>
                  <AlertTriangle size={12} />
                  {getTranslation('budgetWarning', language)}
                </>
              ) : (
                <>
                  <CheckCircle size={12} />
                  {getTranslation('budgetOk', language)}
                </>
              )}
            </span>
            <span style={{ color: 'var(--text-light)' }}>
              {isBudgetExceeded ? `+${formatCurrency(totalExpense - budgetLimit, currency, language)}` : `${language === 'vi' ? 'Còn lại' : 'Remaining'}: ${formatCurrency(remainingBudget, currency, language)}`}
            </span>
          </div>
          {/* Progress Bar */}
          <div style={{ height: '5px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${budgetUsagePercent}%`, 
                background: isBudgetExceeded ? 'var(--gradient-expense)' : 'var(--gradient-income)', 
                transition: 'width 0.3s ease',
                borderRadius: '3px'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* CARD 3: TỶ LỆ TIẾT KIỆM */}
      <div className="glass-card stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="stat-icon-wrapper" style={{ background: 'var(--gradient-savings)', boxShadow: '0 8px 20px -5px rgba(59, 130, 246, 0.4)' }}>
            <TrendingUp size={28} />
          </div>
          <div className="stat-info">
            <div className="stat-title">{getTranslation('savingsRate', language)}</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{savingsRate}%</div>
          </div>
        </div>

        {/* Savings Target Status */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isSavingsTargetMet ? '#10b981' : '#f57c00', fontWeight: 600 }}>
              {isSavingsTargetMet ? (
                <>
                  <CheckCircle size={12} />
                  {getTranslation('savingsTargetOk', language)}
                </>
              ) : (
                <>
                  <AlertTriangle size={12} />
                  {getTranslation('savingsTargetWarning', language)}
                </>
              )}
            </span>
            <span style={{ color: 'var(--text-light)' }}>
              {getTranslation('settings', language)}: {targetRate}%
            </span>
          </div>
          {/* Progress Bar */}
          <div style={{ height: '5px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${savingsProgressPercent}%`, 
                background: isSavingsTargetMet ? 'var(--gradient-savings)' : 'linear-gradient(135deg, #f57c00 0%, #fbc02d 100%)', 
                transition: 'width 0.3s ease',
                borderRadius: '3px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;

