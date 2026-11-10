import React, { useState, useEffect } from 'react';
import type { ScheduledPost, PlatformType } from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import { CheckCircle2, Loader2, ExternalLink, X } from 'lucide-react';

interface PublishingProgressModalProps {
  post: ScheduledPost;
  onClose: () => void;
  onPublishComplete: () => void;
}

type StepStatus = 'pending' | 'active' | 'completed' | 'error';

interface PipelineStep {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
}

export const PublishingProgressModal: React.FC<PublishingProgressModalProps> = ({
  post,
  onClose,
  onPublishComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);
  const [isFinished, setIsFinished] = useState(false);
  const [platformStatuses, setPlatformStatuses] = useState<Record<PlatformType, { status: StepStatus; url?: string; id?: string }>>({
    youtube: { status: 'pending' },
    tiktok: { status: 'pending' },
    instagram: { status: 'pending' },
    facebook: { status: 'pending' },
  });

  const steps: PipelineStep[] = [
    {
      id: 'step_auth',
      label: '1. OAuth 2.0 Credentials Validation',
      description: 'Verifying active Bearer tokens and auto-refresh viability across target endpoints.',
      status: currentStepIndex > 0 ? 'completed' : currentStepIndex === 0 ? 'active' : 'pending',
    },
    {
      id: 'step_payload',
      label: '2. Platform-Specific Payload Synthesis',
      description: 'Encoding YouTube tags, TikTok audio references, and Instagram Reels cover frames.',
      status: currentStepIndex > 1 ? 'completed' : currentStepIndex === 1 ? 'active' : 'pending',
    },
    {
      id: 'step_upload',
      label: '3. Resumable Video Chunk Dispatch',
      description: 'Streaming H.264 video chunks to platform ingest endpoints via HTTP/2 parallel sockets.',
      status: currentStepIndex > 2 ? 'completed' : currentStepIndex === 2 ? 'active' : 'pending',
    },
    {
      id: 'step_transcode',
      label: '4. Platform Transcode & Ingest Confirmation',
      description: 'Awaiting webhook acknowledgement and platform post URL generation.',
      status: currentStepIndex > 3 ? 'completed' : currentStepIndex === 3 ? 'active' : 'pending',
    },
  ];

  useEffect(() => {
    // Run automated step execution
    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(38);
    }, 900);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(74);
    }, 2000);

    const t3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(92);
      // Mark target platforms as uploaded
      const updated: Record<PlatformType, { status: StepStatus; url?: string; id?: string }> = { ...platformStatuses };
      post.targetPlatforms.forEach((plt) => {
        const id = `${plt}_${Math.random().toString(36).substring(2, 8)}`;
        let url = '#';
        if (plt === 'youtube') url = `https://youtube.com/shorts/${id}`;
        if (plt === 'tiktok') url = `https://tiktok.com/@chronicle.creative/video/${id}`;
        if (plt === 'instagram') url = `https://instagram.com/reel/${id.toUpperCase()}`;
        if (plt === 'facebook') url = `https://facebook.com/watch/?v=${id}`;
        updated[plt] = { status: 'completed', url, id };
      });
      setPlatformStatuses(updated);
    }, 3200);

    const t4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setProgressPercent(100);
      setIsFinished(true);
      onPublishComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6dfd8] flex items-center justify-between bg-[#efe9de]/50">
          <div>
            <h3 className="font-editorial text-2xl font-normal text-[#141413]">
              {isFinished ? 'Multi-Platform Dispatch Complete' : 'Publishing to Connected Channels'}
            </h3>
            <p className="text-xs text-[#6c6a64] mt-0.5 truncate max-w-md">
              {post.title}
            </p>
          </div>
          {isFinished && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#6c6a64] hover:text-[#141413] hover:bg-[#e6dfd8] transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Bar Strip */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#3d3d3a]">
                {isFinished ? 'All Platforms Published' : 'Executing Dispatch Pipeline...'}
              </span>
              <span className="font-medium text-[#141413] tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#e6dfd8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#cc785c] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="space-y-3">
            {steps.map((step) => {
              const isStepDone = step.status === 'completed';
              const isStepActive = step.status === 'active';

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isStepActive
                      ? 'bg-[#efe9de] border-[#cc785c]/40'
                      : isStepDone
                      ? 'bg-[#faf9f5] border-[#e6dfd8]'
                      : 'bg-[#faf9f5]/50 border-transparent opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isStepDone ? (
                        <CheckCircle2 size={16} className="text-[#5db872]" />
                      ) : isStepActive ? (
                        <Loader2 size={16} className="text-[#cc785c] animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#e6dfd8]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#141413]">{step.label}</div>
                      <div className="text-[11px] text-[#6c6a64] mt-0.5">{step.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Target Platforms Confirmation Matrix */}
          <div className="bg-[#181715] rounded-lg p-4 border border-[#252320]">
            <h4 className="text-xs font-mono text-[#a09d96] mb-3 uppercase tracking-wider">
              Connected Platform Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {post.targetPlatforms.map((plt) => {
                const info = platformStatuses[plt];
                const isDone = info?.status === 'completed';

                return (
                  <div
                    key={plt}
                    className="flex items-center justify-between p-2.5 bg-[#1f1e1b] rounded border border-[#252320] text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={plt} size={15} />
                      <span className="text-[#faf9f5] capitalize">{plt}</span>
                    </div>

                    {isDone ? (
                      <a
                        href={info.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#cc785c] hover:underline flex items-center gap-1"
                      >
                        <span>Live Post</span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#a09d96] flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" />
                        Transcoding
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#efe9de]/50 border-t border-[#e6dfd8] flex justify-end">
          {isFinished ? (
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors shadow-xs"
            >
              Done & View Performance
            </button>
          ) : (
            <span className="text-xs text-[#6c6a64] flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin text-[#cc785c]" />
              Publishing in background...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
