import React, { useState } from 'react';
import { AdvancedSidebar } from '@/components/features/AdvancedSidebar';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { TopBar } from '@/components/layout/TopBar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ className }) => {
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  
  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    setSelectedChatId(newChatId);
  };

  return (
    <div className={cn("h-screen flex flex-col bg-background matrix-bg", className)}>
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <AdvancedSidebar 
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
        <main className="flex-1 flex flex-col">
          <EnhancedChatInterface />
        </main>
      </div>
    </div>
  );
};