import React from 'react';

interface AnthropicSpikeProps {
  className?: string;
  size?: number;
  color?: string;
}

export const AnthropicSpike: React.FC<AnthropicSpikeProps> = ({
  className = '',
  size = 18,
  color = '#141413',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 4-spoke tapered radial asterisk characteristic of the Anthropic/Claude brand */}
      <path
        d="M12 2C12.3 7 17 11.7 22 12C17 12.3 12.3 17 12 22C11.7 17 7 12.3 2 12C7 11.7 11.7 7 12 2Z"
        fill={color}
      />
    </svg>
  );
};
