import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { aiAgentAPI } from '../services/api';
import { AIAgentMessage, AIAgentResponse, AIAgentSuggestion, GeminiMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface AIAgentChatProps {
  context?: any;
  onActionComplete?: () => void;
}

export const AIAgentChat: React.FC<AIAgentChatProps> = ({ context, onActionComplete }) => {
  const [messages, setMessages] = useState<AIAgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationHistory, setConversationHistory] = useState<GeminiMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default suggestions based on context
  const getDefaultSuggestions = (): AIAgentSuggestion[] => {
    const contextPage = context?.page || 'general';

    const suggestionMap: Record<string, AIAgentSuggestion[]> = {
      dashboard: [
        { text: "Show me my pipeline summary", category: "query", priority: "high" },
        { text: "What are my top 5 deals by value?", category: "query", priority: "high" },
        { text: "How many leads do I have in the qualified stage?", category: "query", priority: "medium" },
        { text: "Create a new lead for John Doe", category: "action", priority: "medium" },
      ],
      leads: [
        { text: "Show me leads from Google", category: "query", priority: "high" },
        { text: "Create a lead for Sarah Smith from Acme Corp", category: "action", priority: "high" },
        { text: "Update lead #123 to qualified status", category: "action", priority: "medium" },
        { text: "Score all my new leads", category: "action", priority: "medium" },
      ],
      deals: [
        { text: "What's the status of deal #123?", category: "query", priority: "high" },
        { text: "Move deal #456 to negotiation stage", category: "action", priority: "high" },
        { text: "Predict the outcome of my recent deals", category: "action", priority: "medium" },
        { text: "Show me deals in the proposal stage", category: "query", priority: "medium" },
      ],
      general: [
        { text: "Show me my pipeline summary", category: "query", priority: "high" },
        { text: "Create a new lead", category: "action", priority: "high" },
        { text: "What are my recent deals?", category: "query", priority: "medium" },
        { text: "Search for contacts from Microsoft", category: "query", priority: "medium" },
      ],
    };

    return suggestionMap[contextPage] || suggestionMap.general;
  };

  // Fetch suggestions
  const { data: suggestionsData } = useQuery({
    queryKey: ['ai-agent-suggestions', context],
    queryFn: () => aiAgentAPI.getSuggestions(context),
    enabled: messages.length === 0, // Only show suggestions when chat is empty
  });

  // Use backend suggestions if available, otherwise use defaults
  const suggestions = suggestionsData?.suggestions && suggestionsData.suggestions.length > 0
    ? suggestionsData.suggestions
    : getDefaultSuggestions();

  // Query mutation
  const queryMutation = useMutation({
    mutationFn: ({ query, userInput }: { query: string; userInput: string }) =>
      aiAgentAPI.query(query, conversationHistory),
    onSuccess: (data: AIAgentResponse, variables) => {
      // Add assistant message
      const assistantMessage: AIAgentMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        function_calls: data.function_calls,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update conversation history in Gemini format
      // Backend returns the updated history, or we build it ourselves
      if (data.conversation_history && data.conversation_history.length > 0) {
        setConversationHistory(data.conversation_history);
      } else {
        // Fallback: Build history manually in Gemini format
        const newHistory: GeminiMessage[] = [
          ...conversationHistory,
          { role: 'user', parts: [{ text: variables.userInput }] },
          { role: 'model', parts: [{ text: data.response }] },
        ];
        setConversationHistory(newHistory);
      }

      // Trigger callback if action was completed
      if (onActionComplete && data.function_calls && data.function_calls.length > 0) {
        try {
          onActionComplete();
        } catch (error) {
          console.error('Error in onActionComplete callback:', error);
          // Don't crash the UI if the callback fails
        }
      }
    },
    onError: (error: any) => {
      // Add error message with detailed error info
      let errorContent = 'Sorry, I encountered an error.';

      // Handle timeout errors
      if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        errorContent = 'Request timed out. The AI is taking longer than expected. Please try again.';
      }
      // Handle network errors
      else if (error?.message === 'Network Error' || !error?.response) {
        errorContent = 'Network error. Please check your connection and try again.';
      }
      // Handle API errors
      else if (error?.response?.data?.error) {
        errorContent = `Error: ${error.response.data.error}`;
      } else if (error?.response?.data?.response) {
        errorContent = error.response.data.response;
      } else if (error?.message) {
        errorContent = `Error: ${error.message}`;
      }

      // Check for specific model errors (404 model not found)
      if (errorContent.includes('404') && (errorContent.includes('model') || errorContent.includes('gemini'))) {
        errorContent = 'The AI model is currently unavailable or being updated. Please try again in a few moments, or contact support if the issue persists.';
      }

      const errorMessage: AIAgentMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || queryMutation.isPending) return;

    const userInput = inputValue.trim();

    // Add user message
    const userMessage: AIAgentMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send query with both query and userInput (needed for history building)
    queryMutation.mutate({ query: userInput, userInput });

    // Clear input
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: AIAgentSuggestion) => {
    setInputValue(suggestion.text);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-theme-border-primary">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
            <p className="text-xs text-theme-text-secondary mt-0.5">
              Ask me anything about your CRM data
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl mb-4">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-base font-semibold text-theme-text-primary mb-2">
                Welcome to your AI Assistant
              </h3>
              <p className="text-sm text-theme-text-secondary max-w-md mx-auto mb-6">
                I can help you manage leads, deals, contacts, and provide insights about your CRM data. Try asking me something!
              </p>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-theme-text-secondary uppercase tracking-wide mb-3">
                    Suggested queries
                  </p>
                  <div className="grid gap-2 max-w-2xl mx-auto">
                    {suggestions.slice(0, 4).map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="group flex items-center gap-3 px-4 py-3 bg-theme-bg-tertiary hover:bg-theme-bg-secondary border border-theme-border-primary rounded-lg transition-all text-left"
                      >
                        <Zap className="h-4 w-4 text-primary-500 flex-shrink-0" />
                        <span className="text-sm text-theme-text-secondary group-hover:text-theme-text-primary">
                          {suggestion.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-theme-bg-tertiary text-theme-text-primary border border-theme-border-primary'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Function calls badges */}
                {message.function_calls && message.function_calls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-theme-border-secondary">
                    <p className="text-xs font-medium text-theme-text-secondary mb-2">
                      Actions performed:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.function_calls
                        .filter(call => call?.name) // Filter out calls without names
                        .map((call, callIdx) => (
                        <span
                          key={callIdx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-success-50 text-success-700 border border-success-200 rounded-md text-xs font-medium"
                        >
                          <Zap className="h-3 w-3" />
                          {call.name.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {queryMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-theme-bg-tertiary border border-theme-border-primary">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                  <p className="text-sm text-theme-text-secondary">Thinking...</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-theme-border-primary p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about your CRM..."
              disabled={queryMutation.isPending}
              className="flex-1 input-field"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || queryMutation.isPending}
              icon={queryMutation.isPending ? Loader2 : Send}
              size="md"
            >
              {queryMutation.isPending ? 'Sending...' : 'Send'}
            </Button>
          </form>

          <p className="text-xs text-theme-text-tertiary mt-2">
            Try: "Show me my pipeline summary" or "Create a lead named John Doe"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
