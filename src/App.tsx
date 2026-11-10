'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpringTabs, StudioTabId, signatureSpring } from './components/SpringTabs.js';
import { StampButton } from './components/StampButton.js';
import { ChannelCard, PlatformChannelMeta } from './components/ChannelCard.js';
import { ConnectedAccountData } from './components/AccountChip.js';
import { BroadcastMatrix } from './components/BroadcastMatrix.js';
import {
  Shield,
  Layers,
  Clock,
  CheckCircle2,
  Send,
  UploadCloud,
  FileVideo,
  Key,
  Radio,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTabId>('channels');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Accounts state with multi-account per platform support
  const [accounts, setAccounts] = useState<ConnectedAccountData[]>([
    {
      id: 'acc_yt_01',
      platform: 'youtube',
      handle: '@chronicle_lab',
      isDefault: true,
      monogramBg: '#92C5F1',
      tokenSnippet: 'ya29.a0Af...9vK2',
      connectedAt: '2h ago',
    },
    {
      id: 'acc_yt_02',
      platform: 'youtube',
      handle: '@chronicle_shorts',
      isDefault: false,
      monogramBg: '#F5EFD5',
      tokenSnippet: 'ya29.a0Af...xL81',
      connectedAt: '1d ago',
    },
    {
      id: 'acc_fb_01',
      platform: 'facebook',
      handle: '@chronicle_studio_hub',
      isDefault: true,
      monogramBg: '#536DA8',
      tokenSnippet: 'EAABwzLp...89Xq',
      connectedAt: '3d ago',
    },
    {
      id: 'acc_ig_01',
      platform: 'instagram',
      handle: '@chronicle_visuals',
      isDefault: true,
      monogramBg: '#A290B6',
      tokenSnippet: 'IGQVJ...991A',
      connectedAt: '3d ago',
    },
    {
      id: 'acc_tt_01',
      platform: 'tiktok',
      handle: '@chronicle.creative',
      isDefault: true,
      monogramBg: '#A290B6',
      tokenSnippet: 'act.48ab...tt_sec',
      connectedAt: '1h ago',
    },
  ]);

  // Queue state for published/scheduled streams
  const [broadcastQueue, setBroadcastQueue] = useState<
    {
      id: string;
      title: string;
      timestamp: string;
      channelCount: number;
      status: 'PUBLISHED' | 'SCHEDULED' | 'DISPATCHING';
    }[]
  >([
    {
      id: 'q_01',
      title: 'Studio Monitor & Audio Suite Workflow',
      timestamp: 'Today, 14:30 GMT',
      channelCount: 5,
      status: 'PUBLISHED',
    },
    {
      id: 'q_02',
      title: 'Ceramic Pour & Slow Morning Ritual',
      timestamp: 'Today, 18:30 GMT (Peak Window)',
      channelCount: 4,
      status: 'SCHEDULED',
    },
  ]);

  const channelMetas: PlatformChannelMeta[] = [
    {
      platform: 'youtube',
      displayName: 'YouTube Studio & Shorts',
      apiName: 'YOUTUBE_DATA_API_V3',
      scopes: ['youtube.upload', 'youtube.readonly'],
      accentColor: '#92C5F1',
      description: 'Uploads full landscape master videos and vertical YouTube Shorts via chunked sessions.',
    },
    {
      platform: 'facebook',
      displayName: 'Facebook Business Pages',
      apiName: 'META_GRAPH_API_V19',
      scopes: ['pages_manage_posts', 'publish_video', 'pages_read_engagement'],
      accentColor: '#536DA8',
      description: 'Publishes native page videos with target audience segmentation and instant indexing.',
    },
    {
      platform: 'instagram',
      displayName: 'Instagram Professional',
      apiName: 'INSTAGRAM_GRAPH_API',
      scopes: ['instagram_content_publish', 'instagram_basic'],
      accentColor: '#A290B6',
      description: 'Dispatches 9:16 vertical Reels with custom cover frame markers and feed placement.',
    },
    {
      platform: 'tiktok',
      displayName: 'TikTok Creator API',
      apiName: 'TIKTOK_OPEN_API',
      scopes: ['video.publish', 'user.info.basic'],
      accentColor: '#A290B6',
      description: 'Direct publishing to TikTok profile with duet, stitch, and commercial disclosure flags.',
    },
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddAccount = (platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok', handle: string) => {
    const bgColors = ['#92C5F1', '#A290B6', '#536DA8', '#F5EFD5'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newAcc: ConnectedAccountData = {
      id: `acc_${platform}_${Date.now()}`,
      platform,
      handle,
      isDefault: accounts.filter((a) => a.platform === platform).length === 0,
      monogramBg: randomBg,
      tokenSnippet: `tok_${platform}_${Math.random().toString(36).substring(2, 6)}`,
      connectedAt: 'Just now',
    };

    setAccounts((prev) => [...prev, newAcc]);
    showToast(`OAuth 2.0 PKCE Link Granted: ${handle} saved into Supabase Vault.`);
  };

  const handleToggleDefault = (id: string) => {
    const target = accounts.find((a) => a.id === id);
    if (!target) return;

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.platform === target.platform) {
          return { ...a, isDefault: a.id === id };
        }
        return a;
      })
    );
    showToast(`Default handle for ${target.platform.toUpperCase()} updated.`);
  };

  const handleDisconnect = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    showToast(`Account cipher detached from Supabase social_tokens.`);
  };

  const handleDispatch = (
    selectedAccountIds: string[],
    metadata: { title: string; caption: string; isScheduled: boolean }
  ) => {
    const newEntry = {
      id: `q_${Date.now()}`,
      title: metadata.title,
      timestamp: metadata.isScheduled ? 'Scheduled for upcoming slot' : 'Dispatched just now',
      channelCount: selectedAccountIds.length,
      status: (metadata.isScheduled ? 'SCHEDULED' : 'PUBLISHED') as any,
    };

    setBroadcastQueue((prev) => [newEntry, ...prev]);
    showToast(
      metadata.isScheduled
        ? `Broadcast scheduled across ${selectedAccountIds.length} connected accounts.`
        : `Immediate multi-channel stream dispatched to ${selectedAccountIds.length} platforms.`
    );
    setActiveTab('queue');
  };

  return (
    <div className="min-h-screen bg-[#E8EAF7] text-[#253B74] flex flex-col font-space selection:bg-[#92C5F1] selection:text-[#253B74]">
      {/* 6) STRICT CLEAN HEADER: Wordmark in Morge + SpringTabs only (NO unknown photo/avatar) */}
      <header className="sticky top-0 z-40 bg-[#E8EAF7]/95 backdrop-blur-xs border-b-[1.5px] border-[#253B74] px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
        {/* Wordmark in Morge */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-morge text-3xl sm:text-4xl text-[#253B74] tracking-tight select-none">
            CHRONICLE
          </span>
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase bg-[#253B74] text-[#E8EAF7] px-2 py-0.5 border border-[#253B74] hidden sm:inline">
            STUDIO // V4
          </span>
        </div>

        {/* 3a) SpringTabs Component */}
        <div className="overflow-x-auto py-1">
          <SpringTabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            tabs={[
              { id: 'channels', label: '01. CHANNELS', countBadge: accounts.length },
              { id: 'dispatch', label: '02. DISPATCH' },
              { id: 'vault', label: '03. VAULT' },
              { id: 'queue', label: '04. QUEUE', countBadge: broadcastQueue.length },
            ]}
          />
        </div>
      </header>

      {/* 7) HERO SECTION WITH MORGE HEADLINE */}
      <section className="px-6 lg:px-12 pt-10 pb-8 border-b-[1.5px] border-[#253B74]">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest uppercase text-[#536DA8]">
            <span className="w-2 h-2 bg-[#92C5F1] border border-[#253B74] animate-pulse" />
            <span>SUPABASE_TOKEN_VAULT // AES_256_GCM // ZERO_PLAINTEXT_EGRESS</span>
          </div>

          <h1 className="font-morge text-5xl sm:text-7xl lg:text-8xl text-[#253B74] tracking-tight leading-[0.95] uppercase">
            ONE UPLOAD. EVERY AUDIENCE.
          </h1>

          <p className="font-mono text-xs sm:text-sm text-[#536DA8] max-w-3xl leading-relaxed pt-2">
            Broadcast videos & posts to YouTube, Facebook, Instagram and TikTok from one tactile studio — tokens sealed in Supabase, streams chunked straight to the platforms.
          </p>
        </div>
      </section>

      {/* MAIN VIEWPORT: TAB PANELS SWITCHING WITH SPRING MOTION */}
      <main className="flex-1 px-6 lg:px-12 py-10 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* TAB 01: CHANNELS & MULTI-ACCOUNT MANAGEMENT */}
          {activeTab === 'channels' && (
            <motion.div
              key="tab-channels"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={signatureSpring}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b-[1.5px] border-[#253B74] gap-2">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#536DA8] block">
                    CHANNEL_MATRIX // UNLIMITED_HANDLES
                  </span>
                  <h2 className="font-morge text-3xl sm:text-4xl text-[#253B74]">
                    Connected Platform Authorities
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#536DA8]">
                  TOTAL LINKED HANDLES: <strong className="text-[#253B74]">{accounts.length}</strong>
                </span>
              </div>

              {/* 4 Supported Platforms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {channelMetas.map((meta) => {
                  const platformAccounts = accounts.filter((a) => a.platform === meta.platform);
                  return (
                    <ChannelCard
                      key={meta.platform}
                      channelMeta={meta}
                      accounts={platformAccounts}
                      onAddAccount={handleAddAccount}
                      onToggleDefault={handleToggleDefault}
                      onDisconnect={handleDisconnect}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 02: BROADCAST DISPATCH MATRIX */}
          {activeTab === 'dispatch' && (
            <motion.div
              key="tab-dispatch"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={signatureSpring}
            >
              <BroadcastMatrix
                accounts={accounts}
                onDispatch={handleDispatch}
                onNavigateToChannels={() => setActiveTab('channels')}
              />
            </motion.div>
          )}

          {/* TAB 03: SUPABASE VAULT & SECURITY LEDGER */}
          {activeTab === 'vault' && (
            <motion.div
              key="tab-vault"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={signatureSpring}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b-[1.5px] border-[#253B74] gap-2">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#536DA8] block">
                    SUPABASE_VAULT // ENCRYPTED_CIPHER_LEDGER
                  </span>
                  <h2 className="font-morge text-3xl sm:text-4xl text-[#253B74]">
                    Cryptographic Token Isolation
                  </h2>
                </div>
                <div className="font-mono text-xs text-[#253B74] bg-[#92C5F1] px-2.5 py-1 border border-[#253B74] font-bold">
                  [ROW_LEVEL_SECURITY: ACTIVE]
                </div>
              </div>

              {/* Security Blueprint Card */}
              <div className="bg-[#F5EFD5] border-[1.5px] border-[#253B74] p-6 sm:p-8 shadow-[4px_4px_0px_#253B74] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-[#253B74]">
                  <div className="p-4 bg-[#E8EAF7] border-[1.5px] border-[#253B74] space-y-2">
                    <span className="font-bold uppercase text-[#253B74] flex items-center gap-1.5">
                      <Shield size={14} className="text-[#536DA8]" />
                      01. RLS Isolation
                    </span>
                    <p className="text-[11px] text-[#536DA8] leading-relaxed">
                      All OAuth tokens sit in <code className="text-[#253B74] font-bold">public.social_tokens</code> locked to <code className="text-[#253B74]">auth.uid()</code>. Zero cross-tenant leakage.
                    </p>
                  </div>

                  <div className="p-4 bg-[#E8EAF7] border-[1.5px] border-[#253B74] space-y-2">
                    <span className="font-bold uppercase text-[#253B74] flex items-center gap-1.5">
                      <Key size={14} className="text-[#536DA8]" />
                      02. Pgcrypto Vault
                    </span>
                    <p className="text-[11px] text-[#536DA8] leading-relaxed">
                      Tokens are encrypted at rest with AES-256 keys managed by Supabase Vault. Tokens decrypt only in transient RAM during dispatch.
                    </p>
                  </div>

                  <div className="p-4 bg-[#E8EAF7] border-[1.5px] border-[#253B74] space-y-2">
                    <span className="font-bold uppercase text-[#253B74] flex items-center gap-1.5">
                      <Radio size={14} className="text-[#536DA8]" />
                      03. Auto-Rotation Cron
                    </span>
                    <p className="text-[11px] text-[#536DA8] leading-relaxed">
                      Background worker inspects TTL every 10 seconds. When &lt;10m remain, a refresh grant executes before chunked video streaming begins.
                    </p>
                  </div>
                </div>

                {/* Live Vault Accounts Table */}
                <div className="overflow-x-auto border-[1.5px] border-[#253B74]">
                  <table className="w-full font-mono text-xs text-left bg-[#E8EAF7]">
                    <thead>
                      <tr className="bg-[#253B74] text-[#E8EAF7] border-b border-[#253B74]">
                        <th className="p-3">ACCOUNT</th>
                        <th className="p-3">PLATFORM</th>
                        <th className="p-3">STORAGE_KEY</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3 text-right">LAST_ROTATED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#253B74]">
                      {accounts.map((acc) => (
                        <tr key={acc.id} className="hover:bg-[#F5EFD5] transition-colors">
                          <td className="p-3 font-bold text-[#253B74]">{acc.handle}</td>
                          <td className="p-3 uppercase">{acc.platform}</td>
                          <td className="p-3 text-[#536DA8]">{acc.tokenSnippet} [AES-GCM]</td>
                          <td className="p-3">
                            <span className="bg-[#92C5F1] text-[#253B74] px-1.5 py-0.5 border border-[#253B74] font-bold text-[10px]">
                              [SEALED]
                            </span>
                          </td>
                          <td className="p-3 text-right text-[#536DA8]">{acc.connectedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 04: QUEUE & BROADCAST HISTORY */}
          {activeTab === 'queue' && (
            <motion.div
              key="tab-queue"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={signatureSpring}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b-[1.5px] border-[#253B74] gap-2">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#536DA8] block">
                    DISPATCH_PIPELINE // AUDIENCE_FEED
                  </span>
                  <h2 className="font-morge text-3xl sm:text-4xl text-[#253B74]">
                    Release Schedule & History
                  </h2>
                </div>
                <StampButton
                  variant="primary"
                  onClick={() => setActiveTab('dispatch')}
                  size="sm"
                >
                  + NEW BROADCAST STREAM
                </StampButton>
              </div>

              <div className="space-y-4">
                {broadcastQueue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#F5EFD5] border-[1.5px] border-[#253B74] p-5 shadow-[4px_4px_0px_#253B74] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-[#253B74] ${
                            item.status === 'PUBLISHED'
                              ? 'bg-[#92C5F1] text-[#253B74]'
                              : 'bg-[#A290B6] text-[#E8EAF7]'
                          }`}
                        >
                          [{item.status}]
                        </span>
                        <span className="font-mono text-xs text-[#536DA8]">{item.timestamp}</span>
                      </div>
                      <h4 className="font-morge text-xl text-[#253B74]">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[#253B74] font-bold">
                        {item.channelCount} CHANNELS BROADCAST
                      </span>
                      <button
                        onClick={() => showToast(`Inspection details for ${item.title} opened.`)}
                        className="px-3 py-1.5 font-mono text-xs font-bold uppercase bg-[#E8EAF7] border border-[#253B74] hover:bg-[#92C5F1] transition-colors"
                      >
                        LOGS &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 6) CLEAN SINGLE MONO FOOTER (NO generic links or marketing noise) */}
      <footer className="border-t-[1.5px] border-[#253B74] bg-[#253B74] text-[#E8EAF7] px-6 lg:px-12 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] font-bold tracking-widest uppercase">
          <span>CHRONICLE AUTO-BROADCAST STUDIO // TOKENS SEALED IN SUPABASE VAULT</span>
          <span className="text-[#92C5F1]">DIRECT_TO_STORAGE CHUNKED S3 PROTOCOL</span>
        </div>
      </footer>

      {/* Tactile Feedback Banner */}
      {toastMessage && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 bg-[#253B74] text-[#E8EAF7] border-[1.5px] border-[#253B74] shadow-[4px_4px_0px_#92C5F1] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-[#92C5F1]" />
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
