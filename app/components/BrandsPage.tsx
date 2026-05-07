'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Search, Grid3x3, List } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  location: string;
  points: number;
  category: string;
  logo: string;
  image: string;
}

interface BrandsPageProps {
  onBrandClick?: (brandName: string) => void;
}

const BRANDS: Brand[] = [
  {
    id: '1',
    name: 'Barista Sri Lanka',
    location: 'Colombo 07',
    points: 750,
    category: 'Food & Drink',
    logo: '/images/brands/Barista Sri Lanka/logo.png',
    image: '/images/brands/Barista Sri Lanka/Barista Sri Lanka.png',
  },
  {
    id: '2',
    name: 'Lean SL',
    location: 'Colombo 03',
    points: 500,
    category: 'Fitness',
    logo: '/images/brands/Lean SL/logoo.png',
    image: '/images/brands/Lean SL/Lean SL.png',
  },
  {
    id: '3',
    name: 'Land of Kings',
    location: 'Battaramulla',
    points: 600,
    category: 'Fashion',
    logo: '/images/brands/Land of Kings/logo.png',
    image: '/images/brands/Land of Kings/Land of Kings.png',
  },
  {
    id: '4',
    name: 'Moeka.lk',
    location: 'Online Store',
    points: 800,
    category: 'Beauty',
    logo: '/images/brands/Moeka.lk/logo.png',
    image: '/images/brands/Moeka.lk/Moeka.lk.png',
  },
  {
    id: '5',
    name: 'Abans',
    location: 'Colombo 07',
    points: 650,
    category: 'Electronics',
    logo: '/images/brands/Abans/logo.png',
    image: '/images/brands/Abans/Abans.png',
  },
  {
    id: '6',
    name: 'Lady J',
    location: 'Maharagama',
    points: 550,
    category: 'Fashion',
    logo: '/images/brands/Lady J/logo.png',
    image: '/images/brands/Lady J/Lady J.png',
  },
  {
    id: '7',
    name: 'Christell Skin',
    location: 'Colombo 07',
    points: 700,
    category: 'Beauty',
    logo: '/images/brands/Christell Skin/Logo.png',
    image: '/images/brands/Christell Skin/Christell Skin.png',
  },
  {
    id: '8',
    name: 'Lakeside Diner',
    location: 'Rajagiriya',
    points: 620,
    category: 'Food & Drink',
    logo: '/images/brands/Lakeside Diner/logo.png',
    image: '/images/brands/Lakeside Diner/Lakeside Diner.png',
  },
  {
    id: '9',
    name: 'Spice Route Eatery',
    location: 'Maradana',
    points: 680,
    category: 'Food & Drink',
    logo: '/images/brands/Spice Route Eatery/logo.png',
    image: '/images/brands/Spice Route Eatery/Spice Route Eatery.png',
  },
  {
    id: '10',
    name: 'Coco Cafe',
    location: 'Nugegoda',
    points: 720,
    category: 'Food & Drink',
    logo: '/images/brands/Coco Cafe/logo.png',
    image: '/images/brands/Coco Cafe/Coco Cafe.png',
  },
];

const CATEGORIES = [
  'All',
  'Food & Drink',
  'Fashion',
  'Tech',
  'Electronics',
  'Beauty',
  'Fitness',
];

export function BrandsPage({ onBrandClick }: BrandsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBrands = BRANDS.filter((brand) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full h-screen overflow-y-auto pb-32 pt-4 bg-gray-50">
      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search brands"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-gray-100 outline-none text-sm text-gray-800"
          />
          <Search size={20} className="text-gray-600" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Map Section */}
      <div className="px-4 mb-4">
        <div className="relative w-full h-48 bg-gray-200 rounded-2xl overflow-hidden">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=79.8&layer=mapnik&marker=6.9271,79.8612"
            className="w-full h-full border-0"
            loading="lazy"
            title="Colombo Map"
          ></iframe>
          <button className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2 shadow-lg">
            View Map
            <span>↗</span>
          </button>
        </div>
      </div>

      {/* All Brands Header with View Toggle */}
      <div className="px-4 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">All Brands</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'grid'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Brands Grid View */}
      {viewMode === 'grid' && (
        <div className="px-4 grid grid-cols-1 gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="relative h-56 rounded-2xl overflow-hidden group cursor-pointer bg-gray-200"
              onClick={() => onBrandClick?.(brand.name)}
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={400}
                height={224}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-4">
                <div />
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{brand.name}</p>
                      <p className="text-gray-300 text-xs">{brand.location}</p>
                    </div>
                  </div>
                  <div
                    className="rounded-full px-3 py-1.5 flex-shrink-0"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <p className="text-white text-xs font-semibold">
                      Up to {brand.points}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Brands List View */}
      {viewMode === 'list' && (
        <div className="px-4 space-y-3">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition cursor-pointer"
              onClick={() => onBrandClick?.(brand.name)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-bold text-sm">{brand.name}</p>
                <p className="text-gray-600 text-xs">{brand.location}</p>
              </div>
              <div
                className="px-3 py-1 rounded-full flex-shrink-0"
                style={{
                  border: '2px solid rgba(147, 51, 234, 0.3)',
                  backgroundColor: 'rgba(147, 51, 234, 0.05)',
                }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: '#9333EA' }}
                >
                  Up to {brand.points}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
