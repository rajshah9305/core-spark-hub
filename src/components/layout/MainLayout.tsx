import React from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { TopBar } from '@/components/layout/TopBar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ className }) => {
  return (
    <div className={cn("h-screen flex flex-col bg-background", className)}>
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <EnhancedChatInterface />
        </main>
      </div>
    </div>
  );
};