import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface WalletAddressProps {
  address: string;
  truncate?: boolean;
  copyable?: boolean;
  showLink?: boolean;
  className?: string;
}

export const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  truncate = true,
  copyable = true,
  showLink = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const displayAddress = truncate && address.length > 12
    ? `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
    : address;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/70 px-2 py-0.5 rounded-md border border-slate-200 transition-colors ${className}`}
      title={address}
    >
      <span>{displayAddress}</span>
      {copyable && (
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-slate-700 focus:outline-none"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      )}
      {showLink && (
        <a
          href={`https://lora.algokit.io/localnet/account/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-700"
          title="View on Algorand Explorer"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </span>
  );
};
