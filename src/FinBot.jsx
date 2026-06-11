import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquareText } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const FinBot = ({ dashboardData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Chào bạn, mình là FinBot! Mình đã đọc các số liệu mới nhất của bạn trong tháng này. Mình có thể giúp gì cho bạn hôm nay?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Chưa cấu hình VITE_GEMINI_API_KEY trong file .env");
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0) + ' VNĐ';
      const savingsRate = dashboardData?.totalIncome > 0 ? Math.round(((dashboardData.totalIncome - dashboardData.totalExpense) / dashboardData.totalIncome) * 100) : 0;
      
      const expenseBreakdown = dashboardData?.expenseByCat 
        ? dashboardData.expenseByCat.map(cat => `- ${cat.name}: ${formatCurrency(cat.amount)}`).join('\n') 
        : 'Chưa có phân bổ chi tiêu.';

      const systemInstruction = `Bạn là FinBot, một trợ lý tài chính cá nhân thân thiện và chuyên nghiệp trên ứng dụng FinApp.
Dữ liệu sinh hoạt của người dùng trong tháng này (Lấy từ Database thật):
- Tổng Thu: ${formatCurrency(dashboardData?.totalIncome)}
- Tổng Chi: ${formatCurrency(dashboardData?.totalExpense)}
- Số dư hiện tại: ${formatCurrency(dashboardData?.currentBalance)}
- Tỷ lệ tiết kiệm: ${savingsRate}%
- Phân bổ chi phí:
${expenseBreakdown}

Nhiệm vụ của bạn là đưa ra những lời khuyên ngắn gọn, thân thiện, và dễ hiểu về tài chính dựa trên dữ liệu trên. Kết thúc câu bằng một lời động viên vui vẻ. Sử dụng markdown để in đậm (**) các con số nếu cần.`;

      const formattedHistory = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      formattedHistory.push({ role: 'user', parts: [{ text: userMessage }] });

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: formattedHistory,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });
      } catch (err) {
        console.warn("Lỗi khi dùng gemini-2.5-flash, thử chuyển sang gemini-flash-latest...", err);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: formattedHistory,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });
        } catch (err2) {
          console.warn("Lỗi khi dùng gemini-flash-latest, thử chuyển sang gemini-flash-lite-latest...", err2);
          response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: formattedHistory,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });
        }
      }

      if (response && response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `Bot báo lỗi: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="finbot-container">
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageSquareText size={28} />
        </button>
      </div>
    );
  }

  return (
    <div className="finbot-container">
      <div className="chat-window">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Bot size={18} color="white" />
              </div>
              <span>FinBot Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ color: '#cbd5e1' }}><X size={20} /></button>
        </div>

        <div className="chat-body scrollbar-hide" ref={scrollRef}>
          <div style={{ alignSelf: 'center', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>Hôm nay</div>
          
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`bubble ${msg.role === 'model' ? 'bot' : 'user'}`} 
              style={msg.role === 'model' ? {whiteSpace: 'pre-line'} : {}}
            >
              <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ))}

          {isLoading && (
            <div className="bubble bot" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              Đang phân tích...
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Hỏi FinBot về tình hình tài chính..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            style={{ 
              color: isLoading ? '#94a3b8' : '#3b82f6', 
              background: '#eff6ff', 
              padding: '10px', 
              borderRadius: '50%', 
              display: 'flex',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
              <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinBot;
