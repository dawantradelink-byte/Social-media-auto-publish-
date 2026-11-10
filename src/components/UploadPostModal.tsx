import React, { useState } from 'react';
import type {
  MediaAsset,
  PlatformType,
  PlatformCustomizations,
  ConnectedAccount,
} from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import {
  X,
  Calendar,
  Clock,
  Check,
  UploadCloud,
  Send,
  AlertTriangle,
  Film,
} from 'lucide-react';

interface UploadPostModalProps {
  mediaList: MediaAsset[];
  initialMedia?: MediaAsset | null;
  accounts: Record<PlatformType, ConnectedAccount>;
  onClose: () => void;
  onSubmitUpload: (postData: {
    title: string;
    caption: string;
    mediaAssetId: string;
    targetPlatforms: PlatformType[];
    scheduledFor: string | null;
    customizations: PlatformCustomizations;
  }) => Promise<void>;
  onNavigateToOAuth: () => void;
}

export const UploadPostModal: React.FC<UploadPostModalProps> = ({
  mediaList,
  initialMedia,
  accounts,
  onClose,
  onSubmitUpload,
  onNavigateToOAuth,
}) => {
  const [selectedMediaId, setSelectedMediaId] = useState<string>(
    initialMedia?.id || mediaList[0]?.id || ''
  );
  const [targetPlatforms, setTargetPlatforms] = useState<PlatformType[]>([
    'youtube',
    'facebook',
    'instagram',
  ]);
  const [activePlatformTab, setActivePlatformTab] = useState<PlatformType>('youtube');
  const [isUploading, setIsUploading] = useState(false);

  // Timing
  const [uploadMode, setUploadMode] = useState<'immediate' | 'schedule'>('immediate');
  const defaultScheduleTime = new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16);
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(defaultScheduleTime);

  // Master Content
  const [videoTitle, setVideoTitle] = useState('Studio Workflow & Audio Mastering Reference');
  const [masterCaption, setMasterCaption] = useState(
    'A breakdown of our tactile acoustic suite and reference monitor workflow. Uploaded on behalf of Chronicle Studios.'
  );

  // Platform Customizations
  const [customizations, setCustomizations] = useState<PlatformCustomizations>({
    youtube: {
      title: 'Studio Workflow & Audio Mastering Reference (Shorts)',
      description:
        'Tactile audio gear and editing suite breakdown. Managed and uploaded via Chronicle Content CRM.',
      privacy: 'public',
      tags: ['studio workflow', 'audiophile', 'editing suite', 'shorts'],
      isShort: true,
      category: 'Science & Technology',
    },
    facebook: {
      title: 'Studio Workflow & Audio Mastering Reference',
      description: 'Behind the scenes video release from Chronicle Studios.',
      pageName: 'Chronicle Studios Hub',
      targetAudience: 'public',
    },
    instagram: {
      caption:
        'Tactile acoustic suite and reference monitor workflow. Uploaded on behalf of @chronicle_visuals.',
      shareToFeed: true,
      audioTitle: 'Original Audio - Chronicle Studio',
      coverFramePercentage: 15,
    },
  });

  const selectedMedia = mediaList.find((m) => m.id === selectedMediaId) || mediaList[0];

  const togglePlatform = (plt: PlatformType) => {
    if (targetPlatforms.includes(plt)) {
      if (targetPlatforms.length > 1) {
        setTargetPlatforms(targetPlatforms.filter((p) => p !== plt));
      }
    } else {
      setTargetPlatforms([...targetPlatforms, plt]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMediaId) return;

    setIsUploading(true);
    await onSubmitUpload({
      title: videoTitle,
      caption: masterCaption,
      mediaAssetId: selectedMediaId,
      targetPlatforms,
      scheduledFor: uploadMode === 'schedule' ? new Date(scheduledDateTime).toISOString() : null,
      customizations,
    });
    setIsUploading(false);
    onClose();
  };

  const primaryPlatforms: PlatformType[] = ['youtube', 'facebook', 'instagram'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6dfd8] flex items-center justify-between bg-[#efe9de]/50 shrink-0">
          <div>
            <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider block">
              Multi-Platform Video Dispatch
            </span>
            <h3 className="font-editorial text-2xl font-normal text-[#141413]">
              Upload Post on Behalf of Creator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#6c6a64] hover:text-[#141413] hover:bg-[#e6dfd8] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Row 1: Pre-Generated Video Selection & Target Channels */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Video Preview Card */}
            <div className="md:col-span-5 space-y-3">
              <label className="text-xs font-medium text-[#141413] block">
                Pre-Generated Video File to Upload
              </label>
              {selectedMedia && (
                <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-lg p-3 space-y-2.5">
                  <div className="relative aspect-video rounded overflow-hidden bg-black">
                    <img
                      src={selectedMedia.thumbnailUrl}
                      alt={selectedMedia.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-mono rounded">
                      {selectedMedia.aspectRatio}
                    </div>
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-mono tabular-nums">
                      {selectedMedia.durationSeconds}s
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-[#141413] truncate">{selectedMedia.title}</h4>
                    <p className="text-[11px] text-[#6c6a64] font-mono mt-0.5">
                      {selectedMedia.filename} ({selectedMedia.resolution} · {selectedMedia.fileSizeMb}MB)
                    </p>
                  </div>
                </div>
              )}

              {/* Video Picker dropdown */}
              <div>
                <label className="text-[11px] text-[#6c6a64] block mb-1">Select from Video Vault:</label>
                <select
                  value={selectedMediaId}
                  onChange={(e) => setSelectedMediaId(e.target.value)}
                  className="w-full text-xs bg-[#faf9f5] border border-[#e6dfd8] rounded-md px-2.5 py-2 text-[#141413] focus:border-[#cc785c] focus:outline-none"
                >
                  {mediaList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.aspectRatio} · {m.durationSeconds}s)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: Destination Channels & Publishing Mode */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#141413] block mb-2">
                  Target Broadcast Destinations (Facebook, Instagram, YouTube)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {primaryPlatforms.map((plt) => {
                    const isSelected = targetPlatforms.includes(plt);
                    const acc = accounts[plt];
                    const isConnected = acc?.isConnected;

                    return (
                      <button
                        type="button"
                        key={plt}
                        onClick={() => togglePlatform(plt)}
                        className={`flex flex-col justify-between p-3 rounded-lg border text-xs font-medium transition-all text-left ${
                          isSelected
                            ? 'bg-[#efe9de] border-[#cc785c] text-[#141413]'
                            : 'bg-[#faf9f5] border-[#e6dfd8] text-[#6c6a64] hover:border-[#cc785c]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <PlatformIcon platform={plt} size={16} showLabel={true} />
                          {isSelected && <Check size={14} className="text-[#cc785c]" />}
                        </div>
                        <div className="mt-2 text-[10px] text-[#6c6a64]">
                          {isConnected ? (
                            <span className="text-[#5db872]">OAuth Active</span>
                          ) : (
                            <span className="text-[#e8a55a]">Settings Required</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Cadence Mode */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#141413] block">
                  Upload Schedule Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadMode('immediate')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                      uploadMode === 'immediate'
                        ? 'bg-[#181715] text-[#faf9f5] border-[#181715]'
                        : 'bg-[#faf9f5] border-[#e6dfd8] text-[#6c6a64]'
                    }`}
                  >
                    <UploadCloud size={14} />
                    <span>Upload Immediately</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadMode('schedule')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                      uploadMode === 'schedule'
                        ? 'bg-[#181715] text-[#faf9f5] border-[#181715]'
                        : 'bg-[#faf9f5] border-[#e6dfd8] text-[#6c6a64]'
                    }`}
                  >
                    <Calendar size={14} />
                    <span>Schedule Release</span>
                  </button>
                </div>

                {uploadMode === 'schedule' && (
                  <div className="pt-2">
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="w-full text-xs bg-[#faf9f5] border border-[#e6dfd8] rounded-md px-3 py-2 text-[#141413] font-mono focus:border-[#cc785c] focus:outline-none"
                    />
                    <span className="text-[11px] text-[#6c6a64] mt-1 block">
                      Chronicle will upload the video on your behalf at the scheduled timestamp.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Master Video Information */}
          <div className="space-y-3 pt-3 border-t border-[#e6dfd8]">
            <div>
              <label className="text-xs font-medium text-[#141413] block mb-1">
                Video Post Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
                className="w-full text-sm bg-[#faf9f5] border border-[#e6dfd8] rounded-md px-3.5 py-2 text-[#141413] focus:border-[#cc785c] focus:outline-none"
                placeholder="Enter title for video publication..."
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#141413] block mb-1">
                Post Caption / Description
              </label>
              <textarea
                value={masterCaption}
                onChange={(e) => setMasterCaption(e.target.value)}
                rows={3}
                className="w-full text-xs bg-[#faf9f5] border border-[#e6dfd8] rounded-md p-3 text-[#141413] focus:border-[#cc785c] focus:outline-none leading-relaxed"
                placeholder="Enter caption or post text to accompany the video..."
              />
            </div>
          </div>

          {/* Platform Customizations */}
          <div className="space-y-3 pt-3 border-t border-[#e6dfd8]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#141413]">
                Destination Metadata
              </label>
              <span className="text-[11px] text-[#6c6a64]">Fine-tune title and tags per platform API</span>
            </div>

            <div className="flex items-center gap-1 border-b border-[#e6dfd8] pb-1">
              {targetPlatforms.map((plt) => {
                const isActive = activePlatformTab === plt;
                return (
                  <button
                    type="button"
                    key={plt}
                    onClick={() => setActivePlatformTab(plt)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#efe9de] text-[#141413] border-b-2 border-[#cc785c]'
                        : 'text-[#6c6a64] hover:text-[#141413]'
                    }`}
                  >
                    <PlatformIcon platform={plt} size={14} />
                    <span className="capitalize">{plt}</span>
                  </button>
                );
              })}
            </div>

            {/* Customizer content */}
            <div className="bg-[#efe9de]/60 p-4 rounded-lg border border-[#e6dfd8] space-y-3 text-xs">
              {activePlatformTab === 'youtube' && customizations.youtube && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#6c6a64] mb-1">
                      <span>YouTube Video Title</span>
                      <span>{customizations.youtube.title.length}/100</span>
                    </div>
                    <input
                      type="text"
                      maxLength={100}
                      value={customizations.youtube.title}
                      onChange={(e) =>
                        setCustomizations({
                          ...customizations,
                          youtube: { ...customizations.youtube!, title: e.target.value },
                        })
                      }
                      className="w-full bg-[#faf9f5] border border-[#e6dfd8] rounded p-2 text-[#141413]"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-[#6c6a64] block mb-1">Tags (Comma Separated)</span>
                    <input
                      type="text"
                      value={customizations.youtube.tags.join(', ')}
                      onChange={(e) =>
                        setCustomizations({
                          ...customizations,
                          youtube: {
                            ...customizations.youtube!,
                            tags: e.target.value.split(',').map((t) => t.trim()),
                          },
                        })
                      }
                      className="w-full bg-[#faf9f5] border border-[#e6dfd8] rounded p-2 text-[#141413]"
                    />
                  </div>
                </div>
              )}

              {activePlatformTab === 'facebook' && customizations.facebook && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-[#6c6a64] block mb-1">Facebook Post Title</span>
                    <input
                      type="text"
                      value={customizations.facebook.title}
                      onChange={(e) =>
                        setCustomizations({
                          ...customizations,
                          facebook: { ...customizations.facebook!, title: e.target.value },
                        })
                      }
                      className="w-full bg-[#faf9f5] border border-[#e6dfd8] rounded p-2 text-[#141413]"
                    />
                  </div>
                </div>
              )}

              {activePlatformTab === 'instagram' && customizations.instagram && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-[#6c6a64] block mb-1">Instagram Reel Caption</span>
                    <textarea
                      rows={2}
                      value={customizations.instagram.caption}
                      onChange={(e) =>
                        setCustomizations({
                          ...customizations,
                          instagram: { ...customizations.instagram!, caption: e.target.value },
                        })
                      }
                      className="w-full bg-[#faf9f5] border border-[#e6dfd8] rounded p-2 text-[#141413]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#e6dfd8] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#141413] hover:bg-[#e6dfd8] rounded-md transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] active:bg-[#a9583e] rounded-md transition-colors shadow-xs disabled:opacity-50"
            >
              <UploadCloud size={14} />
              <span>
                {uploadMode === 'immediate'
                  ? `Upload Post on My Behalf (${targetPlatforms.length} Channels)`
                  : `Schedule Post Upload (${targetPlatforms.length} Channels)`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
