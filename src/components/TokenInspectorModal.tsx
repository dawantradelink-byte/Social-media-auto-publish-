import React, { useState } from 'react';
import type { ConnectedAccount } from '../types/crm.js';
import { PlatformIcon } from './PlatformIcon.js';
import { X, Check, Copy, RefreshCw, Key, ShieldCheck, Clock } from 'lucide-react';

interface TokenInspectorModalProps {
  account: ConnectedAccount | null;
  onClose: () => void;
  onForceRefresh: (platform: string) => Promise<void>;
}

export const TokenInspectorModal: React.FC<TokenInspectorModalProps> = ({
  account,
  onClose,
  onForceRefresh,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!account) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onForceRefresh(account.platform);
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#faf9f5] border border-[#e6dfd8] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6dfd8] flex items-center justify-between bg-[#efe9de]/50">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={account.platform} size={22} />
            <div>
              <h3 className="font-editorial text-xl font-normal text-[#141413]">
                OAuth 2.0 Security & Token Inspector
              </h3>
              <p className="text-xs text-[#6c6a64]">
                {account.platformDisplayName} · {account.handle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#6c6a64] hover:text-[#141413] hover:bg-[#e6dfd8]/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Health & Status Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
              <span className="text-xs text-[#6c6a64] block mb-1">Token Status</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5db872]" />
                <span className="text-sm font-medium text-[#141413] capitalize">
                  {account.tokenData.healthStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
              <span className="text-xs text-[#6c6a64] block mb-1">Auto-Refresh Daemon</span>
              <span className="text-sm font-medium text-[#141413]">
                {account.tokenData.autoRefreshEnabled ? 'Active (Pre-Expiry)' : 'Disabled'}
              </span>
            </div>

            <div className="p-3 bg-[#efe9de] rounded-lg border border-[#e6dfd8]">
              <span className="text-xs text-[#6c6a64] block mb-1">Expires At</span>
              <span className="text-xs font-mono text-[#141413]">
                {account.tokenData.expiresAt ? new Date(account.tokenData.expiresAt).toLocaleTimeString() : 'Not set'}
              </span>
            </div>
          </div>

          {/* Access Token Box (Dark product surface as per Claude design analysis) */}
          <div className="bg-[#181715] rounded-lg p-4 border border-[#252320]">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-mono text-[#a09d96]">
                <Key size={13} className="text-[#cc785c]" />
                Bearer Access Token
              </span>
              <button
                onClick={() => copyToClipboard(account.tokenData.accessToken, 'access')}
                className="flex items-center gap-1 text-xs text-[#faf9f5] hover:text-[#cc785c] transition-colors"
              >
                {copiedField === 'access' ? (
                  <>
                    <Check size={12} className="text-[#5db872]" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy Token
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs text-[#faf9f5] bg-[#1f1e1b] p-3 rounded border border-[#252320] break-all select-all">
              {account.tokenData.accessToken}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-[#a09d96]">
              <span>Type: {account.tokenData.tokenType}</span>
              <span>Last Refreshed: {account.tokenData.lastRefreshedAt ? new Date(account.tokenData.lastRefreshedAt).toLocaleTimeString() : 'Never'}</span>
            </div>
          </div>

          {/* Refresh Token Box */}
          <div className="bg-[#181715] rounded-lg p-4 border border-[#252320]">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-mono text-[#a09d96]">
                <RefreshCw size={13} className="text-[#5db8a6]" />
                OAuth Refresh Token (Encrypted Storage)
              </span>
              <button
                onClick={() => copyToClipboard(account.tokenData.refreshToken, 'refresh')}
                className="flex items-center gap-1 text-xs text-[#faf9f5] hover:text-[#cc785c] transition-colors"
              >
                {copiedField === 'refresh' ? (
                  <>
                    <Check size={12} className="text-[#5db872]" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs text-[#faf9f5] bg-[#1f1e1b] p-3 rounded border border-[#252320] break-all">
              {account.tokenData.refreshToken}
            </div>
          </div>

          {/* Scopes Checklist */}
          <div>
            <h4 className="text-xs font-medium text-[#6c6a64] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#cc785c]" />
              Authorized Scopes
            </h4>
            <div className="bg-[#efe9de] p-3 rounded-lg border border-[#e6dfd8] space-y-1.5">
              {account.tokenData.scopes.map((scope) => (
                <div key={scope} className="flex items-center gap-2 text-xs text-[#252523]">
                  <Check size={13} className="text-[#5db872] shrink-0" />
                  <span className="font-mono">{scope}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Token Lifecycle Explanation */}
          <div className="p-3 bg-[#f5f0e8] rounded-lg border border-[#e6dfd8] text-xs text-[#6c6a64] leading-relaxed">
            <span className="font-medium text-[#141413] block mb-0.5">Automated Token Lifecycle:</span>
            Chronicle monitors the token time-to-live (TTL) every 10 seconds. When an access token reaches 15 minutes before expiration, our background token exchange initiates a refresh cycle using the OAuth 2.0 refresh grant, ensuring zero dropped publishing requests.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#efe9de]/50 border-t border-[#e6dfd8] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#141413] hover:bg-[#e6dfd8] transition-colors rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#cc785c] hover:bg-[#a9583e] active:bg-[#a9583e] transition-colors rounded-md disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Force Immediate Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
