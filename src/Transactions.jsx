import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, FileText } from 'lucide-react';
import { getExpenseColor } from './colors';
import { getTranslation, formatCurrency } from './utils';

const Transactions = ({ onTransactionAdded, language = 'vi', currency = 'VND' }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // States cho form thêm mới
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const currencySymbol = currency;

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Lỗi tải giao dịch:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      }
    } catch (error) {
      console.error('Lỗi tải danh mục:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(getTranslation('deleteConfirm'))) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        fetchTransactions();
        if (onTransactionAdded) onTransactionAdded();
      }
    } catch (error) {
      console.error('Lỗi xóa giao dịch:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !categoryId || !date) return alert(getTranslation('alertFillAll'));
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Nếu tiền tệ là USD, người dùng nhập USD -> quy đổi sang VND để lưu trữ
      const finalAmount = currencySymbol === 'USD' ? Number(amount) * 26000 : Number(amount);

      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category_id: categoryId,
          amount: finalAmount,
          date,
          description
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setAmount('');
        setDescription('');
        fetchTransactions();
        if (onTransactionAdded) onTransactionAdded(date); // Gọi callback để refresh Dashboard và nhảy tới tháng tương ứng
      } else {
        alert(getTranslation('alertAddFail'));
      }
    } catch (error) {
      console.error('Lỗi thêm giao dịch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transactions-container animate-fade-in-up" style={{ padding: '0 20px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{getTranslation('historyTitle')}</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-blue)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 500, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
        >
          <Plus size={18} /> {getTranslation('addButton')}
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>{getTranslation('dateHeader')}</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>{getTranslation('categoryHeader')}</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>{getTranslation('detailsHeader')}</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>{getTranslation('amountHeader')}</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>{getTranslation('actionHeader')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>{getTranslation('noTransactions')}</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                        <Calendar size={16} color="var(--text-secondary)" />
                        {new Date(t.date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                      </div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      {(() => {
                        const badgeColor = t.type === 'expense' ? getExpenseColor(t.category_name) : t.color;
                        return (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${badgeColor}20`, color: badgeColor, padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 }}>
                            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: badgeColor}}></div>
                            {t.category_name}
                          </div>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '15px 20px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                       {t.description || '-'}
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 600, color: t.type === 'income' ? '#10b981' : '#f43f5e' }}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(t.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '5px', borderRadius: '4px' }} className="btn-hover-bg">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Giao Dịch */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '30px', animation: 'scaleUp 0.3s ease' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>{getTranslation('addTransaction')}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{getTranslation('category')}</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type === 'income' ? getTranslation('thu') : getTranslation('chi')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {getTranslation('amountLabel')} ({currencySymbol === 'USD' ? 'USD' : 'VNĐ'})
                </label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={currencySymbol === 'USD' ? 'e.g. 50' : 'e.g. 50000'}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{getTranslation('date')}</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{getTranslation('description')}</label>
                <div style={{ position: 'relative' }}>
                  <FileText size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={getTranslation('notePlaceholder')}
                    style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 500, cursor: 'pointer' }}
                >
                  {getTranslation('cancelBtn')}
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--accent-blue)', color: 'white', border: 'none', fontWeight: 500, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                  {isLoading ? getTranslation('loadingSaveTx') : getTranslation('saveTxBtn')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
