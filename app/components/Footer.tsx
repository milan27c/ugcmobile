'use client';

import Image from 'next/image';

interface FooterProps {
  activePage: 'home' | 'brands' | 'rewards' | 'wallet' | 'profile';
  isInMockup?: boolean;
  onNavigate?: (page: 'home' | 'brands' | 'rewards' | 'wallet' | 'profile') => void;
}

export function Footer({ activePage, isInMockup = false, onNavigate }: FooterProps) {
  const navItems = [
    { id: 'brands', label: 'Brands', icon: 'Brands.svg' },
    { id: 'rewards', label: 'Rewards', icon: 'Rewards.svg' },
    { id: 'home', label: 'Home', icon: 'Home Selected.svg' },
    { id: 'wallet', label: 'Wallet', icon: 'Wallet.svg' },
    { id: 'profile', label: 'Profile', icon: 'Profile.svg' },
  ];

  const isHomePage = activePage === 'home';
  const isLightMode = !isHomePage;

  return (
    <div
      className={`${isInMockup ? 'absolute' : 'fixed'} z-40 flex justify-center`}
      style={{
        bottom: '0px',
        left: '5%',
        right: '5%',
        background: isInMockup ? 'none' : isLightMode ? 'none' : 'linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))',
        padding: '8px 0 12px 0',
      }}
    >
      <div
        className="flex items-center justify-between gap-8 rounded-full px-6 py-3 w-full"
        style={{
          backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: isLightMode ? '1px solid rgba(200, 200, 200, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {navItems.map((item) => {
          const isActive = item.id === activePage;
          const iconFileName = isActive ? `${item.label.replace(/\s+/g, ' ')} Selected.svg` : `${item.label}.svg`;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id as 'home' | 'brands' | 'rewards' | 'wallet' | 'profile')}
              className="relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              {(isActive && !isLightMode) || (item.id === 'home' && activePage === 'brands') ? (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #4A8FFF 0%, #934DFF 55%, #FF4DBA 100%)',
                    width: item.id === 'home' ? '48px' : '48px',
                    height: item.id === 'home' ? '48px' : '48px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: -1,
                  }}
                />
              ) : null}
              <div className={`relative flex items-center justify-center ${item.id === 'home' ? 'w-6 h-6' : 'w-8 h-8'}`}>
                <Image
                  src={`/images/footer/${iconFileName}`}
                  alt={item.label}
                  width={item.id === 'home' ? 24 : 32}
                  height={item.id === 'home' ? 24 : 32}
                  className={item.id === 'home' ? 'w-6 h-6' : 'w-8 h-8'}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
