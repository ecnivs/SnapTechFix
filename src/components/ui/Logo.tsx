import React from 'react';

interface LogoProps {
  variant?: 'full' | 'minimal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ 
  variant = 'full', 
  size = 'md', 
  className = '', 
  showTagline = true 
}: LogoProps) {
  const sizeConfig = {
    sm: {
      text: 'text-lg',
      icon: 'w-6 h-6',
      tagline: 'text-xs',
      container: 'gap-2',
      image: 'h-6'
    },
    md: {
      text: 'text-xl',
      icon: 'w-8 h-8',
      tagline: 'text-sm',
      container: 'gap-2',
      image: 'h-8'
    },
    lg: {
      text: 'text-2xl',
      icon: 'w-10 h-10',
      tagline: 'text-base',
      container: 'gap-3',
      image: 'h-10'
    },
    xl: {
      text: 'text-4xl',
      icon: 'w-16 h-16',
      tagline: 'text-lg',
      container: 'gap-4',
      image: 'h-16'
    }
  };

  const config = sizeConfig[size];

  // Logo Image Component
  const LogoIcon = ({ className }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <img
        src="/images/Screenshot 2025-09-09 002840.png"
        alt="SnapTechFix Logo"
        className={`${config.image} w-auto object-contain`}
        loading="lazy"
      />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`${config.icon} ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${config.container} ${className}`}>
      <div className={config.icon}>
        <LogoIcon />
      </div>
      
      {showTagline && variant === 'full' && (
        <div className={`${config.tagline} text-gray-600 font-medium ml-2`}>
          <span className="text-[#1E88E5]">Repairs Made </span>
          <span className="text-[#4CAF50]">Easier</span>
        </div>
      )}
    </div>
  );
}

// Export individual components for specific use cases
export const LogoIcon = Logo;
export const LogoImage = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) => {
  const sizeConfig = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-10',
    xl: 'h-16'
  };
  
  return (
    <img
      src="/images/Screenshot 2025-09-09 002840.png"
      alt="SnapTechFix Logo"
      className={`${sizeConfig[size]} w-auto object-contain ${className}`}
      loading="lazy"
    />
  );
};