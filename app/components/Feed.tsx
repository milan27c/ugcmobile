'use client';

import { useState, useEffect, useRef } from 'react';
import { VideoPost } from './VideoPost';
import { ImagePost } from './ImagePost';
import { CarouselPost } from './CarouselPost';
import { StoryPost } from './StoryPost';
import { POSTS } from '@/app/types';

export function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;
      e.preventDefault();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const direction = e.deltaY > 0 ? 'down' : 'up';

      scrollTimeoutRef.current = setTimeout(() => {
        if (direction === 'down') {
          setCurrentIndex((prev) =>
            prev < POSTS.length - 1 ? prev + 1 : prev
          );
        } else {
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
      }, 50);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || isTransitioning) return;
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStartRef.current - touchEnd;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setCurrentIndex((prev) =>
            prev < POSTS.length - 1 ? prev + 1 : prev
          );
        } else {
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex((prev) =>
          prev < POSTS.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handlePostEnded = () => {
    setCurrentIndex((prev) =>
      prev < POSTS.length - 1 ? prev + 1 : prev
    );
  };

  const renderPost = (index: number) => {
    const post = POSTS[index];
    const isActive = index === currentIndex;

    switch (post.type) {
      case 'video':
        return (
          <VideoPost
            key={post.id}
            post={post}
            isActive={isActive}
            onEnded={handlePostEnded}
          />
        );
      case 'image':
        return (
          <ImagePost
            key={post.id}
            post={post}
            isActive={isActive}
            onEnded={handlePostEnded}
          />
        );
      case 'carousel':
        return (
          <CarouselPost
            key={post.id}
            post={post}
            isActive={isActive}
            onEnded={handlePostEnded}
          />
        );
      case 'story':
        return (
          <StoryPost
            key={post.id}
            post={post}
            isActive={isActive}
            onEnded={handlePostEnded}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Feed Container with Smooth Scroll */}
      <div
        ref={feedRef}
        className="relative w-full h-full transition-transform duration-600 ease-out"
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
        }}
      >
        {POSTS.map((post, index) => (
          <div key={post.id} className="w-full h-screen flex-shrink-0">
            {renderPost(index)}
          </div>
        ))}
      </div>

    </div>
  );
}
