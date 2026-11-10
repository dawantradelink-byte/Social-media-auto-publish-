import React, { useState } from 'react';
import type { ConnectedAccount, PlatformType } from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import {
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Key,
  Radio,
  Lock,
  RefreshCw,
  Sliders,
  HelpCircle,
} from 'lucide-react';

interface OAuthManagerViewProps {
  accounts: Record<PlatformType, ConnectedAccount>;
  onSaveOAuthSettings: (platform: PlatformType, data: { clientId: string; clientSecret: string; apiKey?: string }) => Promise<void>;
  onManualTokenSave: (platform: PlatformType, data: { accessToken: string; handle?: string }) => Promise<void>;
  onRefreshAccountToken: (platform: PlatformType) => Promise<void>;
  onDisconnectAccount: (platform: PlatformType) => Promise<void>;
  onOAuthComplete: (platform: PlatformType) => void;
}

export const OAuthManagerView: React.FC<OAuthManagerViewProps> = ({
  accounts,
  onSaveOAuthSettings,
  onManualTokenSave,
  onRefreshAccountToken,
  onDisconnectAccount,
  onOAuthComplete,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('youtube');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form states per platform
  const [clientIds, setClientIds] = useState<Record<string, string>>({
    youtube: accounts.youtube?.config.clientId || '',
    facebook: accounts.facebook?.config.clientId || '',
    instagram: accounts.instagram?.config.clientId || '',
  });

  const [clientSecrets, setClientSecrets] = useState<Record<string, string>>({
    youtube: accounts.youtube?.config.clientSecret || '',
    facebook: accounts.facebook?.config.clientSecret || '',
    instagram: accounts.instagram?.config.clientSecret || '',
  });

  const [directTokens, setDirectTokens] = useState<Record<string, string>>({
    youtube: accounts.youtube?.tokenData.accessToken || '',
    facebook: accounts.facebook?.tokenData.accessToken || '',
    instagram: accounts.instagram?.tokenData.accessToken || '',
  });

  const [channelHandles, setChannelHandles] = useState<Record<string, string>>({
    youtube: accounts.youtube?.handle !== 'Pending OAuth Link' ? accounts.youtube?.handle : '',
    facebook: accounts.facebook?.handle !== 'Pending OAuth Link' ? accounts.facebook?.handle : '',
    instagram: accounts.instagram?.handle !== 'Pending OAuth Link' ? accounts.instagram?.handle : '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<'oauth' | 'manual'>('oauth');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSaveCredentials = async (platform: PlatformType) => {
    setIsSaving(true);
    await onSaveOAuthSettings(platform, {
      clientId: clientIds[platform] || '',
      clientSecret: clientSecrets[platform] || '',
    });
    setIsSaving(false);
  };

  const handleSaveDirectToken = async (platform: PlatformType) => {
    if (!directTokens[platform]) return;
    setIsSaving(true);
    await onManualTokenSave(platform, {
      accessToken: directTokens[platform],
      handle: channelHandles[platform] || undefined,
    });
    setIsSaving(false);
  };

  const handleTriggerOAuth = async (platform: PlatformType) => {
    try {
      const res = await fetch(`/api/auth/${platform}/url`);
      const data = await res.json();
      if (data.url) {
        const popup = window.open(data.url, 'oauth_popup', 'width=620,height=720');
        if (!popup) {
          // If popup blocked, notify user
          alert('Please allow popups for this site to complete OAuth 2.0 authorization.');
        }
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const targetPlatforms: PlatformType[] = ['youtube', 'facebook', 'instagram'];
  const currentAcc = accounts[selectedPlatform] || accounts.youtube;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="border-b border-[#e6dfd8] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider block mb-1">
            System Settings · API Integrations
          </span>
          <h1 className="font-editorial text-3xl md:text-4xl font-normal text-[#141413] tracking-tight">
            OAuth 2.0 Platform Integration & Token Engine
          </h1>
          <p className="text-sm text-[#3d3d3a] mt-1 max-w-2xl">
            Configure secure API credentials for YouTube, Facebook, and Instagram. Chronicle uses these authorized OAuth 2.0 connections to upload and publish pre-generated video files on your behalf.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 bg-[#efe9de] rounded-lg border border-[#e6dfd8] text-xs text-[#252523] shrink-0">
          <Radio size={14} className="text-[#5db872]" />
          <span>Automated Token Refresh Daemon Active</span>
        </div>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e6dfd8] pb-2">
        {targetPlatforms.map((plt) => {
          const acc = accounts[plt];
          const isSelected = selectedPlatform === plt;
          return (
            <button
              key={plt}
              onClick={() => setSelectedPlatform(plt)}
              className={`px-4 py-2.5 text-xs md:text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#181715] text-[#faf9f5] shadow-xs'
                  : 'bg-[#efe9de] text-[#141413] hover:bg-[#e6dfd8]'
              }`}
            >
              <PlatformIcon platform={plt} size={16} />
              <span className="capitalize">{plt}</span>
              {acc?.isConnected ? (
                <span className="w-2 h-2 rounded-full bg-[#5db872]" title="Connected" />
              ) : acc?.config.isConfigured ? (
                <span className="w-2 h-2 rounded-full bg-[#e8a55a]" title="Credentials saved, pending OAuth" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#e6dfd8]" title="Not configured" />
              )}
            </button>
          );
        })}
      </div>

      {currentAcc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Integration Setup Instructions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step-by-Step Instructions Card */}
            <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd8]">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={selectedPlatform} size={20} />
                  <h3 className="font-editorial text-xl font-normal text-[#141413]">
                    {currentAcc.config.platformDisplayName} Setup
                  </h3>
                </div>
                <a
                  href={currentAcc.config.setupInstructions.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-[#cc785c] hover:underline font-medium"
                >
                  <span>Open {currentAcc.config.setupInstructions.portalName}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Authorized Redirect URI Box */}
              <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6c6a64]">
                  <span className="font-medium text-[#141413]">
                    Mandatory Authorized OAuth 2.0 Redirect URI
                  </span>
                  <button
                    onClick={() => copyToClipboard(currentAcc.config.redirectUri, 'uri')}
                    className="flex items-center gap-1 text-xs text-[#cc785c] hover:underline font-medium"
                  >
                    {copiedText === 'uri' ? (
                      <>
                        <Check size={12} className="text-[#5db872]" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy URI
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-[#141413] bg-[#efe9de] p-2.5 rounded border border-[#e6dfd8] break-all select-all">
                  {currentAcc.config.redirectUri}
                </div>
                <p className="text-[11px] text-[#6c6a64] leading-relaxed">
                  Add this exact URL to your OAuth 2.0 Client credentials under <strong>Authorized redirect URIs</strong> in the developer console.
                </p>
              </div>

              {/* Instructions steps */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-[#141413] uppercase tracking-wider">
                  Integration Steps:
                </h4>
                <div className="text-xs text-[#3d3d3a] leading-relaxed whitespace-pre-line bg-[#faf9f5] p-4 rounded-lg border border-[#e6dfd8] font-sans">
                  {currentAcc.config.setupInstructions.documentationNotes}
                </div>
              </div>

              {/* Scopes required */}
              <div>
                <h4 className="text-xs font-medium text-[#141413] uppercase tracking-wider mb-2">
                  Required Scopes for Video Uploads:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentAcc.config.setupInstructions.requiredScopes.map((scope) => (
                    <span
                      key={scope}
                      className="text-[11px] font-mono bg-[#faf9f5] text-[#252523] px-2.5 py-1 rounded border border-[#e6dfd8]"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Credential Configuration Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#efe9de] border border-[#e6dfd8] rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e6dfd8]">
                <h3 className="font-editorial text-xl font-normal text-[#141413]">
                  API Credentials
                </h3>
                {/* Method switcher */}
                <div className="flex items-center gap-1 p-0.5 bg-[#faf9f5] rounded border border-[#e6dfd8] text-[11px]">
                  <button
                    onClick={() => setActiveTabMode('oauth')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeTabMode === 'oauth' ? 'bg-[#efe9de] text-[#141413] font-medium' : 'text-[#6c6a64]'
                    }`}
                  >
                    OAuth App
                  </button>
                  <button
                    onClick={() => setActiveTabMode('manual')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeTabMode === 'manual' ? 'bg-[#efe9de] text-[#141413] font-medium' : 'text-[#6c6a64]'
                    }`}
                  >
                    Direct Token
                  </button>
                </div>
              </div>

              {activeTabMode === 'oauth' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#141413] block mb-1">
                      OAuth 2.0 Client ID (or App ID)
                    </label>
                    <input
                      type="text"
                      value={clientIds[selectedPlatform] || ''}
                      onChange={(e) =>
                        setClientIds({ ...clientIds, [selectedPlatform]: e.target.value })
                      }
                      placeholder={selectedPlatform === 'youtube' ? 'e.g. 12345-abc.apps.googleusercontent.com' : 'e.g. 928374928374928'}
                      className="w-full text-xs font-mono bg-[#faf9f5] border border-[#e6dfd8] rounded-md px-3 py-2 text-[#141413] focus:border-[#cc785c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#141413] block mb-1">
                      OAuth 2.0 Client Secret (or App Secret)
                    </label>
                    <input
                      type="password"
                      value={clientSecrets[selectedPlatform] || ''}
                      onChange={(e) =>
                        setClientSecrets({ ...clientSecrets, [selectedPlatform]: e.target.value })
                      }
                      placeholder="Paste your client secret key..."
                      className="w-full text-xs font-mono bg-[#faf9f5] border border-[#e6dfd8] rounded-md px-3 py-2 text-[#141413] focus:border-[#cc785c] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleSaveCredentials(selectedPlatform)}
                      disabled={isSaving}
                      className="w-full py-2.5 text-xs font-medium text-[#141413] bg-[#faf9f5] hover:bg-[#e6dfd8] border border-[#e6dfd8] rounded-md transition-colors"
                    >
                      {isSaving ? 'Saving...' : '1. Save Client Credentials'}
                    </button>

                    <button
                      onClick={() => handleTriggerOAuth(selectedPlatform)}
                      disabled={!clientIds[selectedPlatform]}
                      className="w-full py-2.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Lock size={13} />
                      <span>2. Authenticate & Grant Upload Permissions</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#141413] block mb-1">
                      Active Access Token (Bearer Token)
                    </label>
                    <textarea
                      rows={3}
                      value={directTokens[selectedPlatform] || ''}
                      onChange={(e) =>
                        setDirectTokens({ ...directTokens, [selectedPlatform]: e.target.value })
                      }
                      placeholder="Paste active user or page access token..."
                      className="w-full text-xs font-mono bg-[#faf9f5] border border-[#e6dfd8] rounded-md p-2.5 text-[#141413] focus:border-[#cc785c] focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#141413] block mb-1">
                      Channel or Page Name / Handle
                    </label>
                    <input
                      type="text"
                      value={channelHandles[selectedPlatform] || ''}
                      onChange={(e) =>
                        setChannelHandles({ ...channelHandles, [selectedPlatform]: e.target.value })
                      }
                      placeholder="e.g. @ChronicleStudio"
                      className="w-full text-xs bg-[#faf9f5] border border-[#e6dfd8] rounded-md px-3 py-2 text-[#141413] focus:border-[#cc785c] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveDirectToken(selectedPlatform)}
                    disabled={isSaving || !directTokens[selectedPlatform]}
                    className="w-full py-2.5 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] rounded-md transition-colors shadow-xs disabled:opacity-50"
                  >
                    Save & Activate Token
                  </button>
                </div>
              )}

              {/* Status & Diagnostics Strip */}
              <div className="pt-4 border-t border-[#e6dfd8] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6c6a64]">Connection Status:</span>
                  {currentAcc.isConnected ? (
                    <span className="text-[#5db872] font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} /> Connected & Upload Ready
                    </span>
                  ) : currentAcc.config.isConfigured ? (
                    <span className="text-[#e8a55a] font-medium">Pending OAuth Login</span>
                  ) : (
                    <span className="text-[#6c6a64]">Not Configured</span>
                  )}
                </div>

                {currentAcc.isConnected && (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => onRefreshAccountToken(selectedPlatform)}
                      className="text-xs text-[#cc785c] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw size={11} /> Force Refresh Token
                    </button>
                    <button
                      onClick={() => onDisconnectAccount(selectedPlatform)}
                      className="text-xs text-[#c64545] hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
