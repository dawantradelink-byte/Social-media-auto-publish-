import React, { useState, useRef } from 'react';
import type { MediaAsset } from '../types/crm.js';
import {
  UploadCloud,
  Film,
  Play,
  Layers,
  HardDrive,
  Plus,
} from 'lucide-react';

interface MediaLibraryViewProps {
  mediaList: MediaAsset[];
  onUploadMedia: (fileData: Partial<MediaAsset>) => Promise<void>;
  onSelectMediaForPost: (media: MediaAsset) => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  mediaList,
  onUploadMedia,
  onSelectMediaForPost,
}) => {
  const [filterRatio, setFilterRatio] = useState<'all' | '9:16' | '16:9'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [activePreviewMedia, setActivePreviewMedia] = useState<MediaAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mediaList.filter((m) => {
    if (filterRatio === 'all') return true;
    return m.aspectRatio === filterRatio;
  });

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessFile = async (file: File) => {
    setIsUploading(true);
    const isLikelyVertical = file.name.toLowerCase().includes('short') || file.name.toLowerCase().includes('reel');
    const ratio = isLikelyVertical ? '9:16' : '16:9';
    const resolution = ratio === '9:16' ? '1080x1920' : '1920x1080';
    const duration = 45;
    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(1)) || 32.5;

    await onUploadMedia({
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      filename: file.name,
      aspectRatio: ratio,
      resolution,
      durationSeconds: duration,
      fileSizeMb: sizeMb,
      thumbnailUrl: mediaList[0]?.thumbnailUrl || '',
    });

    setIsUploading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#e6dfd8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider block mb-1">
            Media Ingestion & Assets
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-normal text-[#141413] tracking-tight">
            Pre-Generated Video Vault
          </h1>
          <p className="text-sm text-[#3d3d3a] mt-1 max-w-2xl">
            Pre-generated video files managed by the CRM for immediate or scheduled publishing on your behalf across Facebook, Instagram, and YouTube.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#efe9de] rounded-lg border border-[#e6dfd8] shrink-0">
          <button
            onClick={() => setFilterRatio('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterRatio === 'all' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64] hover:text-[#141413]'
            }`}
          >
            All Formats ({mediaList.length})
          </button>
          <button
            onClick={() => setFilterRatio('9:16')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterRatio === '9:16' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64] hover:text-[#141413]'
            }`}
          >
            9:16 Shorts/Reels
          </button>
          <button
            onClick={() => setFilterRatio('16:9')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterRatio === '16:9' ? 'bg-[#faf9f5] text-[#141413] shadow-xs' : 'text-[#6c6a64] hover:text-[#141413]'
            }`}
          >
            16:9 Landscape
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#e6dfd8] hover:border-[#cc785c] bg-[#efe9de]/40 hover:bg-[#efe9de]/70 transition-all rounded-xl p-8 text-center cursor-pointer group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleProcessFile(e.target.files[0]);
            }
          }}
        />
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#faf9f5] border border-[#e6dfd8] flex items-center justify-center mx-auto text-[#cc785c] group-hover:scale-105 transition-transform">
            <UploadCloud size={24} />
          </div>
          <div>
            <h4 className="font-editorial text-xl font-normal text-[#141413]">
              {isUploading ? 'Analyzing Video Streams...' : 'Add Pre-Generated Video File to Vault'}
            </h4>
            <p className="text-xs text-[#6c6a64] mt-1">
              Supports MP4, MOV, WebM. Automatically calculates aspect ratio and stages for multi-platform dispatch.
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] transition-colors rounded-md inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} />
            <span>Select Video File</span>
          </button>
        </div>
      </div>

      {/* Media Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((media) => (
          <div
            key={media.id}
            className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#cc785c]/50 transition-all"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-video bg-[#181715] overflow-hidden">
              <img
                src={media.thumbnailUrl}
                alt={media.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3">
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono rounded">
                  {media.aspectRatio}
                </span>
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono tabular-nums">
                  {Math.floor(media.durationSeconds / 60)}:
                  {media.durationSeconds % 60 < 10 ? '0' : ''}
                  {media.durationSeconds % 60}
                </span>
              </div>
            </div>

            {/* Metadata Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#cc785c] bg-[#faf9f5] px-1.5 py-0.5 rounded border border-[#e6dfd8]">
                    Pre-Generated Cut
                  </span>
                  <span className="text-xs text-[#6c6a64] truncate">{media.filename}</span>
                </div>

                <h3 className="font-editorial text-lg font-medium text-[#141413] line-clamp-2 leading-snug">
                  {media.title}
                </h3>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono text-[#3d3d3a] bg-[#faf9f5] p-2.5 rounded-lg border border-[#e6dfd8]">
                  <div className="flex items-center gap-1.5">
                    <Layers size={13} className="text-[#6c6a64]" />
                    <span className="truncate">{media.resolution}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HardDrive size={13} className="text-[#6c6a64]" />
                    <span className="tabular-nums">{media.fileSizeMb} MB</span>
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="mt-5 pt-3 border-t border-[#e6dfd8] flex items-center justify-between">
                <button
                  onClick={() => setActivePreviewMedia(media)}
                  className="text-xs text-[#6c6a64] hover:text-[#141413] flex items-center gap-1 transition-colors"
                >
                  <Play size={12} />
                  <span>Inspect Stream</span>
                </button>

                <button
                  onClick={() => onSelectMediaForPost(media)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] transition-colors rounded-md shadow-xs"
                >
                  <UploadCloud size={13} />
                  <span>Upload Post</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stream Inspection Modal */}
      {activePreviewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd8]">
              <h3 className="font-editorial text-xl font-normal text-[#141413]">
                {activePreviewMedia.title}
              </h3>
              <button
                onClick={() => setActivePreviewMedia(null)}
                className="text-xs text-[#6c6a64] hover:text-[#141413]"
              >
                Close
              </button>
            </div>

            <div className="rounded-lg overflow-hidden bg-black max-h-80 flex items-center justify-center">
              <img
                src={activePreviewMedia.thumbnailUrl}
                alt={activePreviewMedia.title}
                className="max-h-80 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-[#181715] text-[#faf9f5] p-4 rounded-lg font-mono text-xs space-y-1.5 border border-[#252320]">
              <div className="text-[#cc785c] mb-1 font-sans font-medium">STREAM ANALYSIS</div>
              <div>Codec: {activePreviewMedia.format}</div>
              <div>Resolution: {activePreviewMedia.resolution} ({activePreviewMedia.aspectRatio})</div>
              <div>Duration: {activePreviewMedia.durationSeconds}s</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onSelectMediaForPost(activePreviewMedia);
                  setActivePreviewMedia(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors"
              >
                <UploadCloud size={14} />
                <span>Upload Post with this Video</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
