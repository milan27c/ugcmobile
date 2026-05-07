'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, MoreVertical, Play } from 'lucide-react';

interface BrandPost {
  id: string;
  image: string;
  points: number;
  type: 'image' | 'video';
}

interface BrandDetailPageProps {
  brandName: string;
  onBack: () => void;
}

const BRAND_DATA: Record<string, any> = {
  'Barista Sri Lanka': {
    location: 'Colombo 07',
    rewardType: 'Per Post',
    logo: '/images/brands/Barista Sri Lanka/logo.png',
    cover: '/images/brands/Barista Sri Lanka/cover.png',
    overview: 'Capture your first sip moment with our brand-new coffee and earn reward points! Post creative content showcasing your experience and inspire fellow coffee lovers.',
    totalEarned: 11420,
    latest: [
      { id: '1', image: '/images/brands/Barista Sri Lanka/contents/latest/1.png', points: 750, type: 'image' as const },
      { id: '2', image: '/images/brands/Barista Sri Lanka/contents/latest/2.png', points: 750, type: 'image' as const },
      { id: '3', image: '/images/brands/Barista Sri Lanka/contents/latest/3.png', points: 750, type: 'image' as const },
      { id: '4', image: '/images/brands/Barista Sri Lanka/contents/latest/4.png', points: 750, type: 'image' as const },
      { id: '5', image: '/images/brands/Barista Sri Lanka/contents/latest/5.mp4', points: 750, type: 'video' as const },
      { id: '6', image: '/images/brands/Barista Sri Lanka/contents/latest/6.png', points: 750, type: 'image' as const },
      { id: '7', image: '/images/brands/Barista Sri Lanka/contents/latest/7.png', points: 750, type: 'image' as const },
    ],
    topEarned: [
      { id: '8', image: '/images/brands/Barista Sri Lanka/contents/top earned/1.png', points: 750, type: 'image' as const },
      { id: '9', image: '/images/brands/Barista Sri Lanka/contents/top earned/2.png', points: 750, type: 'image' as const },
      { id: '10', image: '/images/brands/Barista Sri Lanka/contents/top earned/3.png', points: 750, type: 'image' as const },
      { id: '11', image: '/images/brands/Barista Sri Lanka/contents/top earned/4.png', points: 750, type: 'image' as const },
    ],
    myPosts: [],
  },
};

export function BrandDetailPage({ brandName, onBack }: BrandDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'latest' | 'topEarned' | 'myPosts'>('latest');
  const brandData = BRAND_DATA[brandName] || BRAND_DATA['Barista Sri Lanka'];

  const getPosts = () => {
    switch (activeTab) {
      case 'latest': return brandData.latest;
      case 'topEarned': return brandData.topEarned;
      case 'myPosts': return brandData.myPosts;
      default: return [];
    }
  };

  const posts = getPosts();

  return (
    <div className="w-full h-screen overflow-y-auto pb-8 bg-gray-50">
      {/* Cover Image with Overlays */}
      <div className="relative w-full h-96 bg-gray-200">
        <Image
          src={brandData.cover}
          alt={brandName}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* App Bar — overlaid on cover */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 flex-1">
            <button onClick={onBack} className="text-white flex-shrink-0">
              <ChevronLeft size={24} />
            </button>
            <h1 style={{ fontSize: 16 }} className="font-bold text-white leading-tight">{brandName}</h1>
          </div>
          <button
            className="flex-shrink-0 p-2 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
          >
            <MoreVertical size={18} className="text-white" />
          </button>
        </div>

        {/* Brand Info — bottom of cover */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 py-4 flex items-end justify-between">
          <div className="flex items-end gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/40">
              <Image
                src={brandData.logo}
                alt={brandName}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{brandName}</p>
              <p className="text-gray-300 text-xs">{brandData.location}</p>
            </div>
          </div>
          {/* Per Post / Per Views chip */}
          <div
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <p className="text-white text-xs font-semibold">{brandData.rewardType}</p>
          </div>
        </div>
      </div>

      {/* Brand Overview */}
      <div className="px-4 py-5">
        <h2 className="font-bold text-gray-900 mb-2 text-sm">Brand Overview</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{brandData.overview}</p>
      </div>

      {/* Action Buttons — outline style, content width */}
      <div className="px-4 flex gap-3 pb-5">
        <button
          className="rounded-full text-sm font-semibold transition hover:bg-gray-50"
          style={{ border: '1.5px solid #111', color: '#111', padding: '7px 18px' }}
        >
          Points Breakdown
        </button>
        <button
          className="rounded-full text-sm font-semibold transition hover:bg-gray-50"
          style={{ border: '1.5px solid #111', color: '#111', padding: '7px 18px' }}
        >
          Bonus Points
        </button>
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-100" />

      {/* Earned Points Count */}
      <div className="px-4 py-4">
        <p className="text-gray-900 font-medium text-sm">
          Users earned a total of{' '}
          <span className="font-bold">{brandData.totalEarned.toLocaleString()} Points</span>{' '}
          from {brandName}
        </p>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 px-4 pt-3 pb-3 bg-white flex gap-2 border-b border-gray-100">
        {(['latest', 'topEarned', 'myPosts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="rounded-full text-sm transition whitespace-nowrap"
            style={
              activeTab === tab
                ? { background: '#111', color: '#fff', padding: '6px 16px', fontWeight: 600 }
                : { border: '1.5px solid #D1D5DB', color: '#374151', background: 'transparent', padding: '5px 16px', fontWeight: 500 }
            }
          >
            {tab === 'latest' && 'Latest'}
            {tab === 'topEarned' && 'Top Earned'}
            {tab === 'myPosts' && 'My Posts'}
          </button>
        ))}
      </div>

      {/* Posts — masonry two-column, each column flows independently */}
      {posts.length > 0 ? (
        <div className="flex" style={{ gap: 4, alignItems: 'flex-start' }}>
          {[posts.filter((_: BrandPost, i: number) => i % 2 === 0), posts.filter((_: BrandPost, i: number) => i % 2 === 1)].map((col, colIdx) => (
            <div key={colIdx} className="flex-1 flex flex-col" style={{ gap: 4 }}>
              {col.map((post: BrandPost) => (
                <div key={post.id} className="relative overflow-hidden bg-gray-100 cursor-pointer group">
                  {post.type === 'video' ? (
                    <div className="relative bg-gray-900" style={{ aspectRatio: '9/16' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <Play size={18} className="text-black fill-black" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-2 py-0.5">
                        <p className="text-white text-xs font-semibold">{post.points}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={post.image}
                        alt="Post"
                        width={0}
                        height={0}
                        sizes="50vw"
                        className="w-full h-auto group-hover:opacity-90 transition"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-2 py-0.5">
                        <p className="text-white text-xs font-semibold">{post.points}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 pt-12 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <span className="text-2xl">📸</span>
          </div>
          <p className="text-gray-900 font-medium mb-1">No posts yet</p>
          <p className="text-gray-500 text-sm text-center">
            {activeTab === 'myPosts'
              ? "You haven't posted content with this brand yet"
              : 'No posts available for this category'}
          </p>
        </div>
      )}
    </div>
  );
}
