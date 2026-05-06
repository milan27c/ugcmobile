'use client';

import { useState } from 'react';
import { Feed } from './components/Feed';
import { BrandsPage } from './components/BrandsPage';
import { BrandDetailPage } from './components/BrandDetailPage';
import { WalletPage } from './components/WalletPage';
import { RewardsPage } from './components/RewardsPage';
import { ProfilePage } from './components/ProfilePage';
import { PhoneMockup } from './components/PhoneMockup';
import { Footer } from './components/Footer';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'brands' | 'rewards' | 'wallet' | 'profile'>('home');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const handleNavigation = (page: 'home' | 'brands' | 'rewards' | 'wallet' | 'profile') => {
    setCurrentPage(page);
    setSelectedBrand(null);
  };

  const handleBrandClick = (brandName: string) => {
    setSelectedBrand(brandName);
  };

  const handleBackFromBrandDetail = () => {
    setSelectedBrand(null);
  };

  const renderContent = () => {
    if (selectedBrand) {
      return <BrandDetailPage brandName={selectedBrand} onBack={handleBackFromBrandDetail} />;
    }

    switch (currentPage) {
      case 'home':
        return <Feed />;
      case 'brands':
        return <BrandsPage onBrandClick={handleBrandClick} />;
      case 'rewards':
        return <RewardsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Feed />;
    }
  };

  return (
    <>
      {/* Desktop View with Phone Mockup */}
      <PhoneMockup>
        {renderContent()}
        {!selectedBrand && <Footer activePage={currentPage} isInMockup onNavigate={handleNavigation} />}
      </PhoneMockup>

      {/* Mobile View */}
      <div className="lg:hidden w-full h-screen bg-black overflow-hidden relative">
        {renderContent()}
        {!selectedBrand && <Footer activePage={currentPage} onNavigate={handleNavigation} />}
      </div>
    </>
  );
}
