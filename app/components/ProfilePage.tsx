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

interface SocialAccount {
  id: string;
  name: string;
  handle?: string;
  connected: boolean;
  connectedDate?: string;
}

const APPROVED: Post[] = [
  { id:'a1', image:'/images/profile/contents/approved/1.mp4',  logo:'/images/profile/contents/approved/1logo.png',  brandName:'Barista Sri Lanka', points:750, isVideo:true },
  { id:'a2', image:'/images/profile/contents/approved/2.png',  logo:'/images/profile/contents/approved/2logo.png',  brandName:'Carnage',           points:320 },
  { id:'a3', image:'/images/profile/contents/approved/3.png',  logo:'/images/profile/contents/approved/3logo.png',  brandName:'Waters Edge',        points:120 },
  { id:'a4', image:'/images/profile/contents/approved/4.png',  logo:'/images/profile/contents/approved/4logo.png',  brandName:'Kandy Hills',        points:250 },
  { id:'a5', image:'/images/profile/contents/approved/5.png',  logo:'/images/profile/contents/approved/5logo.png',  brandName:'i Planet',           points:200 },
  { id:'a6', image:'/images/profile/contents/approved/6.png',  logo:'/images/profile/contents/approved/6logo.png',  brandName:'Barista',            points:450 },
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
  const styles: Record<string, React.CSSProperties> = {
    ig:     { background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#bc1888)' },
    tiktok: { background: '#010101' },
    fb:     { background: '#fff', border: '2px dashed #934DFF' },
    yt:     { background: '#fff', border: '2px dashed #FF4DBA' },
  };

  return (
    <button onClick={onTap} className="relative transition active:scale-90">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={styles[account.id]}>
        {account.id === 'ig' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
          </svg>
        )}
        {account.id === 'tiktok' && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.65a8.22 8.22 0 004.82 1.55V6.75a4.85 4.85 0 01-1.05-.06z"/>
          </svg>
        )}
        {account.id === 'fb' && (
          <span className="font-black text-lg" style={{ color:'#934DFF' }}>f</span>
        )}
        {account.id === 'yt' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="10,8 16,12 10,16" fill="#FF4DBA"/>
          </svg>
        )}
      </div>
      {/* + badge for not connected */}
      {!account.connected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background:'linear-gradient(135deg,#934DFF,#FF4DBA)' }}>
          <span className="text-white font-bold" style={{ fontSize:12, lineHeight:1 }}>+</span>
        </div>
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
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: account.id === 'ig' ? 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#bc1888)'
              : account.id === 'tiktok' ? '#010101'
              : account.id === 'fb' ? '#1877F2'
              : '#FF0000' }}>
            {account.id === 'ig' && (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
            )}
            {account.id === 'tiktok' && (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.65a8.22 8.22 0 004.82 1.55V6.75a4.85 4.85 0 01-1.05-.06z"/>
              </svg>
            )}
            {account.id === 'fb' && (
              <span className="text-white font-black" style={{ fontSize: 28 }}>f</span>
            )}
            {account.id === 'yt' && (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <polygon points="10,8 16,12 10,16"/>
              </svg>
            )}
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

/* ══════════════════════════════════════════════════════════════════════ */
export function ProfilePage() {
  const [activeTab,      setActiveTab]      = useState<PostTab>('approved');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [socialDrawer,   setSocialDrawer]   = useState<SocialAccount | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const closeSocial    = useCallback(() => setSocialDrawer(null), []);
  const closeRejection = useCallback(() => setRejectionReason(null), []);

  const posts = activeTab === 'approved' ? APPROVED : PENDING;
  const isPending = activeTab === 'pending';

  const leftCol  = posts.filter((_, i) => i % 2 === 0);
  const rightCol = posts.filter((_, i) => i % 2 === 1);

  const tabLabel = activeTab === 'approved' ? 'Approved Posts' : activeTab === 'pending' ? 'Pending Posts' : 'My Brands';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <div className="w-full h-full overflow-y-auto pb-32">

        {/* App Bar */}
        <div className="px-4 pt-6 pb-2 flex items-center justify-between bg-gray-50">
          <h1 className="font-bold text-gray-900" style={{ fontSize:16 }}>My Profile</h1>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
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
          <p className="text-gray-400 text-sm mt-0.5">@miyuruj20</p>
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
        <div className="px-4 flex gap-2 mb-0">
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

                    {/* Points badge */}
                    {post.points > 0 && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-1"
                        style={{ background:'rgba(0,0,0,0.65)' }}>
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
                      <div className="absolute bottom-2 left-1/2 rounded-full px-2 py-0.5"
                        style={{ transform:'translateX(-50%)', background: post.rejection ? 'rgba(255,59,48,0.85)' : 'rgba(245,158,11,0.85)' }}>
                        <p className="text-white font-semibold" style={{ fontSize:9 }}>
                          {post.rejection ? 'Rejected' : 'Pending'}
                        </p>
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
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: post.rejection ? '#FF3B30' : '#F59E0B', color:'#fff', fontSize:9 }}>
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

        {/* My Brands placeholder */}
        {activeTab === 'brands' && (
          <div className="px-4 pt-16 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🏷️</span>
            </div>
            <p className="text-gray-900 font-medium mb-1">No brands yet</p>
            <p className="text-gray-500 text-sm text-center">Brands you post for will appear here</p>
          </div>
        )}
      </div>

      {/* Social Drawer */}
      <SocialDrawer account={socialDrawer} onClose={closeSocial} />

      {/* Rejection Drawer */}
      <RejectionDrawer reason={rejectionReason} onClose={closeRejection} />
    </div>
  );
}
