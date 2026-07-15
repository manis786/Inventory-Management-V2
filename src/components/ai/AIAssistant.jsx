import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Minimize2, Maximize2, RotateCcw, Package, Users, Truck, ShoppingCart, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
const MdText = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="ai-md-body">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-2 mb-0.5">{line.slice(4)}</h4>;
        if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2 mb-1">{line.slice(3)}</h3>;
        if (line.startsWith('# ')) return <h2 key={i} className="text-sm font-black text-slate-800 dark:text-slate-100 mt-2 mb-1">{line.slice(2)}</h2>;
        if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} className="flex items-start gap-1.5 my-0.5"><span className="text-indigo-500">•</span><span className="text-[11px] text-slate-600 dark:text-slate-400">{line.slice(2)}</span></div>;
        return <p key={i} className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed my-0.5">{line}</p>;
      })}
    </div>
  );
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Assalamu Alaikum! Main MartPro AI hoon. Kaise madad kar sakta hoon?' }]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusText, setStatusText] = useState('');
  const abortControllerRef = useRef(null); // Sahi tareeka: Ref use karein
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const QUICK_PROMPTS = [
    { label: 'Low Stock', text: 'Low stock items batao', icon: Package },
    { label: 'Out of Stock', text: 'Out of stock items batao', icon: Package },
    { label: 'Customers', text: 'Customer details batao', icon: Users },
    { label: 'Suppliers', text: 'Supplier details batao', icon: Truck },
    { label: 'Recent Sales', text: 'Recent sales dikhao', icon: ShoppingCart },
    { label: 'Revenue', text: 'Total revenue kitna hai', icon: TrendingUp },
    { label: 'Summary', text: 'Business summary dikhao', icon: BarChart3 },
  ];


    const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    setStatusText('');
  };

  const clearChat = () => setMessages([{ role: 'assistant', content: 'Chat clear ho gaya!' }]);

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isStreaming) return;
    
    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setStatusText('Fetching data...');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history: messages }),
        signal: abortControllerRef.current.signal
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        chunk.split('\n').forEach(line => {
          if (line.startsWith('data: ')) {
            try {
                const json = JSON.parse(line.replace('data: ', ''));
                if (json.type === 'status') setStatusText(json.text);
                if (json.type === 'chunk') {
                  aiResponse += json.text;
                  setMessages(prev => {
                    let newMsgs = [...prev];
                    if (newMsgs[newMsgs.length - 1]?.role === 'assistant') {
                      newMsgs[newMsgs.length - 1].content = aiResponse;
                    } else {
                      newMsgs.push({ role: 'assistant', content: aiResponse });
                    }
                    return newMsgs;
                  });
                }
            } catch(e) {}
          }
        });
      }
    } catch (err) { if (err.name !== 'AbortError') console.error(err); } 
    finally { setIsStreaming(false); setStatusText(''); }
  };
  

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <>
      {!open && <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-xl z-50"><Bot /></button>}
      {open && (
        <div className={`fixed bottom-6 right-6 w-[400px] h-[600px] bg-white border rounded-3xl shadow-2xl flex flex-col z-50 ${minimized ? 'h-14 overflow-hidden' : ''}`}>
          <div className="flex justify-between p-4 bg-indigo-600 text-white rounded-t-3xl">
            <p className="font-bold">MartPro AI</p>
            <div className="flex gap-2">
              <button onClick={clearChat}><RotateCcw size={14} /></button>
              <button onClick={() => setMinimized(!minimized)}>{minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}</button>
              <button onClick={() => setOpen(false)}><X size={14} /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`p-2 rounded-xl text-xs ${m.role === 'user' ? 'bg-indigo-600 text-white ml-auto max-w-[80%]' : 'bg-slate-100 max-w-[80%]'}`}>
                {m.role === 'user' ? m.content : <MdText text={m.content} />}
              </div>
            ))}
            {statusText && <p className="text-[10px] text-indigo-500 italic">{statusText}</p>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t">
            <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="w-full border p-2 rounded-lg text-xs" placeholder="Sawaal likhein..." />
            <button onClick={() => sendMessage()} disabled={isStreaming} className="w-full bg-indigo-600 text-white mt-2 p-2 rounded-lg">{isStreaming ? 'Streaming...' : 'Send'}</button>
          </div>
        </div>
      )}
    </>
  );
}