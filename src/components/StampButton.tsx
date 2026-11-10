'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const signatureSpring = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 16,
  mass: 0.6,
};

interface StampButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'accent' | 'vanilla';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StampButton: React.FC<StampButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  className = '',
  size = 'md',
}) => {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 380);
    if (onClick) onClick();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#253B74] text-[#E8EAF7] hover:bg-[#1f3162]';
      case 'accent':
        return 'bg-[#92C5F1] text-[#253B74] hover:bg-[#83b7e4]';
      case 'vanilla':
        return 'bg-[#F5EFD5] text-[#253B74] hover:bg-[#ebe4c5]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-5 py-2.5 text-xs sm:text-sm';
      case 'lg':
        return 'px-6 py-3.5 text-sm sm:text-base';
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      transition={signatureSpring}
      whileHover={{ y: -1 }}
      whileTap={{
        scale: 0.95,
        y: 2,
        boxShadow: '1px 1px 0px #253B74',
        transition: signatureSpring,
      }}
      className={`relative font-mono font-bold tracking-widest uppercase border-[1.5px] border-[#253B74] select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_#253B74] inline-flex items-center justify-center gap-2 ${getVariantStyles()} ${getSizeStyles()} ${
        isPulsing ? 'ring-4 ring-[#92C5F1] ring-offset-2 ring-offset-[#E8EAF7]' : ''
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};
