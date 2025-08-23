import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
  provider: string;
  isStarred?: boolean;
}

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Welcome to CoreSpark Hub',
      timestamp: new Date(),
      messageCount: 1,
      provider: 'CoreSpark',
      isStarred: true,
    },
    {
      id: '2',
      title: 'Image Generation Project',
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 15,
      provider: 'DALL-E 3',
    },
    {
      id: '3',
      title: 'Code Review Assistant',
      timestamp: new Date(Date.now() - 7200000),
      messageCount: 8,
      provider: 'GPT-4',
    },
  ]);

  const [selectedChat, setSelectedChat] = useState<string>('1');

  const tools = [
    { icon: MessageSquare, label: 'Chat', active: true, color: 'text-primary' },
    { icon: Image, label: 'Image Gen', color: 'text-accent' },
    { icon: Code, label: 'Code Exec', color: 'text-secondary' },
    { icon: Palette, label: 'UI Builder', color: 'text-warning' },
    { icon: Users, label: 'Multi-Agent', color: 'text-info' },
    { icon: Zap, label: 'Workflows', color: 'text-success' },
  ];

  return (
    <div className={cn("w-80 glass-effect border-r flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text-primary">CoreSpark</h1>
            <p className="text-xs text-muted-foreground">AI Workspace Hub</p>
          </div>
        </div>
        
        <Button className="w-full glow-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Tools */}
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">AI Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.label}
              variant={tool.active ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex flex-col h-16 gap-1",
                tool.active && "glow-secondary"
              )}
            >
              <tool.icon className={cn("w-4 h-4", tool.color)} />
              <span className="text-xs">{tool.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Recent Chats</h3>
            <Button variant="ghost" size="sm">
              <History className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className={cn(
                  "p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                  selectedChat === chat.id 
                    ? "bg-primary/10 border-primary/20 glow-primary" 
                    : "bg-card/30"
                )}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">{chat.title}</h4>
                      {chat.isStarred && (
                        <Star className="w-3 h-3 text-warning fill-current" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs px-1">
                        {chat.provider}
                      </Badge>
                      <span>{chat.messageCount} msgs</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {chat.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Star className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground">
            <div>API Usage Today</div>
            <div className="text-primary font-medium">2,847 tokens</div>
          </div>
          <Badge variant="outline" className="text-xs bg-success/10 text-success">
            Pro Plan
          </Badge>
        </div>
        
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings & API Keys
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      </div>
    </div>
  );
};