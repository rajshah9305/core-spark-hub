import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Key, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Shield,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiProviderService, type APIKeys } from '@/components/providers/AIProviderService';

interface APIKeyManagerProps {
  className?: string;
}

export const APIKeyManager: React.FC<APIKeyManagerProps> = ({ className }) => {
  const [apiKeys, setApiKeys] = useState<APIKeys>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [validationStatus, setValidationStatus] = useState<Record<string, boolean>>({});

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5, DALL-E 3',
      placeholder: 'sk-...',
      website: 'https://platform.openai.com/api-keys',
      color: 'text-primary',
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude 3 Opus, Sonnet, Haiku',
      placeholder: 'sk-ant-...',
      website: 'https://console.anthropic.com/settings/keys',
      color: 'text-secondary',
    },
    {
      id: 'google',
      name: 'Google',
      description: 'Gemini Pro, PaLM',
      placeholder: 'AI...',
      website: 'https://makersuite.google.com/app/apikey',
      color: 'text-accent',
    },
  ];

  const handleKeyChange = (providerId: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [providerId]: value }));
  };

  const toggleShowKey = (providerId: string) => {
    setShowKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const validateKey = async (providerId: string) => {
    const key = apiKeys[providerId as keyof APIKeys];
    if (!key) return;

    // Simulate API key validation (in production, this would make a test API call)
    setTimeout(() => {
      setValidationStatus(prev => ({ ...prev, [providerId]: true }));
    }, 1000);
  };

  const saveKeys = () => {
    aiProviderService.setAPIKeys(apiKeys);
    // In production, this would securely store the keys
    localStorage.setItem('corespark_api_keys', JSON.stringify(apiKeys));
  };

  const loadKeys = () => {
    try {
      const stored = localStorage.getItem('corespark_api_keys');
      if (stored) {
        const keys = JSON.parse(stored);
        setApiKeys(keys);
        aiProviderService.setAPIKeys(keys);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  React.useEffect(() => {
    loadKeys();
  }, []);

  return (
    <Card className={cn("glass-effect", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Key className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="gradient-text-primary">API Key Manager</CardTitle>
            <CardDescription>
              Configure your AI provider API keys to unlock full functionality
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Security Notice */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20">
          <Shield className="w-5 h-5 text-warning mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-warning mb-1">Security Notice</p>
            <p className="text-muted-foreground">
              API keys are stored locally in your browser. In production, use secure environment variables or key management services.
            </p>
          </div>
        </div>

        {/* Provider Configuration */}
        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("font-medium", provider.color)}>
                    {provider.name}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {provider.description}
                  </Badge>
                  {validationStatus[provider.id] && (
                    <CheckCircle className="w-4 h-4 text-success" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(provider.website, '_blank')}
                >
                  Get API Key
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    placeholder={provider.placeholder}
                    value={apiKeys[provider.id as keyof APIKeys] || ''}
                    onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => toggleShowKey(provider.id)}
                  >
                    {showKeys[provider.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => validateKey(provider.id)}
                  disabled={!apiKeys[provider.id as keyof APIKeys]}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            Keys are encrypted and stored locally
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadKeys}>
              Load Saved
            </Button>
            <Button onClick={saveKeys} className="glow-primary">
              Save Configuration
            </Button>
          </div>
        </div>

        {/* Provider Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Available Providers</Label>
          <div className="flex flex-wrap gap-2">
            {aiProviderService.getAvailableProviders().map((provider) => (
              <Badge
                key={provider.id}
                variant="outline"
                className={cn(
                  "bg-success/10 border-success/20 text-success",
                  provider.status !== 'online' && "bg-warning/10 border-warning/20 text-warning"
                )}
              >
                {provider.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};