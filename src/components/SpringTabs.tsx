'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const signatureSpring = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 16,
  mass: 0.6,
};

export type StudioTabId = 'channels' | 'dispatch' | 'vault' | 'queue';

export interface StudioTabItem {
  id: StudioTabId;
  label: string;
  countBadge?: number | string;
}

interface SpringTabsProps {
  activeTab: StudioTabId;
  onSelectTab: (id: StudioTabId) => void;
  tabs?: StudioTabItem[];
}

export const SpringTabs: React.FC<SpringTabsProps> = ({
  activeTab,
  onSelectTab,
  tabs = [
    { id: 'channels', label: '01. CHANNELS' },
    { id: 'dispatch', label: '02. DISPATCH' },
    { id: 'vault', label: '03. VAULT' },
    { id: 'queue', label: '04. QUEUE' },
  ],
}) => {
  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#F5EFD5] border-[1.5px] border-[#253B74] shadow-[4px_4px_0px_#253B74]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            whileTap={{ scale: 0.95, scaleX: 0.95 }}
            transition={signatureSpring}
            className={`relative px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider select-none cursor-pointer border-[1.5px] transition-colors z-10 ${
              isActive
                ? 'text-[#253B74] border-[#253B74]'
                : 'text-[#536DA8] border-transparent hover:text-[#253B74] hover:bg-[#E8EAF7]/50'
            }`}
          >
            {/* Sliding & Squashing Dream-Blue Layout Pill */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                transition={signatureSpring}
                className="absolute inset-0 bg-[#92C5F1] -z-10 shadow-[2px_2px_0px_#253B74]"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{tab.label}</span>
              {tab.countBadge !== undefined && (
                <span className="text-[10px] bg-[#253B74] text-[#E8EAF7] px-1 py-0.2 border border-[#253B74]">
                  {tab.countBadge}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
