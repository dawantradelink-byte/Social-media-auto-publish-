'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';

export const signatureSpring = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 16,
  mass: 0.6,
};

export interface ConnectedAccountData {
  id: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  handle: string;
  isDefault: boolean;
  monogramBg: string; // e.g. #92C5F1, #A290B6, #536DA8
  tokenSnippet: string;
  connectedAt: string;
}

interface AccountChipProps {
  account: ConnectedAccountData;
  onToggleDefault: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export const AccountChip: React.FC<AccountChipProps> = ({
  account,
  onToggleDefault,
  onDisconnect,
}) => {
  const monogram = account.handle.replace('@', '').charAt(0).toUpperCase() || 'A';

  const getPlatformGlyph = () => {
    switch (account.platform) {
      case 'youtube':
        return 'YT';
      case 'facebook':
        return 'FB';
      case 'instagram':
        return 'IG';
      case 'tiktok':
        return 'TT';
    }
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.7, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={signatureSpring}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-2.5 p-1.5 pr-2.5 border-[1.5px] border-[#253B74] shadow-[3px_3px_0px_#253B74] transition-colors ${
        account.isDefault ? 'bg-[#92C5F1]' : 'bg-[#F5EFD5]'
      }`}
    >
      {/* Monogram Square - NEVER a photo */}
      <div
        className="w-7 h-7 border-[1.5px] border-[#253B74] flex items-center justify-center font-mono font-bold text-xs text-[#253B74] select-none shrink-0"
        style={{ backgroundColor: account.monogramBg }}
      >
        {monogram}
      </div>

      {/* Platform Glyph Badge */}
      <span className="font-mono text-[10px] font-bold px-1 py-0.5 bg-[#253B74] text-[#E8EAF7] border border-[#253B74]">
        {getPlatformGlyph()}
      </span>

      {/* Handle & Status */}
      <div className="flex items-center gap-1.5 font-mono text-xs text-[#253B74]">
        <span className="font-medium tracking-tight truncate max-w-[120px]">{account.handle}</span>
        <span className="text-[9px] font-bold bg-[#E8EAF7] text-[#253B74] border border-[#253B74] px-1 py-0.2">
          [LIVE]
        </span>
      </div>

      {/* Star to set default */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleDefault(account.id);
        }}
        title={account.isDefault ? 'Primary Default Account' : 'Set as Primary Account'}
        className={`p-1 border border-[#253B74] transition-colors ${
          account.isDefault
            ? 'bg-[#253B74] text-[#F5EFD5]'
            : 'bg-[#E8EAF7] text-[#536DA8] hover:text-[#253B74]'
        }`}
      >
        <Star size={11} fill={account.isDefault ? '#F5EFD5' : 'none'} />
      </button>

      {/* Disconnect X */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDisconnect(account.id);
        }}
        title="Disconnect Account"
        className="p-1 border border-[#253B74] bg-[#E8EAF7] hover:bg-[#A290B6] text-[#253B74] transition-colors"
      >
        <X size={11} />
      </button>
    </motion.div>
  );
};
