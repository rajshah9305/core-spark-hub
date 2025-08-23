import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Code, 
  Eye, 
  Copy, 
  Download,
  Wand2,
  Layout,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratedUI {
  id: string;
  prompt: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  timestamp: Date;
  framework: string;
}

interface UIGeneratorProps {
  className?: string;
}

export const UIGenerator: React.FC<UIGeneratorProps> = ({ className }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUIs, setGeneratedUIs] = useState<GeneratedUI[]>([]);
  const [selectedUI, setSelectedUI] = useState<GeneratedUI | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      // Simulate UI generation (in production, this would use AI to generate actual code)
      const generatedUI = await simulateUIGeneration(prompt);
      setGeneratedUIs(prev => [generatedUI, ...prev]);
      setSelectedUI(generatedUI);
    } catch (error) {
      console.error('UI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = (ui: GeneratedUI) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated UI - ${ui.prompt.slice(0, 50)}</title>
    <style>
        ${ui.cssCode}
    </style>
</head>
<body>
    ${ui.htmlCode}
    <script>
        ${ui.jsCode}
    </script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `corespark-ui-${ui.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center glow-primary">
              <Palette className="w-4 h-4 text-warning" />
            </div>
            <div>
              <CardTitle className="gradient-text-secondary">AI UI Generator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate beautiful UI components from natural language descriptions
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">UI Description</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the UI you want to create... For example: 'A modern pricing card with gradient background, three tiers, and hover effects'"
              className="min-h-[100px] bg-background/50 border-border/50 focus:border-warning/50"
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-warning to-accent text-warning-foreground hover:from-warning/90 hover:to-accent/90 glow-primary"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                Generating UI...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate UI Component
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated UI Display */}
      {selectedUI && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-warning" />
                  Live Preview
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "border border-border/50 rounded-lg overflow-hidden bg-white transition-all duration-300",
                previewMode === 'mobile' && "max-w-sm mx-auto",
                previewMode === 'tablet' && "max-w-md mx-auto",
                previewMode === 'desktop' && "w-full"
              )}>
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ 
                    __html: `<style>${selectedUI.cssCode}</style>${selectedUI.htmlCode}` 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Code */}
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-warning" />
                  Generated Code
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadCode(selectedUI)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                </TabsList>
                
                <TabsContent value="html" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">HTML</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(selectedUI.htmlCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-background/30 rounded-lg p-4 border border-border/50 max-h-[400px] overflow-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      <code>{selectedUI.htmlCode}</code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="css" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">CSS</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(selectedUI.cssCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-background/30 rounded-lg p-4 border border-border/50 max-h-[400px] overflow-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      <code>{selectedUI.cssCode}</code>
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="js" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">JavaScript</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(selectedUI.jsCode)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-background/30 rounded-lg p-4 border border-border/50 max-h-[400px] overflow-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      <code>{selectedUI.jsCode}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History */}
      {generatedUIs.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-warning" />
              Generated Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedUIs.map((ui) => (
                <Card
                  key={ui.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:border-warning/50",
                    selectedUI?.id === ui.id && "border-warning/50 bg-warning/5"
                  )}
                  onClick={() => setSelectedUI(ui)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium line-clamp-2">{ui.prompt}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {ui.framework}
                        </Badge>
                        <span>{ui.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Simulate UI generation (replace with actual AI implementation)
async function simulateUIGeneration(prompt: string): Promise<GeneratedUI> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = Date.now().toString();
      
      // Generate sample UI based on prompt
      let htmlCode = '';
      let cssCode = '';
      let jsCode = '';

      if (prompt.toLowerCase().includes('card') || prompt.toLowerCase().includes('pricing')) {
        htmlCode = `<div class="pricing-card">
  <div class="card-header">
    <h3>Pro Plan</h3>
    <div class="price">
      <span class="amount">$29</span>
      <span class="period">/month</span>
    </div>
  </div>
  <div class="card-body">
    <ul class="features">
      <li>✓ Unlimited AI requests</li>
      <li>✓ Priority support</li>
      <li>✓ Advanced features</li>
      <li>✓ Team collaboration</li>
    </ul>
  </div>
  <div class="card-footer">
    <button class="cta-button">Get Started</button>
  </div>
</div>`;

        cssCode = `.pricing-card {
  max-width: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-10px);
}

.card-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.amount {
  font-size: 3rem;
  font-weight: 700;
}

.period {
  font-size: 1rem;
  opacity: 0.8;
}

.card-body {
  padding: 1rem 2rem;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.card-footer {
  padding: 1rem 2rem 2rem;
}

.cta-button {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}`;

        jsCode = `// Add interactive functionality
document.querySelector('.cta-button').addEventListener('click', function() {
  this.textContent = 'Welcome aboard!';
  this.style.background = 'rgba(0, 255, 0, 0.3)';
  setTimeout(() => {
    this.textContent = 'Get Started';
    this.style.background = 'rgba(255, 255, 255, 0.2)';
  }, 2000);
});`;
      } else {
        // Default component
        htmlCode = `<div class="component">
  <h2>Generated Component</h2>
  <p>This is a sample component based on your prompt: "${prompt}"</p>
  <button class="action-btn">Click me</button>
</div>`;

        cssCode = `.component {
  padding: 2rem;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  border-radius: 12px;
  color: white;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.component h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.component p {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}`;

        jsCode = `document.querySelector('.action-btn').addEventListener('click', function() {
  alert('Hello from CoreSpark UI Generator!');
});`;
      }

      resolve({
        id,
        prompt,
        htmlCode,
        cssCode,
        jsCode,
        timestamp: new Date(),
        framework: 'HTML/CSS/JS',
      });
    }, 2000 + Math.random() * 1000);
  });
}