import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { aiAgentAPI } from '../services/api';
import { AIMessage } from '../types';

export const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiAgentAPI.query({
        query: input,
        conversation_history: messages,
      });

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">AI Agent</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Your intelligent CRM assistant powered by Google Gemini 2.5 Flash
        </p>
      </div>

      <Card className="flex-1 flex flex-col" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
              >
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>CRM AI Assistant</CardTitle>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Ask me anything about your leads, contacts, deals, and more
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearChat}>
                Clear Chat
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Bot size={64} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                <p className="empty-state-text max-w-md">
                  Ask me to create leads, update deals, search contacts, or get insights about your CRM data.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  <button
                    onClick={() => setInput('Show me my recent leads')}
                    className="btn-secondary text-left p-3 text-sm"
                  >
                    <Sparkles size={16} className="inline mr-2" />
                    Show me my recent leads
                  </button>
                  <button
                    onClick={() => setInput('What deals are in my pipeline?')}
                    className="btn-secondary text-left p-3 text-sm"
                  >
                    <Sparkles size={16} className="inline mr-2" />
                    What deals are in my pipeline?
                  </button>
                  <button
                    onClick={() => setInput('Create a new lead for John Doe')}
                    className="btn-secondary text-left p-3 text-sm"
                  >
                    <Sparkles size={16} className="inline mr-2" />
                    Create a new lead
                  </button>
                  <button
                    onClick={() => setInput('Search for contacts at Acme Corp')}
                    className="btn-secondary text-left p-3 text-sm"
                  >
                    <Sparkles size={16} className="inline mr-2" />
                    Search for contacts
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
                    >
                      <Bot size={18} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
                >
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4" style={{ borderColor: 'var(--border-primary)' }}>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your CRM..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
