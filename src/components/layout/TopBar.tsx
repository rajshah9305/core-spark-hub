import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  User, 
  Bell, 
  Menu,
  Sparkles,
  Zap,
  Crown,
  Globe,
  Activity,
  Wifi,
  WifiOff,
  Shield,
  Clock,
  Database,
  Cpu,
  BarChart3,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState('gpt-4');
  const [systemStatus, setSystemStatus] = useState({
    online: true,
    providers: 4,
    latency: 45,
    uptime: 99.9
  });

  const providers = [
    { id: 'gpt-4', name: 'GPT-4 Turbo', company: 'OpenAI', status: 'online' },
    { id: 'claude-3', name: 'Claude 3 Opus', company: 'Anthropic', status: 'online' },
    { id: 'gemini', name: 'Gemini Pro', company: 'Google', status: 'online' },
    { id: 'dall-e-3', name: 'DALL-E 3', company: 'OpenAI', status: 'online' },
  ];

  const currentProvider = providers.find(p => p.id === selectedProvider);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className={cn(
      "h-16 glass-effect border-b border-border/50 flex items-center justify-between px-6 backdrop-blur-xl",
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <Activity className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg gradient-text-primary">CoreSpark Hub</h1>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                v2.0 Pro
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {getTimeGreeting()} • Multi-Provider AI Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Center Section - Provider Selection & Status */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active Model:</span>
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

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card/50 border border-border/30">
          <Activity className="w-4 h-4 text-warning" />
          <span className="text-xs font-medium">{systemStatus.latency}ms</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card/50 border border-border/30">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-xs font-medium">{systemStatus.uptime}% uptime</span>
        </div>
      </div>

      {/* Mobile Center Section */}
      <div className="flex lg:hidden items-center gap-2">
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <Zap className="w-3 h-3 mr-1" />
          Online
        </Badge>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Time Display */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {currentTime.toLocaleTimeString()}
        </div>

        {/* Plan Badge */}
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 hidden sm:flex">
          <Crown className="w-3 h-3 mr-1" />
          Pro Plan
        </Badge>
        
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border border-background flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </Button>
        
        {/* Security Status */}
        <Button variant="ghost" size="sm" className="text-success">
          <Shield className="w-4 h-4" />
        </Button>
        
        {/* Settings */}
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        
        {/* User Avatar */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl p-0 bg-gradient-to-br from-primary to-secondary glow-primary overflow-hidden">
            <User className="w-5 h-5 text-white" />
          </Button>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
        </div>
      </div>
    </header>
  );
};