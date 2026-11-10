import React, { useState } from 'react';
import type { ScheduledPost, PlatformType } from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import {
  Calendar as CalendarIcon,
  List,
  Clock,
  Send,
  CheckCircle2,
  Trash2,
  UploadCloud,
  Layers,
} from 'lucide-react';

interface SchedulingQueueViewProps {
  posts: ScheduledPost[];
  onPublishNow: (post: ScheduledPost) => void;
  onOpenDetails: (post: ScheduledPost) => void;
  onOpenUpload: () => void;
  onDeletePost: (postId: string) => Promise<void>;
  onReschedulePost: (postId: string, newDate: string) => Promise<void>;
}

export const SchedulingQueueView: React.FC<SchedulingQueueViewProps> = ({
  posts,
  onPublishNow,
  onOpenDetails,
  onOpenUpload,
  onDeletePost,
  onReschedulePost,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'published'>('all');
  const [reschedulingPostId, setReschedulingPostId] = useState<string | null>(null);
  const [newScheduleTime, setNewScheduleTime] = useState('');

  const filteredPosts = posts.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;

  const handleRescheduleSubmit = async (postId: string) => {
    if (!newScheduleTime) return;
    await onReschedulePost(postId, new Date(newScheduleTime).toISOString());
    setReschedulingPostId(null);
    setNewScheduleTime('');
  };

  const today = new Date();
  const currentMonthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      dayNumber: i + 1,
      dateString: d.toISOString().split('T')[0],
      isToday: i + 1 === today.getDate(),
      posts: posts.filter((p) => {
        const postDate = p.scheduledFor ? p.scheduledFor.split('T')[0] : p.publishedAt?.split('T')[0];
        return postDate === d.toISOString().split('T')[0];
      }),
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="border-b border-[#e6dfd8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider block mb-1">
            Publishing Queue & Pipeline
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-normal text-[#141413] tracking-tight">
            Video Release Scheduling Queue
          </h1>
          <p className="text-sm text-[#3d3d3a] mt-1 max-w-2xl">
            Synchronized queue managing pre-generated video uploads across YouTube, Facebook, and Instagram.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors shadow-xs"
          >
            <UploadCloud size={14} />
            <span>Upload Post</span>
          </button>

          {/* Status Filters */}
          <div className="flex items-center gap-1 p-1 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'scheduled' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              Scheduled ({scheduledCount})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'published' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              Published ({publishedCount})
            </button>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
            <button
              onClick={() => setViewMode('timeline')}
              title="Timeline Queue"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'timeline' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64]'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              title="Calendar View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64]'
              }`}
            >
              <CalendarIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-[#efe9de] rounded-xl border border-[#e6dfd8] space-y-3">
              <Clock size={28} className="text-[#6c6a64] mx-auto" />
              <h4 className="font-editorial text-xl text-[#141413]">Queue Is Currently Clear</h4>
              <p className="text-xs text-[#6c6a64]">
                Choose a pre-generated video file and schedule an upload on your behalf across your connected channels.
              </p>
              <button
                onClick={onOpenUpload}
                className="px-4 py-2 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <UploadCloud size={14} />
                <span>Upload Post</span>
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isScheduled = post.status === 'scheduled';
              const isPublished = post.status === 'published';

              return (
                <div
                  key={post.id}
                  className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-5 hover:border-[#cc785c]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                >
                  {/* Left: Thumbnail & Content Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-[#e6dfd8]">
                      <img
                        src={post.mediaAsset.thumbnailUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white text-[9px] font-mono rounded tabular-nums">
                        {post.mediaAsset.durationSeconds}s
                      </div>
                      <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/70 text-white text-[9px] font-mono rounded">
                        {post.mediaAsset.aspectRatio}
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isPublished ? (
                          <span className="text-[11px] font-medium text-[#5db872] bg-[#faf9f5] px-2 py-0.5 rounded border border-[#e6dfd8] flex items-center gap-1">
                            <CheckCircle2 size={11} /> Published on Behalf
                          </span>
                        ) : isScheduled ? (
                          <span className="text-[11px] font-medium text-[#cc785c] bg-[#faf9f5] px-2 py-0.5 rounded border border-[#e6dfd8] flex items-center gap-1">
                            <Clock size={11} /> Scheduled
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-[#6c6a64] bg-[#faf9f5] px-2 py-0.5 rounded border border-[#e6dfd8]">
                            Draft
                          </span>
                        )}

                        <span className="text-xs text-[#6c6a64] font-mono tabular-nums">
                          {isPublished && post.publishedAt
                            ? `Published ${new Date(post.publishedAt).toLocaleDateString()} at ${new Date(
                                post.publishedAt
                              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : post.scheduledFor
                            ? `Scheduled for ${new Date(post.scheduledFor).toLocaleDateString()} at ${new Date(
                                post.scheduledFor
                              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : 'Unscheduled'}
                        </span>
                      </div>

                      <h3 className="font-editorial text-lg font-medium text-[#141413] leading-snug truncate">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#3d3d3a] line-clamp-1 max-w-xl">
                        {post.caption}
                      </p>

                      {/* Target Platforms */}
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[11px] text-[#6c6a64]">Destinations:</span>
                        <div className="flex items-center gap-1.5">
                          {post.targetPlatforms.map((plt) => (
                            <span
                              key={plt}
                              className="p-1 bg-[#faf9f5] rounded border border-[#e6dfd8]"
                              title={`Target: ${plt}`}
                            >
                              <PlatformIcon platform={plt} size={13} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#e6dfd8]">
                    {isPublished ? (
                      <button
                        onClick={() => onOpenDetails(post)}
                        className="px-3 py-1.5 text-xs font-medium text-[#141413] bg-[#faf9f5] hover:bg-[#e6dfd8] border border-[#e6dfd8] rounded-md transition-colors"
                      >
                        Inspect Post Status
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onPublishNow(post)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors shadow-xs"
                        >
                          <Send size={12} />
                          <span>Upload Now on My Behalf</span>
                        </button>

                        <button
                          onClick={() => {
                            setReschedulingPostId(post.id);
                            setNewScheduleTime(post.scheduledFor?.slice(0, 16) || '');
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-[#141413] bg-[#faf9f5] hover:bg-[#e6dfd8] border border-[#e6dfd8] rounded-md transition-colors"
                        >
                          Reschedule
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onDeletePost(post.id)}
                      title="Remove from queue"
                      className="p-1.5 text-[#6c6a64] hover:text-[#c64545] hover:bg-[#faf9f5] rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd8]">
            <h3 className="font-editorial text-2xl font-normal text-[#141413]">
              {currentMonthName} Broadcast Schedule
            </h3>
            <span className="text-xs text-[#6c6a64]">
              {scheduledCount} videos scheduled for upload
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-[#6c6a64] py-1">
                {d}
              </div>
            ))}

            {daysInMonth.map((day) => {
              const hasPosts = day.posts.length > 0;
              return (
                <div
                  key={day.dayNumber}
                  className={`min-h-24 p-2 rounded-lg border flex flex-col justify-between transition-colors ${
                    day.isToday
                      ? 'bg-[#faf9f5] border-[#cc785c]'
                      : hasPosts
                      ? 'bg-[#faf9f5]/80 border-[#e6dfd8]'
                      : 'bg-[#faf9f5]/30 border-transparent hover:border-[#e6dfd8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono tabular-nums ${
                        day.isToday ? 'font-bold text-[#cc785c]' : 'text-[#6c6a64]'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {hasPosts && <span className="w-1.5 h-1.5 rounded-full bg-[#cc785c]" />}
                  </div>

                  <div className="space-y-1 mt-1">
                    {day.posts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => (p.status === 'published' ? onOpenDetails(p) : onPublishNow(p))}
                        className="w-full text-left p-1 bg-[#efe9de] hover:bg-[#e6dfd8] rounded text-[10px] text-[#141413] font-medium truncate block transition-colors"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h4 className="font-editorial text-lg text-[#141413]">
              Reschedule Video Upload
            </h4>
            <input
              type="datetime-local"
              value={newScheduleTime}
              onChange={(e) => setNewScheduleTime(e.target.value)}
              className="w-full text-xs bg-[#efe9de] border border-[#e6dfd8] rounded-md px-3 py-2 text-[#141413] font-mono focus:border-[#cc785c] focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingPostId(null)}
                className="px-3 py-1.5 text-xs text-[#6c6a64] hover:text-[#141413]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRescheduleSubmit(reschedulingPostId)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors"
              >
                Confirm Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
