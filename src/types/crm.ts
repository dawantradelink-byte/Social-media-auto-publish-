export type PlatformType = 'youtube' | 'facebook' | 'instagram' | 'tiktok';

export interface PlatformOAuthConfig {
  platform: PlatformType;
  platformDisplayName: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiKey?: string;
  isConfigured: boolean;
  setupInstructions: {
    portalName: string;
    portalUrl: string;
    requiredScopes: string[];
    documentationNotes: string;
  };
}

export interface OAuthTokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // seconds
  expiresAt: string | null; // ISO string
  scopes: string[];
  lastRefreshedAt: string | null;
  autoRefreshEnabled: boolean;
  healthStatus: 'not_configured' | 'pending_auth' | 'healthy' | 'refreshing' | 'expired';
}

export interface ConnectedAccount {
  id: string;
  platform: PlatformType;
  platformDisplayName: string;
  accountName: string;
  handle: string;
  avatarUrl: string;
  isConnected: boolean;
  config: PlatformOAuthConfig;
  tokenData: OAuthTokenData;
  lastSyncAt: string | null;
}

export interface MediaAsset {
  id: string;
  title: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  durationSeconds: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  resolution: string;
  fileSizeMb: number;
  format: string;
  createdAt: string;
  isPreGenerated: boolean;
}

export interface PlatformCustomizations {
  youtube?: {
    title: string;
    description: string;
    privacy: 'public' | 'unlisted' | 'private';
    tags: string[];
    isShort: boolean;
    category: string;
  };
  facebook?: {
    title: string;
    description: string;
    pageId?: string;
    pageName?: string;
    targetAudience: 'public' | 'followers';
  };
  instagram?: {
    caption: string;
    shareToFeed: boolean;
    audioTitle: string;
    coverFramePercentage: number;
  };
  tiktok?: {
    caption: string;
    allowDuet: boolean;
    allowStitch: boolean;
    allowComments: boolean;
    commercialDisclosure: boolean;
  };
}

export interface PlatformPublishResult {
  platform: PlatformType;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  platformPostId: string;
  platformUrl: string;
  publishedAt?: string;
  errorMessage?: string;
}

export interface PostRetentionPoint {
  second: number;
  percentage: number;
}

export interface PlatformSpecificMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  retentionRate?: number;
  avgWatchDurationSeconds?: number;
}

export interface PostMetrics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalWatchTimeHours: number;
  byPlatform: Partial<Record<PlatformType, PlatformSpecificMetrics>>;
  retentionCurve?: PostRetentionPoint[];
}

export type PostStatus = 'draft' | 'scheduled' | 'uploading' | 'published' | 'failed';

export interface ScheduledPost {
  id: string;
  title: string;
  caption: string;
  mediaAsset: MediaAsset;
  targetPlatforms: PlatformType[];
  status: PostStatus;
  scheduledFor: string | null; // ISO string
  publishedAt: string | null;
  createdAt: string;
  customizations: PlatformCustomizations;
  platformResults: Partial<Record<PlatformType, PlatformPublishResult>>;
  metrics?: PostMetrics;
}

export interface DailyEngagementTimelinePoint {
  date: string;
  youtube: number;
  facebook: number;
  instagram: number;
  total: number;
}

export interface PlatformShareMetric {
  platform: PlatformType;
  views: number;
  percentage: number;
  color: string;
}

export interface UnifiedAnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalWatchHours: number;
  scheduledQueueCount: number;
  publishedCount: number;
  timeline: DailyEngagementTimelinePoint[];
  platformShares: PlatformShareMetric[];
}
