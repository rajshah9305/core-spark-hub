import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles, 
  Zap, 
  Settings, 
  User, 
  ChevronDown,
  Cpu,
  Globe,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ className }) => {
  const [selectedProvider, setSelectedProvider] = useState('gpt-4');
  
  const providers = [
    { id: 'gpt-4', name: 'GPT-4 Turbo', company: 'OpenAI', status: 'online' },
    { id: 'claude-3', name: 'Claude 3 Opus', company: 'Anthropic', status: 'online' },
    { id: 'gemini', name: 'Gemini Pro', company: 'Google', status: 'online' },
    { id: 'dall-e-3', name: 'DALL-E 3', company: 'OpenAI', status: 'online' },
  ];

  const currentProvider = providers.find(p => p.id === selectedProvider);

  return (
    <div className={cn("glass-effect border-b border-border/50 px-6 py-3", className)}>
      <div className="flex items-center justify-between">
        {/* Left Side - Brand & Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text-primary">CoreSpark Hub</h1>
              <p className="text-xs text-muted-foreground">Multi-Provider AI Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
              Online
            </Badge>
            <Badge variant="outline" className="bg-info/10 text-info border-info/20">
              <Cpu className="w-3 h-3 mr-1" />
              4 Providers
            </Badge>
          </div>
        </div>

        {/* Center - Provider Selection */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Active Model:</div>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-48 bg-background/50 border-border/50">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  currentProvider?.status === 'online' ? 'bg-success' : 'bg-warning'
                )} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="glass-effect">
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      provider.status === 'online' ? 'bg-success' : 'bg-warning'
                    )} />
                    <span>{provider.name}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {provider.company}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Side - Actions & User */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Zap className="w-4 h-4 text-warning" />
            API Keys
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <User className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};