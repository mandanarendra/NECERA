import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';
import { neceraStore } from '../../services/store';
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Code2,
  BookOpen,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiMentorViewProps {
  initialTopic?: string;
}

export const AiMentorView: React.FC<AiMentorViewProps> = ({ initialTopic }) => {
  const { currentUser } = useAuth();
  const currentRoadmapNode = neceraStore.getRoadmapNodes().find((n) => n.status === 'in_progress');

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content: `Hello ${currentUser.fullName.split(' ')[0]}! I am your NECERA AI Engineering Mentor.
I see you are currently progressing through **${currentRoadmapNode?.conceptTitle || 'Linear & Polynomial Regression'}**.

I'm here to provide Socratic hints, clarify mathematical derivations, help debug tensor shape mismatches, or generate targeted practice problems.

How can I assist your engineering inquiry today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialTopic) {
      handleSendPrompt(`Could you explain the concept of "${initialTopic}" with geometric intuition and why it caused an assessment mistake?`);
    }
  }, [initialTopic]);

  const handleSendPrompt = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.content }));
      const response = await aiService.askMentor(query, history, {
        studentName: currentUser.fullName,
        currentModule: 'Machine Learning & Statistical Foundations',
        currentConcept: currentRoadmapNode?.conceptTitle || 'Linear & Polynomial Regression',
        conceptDescription: currentRoadmapNode?.description,
        weakTopics: currentRoadmapNode?.weakTopics || ['L1 vs L2 Weight Shrinkage Derivation'],
      });

      const assistantMsg: Message = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'I encountered a brief latency glitch. Please retry your inquiry or select one of the suggested prompts below.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init_msg_clean',
        role: 'assistant',
        content: `Chat session cleared. How can I assist your engineering study on **${currentRoadmapNode?.conceptTitle || 'Linear Regression'}**?`,
        timestamp: 'Just now',
      },
    ]);
  };

  const promptSuggestions = [
    'Explain L1 vs L2 regularization geometrically',
    'Give me a hint for vectorized cost function',
    'Why is my gradient descent diverging into NaN?',
    'Recommend my next learning path',
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* Mentor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Socratic AI Engineering Mentorship</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Mentor & Diagnostic Tutor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Contextual guidance engineered to develop deep first-principles intuition without shortcutting assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Session</span>
          </button>
        </div>
      </div>

      {/* Main 2-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Context & Suggested Prompts (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Context Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Active Learning Context</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400">Current Concept:</div>
              <div className="font-bold text-white text-sm">
                {currentRoadmapNode?.conceptTitle || 'Linear & Polynomial Regression'}
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {currentRoadmapNode?.description}
              </p>
            </div>

            {currentRoadmapNode?.weakTopics && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged Weak Topics</span>
                </div>
                <div className="text-[11px] text-amber-200">
                  {currentRoadmapNode.weakTopics.join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Quick Socratic Prompts */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Suggested Inquiries</span>
            </div>

            <div className="space-y-2">
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/60 text-xs text-slate-300 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-60 group-hover:opacity-100 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Chat Conversation Area (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden h-[620px]">
          
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isAssistant
                        ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-800/80 border border-slate-700/80 text-slate-200 shadow-sm'
                        : 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-2 font-mono ${
                        isAssistant ? 'text-slate-400' : 'text-indigo-200'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3 mr-auto">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-indigo-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>AI Mentor formulating pedagogical response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Field */}
          <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about equations, code bugs, hints, or concept intuition..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-lg shadow-indigo-600/20"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
