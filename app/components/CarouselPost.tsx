'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Post, getBonusPointIcon } from '@/app/types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselPostProps {
  post: Post;
  isActive: boolean;
  onEnded: () => void;
}

export function CarouselPost({ post, isActive, onEnded }: CarouselPostProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = post.content as string[];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const isCaptionLong = post.caption.length > 80;

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image Container - Black Background with Centered Image */}
      <div className="w-full h-full relative bg-black flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <Image
            src={images[currentIndex]}
            alt={`carousel-${currentIndex}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-5" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/40 to-transparent px-4 pt-4">
        <div className="flex justify-center items-center relative w-full">
          {/* Bonus Icon - Left */}
          {post.bonusPoints && getBonusPointIcon(post.bonusPoints) && (
            <div className="absolute left-4 w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center border border-gray-600">
              <Image
                src={getBonusPointIcon(post.bonusPoints)!}
                alt="bonus"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </div>
          )}

          {/* Points Badge - Centered with Gradient Border */}
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5 bg-gray-700/50"
            style={{
              border: '2px solid transparent',
              backgroundImage: 'linear-gradient(rgba(55, 65, 81, 0.5), rgba(55, 65, 81, 0.5)), linear-gradient(135deg, #4A8FFF 0%, #934DFF 55%, #FF4DBA 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <span className="text-yellow-300">⭐</span>
            <span className="font-bold text-white text-sm">{post.points}</span>
          </div>

          {/* Search Icon - Absolute Right */}
          <button className="absolute right-4 text-white hover:text-gray-300 transition">
            <Search size={24} />
          </button>
        </div>
      </div>

      {/* Image Counter */}
      <div className="absolute top-16 right-4 z-10 bg-black/60 rounded-full px-3 py-1 text-white text-xs font-medium">
        {currentIndex + 1}/{images.length}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition ${
              idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-4 pb-8 pt-28 mb-2">
        <div className="flex justify-between items-end gap-3">
          {/* Left: Username and Caption */}
          <div className="flex-1">
            <p className="text-white font-bold text-sm mb-1">{post.username}</p>
            <p
              className={`text-white text-sm leading-relaxed ${
                isExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {post.caption}
            </p>
            {isCaptionLong && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-gray-300 text-xs font-medium mt-1"
              >
                View more
              </button>
            )}
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-300 text-xs font-medium mt-1"
              >
                View less
              </button>
            )}
          </div>

          {/* Right: Brand Logo with Glow */}
          <div className="flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg" style={{
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.5), inset 0 0 8px rgba(255, 255, 255, 0.2)'
            }}>
              <Image
                src={post.logo}
                alt="brand logo"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
