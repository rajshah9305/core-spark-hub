// Core AI Provider Service for CoreSpark Hub
// Supports multiple AI providers with unified interface

export interface AIProvider {
  id: string;
  name: string;
  company: string;
  type: 'text' | 'image' | 'multimodal';
  apiKeyRequired: boolean;
  status: 'online' | 'offline' | 'limited';
  endpoint?: string;
  maxTokens?: number;
  supportsStreaming: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: string;
  tokens?: number;
  imageUrl?: string;
}

export interface ChatResponse {
  content: string;
  tokens: number;
  provider: string;
  timestamp: Date;
  error?: string;
}

export interface APIKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  stability?: string;
  replicate?: string;
}

class AIProviderService {
  private apiKeys: APIKeys = {};
  
  public readonly providers: AIProvider[] = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      company: 'OpenAI',
      type: 'multimodal',
      apiKeyRequired: true,
      status: 'online',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      maxTokens: 128000,
      supportsStreaming: true,
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      company: 'OpenAI',
      type: 'text',
      apiKeyRequired: true,
      status: 'online',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      maxTokens: 16385,
      supportsStreaming: true,
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      company: 'Anthropic',
      type: 'multimodal',
      apiKeyRequired: true,
      status: 'online',
      endpoint: 'https://api.anthropic.com/v1/messages',
      maxTokens: 200000,
      supportsStreaming: true,
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      company: 'Anthropic',
      type: 'multimodal',
      apiKeyRequired: true,
      status: 'online',
      endpoint: 'https://api.anthropic.com/v1/messages',
      maxTokens: 200000,
      supportsStreaming: true,
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      company: 'Google',
      type: 'multimodal',
      apiKeyRequired: true,
      status: 'online',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      maxTokens: 32768,
      supportsStreaming: true,
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      company: 'OpenAI',
      type: 'image',
      apiKeyRequired: true,
      status: 'online',
      endpoint: 'https://api.openai.com/v1/images/generations',
      supportsStreaming: false,
    },
  ];

  // Set API keys (in production, these would be securely stored)
  setAPIKeys(keys: Partial<APIKeys>) {
    this.apiKeys = { ...this.apiKeys, ...keys };
  }

  // Get available providers based on configured API keys
  getAvailableProviders(): AIProvider[] {
    return this.providers.filter(provider => {
      if (!provider.apiKeyRequired) return true;
      
      switch (provider.company) {
        case 'OpenAI':
          return !!this.apiKeys.openai;
        case 'Anthropic':
          return !!this.apiKeys.anthropic;
        case 'Google':
          return !!this.apiKeys.google;
        default:
          return false;
      }
    });
  }

  // Send chat message to provider
  async sendMessage(
    providerId: string, 
    messages: ChatMessage[], 
    systemPrompt?: string
  ): Promise<ChatResponse> {
    const provider = this.providers.find(p => p.id === providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    try {
      switch (provider.company) {
        case 'OpenAI':
          return await this.sendOpenAIMessage(provider, messages, systemPrompt);
        case 'Anthropic':
          return await this.sendAnthropicMessage(provider, messages, systemPrompt);
        case 'Google':
          return await this.sendGoogleMessage(provider, messages, systemPrompt);
        default:
          throw new Error(`Provider ${provider.company} not implemented`);
      }
    } catch (error) {
      console.error(`Error sending message to ${provider.name}:`, error);
      return {
        content: `Error: Failed to get response from ${provider.name}. Please check your API key and try again.`,
        tokens: 0,
        provider: provider.name,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // OpenAI API implementation
  private async sendOpenAIMessage(
    provider: AIProvider, 
    messages: ChatMessage[], 
    systemPrompt?: string
  ): Promise<ChatResponse> {
    const apiKey = this.apiKeys.openai;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openAIMessages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const response = await fetch(provider.endpoint!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.id,
        messages: openAIMessages,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokens: data.usage.total_tokens,
      provider: provider.name,
      timestamp: new Date(),
    };
  }

  // Anthropic API implementation
  private async sendAnthropicMessage(
    provider: AIProvider, 
    messages: ChatMessage[], 
    systemPrompt?: string
  ): Promise<ChatResponse> {
    const apiKey = this.apiKeys.anthropic;
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const response = await fetch(provider.endpoint!, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: provider.id,
        messages: anthropicMessages,
        max_tokens: 4000,
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic API request failed');
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      tokens: data.usage.input_tokens + data.usage.output_tokens,
      provider: provider.name,
      timestamp: new Date(),
    };
  }

  // Google Gemini API implementation
  private async sendGoogleMessage(
    provider: AIProvider, 
    messages: ChatMessage[], 
    systemPrompt?: string
  ): Promise<ChatResponse> {
    const apiKey = this.apiKeys.google;
    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    // Convert messages to Google format
    const contents = [
      ...(systemPrompt ? [{
        parts: [{ text: systemPrompt }],
        role: 'user',
      }] : []),
      ...messages.map(msg => ({
        parts: [{ text: msg.content }],
        role: msg.role === 'assistant' ? 'model' : 'user',
      })),
    ];

    const response = await fetch(`${provider.endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 4000,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Google API request failed');
    }

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      tokens: data.usageMetadata?.totalTokenCount || 0,
      provider: provider.name,
      timestamp: new Date(),
    };
  }

  // Generate image using DALL-E 3
  async generateImage(prompt: string, size: string = '1024x1024'): Promise<string> {
    const apiKey = this.apiKeys.openai;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured for image generation');
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        size,
        quality: 'standard',
        n: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Image generation failed');
    }

    const data = await response.json();
    return data.data[0].url;
  }
}

export const aiProviderService = new AIProviderService();