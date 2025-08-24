import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MessageSquare,
  Mic,
  Paperclip,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Download,
  Zap,
  Brain,
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Star,
  Bookmark,
  MoreHorizontal,
  RefreshCw,
  PenTool,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { aiProviderService } from '@/components/providers/AIProviderService';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  provider?: string;
  tokens?: number;
  type?: 'text' | 'image' | 'code' | 'ui';
  attachments?: string[];
  reactions?: { type: string; count: number }[];
  isStreaming?: boolean;
  isStarred?: boolean;
  isBookmarked?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  provider: string;
  isActive: boolean;
}

interface EnhancedChatInterfaceProps {
  className?: string;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({ className }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Welcome to CoreSpark Hub',
      messages: [
        {
          id: '1',
          content: '🌟 Welcome to CoreSpark Hub - Your Ultimate AI Workspace! 🌟\n\nI\'m your advanced AI assistant, ready to help you:\n• Generate stunning images with DALL-E 3, Midjourney & Stable Diffusion\n• Execute code in multiple languages with sandboxed environments\n• Create beautiful UI components from natural language\n• Collaborate with multiple AI agents simultaneously\n• Build interactive workflows and automations\n\nWhat amazing project shall we start with today?',
          role: 'assistant',
          timestamp: new Date(),
          provider: 'CoreSpark Pro',
          type: 'text',
          reactions: [
            { type: 'heart', count: 12 },
            { type: 'thumbs-up', count: 8 }
          ]
        }
      ],
      timestamp: new Date(),
      provider: 'CoreSpark Pro',
      isActive: true
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState('1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
      attachments: selectedFiles.map(f => f.name),
      type: selectedFiles.some(f => f.type.startsWith('image/')) ? 'image' : 'text'
    };

    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));

    setInput('');
    setSelectedFiles([]);
    setIsLoading(true);
    setIsTyping(true);

    // Send actual AI request
    try {
      const providers = aiProviderService.getAvailableProviders();
      const selectedProvider = providers.find(p => p.type === 'multimodal' || p.type === 'text') || providers[0];
      
      if (!selectedProvider) {
        throw new Error('No AI providers available. Please configure your API keys.');
      }

      const response = await aiProviderService.sendMessage(
        selectedProvider.id,
        [...messages, userMessage]
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: response.timestamp,
        provider: response.provider,
        tokens: response.tokens,
        type: 'text',
        isStreaming: false
      };

      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, messages: [...session.messages, assistantMessage] }
          : session
      ));

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}. Please check your API keys in Settings.`,
        role: 'assistant',
        timestamp: new Date(),
        provider: 'System',
        type: 'text',
        isStreaming: false
      };

      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, messages: [...session.messages, errorMessage] }
          : session
      ));

      toast({
        title: "AI Request Failed",
        description: "Please check your API keys in Settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat ${sessions.length + 1}`,
      messages: [],
      timestamp: new Date(),
      provider: 'CoreSpark Pro',
      isActive: false
    };

    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    toast({
      title: "New Chat Created",
      description: "Ready for your next conversation!",
    });
  };

  const toggleReaction = (messageId: string, reactionType: string) => {
    setSessions(prev => prev.map(session => ({
      ...session,
      messages: session.messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.type === reactionType);
          
          if (existingReaction) {
            return {
              ...msg,
              reactions: reactions.map(r => 
                r.type === reactionType 
                  ? { ...r, count: r.count + 1 }
                  : r
              )
            };
          } else {
            return {
              ...msg,
              reactions: [...reactions, { type: reactionType, count: 1 }]
            };
          }
        }
        return msg;
      })
    })));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Voice recording logic would go here
    setTimeout(() => {
      setIsRecording(false);
      toast({
        title: "Voice recorded",
        description: "Your voice message has been captured.",
      });
    }, 3000);
  };

  return (
    <div className={cn("flex flex-col h-full neural-network", fullscreen && "fixed inset-0 z-50", className)}>
      {/* Enhanced Chat Header */}
      <div className="glass-effect border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary animate-pulse-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-ping"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg gradient-text-primary">CoreSpark AI Chat</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  {activeSession?.provider || 'Multi-Provider'}
                </Badge>
                <span>•</span>
                <span>{messages.length} messages</span>
                {isTyping && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                      <span className="ml-1">AI typing...</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={voiceEnabled ? "text-primary" : "text-muted-foreground"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={createNewSession}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setFullscreen(!fullscreen)}
            >
              {fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Session Tabs */}
        {sessions.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-thin">
            {sessions.map((session) => (
              <Button
                key={session.id}
                variant={session.id === activeSessionId ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveSessionId(session.id)}
                className={cn(
                  "flex-shrink-0 max-w-[200px] justify-start",
                  session.id === activeSessionId && "glow-secondary"
                )}
              >
                <MessageSquare className="w-3 h-3 mr-2" />
                <span className="truncate">{session.title}</span>
                {session.messages.length > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {session.messages.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Messages Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 animate-slide-up message-hover group",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.role === 'assistant' && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center glow-secondary animate-float">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  {message.provider && (
                    <Badge variant="outline" className="text-xs">
                      {message.provider}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className={cn(
                "max-w-[70%] space-y-3",
                message.role === 'user' ? 'items-end' : 'items-start'
              )}>
                <Card className={cn(
                  "relative overflow-hidden backdrop-blur-md",
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30' 
                    : 'glass-effect bg-card/80',
                  message.isStreaming && "animate-pulse"
                )}>
                  {message.type === 'image' && message.attachments && (
                    <div className="p-2 border-b">
                      <div className="flex gap-2 flex-wrap">
                        {message.attachments.map((attachment, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Image className="w-3 h-3 mr-1" />
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <p className={cn(
                      "text-sm leading-relaxed whitespace-pre-wrap",
                      message.isStreaming && "animate-typing"
                    )}>
                      {message.content}
                    </p>
                  </div>

                  {/* Message Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => toggleReaction(message.id, 'star')}
                      >
                        <Star className={cn("w-3 h-3", message.isStarred && "fill-current text-warning")} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
                
                {/* Message Footer */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground px-2">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  
                  {message.tokens && (
                    <Badge variant="outline" className="text-xs">
                      {message.tokens} tokens
                    </Badge>
                  )}

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-2">
                      {message.reactions.map((reaction) => (
                        <Button
                          key={reaction.type}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => toggleReaction(message.id, reaction.type)}
                        >
                          {reaction.type === 'heart' && <Heart className="w-3 h-3 mr-1 fill-current text-red-500" />}
                          {reaction.type === 'thumbs-up' && <ThumbsUp className="w-3 h-3 mr-1 fill-current text-green-500" />}
                          {reaction.type === 'thumbs-down' && <ThumbsDown className="w-3 h-3 mr-1 fill-current text-orange-500" />}
                          {reaction.count}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Reactions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => toggleReaction(message.id, 'heart')}
                    >
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => toggleReaction(message.id, 'thumbs-up')}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-warning flex items-center justify-center glow-accent animate-float">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex gap-4 justify-start animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center glow-secondary">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <Card className="p-4 glass-effect bg-card/80 max-w-[70%]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">CoreSpark AI is analyzing...</span>
                  <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="glass-effect border-t p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* File Attachments */}
          {selectedFiles.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedFiles.map((file, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-2 pr-1"
                >
                  {file.type.startsWith('image/') ? <Image className="w-3 h-3" /> : <Paperclip className="w-3 h-3" />}
                  <span className="text-xs max-w-[100px] truncate">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0" 
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* AI Tools Quick Access */}
          <div className="flex gap-2 mb-4">
            <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
              <Image className="w-4 h-4 mr-2" />
              Generate Image
            </Button>
            <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary/10">
              <Code className="w-4 h-4 mr-2" />
              Execute Code
            </Button>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              <Palette className="w-4 h-4 mr-2" />
              Create UI
            </Button>
            <Button variant="ghost" size="sm" className="text-warning hover:bg-warning/10">
              <Wand2 className="w-4 h-4 mr-2" />
              AI Workflow
            </Button>
          </div>
          
          {/* Main Input */}
          <div className="relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask CoreSpark AI anything... (Shift+Enter for new line)"
                  className="min-h-[60px] max-h-[200px] bg-background/80 border-border/50 focus:border-primary/50 focus:ring-primary/50 pr-24 resize-none"
                  disabled={isLoading}
                />
                
                {/* Input Actions */}
                <div className="absolute right-3 bottom-3 flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-3 h-3" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "h-6 w-6 p-0",
                      isRecording && "text-red-500 animate-pulse"
                    )}
                    onClick={startVoiceRecording}
                  >
                    <Mic className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleSend} 
                disabled={(!input.trim() && selectedFiles.length === 0) || isLoading}
                className="h-[60px] px-6 glow-primary bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>

            {/* Character Count & Shortcuts */}
            <div className="flex justify-between items-center mt-2 px-1">
              <div className="text-xs text-muted-foreground">
                {input.length > 0 && `${input.length} characters`}
              </div>
              
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>⌘+Enter to send</span>
                <span>⌘+K for commands</span>
                <span>⌘+/ for shortcuts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};