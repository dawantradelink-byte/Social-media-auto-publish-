import React, { useState } from 'react';
import type { UnifiedAnalyticsSummary, PlatformType } from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import {
  TrendingUp,
  Clock,
  Layers,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

interface AnalyticsViewProps {
  analytics: UnifiedAnalyticsSummary;
  selectedDays: number;
  onSelectDays: (days: number) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const timeline = analytics.timeline || [];
  const maxVal = Math.max(...timeline.map((t) => t.total), 1);
  const hasViews = analytics.totalViews > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="border-b border-[#e6dfd8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider block mb-1">
            Audience Intelligence & Performance
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-normal text-[#141413] tracking-tight">
            Unified Cross-Platform Analytics
          </h1>
          <p className="text-sm text-[#3d3d3a] mt-1 max-w-2xl">
            Real performance metrics and engagement data aggregated across YouTube, Facebook, and Instagram for posts uploaded on your behalf.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Total Video Views</span>
          <div className="font-mono text-2xl md:text-3xl font-medium text-[#141413] tabular-nums">
            {analytics.totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6c6a64] block">Verified platform delivery</span>
        </div>

        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Combined Likes</span>
          <div className="font-mono text-2xl md:text-3xl font-medium text-[#141413] tabular-nums">
            {analytics.totalLikes.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6c6a64] block">YouTube, FB & Instagram</span>
        </div>

        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Comments & Replies</span>
          <div className="font-mono text-2xl md:text-3xl font-medium text-[#141413] tabular-nums">
            {analytics.totalComments.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6c6a64] block">Direct community feedback</span>
        </div>

        <div className="p-5 bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-1">
          <span className="text-xs text-[#6c6a64] block">Published Releases</span>
          <div className="font-mono text-2xl md:text-3xl font-medium text-[#141413] tabular-nums">
            {analytics.publishedCount}
          </div>
          <span className="text-[11px] text-[#6c6a64]">Active broadcast assets</span>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-[#efe9de] rounded-xl border border-[#e6dfd8] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e6dfd8]">
          <div>
            <h3 className="font-editorial text-2xl font-normal text-[#141413]">
              Daily Cross-Platform Views Timeline
            </h3>
            <p className="text-xs text-[#6c6a64] mt-0.5">
              Comparative traffic trajectories broken down by destination platform
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cc785c]" />
              <span className="text-[#3d3d3a]">YouTube</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5db8a6]" />
              <span className="text-[#3d3d3a]">Facebook</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8a55a]" />
              <span className="text-[#3d3d3a]">Instagram</span>
            </span>
          </div>
        </div>

        {hasViews && timeline.length > 0 ? (
          <>
            <div className="h-64 w-full relative">
              <svg viewBox="0 0 800 240" className="w-full h-full" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="800" y2="30" stroke="#e6dfd8" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="800" y2="120" stroke="#e6dfd8" strokeDasharray="3 3" />
                <line x1="0" y1="210" x2="800" y2="210" stroke="#e6dfd8" />

                {timeline.map((point, idx) => {
                  const colWidth = 800 / timeline.length;
                  const x = idx * colWidth + colWidth * 0.2;
                  const barW = colWidth * 0.6;

                  const ytH = (point.youtube / maxVal) * 170;
                  const fbH = (point.facebook / maxVal) * 170;
                  const igH = (point.instagram / maxVal) * 170;

                  const igY = 210 - igH;
                  const fbY = igY - fbH;
                  const ytY = fbY - ytH;

                  return (
                    <g key={point.date}>
                      <rect x={x} y={igY} width={barW} height={igH} fill="#e8a55a" rx="2" />
                      <rect x={x} y={fbY} width={barW} height={fbH} fill="#5db8a6" rx="2" />
                      <rect x={x} y={ytY} width={barW} height={ytH} fill="#cc785c" rx="2" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#6c6a64] px-2">
              {timeline.map((point, i) => (
                <span key={i}>{point.date}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center text-xs text-[#6c6a64] bg-[#faf9f5] rounded-lg border border-[#e6dfd8] space-y-2">
            <BarChart3 size={24} className="mx-auto text-[#6c6a64]" />
            <p className="font-medium text-[#141413]">Initial Performance Baseline</p>
            <p>
              Uploaded posts will populate live engagement graphs as views, likes, and comments are fetched from each connected platform API.
            </p>
          </div>
        )}
      </div>

      {/* Two Column Grid: Platform Shares & Channel Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-[#efe9de] rounded-xl border border-[#e6dfd8] p-6 space-y-4">
          <h3 className="font-editorial text-2xl font-normal text-[#141413]">
            Platform Share of Views
          </h3>
          <p className="text-xs text-[#6c6a64]">
            Audience breakdown across YouTube, Facebook, and Instagram
          </p>

          <div className="space-y-3 mt-4">
            {analytics.platformShares.map((share) => (
              <div key={share.platform} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[#141413] capitalize">
                    <PlatformIcon platform={share.platform} size={15} />
                    {share.platform}
                  </span>
                  <span className="font-mono text-[#141413] tabular-nums">
                    {share.percentage}% ({share.views.toLocaleString()} views)
                  </span>
                </div>
                <div className="w-full bg-[#faf9f5] h-2 rounded-full overflow-hidden border border-[#e6dfd8]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${share.percentage}%`,
                      backgroundColor: share.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#efe9de] rounded-xl border border-[#e6dfd8] p-6 space-y-4">
          <h3 className="font-editorial text-2xl font-normal text-[#141413]">
            Cross-Channel Publishing Engine
          </h3>
          <p className="text-xs text-[#6c6a64]">
            Verified delivery channels connected via OAuth 2.0
          </p>

          <div className="space-y-3 mt-4 text-xs">
            <div className="p-3 bg-[#faf9f5] rounded-lg border border-[#e6dfd8] flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <PlatformIcon platform="youtube" size={16} /> YouTube Data API v3
              </span>
              <span className="text-[#6c6a64] font-mono">Shorts & Long-Form Video</span>
            </div>
            <div className="p-3 bg-[#faf9f5] rounded-lg border border-[#e6dfd8] flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <PlatformIcon platform="facebook" size={16} /> Facebook Pages API
              </span>
              <span className="text-[#6c6a64] font-mono">Page Video Feed</span>
            </div>
            <div className="p-3 bg-[#faf9f5] rounded-lg border border-[#e6dfd8] flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <PlatformIcon platform="instagram" size={16} /> Instagram Graph API
              </span>
              <span className="text-[#6c6a64] font-mono">Reels Publishing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
