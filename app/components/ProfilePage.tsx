'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { Settings, Grid3x3, List, Play } from 'lucide-react';

type PostTab = 'approved' | 'pending' | 'brands';
type ViewMode = 'grid' | 'list';

interface Post {
  id: string;
  image: string;
  logo: string;
  brandName: string;
  points: number;
  isVideo?: boolean;
  rejection?: string;
}

interface Brand {
  name: string;
  logo: string;
  postCount: number;
  totalEarnings: number;
  posts: Post[];
}

interface SocialAccount {
  id: string;
  name: string;
  handle?: string;
  connected: boolean;
  connectedDate?: string;
}

const APPROVED: Post[] = [
  { id:'a1', image:'/images/profile/contents/approved/1.mp4',  logo:'/images/profile/contents/approved/1logo.png',  brandName:'Barista Sri Lanka', points:750, isVideo:true },
  { id:'a4', image:'/images/profile/contents/approved/4.png',  logo:'/images/profile/contents/approved/4logo.png',  brandName:'Kandy Hills',        points:250 },
  { id:'a2', image:'/images/profile/contents/approved/2.png',  logo:'/images/profile/contents/approved/2logo.png',  brandName:'Carnage',           points:320 },
  { id:'a3', image:'/images/profile/contents/approved/3.png',  logo:'/images/profile/contents/approved/3logo.png',  brandName:'Waters Edge',        points:120 },
  { id:'a7', image:'/images/profile/contents/approved/7.png',  logo:'/images/profile/contents/approved/7logo.png',  brandName:'Scope Cinema',       points:100 },
];

const PENDING: Post[] = [
  { id:'p1', image:'/images/profile/contents/pending/1.png', logo:'/images/profile/contents/pending/1logo.png', brandName:'Carnage',     points:0 },
  { id:'p2', image:'/images/profile/contents/pending/2.png', logo:'/images/profile/contents/pending/2logo.png', brandName:'Barista',     points:0 },
  { id:'p3', image:'/images/profile/contents/pending/3.png', logo:'/images/profile/contents/pending/3logo.png', brandName:'Land of Kings', points:0 },
  { id:'p4', image:'/images/profile/contents/pending/4.png', logo:'/images/profile/contents/pending/4logo.png', brandName:'Lean SL',     points:0 },
  { id:'p5', image:'/images/profile/contents/pending/5.png', logo:'/images/profile/contents/pending/5logo.png', brandName:'Moeka.lk',   points:0 },
  { id:'p6', image:'/images/profile/contents/pending/6.png', logo:'/images/profile/contents/pending/6logo.png', brandName:'Abans',       points:0, rejection:'Post does not meet brand quality standards. Please ensure better lighting and framing.' },
];

const SOCIAL: SocialAccount[] = [
  { id:'ig',      name:'Instagram', handle:'@miyuruj20', connected:true, connectedDate:'Connected on Jan 15, 2025' },
  { id:'tiktok',  name:'TikTok',    handle:'@miyuruj20', connected:true, connectedDate:'Connected on Dec 20, 2024' },
  { id:'fb',      name:'Facebook',  connected:false },
  { id:'yt',      name:'YouTube',   connected:false },
];

/* ── Social icon shapes ─────────────────────────────────────────────── */
function SocialIcon({ account, onTap }: { account: SocialAccount; onTap(): void }) {
  const iconMap: Record<string, string> = {
    ig: '/images/profile/socialmedia/instagram.png',
    tiktok: '/images/profile/socialmedia/tiktok.png',
    fb: '/images/profile/socialmedia/facebook.png',
    yt: '/images/profile/socialmedia/youtube.png',
  };

  return (
    <button onClick={onTap} className="relative transition active:scale-90">
      {account.connected ? (
        /* Connected: solid white background */
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center overflow-hidden">
            <Image src={iconMap[account.id]} alt={account.name} width={24} height={24} className="w-full h-full object-cover" />
          </div>
        </div>
      ) : (
        /* Not connected: dashed border + faded */
        <>
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ border: '2px dashed #934DFF', opacity: 0.5 }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center overflow-hidden">
              <Image src={iconMap[account.id]} alt={account.name} width={24} height={24} className="w-full h-full object-cover" />
            </div>
          </div>
          {/* + badge for not connected */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background:'linear-gradient(135deg,#934DFF,#FF4DBA)' }}>
            <span className="text-white font-bold" style={{ fontSize:11, lineHeight:1 }}>+</span>
          </div>
        </>
      )}
    </button>
  );
}

/* ── Social Drawer ──────────────────────────────────────────────────── */
function SocialDrawer({ account, onClose }: { account: SocialAccount | null; onClose(): void }) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (account) requestAnimationFrame(() => requestAnimationFrame(() => setInView(true)));
    else setInView(false);
  }, [account]);

  if (!account) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: inView ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0)', transition:'background 0.32s ease' }}
      onClick={onClose}>
      <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8"
        style={{ transform: inView ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />

        {/* Social Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-3xl overflow-hidden flex items-center justify-center bg-gray-100">
            <Image
              src={account.id === 'ig' ? '/images/profile/socialmedia/instagram.png'
                : account.id === 'tiktok' ? '/images/profile/socialmedia/tiktok.png'
                : account.id === 'fb' ? '/images/profile/socialmedia/facebook.png'
                : '/images/profile/socialmedia/youtube.png'}
              alt={account.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <p className="text-gray-900 font-bold text-lg mb-5 text-center">{account.name}</p>

        {account.connected ? (
          <>
            <div className="rounded-2xl bg-gray-50 px-4 py-4 mb-3">
              <p className="text-gray-400 text-xs mb-2">Connected Account</p>
              <p className="text-gray-900 font-bold text-sm mb-3">{account.handle}</p>
              <p className="text-gray-400 text-xs">{account.connectedDate}</p>
            </div>
            <div className="space-y-3 mb-6">
              <button className="w-full rounded-full py-3.5 font-bold text-sm transition active:scale-95"
                style={{ background:'#111', color:'#fff' }}>
                Connect New Account
              </button>
              <button className="w-full rounded-full py-3.5 font-bold text-sm transition active:scale-95"
                style={{ background:'#F3F4F6', color:'#111' }}>
                Remove Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl bg-gray-50 px-4 py-4 mb-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect your {account.name} account to start sharing posts and earning reward points.
              </p>
            </div>
            <button className="w-full rounded-full py-3.5 font-bold text-sm transition active:scale-95"
              style={{ background:'#111', color:'#fff' }}>
              Connect {account.name}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Rejection Drawer ───────────────────────────────────────────────── */
function RejectionDrawer({ reason, onClose }: { reason: string | null; onClose(): void }) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reason) requestAnimationFrame(() => requestAnimationFrame(() => setInView(true)));
    else setInView(false);
  }, [reason]);

  if (!reason) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: inView ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0)', transition:'background 0.32s ease' }}
      onClick={onClose}>
      <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8"
        style={{ transform: inView ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
        onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />
        <p className="text-gray-900 font-bold text-lg mb-3">Post Rejected</p>
        <div className="rounded-2xl bg-gray-50 px-4 py-4 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">{reason}</p>
        </div>
        <button onClick={onClose} className="w-full rounded-full py-3.5 font-bold text-sm transition active:scale-95"
          style={{ background:'#111', color:'#fff' }}>
          Got It
        </button>
      </div>
    </div>
  );
}

/* ── Aggregate brands from approved posts ────────────────────────────── */
function getBrandsFromPosts(posts: Post[]): Brand[] {
  const brandMap = new Map<string, Brand>();

  posts.forEach(post => {
    if (!brandMap.has(post.brandName)) {
      brandMap.set(post.brandName, {
        name: post.brandName,
        logo: post.logo,
        postCount: 0,
        totalEarnings: 0,
        posts: [],
      });
    }

    const brand = brandMap.get(post.brandName)!;
    brand.postCount += 1;
    brand.totalEarnings += post.points;
    brand.posts.push(post);
  });

  return Array.from(brandMap.values()).sort((a, b) => b.totalEarnings - a.totalEarnings);
}

/* ══════════════════════════════════════════════════════════════════════ */
export function ProfilePage() {
  const [activeTab,      setActiveTab]      = useState<PostTab>('approved');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [socialDrawer,   setSocialDrawer]   = useState<SocialAccount | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [selectedBrand,  setSelectedBrand]  = useState<Brand | null>(null);
  const [brandDrawerIn,  setBrandDrawerIn]  = useState(false);

  const closeSocial    = useCallback(() => setSocialDrawer(null), []);
  const closeRejection = useCallback(() => setRejectionReason(null), []);

  const openBrandDrawer = (brand: Brand) => {
    setSelectedBrand(brand);
    requestAnimationFrame(() => requestAnimationFrame(() => setBrandDrawerIn(true)));
  };

  const closeBrandDrawer = useCallback(() => {
    setBrandDrawerIn(false);
    setTimeout(() => setSelectedBrand(null), 320);
  }, []);

  const posts = activeTab === 'approved' ? APPROVED : PENDING;
  const isPending = activeTab === 'pending';

  const leftCol  = posts.filter((_, i) => i % 2 === 0);
  const rightCol = posts.filter((_, i) => i % 2 === 1);

  const tabLabel = activeTab === 'approved' ? 'Approved Posts' : activeTab === 'pending' ? 'Pending Posts' : 'My Brands';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      <div className="w-full h-full overflow-y-auto pb-32">

        {/* App Bar */}
        <div className="relative px-4 pt-6 pb-4 bg-white border-b border-gray-100">
          <h1 className="font-bold text-gray-900" style={{ fontSize:16 }}>My Profile</h1>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition">
            <Settings size={20} className="text-gray-900" />
          </button>
        </div>

        {/* Profile Photo + Name */}
        <div className="flex flex-col items-center pt-4 pb-5 px-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3"
            style={{ border:'3px solid #fff', boxShadow:'0 2px 12px rgba(0,0,0,0.12)' }}>
            <Image src="/images/profile/user.png" alt="User" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <p className="font-bold text-gray-900 text-lg">Miyuru Jayawardana</p>
        </div>

        {/* Connected Social Media */}
        <div className="mx-4 mb-6 bg-white rounded-2xl px-4 py-4" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-gray-500 text-xs font-medium text-center mb-3">Connected Social Media</p>
          <div className="flex items-center justify-center gap-5">
            {SOCIAL.map(s => (
              <SocialIcon key={s.id} account={s} onTap={() => setSocialDrawer(s)} />
            ))}
          </div>
        </div>

        {/* Tabs — same style as BrandDetailPage */}
        <div className="px-4 flex gap-2 mb-4">
          {(['approved','pending','brands'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="rounded-full text-sm transition whitespace-nowrap"
              style={activeTab === tab
                ? { background:'#111', color:'#fff', padding:'6px 16px', fontWeight:600 }
                : { border:'1.5px solid #D1D5DB', color:'#374151', background:'transparent', padding:'5px 16px', fontWeight:500 }}>
              {tab === 'approved' && 'Approved'}
              {tab === 'pending'  && 'Pending'}
              {tab === 'brands'   && 'My Brands'}
            </button>
          ))}
        </div>

        {/* Posts header row */}
        {activeTab !== 'brands' && (
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <p className="font-bold text-gray-900 text-sm">{tabLabel}</p>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
                <Grid3x3 size={18} />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
                <List size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Grid View — masonry two-column, same pattern as BrandDetailPage */}
        {activeTab !== 'brands' && viewMode === 'grid' && (
          <div className="flex" style={{ gap:4, alignItems:'flex-start', paddingLeft:4, paddingRight:4 }}>
            {[leftCol, rightCol].map((col, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col" style={{ gap:4 }}>
                {col.map(post => (
                  <div key={post.id} className="relative overflow-hidden bg-gray-200 cursor-pointer group"
                    onClick={() => post.rejection ? setRejectionReason(post.rejection) : undefined}>
                    {post.isVideo ? (
                      <div className="relative bg-gray-900" style={{ aspectRatio:'9/16' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-3">
                            <Play size={18} className="text-black fill-black" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={post.image}
                        alt="Post"
                        width={0}
                        height={0}
                        sizes="50vw"
                        className="w-full h-auto group-hover:opacity-90 transition"
                        style={{ width:'100%', height:'auto', display:'block',
                          filter: isPending ? 'grayscale(100%)' : 'none' }}
                      />
                    )}

                    {/* Points badge — center aligned */}
                    {post.points > 0 && (
                      <div className="absolute bottom-2 left-1/2 flex items-center gap-1 rounded-full px-2 py-1"
                        style={{ transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)' }}>
                        <span style={{ fontSize:10, color:'#FCD34D' }}>⭐</span>
                        <span className="text-white font-bold" style={{ fontSize:10 }}>{post.points} Points</span>
                      </div>
                    )}

                    {/* Brand logo */}
                    <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full overflow-hidden">
                      <Image src={post.logo} alt="Brand" width={28} height={28} className="w-full h-full object-cover" />
                    </div>

                    {/* Pending / Rejected status — bottom center */}
                    {isPending && (
                      <div className="absolute bottom-2 left-1/2 rounded-full px-2 py-0.5 font-semibold text-white"
                        style={{ transform:'translateX(-50%)',
                          background: post.rejection ? 'rgba(255,59,48,0.5)' : 'rgba(245,158,11,0.5)',
                          fontSize:9 }}>
                        {post.rejection ? 'Rejected' : 'Pending'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {activeTab !== 'brands' && viewMode === 'list' && (
          <div className="px-4">
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
              {posts.map((post, i) => (
                <button key={post.id}
                  onClick={() => post.rejection ? setRejectionReason(post.rejection) : undefined}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left transition active:bg-gray-50"
                  style={i < posts.length - 1 ? { borderBottom:'1px solid #F3F4F6' } : {}}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    {post.isVideo ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Play size={16} className="text-white fill-white" />
                      </div>
                    ) : (
                      <Image src={post.image} alt="Post" width={56} height={56}
                        className="w-full h-full object-cover"
                        style={{ filter: isPending ? 'grayscale(100%)' : 'none' }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm truncate">{post.brandName}</p>
                  </div>

                  {isPending ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 text-white"
                      style={{ background: post.rejection ? 'rgba(255,59,48,0.5)' : 'rgba(245,158,11,0.5)',
                        fontSize:9 }}>
                      {post.rejection ? 'Rejected' : 'Pending'}
                    </span>
                  ) : post.points > 0 && (
                    <p className="text-gray-900 font-semibold text-sm flex-shrink-0">+{post.points}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* My Brands */}
        {activeTab === 'brands' && (
          <div className="px-4">
            {getBrandsFromPosts(APPROVED).length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {getBrandsFromPosts(APPROVED).map((brand) => (
                  <button key={brand.name}
                    onClick={() => openBrandDrawer(brand)}
                    className="bg-white rounded-2xl p-3 flex flex-col items-center text-center transition active:scale-95"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 mb-2 border border-gray-100">
                      <Image src={brand.logo} alt={brand.name} width={56} height={56} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-semibold text-gray-900 text-xs mb-2 line-clamp-2">{brand.name}</p>
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Posts</span>
                        <span className="font-bold text-gray-900">{brand.postCount}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Earned</span>
                        <span className="font-bold text-gray-900">+{brand.totalEarnings}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="pt-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">🏷️</span>
                </div>
                <p className="text-gray-900 font-medium mb-1">No brands yet</p>
                <p className="text-gray-500 text-sm text-center">Brands you post for will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Brand Drawer */}
      {selectedBrand && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ background: brandDrawerIn ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0)', transition:'background 0.32s ease' }}
          onClick={closeBrandDrawer}>
          <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8"
            style={{ transform: brandDrawerIn ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />

            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                <Image src={selectedBrand.logo} alt={selectedBrand.name} width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-base">{selectedBrand.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{selectedBrand.postCount} {selectedBrand.postCount === 1 ? 'post' : 'posts'}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 rounded-2xl bg-gray-50 px-3 py-3">
                <p className="text-gray-400 text-xs mb-1">Total Posts</p>
                <p className="text-gray-900 font-bold text-lg">{selectedBrand.postCount}</p>
              </div>
              <div className="flex-1 rounded-2xl bg-gray-50 px-3 py-3">
                <p className="text-gray-400 text-xs mb-1">Total Earnings</p>
                <p className="text-gray-900 font-bold text-lg">+{selectedBrand.totalEarnings}</p>
              </div>
            </div>

            {/* Posts Summary */}
            <p className="text-gray-900 font-bold text-sm mb-3">Posts</p>
            <div className="bg-white rounded-2xl overflow-hidden mb-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {selectedBrand.posts.map((post, i) => (
                <div key={post.id}
                  className="flex items-center gap-2 px-3 py-2.5"
                  style={i < selectedBrand.posts.length - 1 ? { borderBottom:'1px solid #F3F4F6' } : {}}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {post.isVideo ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Play size={12} className="text-white fill-white" />
                      </div>
                    ) : (
                      <Image src={post.image} alt="Post" width={40} height={40} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="text-gray-500 text-xs flex-1">Post {i + 1}</p>
                  <p className="text-gray-900 font-semibold text-xs">+{post.points}</p>
                </div>
              ))}
            </div>

            <button onClick={closeBrandDrawer} className="w-full rounded-full py-3.5 font-bold text-sm transition active:scale-95"
              style={{ background:'#111', color:'#fff' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Social Drawer */}
      <SocialDrawer account={socialDrawer} onClose={closeSocial} />

      {/* Rejection Drawer */}
      <RejectionDrawer reason={rejectionReason} onClose={closeRejection} />
    </div>
  );
}
