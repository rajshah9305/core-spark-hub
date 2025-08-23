import React, { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { ImageGenerator } from '@/components/tools/ImageGenerator';
import { CodeExecutor } from '@/components/tools/CodeExecutor';
import { UIGenerator } from '@/components/tools/UIGenerator';
import { APIKeyManager } from '@/components/settings/APIKeyManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Image, 
  Code, 
  Palette, 
  Settings,
  Sparkles
} from 'lucide-react';

interface EnhancedChatInterfaceProps {
  className?: string;
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="glass-effect grid w-full grid-cols-5 mb-0 border-b border-border/50 rounded-none">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="ui" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            UI Builder
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full m-0 p-0">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="image" className="h-full m-0 p-6 overflow-auto scrollbar-thin">
            <ImageGenerator />
          </TabsContent>
          
          <TabsContent value="code" className="h-full m-0 p-6 overflow-auto scrollbar-thin">
            <CodeExecutor />
          </TabsContent>
          
          <TabsContent value="ui" className="h-full m-0 p-6 overflow-auto scrollbar-thin">
            <UIGenerator />
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-6 overflow-auto scrollbar-thin">
            <APIKeyManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};