'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Post, getBonusPointIcon } from '@/app/types';
import { Search } from 'lucide-react';

interface StoryPostProps {
  post: Post;
  isActive: boolean;
  onEnded: () => void;
}

export function StoryPost({ post, isActive, onEnded }: StoryPostProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setProgress(0);
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const isCaptionLong = post.caption.length > 80;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
        muted
      >
        <source src={post.content as string} type="video/mp4" />
      </video>

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-5" />

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

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-gray-500/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-700 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
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
