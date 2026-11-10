import React from 'react';
import type { PlatformType } from '../types/crm.js';
import { Youtube, Instagram, Facebook } from 'lucide-react';

interface PlatformIconProps {
  platform: PlatformType;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 16,
  className = '',
  showLabel = false,
}) => {
  const getIcon = () => {
    switch (platform) {
      case 'youtube':
        return <Youtube size={size} className="text-[#cc785c]" />;
      case 'tiktok':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#141413]"
          >
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.882 2.882 2.896 2.896 0 0 1-2.882-2.882 2.896 2.896 0 0 1 2.882-2.882c.42 0 .817.09 1.176.252V9.525a6.34 6.34 0 0 0-1.176-.11 6.341 6.341 0 0 0-6.341 6.341 6.341 6.341 0 0 0 6.341 6.341 6.341 6.341 0 0 0 6.341-6.341V8.653a8.212 8.212 0 0 0 4.756 1.48v-3.447z" />
          </svg>
        );
      case 'instagram':
        return <Instagram size={size} className="text-[#e8a55a]" />;
      case 'facebook':
        return <Facebook size={size} className="text-[#5db8a6]" />;
    }
  };

  const getLabel = () => {
    switch (platform) {
      case 'youtube':
        return 'YouTube';
      case 'tiktok':
        return 'TikTok';
      case 'instagram':
        return 'Instagram';
      case 'facebook':
        return 'Facebook';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {getIcon()}
      {showLabel && <span className="text-xs font-medium text-[#252523]">{getLabel()}</span>}
    </span>
  );
};
