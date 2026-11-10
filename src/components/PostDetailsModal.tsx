import React from 'react';
import type { ScheduledPost, PlatformType } from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import {
  X,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface PostDetailsModalProps {
  post: ScheduledPost;
  onClose: () => void;
}

export const PostDetailsModal: React.FC<PostDetailsModalProps> = ({ post, onClose }) => {
  const metrics = post.metrics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6dfd8] flex items-center justify-between bg-[#efe9de]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded overflow-hidden bg-black shrink-0">
              <img
                src={post.mediaAsset.thumbnailUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider block">
                Published Video Details
              </span>
              <h3 className="font-editorial text-2xl font-normal text-[#141413] truncate max-w-lg">
                {post.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#6c6a64] hover:text-[#141413] hover:bg-[#e6dfd8] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Real Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
              <span className="text-[11px] text-[#6c6a64] flex items-center gap-1 mb-1">
                <Eye size={12} className="text-[#cc785c]" /> Views
              </span>
              <div className="font-mono text-lg font-medium text-[#141413] tabular-nums">
                {metrics ? metrics.totalViews.toLocaleString() : '0'}
              </div>
            </div>

            <div className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
              <span className="text-[11px] text-[#6c6a64] flex items-center gap-1 mb-1">
                <Heart size={12} className="text-[#cc785c]" /> Likes
              </span>
              <div className="font-mono text-lg font-medium text-[#141413] tabular-nums">
                {metrics ? metrics.totalLikes.toLocaleString() : '0'}
              </div>
            </div>

            <div className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
              <span className="text-[11px] text-[#6c6a64] flex items-center gap-1 mb-1">
                <MessageCircle size={12} className="text-[#cc785c]" /> Comments
              </span>
              <div className="font-mono text-lg font-medium text-[#141413] tabular-nums">
                {metrics ? metrics.totalComments.toLocaleString() : '0'}
              </div>
            </div>

            <div className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
              <span className="text-[11px] text-[#6c6a64] flex items-center gap-1 mb-1">
                <Share2 size={12} className="text-[#cc785c]" /> Shares
              </span>
              <div className="font-mono text-lg font-medium text-[#141413] tabular-nums">
                {metrics ? metrics.totalShares.toLocaleString() : '0'}
              </div>
            </div>
          </div>

          {/* Platform Broadcast Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-[#141413] uppercase tracking-wider">
              Connected Platform Upload Results:
            </h4>
            <div className="space-y-2">
              {post.targetPlatforms.map((plt) => {
                const res = post.platformResults[plt];
                return (
                  <div
                    key={plt}
                    className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={plt} size={16} />
                      <span className="font-medium capitalize text-[#141413]">{plt}</span>
                      <span className="text-[11px] text-[#5db872] flex items-center gap-1">
                        <CheckCircle2 size={12} /> Uploaded on Your Behalf
                      </span>
                    </div>

                    {res?.platformUrl ? (
                      <a
                        href={res.platformUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#cc785c] hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>View Live Post</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#6c6a64]">Pending webhook</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Metadata Inspector */}
          <div className="bg-[#181715] text-[#faf9f5] rounded-xl p-5 border border-[#252320] space-y-2 font-mono text-xs">
            <div className="text-[#cc785c] font-sans font-medium uppercase text-xs mb-1">
              DISPATCH FILE SPECIFICATIONS
            </div>
            <div>Filename: {post.mediaAsset.filename}</div>
            <div>Resolution: {post.mediaAsset.resolution} ({post.mediaAsset.aspectRatio})</div>
            <div>Duration: {post.mediaAsset.durationSeconds}s · File Size: {post.mediaAsset.fileSizeMb}MB</div>
            <div>Published At: {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : 'Pending'}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#efe9de]/50 border-t border-[#e6dfd8] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#141413] bg-[#faf9f5] hover:bg-[#e6dfd8] border border-[#e6dfd8] rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
