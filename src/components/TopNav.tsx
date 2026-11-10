import React from 'react';
import { AnthropicSpike } from './AnthropicSpike.js';
import { UploadCloud } from 'lucide-react';

export type NavTab = 'dashboard' | 'queue' | 'media' | 'oauth' | 'analytics';

interface TopNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenUploadModal: () => void;
  avatarUrl: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenUploadModal,
  avatarUrl,
}) => {
  const navItems: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'queue', label: 'Publishing Queue' },
    { id: 'media', label: 'Video Vault' },
    { id: 'oauth', label: 'OAuth 2.0 Settings' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#faf9f5]/95 backdrop-blur-md border-b border-[#e6dfd8] px-6 h-16 flex items-center justify-between gap-8 transition-colors">
      {/* Zone 1: Brand Wordmark with Anthropic Spike */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('dashboard');
          }}
          className="flex items-center gap-2.5 text-[#141413] hover:opacity-85 transition-opacity"
        >
          <AnthropicSpike size={20} color="#141413" />
          <span className="font-editorial text-2xl font-normal tracking-tight text-[#141413] whitespace-nowrap">
            Chronicle
          </span>
          <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-widest pl-1 border-l border-[#e6dfd8] hidden sm:inline">
            Content CRM
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3.5 py-1.5 text-sm font-medium transition-all rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#efe9de] text-[#141413] shadow-xs'
                  : 'text-[#6c6a64] hover:text-[#141413] hover:bg-[#efe9de]/50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 Primary Action "Upload Post" + Profile Indicator */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] active:bg-[#a9583e] transition-colors rounded-md shadow-xs whitespace-nowrap shrink-0"
        >
          <UploadCloud size={16} />
          <span>Upload Post</span>
        </button>

        <div className="relative group">
          <button
            onClick={() => onSelectTab('oauth')}
            title="Channel Connections & OAuth 2.0 Settings"
            className="w-9 h-9 rounded-full overflow-hidden border border-[#e6dfd8] hover:border-[#cc785c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#cc785c]/30"
          >
            <img
              src={avatarUrl}
              alt="Channel Director"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
