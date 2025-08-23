import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, 
  Wand2, 
  Download, 
  Copy, 
  RefreshCw,
  Sparkles,
  Settings,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiProviderService } from '@/components/providers/AIProviderService';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
  model: string;
  size: string;
}

interface ImageGeneratorProps {
  className?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ className }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [selectedModel, setSelectedModel] = useState('dall-e-3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const sizes = [
    { value: '1024x1024', label: '1024×1024 (Square)' },
    { value: '1024x1792', label: '1024×1792 (Portrait)' },
    { value: '1792x1024', label: '1792×1024 (Landscape)' },
  ];

  const models = [
    { value: 'dall-e-3', label: 'DALL-E 3', company: 'OpenAI' },
    { value: 'midjourney', label: 'Midjourney', company: 'Midjourney', disabled: true },
    { value: 'stable-diffusion', label: 'Stable Diffusion', company: 'Stability AI', disabled: true },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const imageUrl = await aiProviderService.generateImage(prompt, selectedSize);
      
      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt,
        timestamp: new Date(),
        model: selectedModel,
        size: selectedSize,
      };

      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error('Image generation failed:', error);
      // In production, show proper error toast
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `corespark-${prompt.slice(0, 50)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center glow-accent">
              <Image className="w-4 h-4 text-accent" />
            </div>
            <div>
              <CardTitle className="gradient-text-secondary">AI Image Generator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create stunning images with advanced AI models
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create... Be creative and detailed!"
              className="min-h-[100px] bg-background/50 border-border/50 focus:border-accent/50"
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  {models.map((model) => (
                    <SelectItem 
                      key={model.value} 
                      value={model.value}
                      disabled={model.disabled}
                    >
                      <div className="flex items-center gap-2">
                        <span>{model.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.company}
                        </Badge>
                        {model.disabled && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  {sizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full glow-accent"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              Generated Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((image, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative group">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full rounded-lg border border-border/50 shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownload(image.url, image.prompt)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyPrompt(image.prompt)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {image.model}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {image.size}
                      </Badge>
                      <span>{image.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};