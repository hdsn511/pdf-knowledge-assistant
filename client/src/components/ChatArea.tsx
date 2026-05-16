import { useState, useRef, useEffect } from 'react';
import { Send, PanelLeftClose, PanelLeftOpen, Bot } from 'lucide-react';
import { Button } from './ui/button';
import type { Message } from '../types/index';
import DocLogo from './DocLogo';

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onQuery: (q: string) => void;
}

export default function ChatArea({ messages, loading, sidebarOpen, onToggleSidebar, onQuery }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  function handleSend() {
    if (!input.trim() || loading) return;
    onQuery(input.trim());
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="h-full flex flex-col">

      {/* Top Bar */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#2e241e] shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#787878] hover:text-[#eeeeee] hover:bg-[#2a211c]"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </Button>
        <span className="text-sm text-[#787878] font-sans">PDF Knowledge Assistant</span>
        <span className="text-xs text-[#787878] bg-[#2a211c] px-2 py-1 rounded-md">
          llama-3.3-70b
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2a211c] flex items-center justify-center">
              <DocLogo />
            </div>
            <h2 className="font-serif text-[#ffe0c2] text-lg font-medium">PDF Knowledge Assistant</h2>
            <p className="text-sm text-[#787878]">Upload a PDF and start asking questions</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-3 items-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#3d3028] flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} stroke="#ffe0c2" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#3d3028] text-[#ffe0c2] rounded-2xl rounded-tr-sm'
                      : 'bg-[#221b17] text-[#e8ddd2] rounded-2xl rounded-tl-sm border border-[#382e25]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex justify-start gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-[#3d3028] flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} stroke="#ffe0c2" />
                </div>
                <div className="bg-[#221b17] border border-[#382e25] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#a07e6a] animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#221b17] border border-[#382e25] flex items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents..."
            rows={1}
            className="flex-1 bg-transparent px-5 py-3.5 text-sm text-[#f0e6db] placeholder:text-[#787878] resize-none outline-none"
            style={{ maxHeight: '120px' }}
          />
          <Button
            size="icon"
            className={`m-2 p-2.5 rounded-xl transition-transform active:scale-95 ${
              input.trim() && !loading
                ? 'bg-[#ffe0c2] text-[#1a1412] hover:scale-105'
                : 'bg-[#322821] text-[#787878] opacity-20'
            }`}
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}