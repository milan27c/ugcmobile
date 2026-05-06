'use client';

import { useState } from 'react';
import { Feed } from './components/Feed';
import { BrandsPage } from './components/BrandsPage';
import { PhoneMockup } from './components/PhoneMockup';
import { Footer } from './components/Footer';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'home' | 'brands' | 'rewards' | 'wallet' | 'profile'>('home');

  const handleNavigation = (page: 'home' | 'brands' | 'rewards' | 'wallet' | 'profile') => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Feed />;
      case 'brands':
        return <BrandsPage />;
      default:
        return <Feed />;
    }
  };

  return (
    <>
      {/* Desktop View with Phone Mockup */}
      <PhoneMockup>
        {renderContent()}
        <Footer activePage={currentPage} isInMockup onNavigate={handleNavigation} />
      </PhoneMockup>

      {/* Mobile View */}
      <div className="lg:hidden w-full h-screen bg-black overflow-hidden relative">
        {renderContent()}
        <Footer activePage={currentPage} onNavigate={handleNavigation} />
      </div>
    </>
  );
}
