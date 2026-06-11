import React, { useState, useEffect } from 'react';
import { User, Lock, Palette, Coins, ShieldAlert } from 'lucide-react';
import { getTranslation, formatCurrency } from './utils';

const SettingsView = ({ 
  user, 
  setUser,
  theme,
  setTheme,
  currency,
  setCurrency,
  language,
  setLanguage,
  monthlyBudgetLimit,
  setMonthlyBudgetLimit,
  savingsTargetRate,
  setSavingsTargetRate
}) => {
  // Profile settings state
  const [profileName, setProfileName] = useState(user.name || '');
  const [profileEmail, setProfileEmail] = useState(user.email || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Security password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  const [prefSuccess, setPrefSuccess] = useState('');

  // Sync user prop if it changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    if (!profileName.trim() || !profileEmail.trim()) {
      return setProfileError(getTranslation('profileErrorFields'));
    }

    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileName.trim(), email: profileEmail.trim() })
      });

      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || `Lỗi server (${response.status})`);
      }

      // Save user updates
      const updatedUser = { ...user, name: profileName.trim(), email: profileEmail.trim() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setProfileSuccess(getTranslation('profileSuccessMsg'));
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecuritySuccess('');
    setSecurityError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setSecurityError(getTranslation('passwordErrorFields'));
    }

    if (newPassword !== confirmPassword) {
      return setSecurityError(getTranslation('passwordErrorMismatch'));
    }

    if (newPassword.length < 6) {
      return setSecurityError(getTranslation('passwordErrorLength'));
    }

    setSecurityLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || `Lỗi server (${response.status})`);
      }

      setSecuritySuccess(getTranslation('securitySuccessMsg'));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSecurityError(err.message);
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setPrefSuccess(getTranslation('preferencesSuccessMsg'));
    setTimeout(() => {
      setPrefSuccess('');
    }, 1500);
  };

  const handleThemeChange = (val) => {
    setTheme(val);
    localStorage.setItem('theme', val);
  };

  const handleCurrencyChange = (val) => {
    setCurrency(val);
    localStorage.setItem('currency', val);
  };

  const handleLanguageChange = (val) => {
    setLanguage(val);
    localStorage.setItem('language', val);
  };

  const handleBudgetChange = (val) => {
    setMonthlyBudgetLimit(val);
    localStorage.setItem('monthlyBudgetLimit', val.toString());
  };

  const handleSavingsChange = (val) => {
    setSavingsTargetRate(val);
    localStorage.setItem('savingsTargetRate', val.toString());
  };

  return (
    <div style={{ padding: '0 40px 40px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="animate-fade-in-up">
        
        {/* Cột trái: Hồ sơ & Bảo mật */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Card Hồ sơ */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <User size={20} color="#3b82f6" />
              {getTranslation('profileTitle')}
            </h3>

            {profileSuccess && (
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '6px' }}>{getTranslation('fullName')}</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '6px' }}>{getTranslation('emailAddress')}</label>
                <input 
                  type="email" 
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={profileLoading}
                style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', fontWeight: 600, border: 'none', cursor: profileLoading ? 'not-allowed' : 'pointer', opacity: profileLoading ? 0.7 : 1 }}
              >
                {profileLoading ? getTranslation('loadingSave') : getTranslation('saveChanges')}
              </button>
            </form>
          </div>

          {/* Card Đổi mật khẩu */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Lock size={20} color="#f43f5e" />
              {getTranslation('securityTitle')}
            </h3>

            {securitySuccess && (
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>
                {securitySuccess}
              </div>
            )}
            {securityError && (
              <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>
                {securityError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '6px' }}>{getTranslation('currentPassword')}</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '6px' }}>{getTranslation('newPassword')}</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '6px' }}>{getTranslation('confirmPassword')}</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={securityLoading}
                style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', color: 'white', fontWeight: 600, border: 'none', cursor: securityLoading ? 'not-allowed' : 'pointer', opacity: securityLoading ? 0.7 : 1 }}
              >
                {securityLoading ? getTranslation('loadingPassword') : getTranslation('updatePassword')}
              </button>
            </form>
          </div>
        </div>

        {/* Cột phải: Ưu tiên Hệ thống & Tài chính */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Card Ưu tiên */}
          <div className="glass-card" style={{ height: '100%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Palette size={20} color="#10b981" />
              {getTranslation('preferencesTitle')}
            </h3>

            {prefSuccess && (
              <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '15px' }}>
                {prefSuccess}
              </div>
            )}

            <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Theme */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px' }}>{getTranslation('themeLabel')}</label>
                <select 
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="light">{getTranslation('themeLight')}</option>
                  <option value="nebula-dark">{getTranslation('themeNebulaDark')}</option>
                  <option value="deep-emerald">{getTranslation('themeDeepEmerald')}</option>
                </select>
              </div>

              {/* Currency & Language */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px' }}>
                    <Coins size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    {getTranslation('currencyLabel')}
                  </label>
                  <select 
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none' }}
                  >
                    <option value="VND">VNĐ (đ)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '8px' }}>{getTranslation('languageLabel')}</label>
                  <select 
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--input-text)', outline: 'none' }}
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '5px 0' }} />

              {/* Monthly Spending Limit */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
                    <ShieldAlert size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                    {getTranslation('monthlyBudgetLabel')}
                  </label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6' }}>
                    {formatCurrency(monthlyBudgetLimit)}
                  </span>
                </div>
                <input 
                  type="range"
                  min="1000000"
                  max="50000000"
                  step="1000000"
                  value={monthlyBudgetLimit}
                  onChange={(e) => handleBudgetChange(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#3b82f6' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{getTranslation('budgetLimitHint')}</span>
              </div>

              {/* Savings Goal Target Rate */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>{getTranslation('monthlySavingsLabel')}</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>{savingsTargetRate}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={savingsTargetRate}
                  onChange={(e) => handleSavingsChange(Number(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer', accentColor: '#10b981' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{getTranslation('savingsLimitHint')}</span>
              </div>

              <button 
                type="submit" 
                style={{ padding: '12px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%', marginTop: '10px' }}
              >
                {getTranslation('savePreferences')}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
