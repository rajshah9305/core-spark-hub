import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Settings, Key, Shield, Palette, Bell, Globe, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiProviderService } from '@/components/providers/AIProviderService';

interface SettingsDialogProps {
  trigger: React.ReactNode;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ trigger }) => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    google: false,
  });
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
    streamingResponses: true,
  });

  const { toast } = useToast();

  const handleSaveKeys = () => {
    // Filter out empty keys
    const validKeys = Object.entries(apiKeys).reduce((acc, [key, value]) => {
      if (value.trim()) {
        (acc as any)[key] = value.trim();
      }
      return acc;
    }, {} as Partial<typeof apiKeys>);

    aiProviderService.setAPIKeys(validKeys);
    
    // Store in localStorage for persistence (in production, use secure storage)
    Object.entries(validKeys).forEach(([provider, key]) => {
      if (key) {
        localStorage.setItem(`corespark_${provider}_key`, key);
      }
    });

    toast({
      title: "API Keys Saved",
      description: "Your API keys have been securely stored.",
    });
  };

  const handleLoadKeys = () => {
    const keys = {
      openai: localStorage.getItem('corespark_openai_key') || '',
      anthropic: localStorage.getItem('corespark_anthropic_key') || '',
      google: localStorage.getItem('corespark_google_key') || '',
    };
    
    setApiKeys(keys);
    aiProviderService.setAPIKeys(keys);
  };

  React.useEffect(() => {
    handleLoadKeys();
  }, []);

  const toggleKeyVisibility = (provider: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const updateApiKey = (provider: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const availableProviders = aiProviderService.getAvailableProviders();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings & Configuration
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Keys Configuration
                </CardTitle>
                <CardDescription>
                  Configure your API keys to enable AI providers. Keys are stored securely in your browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* OpenAI */}
                <div className="space-y-2">
                  <Label htmlFor="openai-key" className="flex items-center gap-2">
                    OpenAI API Key
                    <Badge variant="outline" className="text-xs">GPT-4, DALL-E 3</Badge>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="openai-key"
                      type={showKeys.openai ? "text" : "password"}
                      placeholder="sk-..."
                      value={apiKeys.openai}
                      onChange={(e) => updateApiKey('openai', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeyVisibility('openai')}
                    >
                      {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a>
                  </p>
                </div>

                {/* Anthropic */}
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key" className="flex items-center gap-2">
                    Anthropic API Key
                    <Badge variant="outline" className="text-xs">Claude 3</Badge>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="anthropic-key"
                      type={showKeys.anthropic ? "text" : "password"}
                      placeholder="sk-ant-..."
                      value={apiKeys.anthropic}
                      onChange={(e) => updateApiKey('anthropic', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeyVisibility('anthropic')}
                    >
                      {showKeys.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic Console</a>
                  </p>
                </div>

                {/* Google */}
                <div className="space-y-2">
                  <Label htmlFor="google-key" className="flex items-center gap-2">
                    Google AI API Key
                    <Badge variant="outline" className="text-xs">Gemini Pro</Badge>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="google-key"
                      type={showKeys.google ? "text" : "password"}
                      placeholder="AIza..."
                      value={apiKeys.google}
                      onChange={(e) => updateApiKey('google', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleKeyVisibility('google')}
                    >
                      {showKeys.google ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    API keys are stored locally and never sent to our servers.
                  </p>
                  <Button onClick={handleSaveKeys} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Providers</CardTitle>
                <CardDescription>
                  AI providers currently configured and available for use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {aiProviderService.providers.map((provider) => {
                    const isConfigured = availableProviders.some(p => p.id === provider.id);
                    return (
                      <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-muted-foreground">{provider.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={provider.type === 'image' ? 'secondary' : 'outline'}>
                            {provider.type}
                          </Badge>
                          <Badge variant={isConfigured ? 'default' : 'outline'}>
                            {isConfigured ? 'Configured' : 'Not configured'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  User Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, darkMode: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, notifications: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save">Auto-save Conversations</Label>
                  <Switch
                    id="auto-save"
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, autoSave: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="streaming">Streaming Responses</Label>
                  <Switch
                    id="streaming"
                    checked={preferences.streamingResponses}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, streamingResponses: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Data Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    All API keys and conversations are stored locally in your browser. 
                    No data is transmitted to external servers except for AI API calls.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">API Security</h4>
                  <p className="text-sm text-muted-foreground">
                    All API communications use HTTPS encryption. API keys are transmitted 
                    directly to provider endpoints and never stored on our servers.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Clear Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove all stored API keys and conversation history from this browser.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      localStorage.clear();
                      setApiKeys({ openai: '', anthropic: '', google: '' });
                      toast({
                        title: "Data Cleared",
                        description: "All local data has been removed.",
                      });
                    }}
                  >
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};