import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Image, 
  Code, 
  Palette,
  Settings,
  Plus,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  provider?: string;
  tokens?: number;
}

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to CoreSpark Hub! I\'m your AI assistant ready to help with text, images, code, and more. What would you like to create today?',
      role: 'assistant',
      timestamp: new Date(),
      provider: 'CoreSpark',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you want to work with: "${input}". This is where I would integrate with your selected AI provider to generate a response. The multi-provider system supports OpenAI, Anthropic, Google, and more!`,
        role: 'assistant',
        timestamp: new Date(),
        provider: 'GPT-4',
        tokens: 42,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="glass-effect border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold gradient-text-primary">AI Chat</h2>
            <p className="text-xs text-muted-foreground">Multi-provider AI workspace</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center glow-secondary flex-shrink-0">
                  <Bot className="w-4 h-4 text-secondary" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] space-y-2",
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <Card className={cn(
                  "p-4 glass-effect",
                  message.role === 'user' 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'bg-card/50'
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </Card>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.provider && (
                    <Badge variant="outline" className="text-xs">
                      {message.provider}
                    </Badge>
                  )}
                  {message.tokens && (
                    <Badge variant="outline" className="text-xs">
                      {message.tokens} tokens
                    </Badge>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center glow-accent flex-shrink-0">
                  <User className="w-4 h-4 text-accent" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center glow-secondary">
                <Bot className="w-4 h-4 text-secondary" />
              </div>
              <Card className="p-4 glass-effect bg-card/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="glass-effect border-t p-4">
        <div className="flex gap-2 mb-3">
          <Button variant="ghost" size="sm" className="text-accent">
            <Image className="w-4 h-4" />
            Image
          </Button>
          <Button variant="ghost" size="sm" className="text-secondary">
            <Code className="w-4 h-4" />
            Code
          </Button>
          <Button variant="ghost" size="sm" className="text-primary">
            <Palette className="w-4 h-4" />
            Generate UI
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything... (Shift+Enter for new line)"
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/50"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="glow-primary"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};