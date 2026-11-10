'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccountChip, ConnectedAccountData, signatureSpring } from './AccountChip.js';
import { StampButton } from './StampButton.js';
import { Plus, Shield, Key, Check, Lock, Radio } from 'lucide-react';

export interface PlatformChannelMeta {
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  displayName: string;
  apiName: string;
  scopes: string[];
  accentColor: string; // e.g. #92C5F1, #A290B6, #536DA8
  description: string;
}

interface ChannelCardProps {
  channelMeta: PlatformChannelMeta;
  accounts: ConnectedAccountData[];
  onAddAccount: (platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok', handle: string) => void;
  onToggleDefault: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channelMeta,
  accounts,
  onAddAccount,
  onToggleDefault,
  onDisconnect,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [inputHandle, setInputHandle] = useState('');
  const [showInputModal, setShowInputModal] = useState(false);

  const handleStartConnect = () => {
    setShowInputModal(true);
  };

  const handleConfirmConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const handle = inputHandle.trim()
      ? inputHandle.trim().startsWith('@')
        ? inputHandle.trim()
        : `@${inputHandle.trim()}`
      : `@${channelMeta.platform}_creator_${accounts.length + 1}`;

    setIsConnecting(true);
    // Simulate PKCE OAuth handshake popup
    setTimeout(() => {
      onAddAccount(channelMeta.platform, handle);
      setIsConnecting(false);
      setShowInputModal(false);
      setInputHandle('');
    }, 600);
  };

  return (
    <motion.div
      layout
      transition={signatureSpring}
      whileHover={{ y: -2 }}
      className="bg-[#F5EFD5] border-[1.5px] border-[#253B74] shadow-[4px_4px_0px_#253B74] p-6 sm:p-7 flex flex-col justify-between"
    >
      <div>
        {/* Header Strip */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-[1.5px] border-[#253B74]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase bg-[#253B74] text-[#E8EAF7] px-2 py-0.5 border border-[#253B74]">
                {channelMeta.apiName}
              </span>
              <span className="font-mono text-[10px] text-[#536DA8] font-bold">
                [{accounts.length} ACCOUNTS LINKED]
              </span>
            </div>
            <h3 className="font-morge text-2xl sm:text-3xl font-normal text-[#253B74] tracking-tight">
              {channelMeta.displayName}
            </h3>
            <p className="font-space text-xs text-[#536DA8] mt-1 leading-snug">
              {channelMeta.description}
            </p>
          </div>

          <div
            className="w-8 h-8 border-[1.5px] border-[#253B74] flex items-center justify-center font-mono font-bold text-xs text-[#253B74] shrink-0"
            style={{ backgroundColor: channelMeta.accentColor }}
          >
            {channelMeta.displayName.charAt(0)}
          </div>
        </div>

        {/* Scopes Inset */}
        <div className="my-4 p-3 bg-[#E8EAF7] border-[1.5px] border-[#253B74] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#536DA8] uppercase tracking-wider">
            <span>MANDATORY_OAUTH_SCOPES</span>
            <span className="text-[#253B74]">SUPABASE_VAULT [AES-256]</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {channelMeta.scopes.map((scope) => (
              <span
                key={scope}
                className="font-mono text-[10px] bg-[#F5EFD5] text-[#253B74] border border-[#253B74] px-1.5 py-0.5"
              >
                {scope}
              </span>
            ))}
          </div>
        </div>

        {/* Connected Accounts Cluster */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#253B74] uppercase tracking-wider">
            <span>CONNECTED_ACCOUNTS ({accounts.length})</span>
            {accounts.length > 0 && <span className="text-[#536DA8]">STAR = DEFAULT</span>}
          </div>

          <div className="min-h-[52px] flex flex-wrap gap-2 pt-1">
            <AnimatePresence mode="popLayout">
              {accounts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center py-4 border-[1.5px] border-dashed border-[#536DA8]/50 text-xs font-mono text-[#536DA8]"
                >
                  NO ACCOUNTS LINKED YET. CLICK '+ CONNECT' BELOW.
                </motion.div>
              ) : (
                accounts.map((acc) => (
                  <AccountChip
                    key={acc.id}
                    account={acc}
                    onToggleDefault={onToggleDefault}
                    onDisconnect={onDisconnect}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Action Footer: Big + CONNECT Button */}
      <div className="pt-6 mt-6 border-t-[1.5px] border-[#253B74]">
        <StampButton
          variant="primary"
          onClick={handleStartConnect}
          className="w-full py-3"
          size="md"
        >
          <Plus size={15} />
          <span>+ CONNECT {channelMeta.displayName.split(' ')[0]} ACCOUNT</span>
        </StampButton>
      </div>

      {/* 1-Tap OAuth Connect Modal / Popover */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#253B74]/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={signatureSpring}
            className="bg-[#F5EFD5] border-[1.5px] border-[#253B74] p-6 max-w-md w-full shadow-[6px_6px_0px_#253B74]"
          >
            <div className="flex items-center justify-between pb-3 border-b-[1.5px] border-[#253B74]">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#253B74]">
                1-TAP OAUTH 2.0 CONNECT // {channelMeta.displayName}
              </span>
              <button
                type="button"
                onClick={() => setShowInputModal(false)}
                className="p-1 border border-[#253B74] bg-[#E8EAF7] text-[#253B74] hover:bg-[#A290B6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmConnect} className="space-y-4 mt-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-[#253B74] mb-1">
                  Channel / Profile Handle
                </label>
                <input
                  type="text"
                  value={inputHandle}
                  onChange={(e) => setInputHandle(e.target.value)}
                  placeholder={`e.g. @${channelMeta.platform}_official`}
                  className="w-full font-mono text-xs bg-[#E8EAF7] border-[1.5px] border-[#253B74] p-2.5 text-[#253B74] placeholder-[#536DA8] focus:outline-none focus:ring-2 focus:ring-[#92C5F1]"
                  autoFocus
                />
                <span className="text-[10px] font-mono text-[#536DA8] mt-1 block">
                  Launches OAuth 2.0 PKCE flow. Token is securely signed into Supabase Vault.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t-[1.5px] border-[#253B74]">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2 font-mono text-xs font-bold uppercase border border-[#253B74] bg-[#E8EAF7] text-[#253B74]"
                >
                  CANCEL
                </button>
                <StampButton
                  type="submit"
                  disabled={isConnecting}
                  variant="accent"
                  size="sm"
                >
                  {isConnecting ? 'AUTHORIZING_PKCE...' : 'AUTHORIZE & LINK ->'}
                </StampButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
