import React from 'react';
import type {
  ConnectedAccount,
  ScheduledPost,
  UnifiedAnalyticsSummary,
  PlatformType,
} from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import {
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Layers,
  Settings,
} from 'lucide-react';

interface DashboardViewProps {
  accounts: Record<PlatformType, ConnectedAccount>;
  posts: ScheduledPost[];
  analytics: UnifiedAnalyticsSummary;
  onNavigate: (tab: 'queue' | 'media' | 'oauth' | 'analytics') => void;
  onOpenUpload: () => void;
  onPublishNow: (post: ScheduledPost) => void;
  onOpenPostDetails: (post: ScheduledPost) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accounts,
  posts,
  analytics,
  onNavigate,
  onOpenUpload,
  onPublishNow,
  onOpenPostDetails,
}) => {
  const scheduledPosts = posts.filter((p) => p.status === 'scheduled');
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const primaryPlatforms: PlatformType[] = ['youtube', 'facebook', 'instagram'];

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Editorial Hero Band */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#e6dfd8]">
        <div className="space-y-2 max-w-3xl">
          <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider block">
            Content CRM · Broadcast Console
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal text-[#141413] tracking-tight leading-[1.08]">
            Pre-Generated Video Publishing Across YouTube, Facebook & Instagram
          </h1>
          <p className="text-sm md:text-base text-[#3d3d3a] leading-relaxed pt-1">
            Chronicle manages pre-generated video files for immediate or scheduled publishing on your behalf across Facebook, Instagram, and YouTube. Connect each platform’s OAuth 2.0 API in System Settings to enable automated uploads.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('queue')}
            className="px-4 py-2.5 text-xs md:text-sm font-medium text-[#141413] bg-[#efe9de] hover:bg-[#e6dfd8] rounded-md border border-[#e6dfd8] transition-colors"
          >
            Review Queue ({scheduledPosts.length})
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs md:text-sm font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors shadow-xs"
          >
            <UploadCloud size={16} />
            <span>Upload Post</span>
          </button>
        </div>
      </div>

      {/* Channel Connections Alert & Settings Instruction Callout */}
      <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#faf9f5] rounded-lg border border-[#e6dfd8] text-[#cc785c] shrink-0 mt-0.5">
            <Settings size={18} />
          </div>
          <div>
            <h4 className="text-xs font-medium text-[#141413] uppercase tracking-wider">
              Channel Connections & OAuth 2.0 Setup Instruction
            </h4>
            <p className="text-xs text-[#3d3d3a] mt-0.5 max-w-3xl leading-relaxed">
              To publish videos on your behalf, integrate your OAuth 2.0 APIs (Client ID & Client Secret) for <strong>YouTube Data API v3</strong>, <strong>Facebook Pages API</strong>, and <strong>Instagram Graph API</strong> in <strong>OAuth 2.0 Settings</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('oauth')}
          className="px-4 py-2 text-xs font-medium text-white bg-[#181715] hover:bg-[#252320] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          Open OAuth Settings
        </button>
      </div>

      {/* Channel Connection Status Grid (Real Status, Zero Fake Numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {primaryPlatforms.map((plt) => {
          const acc = accounts[plt];
          const isConnected = acc?.isConnected;
          const isConfigured = acc?.config.isConfigured;

          return (
            <div
              key={plt}
              onClick={() => onNavigate('oauth')}
              className="p-4 bg-[#efe9de] rounded-xl border border-[#e6dfd8] hover:border-[#cc785c]/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#faf9f5] rounded-lg border border-[#e6dfd8]">
                  <PlatformIcon platform={plt} size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#141413] group-hover:text-[#cc785c] transition-colors capitalize">
                    {plt}
                  </h4>
                  <p className="text-[11px] text-[#6c6a64] font-mono">
                    {isConnected ? acc.handle : isConfigured ? 'Pending Auth' : 'Not Integrated'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    isConnected
                      ? 'bg-[#5db872]'
                      : isConfigured
                      ? 'bg-[#e8a55a]'
                      : 'bg-[#e6dfd8]'
                  }`}
                />
                <div className="text-[10px] text-[#6c6a64] font-mono mt-0.5">
                  {isConnected ? 'Active' : 'Configure'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Aggregate Pipeline Counts (Zero Fake Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Published Videos</span>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#141413] tabular-nums">
            {analytics.publishedCount}
          </div>
          <span className="text-[11px] text-[#6c6a64]">Uploaded on your behalf</span>
        </div>

        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Scheduled Queue</span>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#141413] tabular-nums">
            {analytics.scheduledQueueCount}
          </div>
          <span className="text-[11px] text-[#cc785c]">Awaiting automated release</span>
        </div>

        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Recorded Views</span>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#141413] tabular-nums">
            {analytics.totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6c6a64]">Verified API metrics</span>
        </div>

        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Total Engagements</span>
          <div className="font-mono text-2xl sm:text-3xl font-medium text-[#141413] tabular-nums">
            {(analytics.totalLikes + analytics.totalComments + analytics.totalShares).toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6c6a64]">Likes, comments, shares</span>
        </div>
      </div>

      {/* Main Content Sections: Scheduled Queue & Published Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scheduled Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-normal text-[#141413]">
              Scheduled Video Queue
            </h3>
            <button
              onClick={() => onNavigate('queue')}
              className="text-xs text-[#6c6a64] hover:text-[#141413] flex items-center gap-1"
            >
              <span>View Full Queue</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {scheduledPosts.length === 0 ? (
              <div className="p-8 text-center bg-[#efe9de] rounded-xl border border-[#e6dfd8] text-xs text-[#6c6a64] space-y-2">
                <p>No video files currently scheduled for future release.</p>
                <button
                  onClick={onOpenUpload}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors"
                >
                  Upload Post Now
                </button>
              </div>
            ) : (
              scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-[#cc785c]/40 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-16 h-12 rounded overflow-hidden bg-black shrink-0 border border-[#e6dfd8]">
                      <img
                        src={post.mediaAsset.thumbnailUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-[#cc785c] flex items-center gap-1">
                          <Clock size={10} />
                          {post.scheduledFor
                            ? new Date(post.scheduledFor).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Pending'}
                        </span>
                        <div className="flex items-center gap-1">
                          {post.targetPlatforms.map((p) => (
                            <PlatformIcon key={p} platform={p} size={11} />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-xs font-medium text-[#141413] truncate">{post.title}</h4>
                    </div>
                  </div>

                  <button
                    onClick={() => onPublishNow(post)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors shrink-0 shadow-xs"
                  >
                    <Send size={11} />
                    <span>Upload Now</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pre-Generated Media Ready to Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl font-normal text-[#141413]">
              Pre-Generated Video Vault
            </h3>
            <button
              onClick={() => onNavigate('media')}
              className="text-xs text-[#6c6a64] hover:text-[#141413] flex items-center gap-1"
            >
              <span>Browse Vault</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-5 space-y-3">
            <p className="text-xs text-[#6c6a64] leading-relaxed">
              Your repository contains pre-generated master cuts formatted in 9:16 vertical and 16:9 landscape aspect ratios ready for automated publishing across YouTube, Facebook, and Instagram.
            </p>
            <button
              onClick={onOpenUpload}
              className="w-full py-2.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <UploadCloud size={14} />
              <span>Upload Post from Vault</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
