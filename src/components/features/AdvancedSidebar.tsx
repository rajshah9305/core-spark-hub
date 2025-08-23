import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Plus,
  Settings,
  Sparkles,
  Bot,
  Image,
  Code,
  Palette,
  Zap,
  Users,
  History,
  Star,
  Trash2,
  ChevronRight,
  Search,
  Filter,
  Archive,
  Pin,
  Clock,
  Brain,
  Workflow,
  Database,
  Cloud,
  Shield,
  Gauge,
  TrendingUp,
  Award,
  Target,
  Layers,
  GitBranch,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
  provider: string;
  isStarred?: boolean;
  isPinned?: boolean;
  tags?: string[];
  category?: 'work' | 'personal' | 'creative' | 'research';
  lastActivity?: Date;
}

interface AdvancedSidebarProps {
  className?: string;
  onChatSelect?: (chatId: string) => void;
  onNewChat?: () => void;
}

export const AdvancedSidebar: React.FC<AdvancedSidebarProps> = ({ 
  className, 
  onChatSelect, 
  onNewChat 
}) => {
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Welcome to CoreSpark Hub',
      timestamp: new Date(),
      messageCount: 1,
      provider: 'CoreSpark Pro',
      isStarred: true,
      isPinned: true,
      tags: ['welcome', 'intro'],
      category: 'personal',
      lastActivity: new Date(),
    },
    {
      id: '2',
      title: 'AI Image Generation Masterclass',
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 15,
      provider: 'DALL-E 3',
      isStarred: true,
      tags: ['images', 'dall-e', 'creative'],
      category: 'creative',
      lastActivity: new Date(Date.now() - 1800000),
    },
    {
      id: '3',
      title: 'Code Review & Optimization',
      timestamp: new Date(Date.now() - 7200000),
      messageCount: 8,
      provider: 'GPT-4 Turbo',
      tags: ['code', 'review', 'optimization'],
      category: 'work',
      lastActivity: new Date(Date.now() - 3600000),
    },
    {
      id: '4',
      title: 'UI Component Generator',
      timestamp: new Date(Date.now() - 10800000),
      messageCount: 23,
      provider: 'Claude 3 Opus',
      isPinned: true,
      tags: ['ui', 'components', 'design'],
      category: 'work',
      lastActivity: new Date(Date.now() - 5400000),
    },
    {
      id: '5',
      title: 'Research Paper Analysis',
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 12,
      provider: 'Gemini Pro',
      tags: ['research', 'analysis', 'papers'],
      category: 'research',
      lastActivity: new Date(Date.now() - 7200000),
    },
  ]);

  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | 'starred' | 'recent'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tools = [
    { icon: MessageSquare, label: 'Chat', active: true, color: 'text-primary', count: 24 },
    { icon: Image, label: 'Images', color: 'text-accent', count: 12 },
    { icon: Code, label: 'Code', color: 'text-secondary', count: 8 },
    { icon: Palette, label: 'UI Gen', color: 'text-warning', count: 15 },
    { icon: Users, label: 'Multi-Agent', color: 'text-info', count: 3 },
    { icon: Workflow, label: 'Workflows', color: 'text-success', count: 6 },
  ];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'pinned' && chat.isPinned) ||
                         (activeFilter === 'starred' && chat.isStarred) ||
                         (activeFilter === 'recent' && chat.lastActivity && chat.lastActivity > new Date(Date.now() - 86400000));
    
    const matchesCategory = activeCategory === 'all' || chat.category === activeCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    onChatSelect?.(chatId);
  };

  return (
    <div className={cn("w-80 glass-effect border-r flex flex-col h-full", className)}>
      {/* Enhanced Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary animate-pulse-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-lg gradient-text-primary">CoreSpark Hub</h1>
            <p className="text-xs text-muted-foreground">Premium AI Workspace</p>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
            Pro
          </Badge>
        </div>
        
        <Button 
          className="w-full glow-primary bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          onClick={onNewChat}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* AI Tools Grid */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          AI Tools & Features
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.label}
              variant={tool.active ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex flex-col h-20 gap-1 relative",
                tool.active && "glow-secondary"
              )}
            >
              <tool.icon className={cn("w-5 h-5", tool.color)} />
              <span className="text-xs font-medium">{tool.label}</span>
              {tool.count > 0 && (
                <Badge 
                  variant="outline" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full"
                >
                  {tool.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Search & Filters */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
        
        <div className="flex gap-1">
          {['all', 'pinned', 'starred', 'recent'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(filter as any)}
              className="text-xs capitalize flex-1"
            >
              {filter === 'pinned' && <Pin className="w-3 h-3 mr-1" />}
              {filter === 'starred' && <Star className="w-3 h-3 mr-1" />}
              {filter === 'recent' && <Clock className="w-3 h-3 mr-1" />}
              {filter === 'all' && <Globe className="w-3 h-3 mr-1" />}
              {filter}
            </Button>
          ))}
        </div>

        <div className="flex gap-1">
          {['all', 'work', 'personal', 'creative', 'research'].map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "outline" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="text-xs capitalize flex-1"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Chat History */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <History className="w-4 h-4" />
              Conversations ({filteredChats.length})
            </h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Filter className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Archive className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className={cn(
                  "p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50 group relative overflow-hidden",
                  selectedChat === chat.id 
                    ? "bg-primary/10 border-primary/20 glow-primary" 
                    : "bg-card/30 hover:border-border/70"
                )}
                onClick={() => handleChatSelect(chat.id)}
              >
                {/* Pinned indicator */}
                {chat.isPinned && (
                  <div className="absolute top-2 left-2">
                    <Pin className="w-3 h-3 text-primary fill-current" />
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 ml-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">{chat.title}</h4>
                      {chat.isStarred && (
                        <Star className="w-3 h-3 text-warning fill-current" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs px-2 py-0",
                          chat.category === 'work' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                          chat.category === 'personal' && "bg-green-500/10 text-green-500 border-green-500/20",
                          chat.category === 'creative' && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                          chat.category === 'research' && "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        )}
                      >
                        {chat.provider}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {chat.messageCount} msgs
                      </span>
                    </div>

                    {/* Tags */}
                    {chat.tags && chat.tags.length > 0 && (
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {chat.tags.slice(0, 2).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs px-1 py-0 h-5"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {chat.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                            +{chat.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{chat.timestamp.toLocaleDateString()}</span>
                      {chat.lastActivity && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          {Math.floor((Date.now() - chat.lastActivity.getTime()) / 60000)}m ago
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Star className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Activity bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Enhanced Status Footer */}
      <div className="p-4 border-t border-border/50 space-y-3">
        {/* Usage Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Today's Usage</div>
                <div className="text-sm font-medium text-primary">2,847 tokens</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Performance</div>
                <div className="text-sm font-medium text-success">98.5%</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Plan Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <Award className="w-3 h-3 mr-1" />
              Pro Plan
            </Badge>
            <span className="text-xs text-muted-foreground">Unlimited</span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            Upgrade
          </Button>
        </div>
        
        {/* Settings */}
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings & API Keys
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      </div>
    </div>
  );
};