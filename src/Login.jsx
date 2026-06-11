import React, { useState } from 'react';
import { Component, Lock, Mail, User } from 'lucide-react';
import './App.css'; // Mượn tạm CSS của App

const Login = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const url = isLoginView 
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi kết nối server');
      }

      if (isLoginView) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess();
      } else {
        setIsLoginView(true);
        setErrorMsg('Đăng ký thành công! Hãy đăng nhập.');
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      <div style={{ background: 'var(--secondary-bg)', padding: '40px', borderRadius: '16px', boxShadow: 'var(--glass-shadow)', width: '100%', maxWidth: '400px', border: 'var(--glass-border)', backdropFilter: 'blur(10px)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', width: '60px', height: '60px', borderRadius: '16px', marginBottom: '15px' }}>
            <Component size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{isLoginView ? 'Đăng nhập FinApp' : 'Tạo tài khoản mới'}</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '5px' }}>
            Vui lòng nhập thông tin của bạn bên dưới
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLoginView && (
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Họ và tên" 
                required={!isLoginView}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: 'var(--text-dark)', outline: 'none' }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="email" 
              placeholder="Email" 
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: 'var(--text-dark)', outline: 'none' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: 'var(--text-dark)', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ marginTop: '10px', padding: '12px', borderRadius: '8px', background: '#3b82f6', color: 'white', fontWeight: 600, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Đăng ký')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
          <span 
            onClick={() => { setIsLoginView(!isLoginView); setErrorMsg(''); }}
            style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
