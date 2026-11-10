'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectedAccountData, signatureSpring } from './AccountChip.js';
import { StampButton } from './StampButton.js';
import { Check, Send, Film, Clock, Layers, Sparkles, AlertCircle } from 'lucide-react';

interface PreGenVideo {
  id: string;
  title: string;
  filename: string;
  duration: string;
  aspect: string;
  sizeMb: string;
}

interface BroadcastMatrixProps {
  accounts: ConnectedAccountData[];
  onDispatch: (selectedAccountIds: string[], metadata: { title: string; caption: string; isScheduled: boolean }) => void;
  onNavigateToChannels: () => void;
}

export const BroadcastMatrix: React.FC<BroadcastMatrixProps> = ({
  accounts,
  onDispatch,
  onNavigateToChannels,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(accounts.map((a) => a.id));
  const [title, setTitle] = useState('Studio Audio Mastering & Tactile Workflow');
  const [caption, setCaption] = useState('Direct multi-channel broadcast streamed on our behalf. #audiophile #studiotour #workflow');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16));
  const [selectedVideoId, setSelectedVideoId] = useState('vid_01');

  const preGeneratedVideos: PreGenVideo[] = [
    {
      id: 'vid_01',
      title: 'Studio Monitor & Audio Suite Workflow',
      filename: 'studio_editing_suite_4k.mp4',
      duration: '58s',
      aspect: '9:16 (Shorts/Reels/TikTok)',
      sizeMb: '42.6MB',
    },
    {
      id: 'vid_02',
      title: 'Ceramic Pour & Slow Morning Ritual',
      filename: 'minimalist_coffee_ritual_1080p.mp4',
      duration: '42s',
      aspect: '9:16 (Vertical Cut)',
      sizeMb: '31.2MB',
    },
    {
      id: 'vid_03',
      title: 'Architectural Workspace & Code Breakdown',
      filename: 'system_design_walkthrough_16x9.mp4',
      duration: '3m 04s',
      aspect: '16:9 (Landscape Master)',
      sizeMb: '248.5MB',
    },
  ];

  const toggleAccount = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === accounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(accounts.map((a) => a.id));
    }
  };

  const selectedVideo = preGeneratedVideos.find((v) => v.id === selectedVideoId) || preGeneratedVideos[0];

  const handleTriggerDispatch = () => {
    if (selectedIds.length === 0) return;
    onDispatch(selectedIds, { title, caption, isScheduled });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-[#253B74] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#536DA8] block mb-1">
            PARALLEL_DISPATCH_MATRIX
          </span>
          <h2 className="font-morge text-3xl sm:text-4xl text-[#253B74] tracking-tight">
            Independent Account Broadcast Channels
          </h2>
          <p className="font-space text-xs sm:text-sm text-[#536DA8] mt-1 max-w-2xl">
            Select which linked account handles will receive this pre-generated video stream. Streams chunk directly from Supabase Storage to YouTube, Meta, and TikTok APIs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSelectAll}
          className="font-mono text-xs font-bold uppercase px-3 py-1.5 border-[1.5px] border-[#253B74] bg-[#F5EFD5] hover:bg-[#92C5F1] text-[#253B74] shadow-[2px_2px_0px_#253B74] transition-colors"
        >
          {selectedIds.length === accounts.length ? 'DESELECT_ALL' : 'SELECT_ALL_CHANNELS'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Ingest & Copy (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selected Video Card */}
          <div className="bg-[#F5EFD5] border-[1.5px] border-[#253B74] shadow-[4px_4px_0px_#253B74] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-[1.5px] border-[#253B74]">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#253B74] flex items-center gap-1.5">
                <Film size={13} />
                PRE_GENERATED_VIDEO_SOURCE
              </span>
              <span className="font-mono text-[10px] bg-[#92C5F1] text-[#253B74] px-1.5 py-0.5 border border-[#253B74] font-bold">
                READY_TO_STREAM
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs text-[#253B74]">
              <div className="font-bold text-sm truncate">{selectedVideo.title}</div>
              <div className="text-[#536DA8]">{selectedVideo.filename}</div>
              <div className="flex items-center gap-3 pt-1 text-[11px]">
                <span className="bg-[#E8EAF7] px-2 py-0.5 border border-[#253B74]">{selectedVideo.aspect}</span>
                <span className="bg-[#E8EAF7] px-2 py-0.5 border border-[#253B74]">{selectedVideo.duration}</span>
                <span className="bg-[#E8EAF7] px-2 py-0.5 border border-[#253B74]">{selectedVideo.sizeMb}</span>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold uppercase text-[#536DA8] mb-1">
                SWITCH MASTER VIDEO FILE:
              </label>
              <select
                value={selectedVideoId}
                onChange={(e) => setSelectedVideoId(e.target.value)}
                className="w-full font-mono text-xs bg-[#E8EAF7] border-[1.5px] border-[#253B74] p-2 text-[#253B74] focus:outline-none focus:ring-2 focus:ring-[#92C5F1]"
              >
                {preGeneratedVideos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.duration} · {v.aspect})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Broadcast Copy Form */}
          <div className="bg-[#F5EFD5] border-[1.5px] border-[#253B74] shadow-[4px_4px_0px_#253B74] p-5 space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#253B74] mb-1">
                Broadcast Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full font-space text-sm bg-[#E8EAF7] border-[1.5px] border-[#253B74] p-2.5 text-[#253B74] focus:outline-none focus:ring-2 focus:ring-[#92C5F1]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase text-[#253B74] mb-1">
                Caption / Description & Tags
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full font-space text-xs bg-[#E8EAF7] border-[1.5px] border-[#253B74] p-2.5 text-[#253B74] focus:outline-none focus:ring-2 focus:ring-[#92C5F1] leading-relaxed"
              />
            </div>

            {/* Timing Switcher */}
            <div className="pt-2 border-t-[1.5px] border-[#253B74] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[#253B74]">
                <span>SCHEDULE_RELEASE</span>
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-4 h-4 accent-[#253B74] cursor-pointer"
                />
              </div>

              {isScheduled && (
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full font-mono text-xs bg-[#E8EAF7] border-[1.5px] border-[#253B74] p-2 text-[#253B74]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Independent Mechanical Checkbox Rows for Every Account (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#253B74]">
              DESTINATION_HANDLES ({selectedIds.length} OF {accounts.length} SELECTED)
            </span>
            <button
              onClick={onNavigateToChannels}
              className="font-mono text-xs text-[#536DA8] hover:text-[#253B74] underline uppercase"
            >
              + ADD NEW ACCOUNTS
            </button>
          </div>

          <div className="space-y-3">
            {accounts.length === 0 ? (
              <div className="bg-[#F5EFD5] border-[1.5px] border-[#253B74] p-8 text-center space-y-3 shadow-[4px_4px_0px_#253B74]">
                <AlertCircle size={28} className="mx-auto text-[#253B74]" />
                <h4 className="font-morge text-xl text-[#253B74]">No Channels Connected</h4>
                <p className="font-space text-xs text-[#536DA8]">
                  Link YouTube, Facebook, Instagram, or TikTok accounts in the Channels tab to begin broadcasting.
                </p>
                <StampButton variant="primary" onClick={onNavigateToChannels} size="sm">
                  GO TO CHANNELS TAB
                </StampButton>
              </div>
            ) : (
              accounts.map((acc) => {
                const isChecked = selectedIds.includes(acc.id);
                const monogram = acc.handle.replace('@', '').charAt(0).toUpperCase() || 'A';

                return (
                  <motion.div
                    key={acc.id}
                    layout
                    whileTap={{ scale: 0.98 }}
                    transition={signatureSpring}
                    onClick={() => toggleAccount(acc.id)}
                    className={`p-4 border-[1.5px] border-[#253B74] shadow-[4px_4px_0px_#253B74] cursor-pointer transition-colors flex items-center justify-between gap-4 select-none ${
                      isChecked ? 'bg-[#F5EFD5]' : 'bg-[#E8EAF7] opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Mechanical Checkbox */}
                      <div
                        className={`w-5 h-5 border-[1.5px] border-[#253B74] flex items-center justify-center transition-colors shrink-0 ${
                          isChecked ? 'bg-[#92C5F1]' : 'bg-[#E8EAF7]'
                        }`}
                      >
                        {isChecked && <Check size={14} className="text-[#253B74] stroke-[3]" />}
                      </div>

                      {/* Monogram */}
                      <div
                        className="w-8 h-8 border-[1.5px] border-[#253B74] flex items-center justify-center font-mono font-bold text-xs text-[#253B74] shrink-0"
                        style={{ backgroundColor: acc.monogramBg }}
                      >
                        {monogram}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#253B74] truncate">
                            {acc.handle}
                          </span>
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-[#253B74] text-[#E8EAF7] border border-[#253B74]">
                            {acc.platform.toUpperCase()}
                          </span>
                          {acc.isDefault && (
                            <span className="font-mono text-[9px] bg-[#92C5F1] text-[#253B74] border border-[#253B74] px-1 font-bold">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        {/* Exact platform payload specs */}
                        <div className="font-mono text-[10px] text-[#536DA8] pt-0.5 truncate">
                          {acc.platform === 'tiktok' && '[x] TIKTOK_VIDEO: privacy=public, cover=auto, duet=true'}
                          {acc.platform === 'youtube' && '[x] YOUTUBE_SHORTS: title, privacy=public, isShort=true'}
                          {acc.platform === 'facebook' && '[x] FACEBOOK_VIDEO: page_id, publish_video=true'}
                          {acc.platform === 'instagram' && '[x] INSTAGRAM_REELS: share_to_feed=true, cover_frame=00:03'}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-[10px] text-[#253B74] font-bold shrink-0">
                      {isChecked ? '[ENGAGED]' : '[BYPASSED]'}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Big CTA Rubber Stamp Button */}
          {accounts.length > 0 && (
            <div className="pt-4">
              <StampButton
                variant="primary"
                onClick={handleTriggerDispatch}
                disabled={selectedIds.length === 0}
                className="w-full py-4 text-base"
                size="lg"
              >
                <Send size={18} />
                <span>
                  {isScheduled
                    ? `SCHEDULE BROADCAST ON BEHALF (${selectedIds.length} CHANNELS)`
                    : `EXECUTE PARALLEL BROADCAST (${selectedIds.length} CHANNELS) ->`}
                </span>
              </StampButton>
              <p className="font-mono text-[10px] text-[#536DA8] text-center mt-2">
                * Zero proxy re-encoding. Video stream passes directly to official endpoints using Supabase Vault tokens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
