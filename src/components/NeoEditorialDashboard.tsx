'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Lock,
  Terminal,
  Key,
  Check,
  Copy,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

// Exact Framer Motion spring physics specifications from design system
export const editorialSpring = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 26,
  mass: 0.8,
};

export const snappyBouncy = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 18, // Intentionally under-damped for a playful, tactile punch
  mass: 0.6,
};

interface ChannelConnection {
  id: string;
  platform: 'youtube' | 'meta';
  platformTitle: string;
  apiName: string;
  handle: string;
  maskedToken: string;
  tokenType: string;
  ttlSeconds: number;
  scopes: string[];
  lastRotated: string;
  storageTarget: string;
}

export default function AccountConnectionDashboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeRotation, setActiveRotation] = useState<string | null>(null);

  // Live countdown timers for tokens to demonstrate Supabase automated rotation
  const [channels, setChannels] = useState<Record<string, ChannelConnection>>({
    youtube: {
      id: 'conn_yt_01',
      platform: 'youtube',
      platformTitle: 'YouTube Studio & Shorts',
      apiName: 'YouTube Data API v3',
      handle: '@chronicle_lab',
      maskedToken: 'ya29.a0AfH6SMDh_98vK2Q...x91L [AES-256-GCM]',
      tokenType: 'OAuth 2.0 Bearer',
      ttlSeconds: 3240, // 54m 00s
      scopes: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
      ],
      lastRotated: '6 mins ago via Supabase Cron',
      storageTarget: 'supabase.vault.social_tokens[id:yt_01]',
    },
    meta: {
      id: 'conn_meta_01',
      platform: 'meta',
      platformTitle: 'Facebook Pages & Instagram Reels',
      apiName: 'Meta Graph API v19.0',
      handle: '@chronicle_visuals',
      maskedToken: 'EAABwzLp...89XqK7129P [AES-256-GCM]',
      tokenType: 'OAuth 2.0 Long-Lived (60D)',
      ttlSeconds: 5184000 - 86400 * 2, // 58 days remaining
      scopes: [
        'instagram_content_publish',
        'pages_manage_posts',
        'publish_video',
        'pages_read_engagement',
      ],
      lastRotated: '2 days ago via Supabase Edge Function',
      storageTarget: 'supabase.vault.social_tokens[id:meta_01]',
    },
  });

  // Second-by-second countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setChannels((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (next[key].ttlSeconds > 0) {
            next[key] = {
              ...next[key],
              ttlSeconds: next[key].ttlSeconds - 1,
            };
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTTL = (seconds: number) => {
    if (seconds > 86400) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      return `${days}D ${hours}H REMAINING`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}M ${secs < 10 ? '0' : ''}${secs}S REMAINING`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestTokenGrant = async (platformKey: string) => {
    setActiveRotation(platformKey);
    // Simulate Supabase Edge Function validating and rotating token
    await new Promise((resolve) => setTimeout(resolve, 850));
    setChannels((prev) => ({
      ...prev,
      [platformKey]: {
        ...prev[platformKey],
        ttlSeconds: 3600,
        lastRotated: 'Just now (Verification probe passed)',
      },
    }));
    setActiveRotation(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] text-[#13251E] selection:bg-[#D2FF38] selection:text-[#13251E] p-6 sm:p-10 lg:p-14 font-mono">
      {/* Editorial Masthead / Header */}
      <header className="max-w-6xl mx-auto border-b-[1.5px] border-[#13251E] pb-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-[#13251E] text-[#D2FF38] px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase">
                VAULT_SECURITY // RLS_ENFORCED
              </span>
              <span className="text-[11px] font-mono text-[#13251E]/60 tracking-wider">
                SUPABASE PGCRYPTO ENCRYPTION ACTIVE
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#13251E] leading-[1.05]">
              Account Connection Dashboard
            </h1>
            <p className="font-mono text-xs sm:text-sm text-[#13251E]/80 max-w-2xl leading-relaxed pt-1">
              Authorized OAuth 2.0 credentials for automated publishing across YouTube, Facebook, and Instagram. Cryptographically locked in Supabase Vault with zero plaintext exposure.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="border-[1.5px] border-[#13251E] bg-[#EBE4D5] px-4 py-2.5 text-xs text-[#13251E] flex items-center gap-2.5 shadow-[2px_2px_0px_#13251E]">
              <span className="w-2.5 h-2.5 bg-[#D2FF38] border border-[#13251E] animate-pulse" />
              <span className="font-bold tracking-widest uppercase text-[11px]">
                DAEMON: AUTO_ROTATE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Channel Card Lockups */}
      <main className="max-w-6xl mx-auto space-y-12">
        {/* Section Lead */}
        <div className="flex items-center justify-between border-b-[1.5px] border-[#13251E] pb-3">
          <span className="font-bold text-xs uppercase tracking-widest text-[#13251E]">
            01 // ACTIVE_CHANNEL_CONNECTIONS
          </span>
          <span className="text-xs text-[#13251E]/60">
            TABLE: <code className="text-[#13251E] font-bold">public.social_tokens</code>
          </span>
        </div>

        {/* Asymmetrical Channel Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: YouTube Data API v3 */}
          <motion.div
            layout
            transition={editorialSpring}
            whileHover={{
              x: -3,
              y: -3,
              boxShadow: '4px 4px 0px #13251E',
              transition: snappyBouncy,
            }}
            className="bg-[#EBE4D5] border-[1.5px] border-[#13251E] rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm p-6 sm:p-8 flex flex-col justify-between transition-colors relative overflow-hidden"
          >
            {/* Top Bar / Kicker */}
            <div>
              <div className="flex items-start justify-between gap-4 pb-5 border-b-[1.5px] border-[#13251E]/30">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#13251E]/60 block mb-1">
                    GOOGLE CLOUD PLATFORM · YOUTUBE API
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#13251E] tracking-tight">
                    {channels.youtube.platformTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-[#13251E]">{channels.youtube.handle}</span>
                    <span className="text-[#13251E]/40">·</span>
                    <span className="text-xs text-[#13251E]/70 font-mono">Channel Verified</span>
                  </div>
                </div>

                {/* Status Block Indicator (Electric Lime Accent) */}
                <div className="bg-[#D2FF38] text-[#13251E] border-[1.5px] border-[#13251E] px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#13251E]">
                  <span>[● LIVE · RLS VERIFIED]</span>
                </div>
              </div>

              {/* Inset Deep Forest Terminal Box for Masked Token */}
              <div className="bg-[#13251E] text-[#F4F0E8] p-4 mt-6 border-[1.5px] border-[#13251E] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#F4F0E8]/70 border-b border-[#F4F0E8]/20 pb-2">
                  <span className="flex items-center gap-1.5 font-bold tracking-widest uppercase text-[#D2FF38]">
                    <Key size={12} />
                    OAUTH_2.0_BEARER_TOKEN
                  </span>
                  <button
                    onClick={() => copyToClipboard(channels.youtube.maskedToken, 'yt')}
                    className="flex items-center gap-1 hover:text-[#D2FF38] transition-colors"
                  >
                    {copiedKey === 'yt' ? (
                      <>
                        <Check size={11} className="text-[#D2FF38]" /> COPIED
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> COPY_CIPHER
                      </>
                    )}
                  </button>
                </div>

                <div className="font-mono text-xs text-[#D2FF38] break-all select-all font-medium py-1">
                  {channels.youtube.maskedToken}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-[#F4F0E8]/60 pt-1 gap-1">
                  <span>TARGET: {channels.youtube.storageTarget}</span>
                  <span>ROTATED: {channels.youtube.lastRotated}</span>
                </div>
              </div>

              {/* Token Time-To-Live & Health Strip */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#F4F0E8] border-[1.5px] border-[#13251E] p-3">
                  <span className="text-[10px] text-[#13251E]/60 uppercase tracking-widest block mb-0.5">
                    TOKEN_LIFETIME (TTL)
                  </span>
                  <div className="text-xs font-bold text-[#13251E] tabular-nums flex items-center gap-1.5">
                    <Clock size={13} className="text-[#D45D3A]" />
                    <span>{formatTTL(channels.youtube.ttlSeconds)}</span>
                  </div>
                </div>

                <div className="bg-[#F4F0E8] border-[1.5px] border-[#13251E] p-3">
                  <span className="text-[10px] text-[#13251E]/60 uppercase tracking-widest block mb-0.5">
                    AUTO_REFRESH_GRANT
                  </span>
                  <span className="text-xs font-bold text-[#13251E] uppercase">
                    ONLINE (CRON 10M)
                  </span>
                </div>
              </div>

              {/* Authorized Scopes */}
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-bold text-[#13251E]/70 uppercase tracking-widest block">
                  GRANTED_OAUTH_SCOPES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {channels.youtube.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="text-[11px] bg-[#F4F0E8] text-[#13251E] border-[1.5px] border-[#13251E] px-2 py-0.5"
                    >
                      {scope.split('/').pop()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Button Cluster */}
            <div className="pt-6 mt-6 border-t-[1.5px] border-[#13251E]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleTestTokenGrant('youtube')}
                disabled={activeRotation === 'youtube'}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold tracking-widest uppercase bg-[#D45D3A] text-[#F4F0E8] border-[1.5px] border-[#13251E] hover:bg-[#b84c2d] active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#13251E] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} className={activeRotation === 'youtube' ? 'animate-spin' : ''} />
                <span>{activeRotation === 'youtube' ? 'PROBING_VAULT...' : 'TEST_BEARER_GRANT ->'}</span>
              </button>

              <button
                onClick={() => handleTestTokenGrant('youtube')}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold tracking-widest uppercase bg-[#F4F0E8] text-[#13251E] border-[1.5px] border-[#13251E] hover:bg-[#EBE4D5] transition-all shadow-[2px_2px_0px_#13251E]"
              >
                RE-AUTHENTICATE (PKCE)
              </button>
            </div>
          </motion.div>

          {/* Card 2: Meta Graph API (Facebook Pages & Instagram) */}
          <motion.div
            layout
            transition={editorialSpring}
            whileHover={{
              x: -3,
              y: -3,
              boxShadow: '4px 4px 0px #13251E',
              transition: snappyBouncy,
            }}
            className="bg-[#EBE4D5] border-[1.5px] border-[#13251E] rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm p-6 sm:p-8 flex flex-col justify-between transition-colors relative overflow-hidden"
          >
            {/* Top Bar / Kicker */}
            <div>
              <div className="flex items-start justify-between gap-4 pb-5 border-b-[1.5px] border-[#13251E]/30">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#13251E]/60 block mb-1">
                    META FOR DEVELOPERS · GRAPH API
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#13251E] tracking-tight">
                    {channels.meta.platformTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-[#13251E]">{channels.meta.handle}</span>
                    <span className="text-[#13251E]/40">·</span>
                    <span className="text-xs text-[#13251E]/70 font-mono">Business Linked</span>
                  </div>
                </div>

                {/* Status Block Indicator (Electric Lime Accent) */}
                <div className="bg-[#D2FF38] text-[#13251E] border-[1.5px] border-[#13251E] px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#13251E]">
                  <span>[● LIVE · RLS VERIFIED]</span>
                </div>
              </div>

              {/* Inset Deep Forest Terminal Box for Masked Token */}
              <div className="bg-[#13251E] text-[#F4F0E8] p-4 mt-6 border-[1.5px] border-[#13251E] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#F4F0E8]/70 border-b border-[#F4F0E8]/20 pb-2">
                  <span className="flex items-center gap-1.5 font-bold tracking-widest uppercase text-[#D2FF38]">
                    <Key size={12} />
                    LONG_LIVED_TOKEN_GRANT
                  </span>
                  <button
                    onClick={() => copyToClipboard(channels.meta.maskedToken, 'meta')}
                    className="flex items-center gap-1 hover:text-[#D2FF38] transition-colors"
                  >
                    {copiedKey === 'meta' ? (
                      <>
                        <Check size={11} className="text-[#D2FF38]" /> COPIED
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> COPY_CIPHER
                      </>
                    )}
                  </button>
                </div>

                <div className="font-mono text-xs text-[#D2FF38] break-all select-all font-medium py-1">
                  {channels.meta.maskedToken}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-[#F4F0E8]/60 pt-1 gap-1">
                  <span>TARGET: {channels.meta.storageTarget}</span>
                  <span>ROTATED: {channels.meta.lastRotated}</span>
                </div>
              </div>

              {/* Token Time-To-Live & Health Strip */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#F4F0E8] border-[1.5px] border-[#13251E] p-3">
                  <span className="text-[10px] text-[#13251E]/60 uppercase tracking-widest block mb-0.5">
                    TOKEN_LIFETIME (TTL)
                  </span>
                  <div className="text-xs font-bold text-[#13251E] tabular-nums flex items-center gap-1.5">
                    <Clock size={13} className="text-[#D45D3A]" />
                    <span>{formatTTL(channels.meta.ttlSeconds)}</span>
                  </div>
                </div>

                <div className="bg-[#F4F0E8] border-[1.5px] border-[#13251E] p-3">
                  <span className="text-[10px] text-[#13251E]/60 uppercase tracking-widest block mb-0.5">
                    ROTATION_CADENCE
                  </span>
                  <span className="text-xs font-bold text-[#13251E] uppercase">
                    60-DAY EXTENSION
                  </span>
                </div>
              </div>

              {/* Authorized Scopes */}
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-bold text-[#13251E]/70 uppercase tracking-widest block">
                  GRANTED_OAUTH_SCOPES:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {channels.meta.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="text-[11px] bg-[#F4F0E8] text-[#13251E] border-[1.5px] border-[#13251E] px-2 py-0.5"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Button Cluster */}
            <div className="pt-6 mt-6 border-t-[1.5px] border-[#13251E]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleTestTokenGrant('meta')}
                disabled={activeRotation === 'meta'}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold tracking-widest uppercase bg-[#D45D3A] text-[#F4F0E8] border-[1.5px] border-[#13251E] hover:bg-[#b84c2d] active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#13251E] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} className={activeRotation === 'meta' ? 'animate-spin' : ''} />
                <span>{activeRotation === 'meta' ? 'EXTENDING...' : 'TEST_BEARER_GRANT ->'}</span>
              </button>

              <button
                onClick={() => handleTestTokenGrant('meta')}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold tracking-widest uppercase bg-[#F4F0E8] text-[#13251E] border-[1.5px] border-[#13251E] hover:bg-[#EBE4D5] transition-all shadow-[2px_2px_0px_#13251E]"
              >
                RE-AUTHENTICATE (PKCE)
              </button>
            </div>
          </motion.div>
        </div>

        {/* Supabase Vault Security Invariants Dossier */}
        <div className="bg-[#13251E] text-[#F4F0E8] border-[1.5px] border-[#13251E] p-8 rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm shadow-[4px_4px_0px_#13251E]/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F4F0E8]/20 gap-3">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#D2FF38] uppercase">
                SECURITY_ARCHITECTURE // SUPABASE_POSTGRES
              </span>
              <h3 className="font-serif text-2xl text-[#F4F0E8] tracking-tight mt-0.5">
                Token Security & Isolation Invariants
              </h3>
            </div>
            <div className="text-xs text-[#D2FF38] font-bold font-mono">
              [ENCRYPTION_ENGINE: AES_GCM_256]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#F4F0E8]/80 leading-relaxed">
            <div className="space-y-2 border-l border-[#D2FF38]/40 pl-4">
              <span className="text-[#D2FF38] font-bold block uppercase tracking-wider">
                01. Row Level Security (RLS)
              </span>
              <p>
                Tokens reside in the <code className="text-[#F4F0E8] font-bold">social_tokens</code> table. Policies restrict access to <code className="text-[#D2FF38]">auth.uid() = user_id</code>. Zero public egress or unauthorized reads.
              </p>
            </div>

            <div className="space-y-2 border-l border-[#D2FF38]/40 pl-4">
              <span className="text-[#D2FF38] font-bold block uppercase tracking-wider">
                02. Pgcrypto Column Encryption
              </span>
              <p>
                Bearer tokens and refresh tokens are encrypted at rest using private master keys stored in Supabase Vault. Plaintext tokens exist strictly in transient RAM during dispatch.
              </p>
            </div>

            <div className="space-y-2 border-l border-[#D2FF38]/40 pl-4">
              <span className="text-[#D2FF38] font-bold block uppercase tracking-wider">
                03. Zero-Downtime Auto-Refresh
              </span>
              <p>
                A background worker tests token expiration before every video dispatch. If TTL drops below 10 minutes, a refresh grant executes automatically before chunked upload begins.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
