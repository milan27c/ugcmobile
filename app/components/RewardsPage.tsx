'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

type RewardType = 'in-store' | 'online';

interface Reward {
  id: string;
  brand: string;
  logo: string;
  discount: string;
  discountValue: string;
  pointsNeeded: number;
  expiry: string;
  expiryShort?: string;
  type: RewardType;
  description?: string;
  couponCode?: string;
  visitUrl?: string;
  howItWorks: string;
}

const EXPIRE_SOON: Reward[] = [
  {
    id: 'e1',
    brand: 'Barista Sri Lanka',
    logo: '/images/brands/Barista Sri Lanka/logo.png',
    discount: '1000 LKR OFF',
    discountValue: '1000 LKR',
    pointsNeeded: 280,
    expiry: 'Apr 5, 2024',
    expiryShort: 'Apr 5',
    type: 'in-store',
    description: 'Get LKR 1,000 off any coffee order above LKR 2,000 at any branch.',
    howItWorks: 'You have 280 points available. Use them to redeem this reward and get 1000 LKR discount at Barista Sri Lanka.',
  },
  {
    id: 'e2',
    brand: 'Moeka.lk',
    logo: '/images/brands/Moeka.lk/logo.png',
    discount: '1500 LKR OFF',
    discountValue: '1500 LKR',
    pointsNeeded: 500,
    expiry: 'Apr 8, 2024',
    expiryShort: 'Apr 8',
    type: 'online',
    description: 'Enjoy LKR 1,500 discount on lifestyle and beauty purchases.',
    couponCode: 'MOEKA-500',
    visitUrl: 'Moeka.lk',
    howItWorks: 'Copy the coupon code and paste it at checkout on Moeka.lk to get 1500 LKR discount on your purchase.',
  },
  {
    id: 'e3',
    brand: 'Lean SL',
    logo: '/images/brands/Lean SL/logoo.png',
    discount: '20% OFF',
    discountValue: '20%',
    pointsNeeded: 300,
    expiry: 'Apr 10, 2024',
    expiryShort: 'Apr 10',
    type: 'online',
    description: 'Get 20% off on any fitness supplement or product purchase.',
    couponCode: 'LEAN-300',
    visitUrl: 'LeanSL.lk',
    howItWorks: 'Copy the coupon code and paste it at checkout on Lean SL to get 20% OFF on your purchase.',
  },
];

const IN_STORE: Reward[] = [
  {
    id: 's1', brand: 'Barista Sri Lanka', logo: '/images/brands/Barista Sri Lanka/logo.png',
    discount: '500 LKR OFF', discountValue: '500 LKR', pointsNeeded: 200, type: 'in-store',
    expiry: 'Apr 30, 2024',
    howItWorks: 'You have 200 points available. Use them to redeem this reward and get 500 LKR discount at Barista Sri Lanka.',
  },
  {
    id: 's2', brand: 'Lakeside Diner', logo: '/images/brands/Lakeside Diner/logo.png',
    discount: '20% OFF', discountValue: '20%', pointsNeeded: 300, type: 'in-store',
    expiry: 'May 5, 2024',
    howItWorks: 'Show this QR code at Lakeside Diner to redeem 20% discount on your total dining bill.',
  },
  {
    id: 's3', brand: 'Land of Kings', logo: '/images/brands/Land of Kings/logo.png',
    discount: '1000 LKR OFF', discountValue: '1000 LKR', pointsNeeded: 400, type: 'in-store',
    expiry: 'May 15, 2024',
    howItWorks: 'Show this QR code at Land of Kings to redeem 1000 LKR discount on any purchase above LKR 5,000.',
  },
  {
    id: 's4', brand: 'Lady J', logo: '/images/brands/Lady J/logo.png',
    discount: '15% OFF', discountValue: '15%', pointsNeeded: 250, type: 'in-store',
    expiry: 'May 20, 2024',
    howItWorks: 'Show this QR code at Lady J to redeem 15% discount on any fashion item.',
  },
  {
    id: 's5', brand: 'Christell Skin', logo: '/images/brands/Christell Skin/Logo.png',
    discount: '750 LKR OFF', discountValue: '750 LKR', pointsNeeded: 350, type: 'in-store',
    expiry: 'Jun 1, 2024',
    howItWorks: 'Show this QR code at Christell Skin to redeem 750 LKR discount on any skincare product.',
  },
  {
    id: 's6', brand: 'Abans', logo: '/images/brands/Abans/logo.png',
    discount: '2000 LKR OFF', discountValue: '2000 LKR', pointsNeeded: 600, type: 'in-store',
    expiry: 'Jun 10, 2024',
    howItWorks: 'Show this QR code at Abans to redeem 2000 LKR discount on any electronics purchase above LKR 20,000.',
  },
  {
    id: 's7', brand: 'Spice Route Eatery', logo: '/images/brands/Spice Route Eatery/logo.png',
    discount: '20% OFF', discountValue: '20%', pointsNeeded: 300, type: 'in-store',
    expiry: 'Jun 15, 2024',
    howItWorks: 'Show this QR code at Spice Route Eatery to redeem 20% discount on your total food bill.',
  },
];

const ONLINE: Reward[] = [
  {
    id: 'o1', brand: 'Moeka.lk', logo: '/images/brands/Moeka.lk/logo.png',
    discount: '1,000 LKR OFF', discountValue: '1000 LKR', pointsNeeded: 500, type: 'online',
    expiry: 'Apr 30, 2024', couponCode: 'COUPON-500', visitUrl: 'Moeka.lk',
    howItWorks: 'Copy the coupon code and paste it at checkout on Moeka.lk to get 1000 LKR discount on your purchase.',
  },
  {
    id: 'o2', brand: 'Lean SL', logo: '/images/brands/Lean SL/logoo.png',
    discount: '20% OFF', discountValue: '20%', pointsNeeded: 300, type: 'online',
    expiry: 'Apr 30, 2024', couponCode: 'LEAN-300', visitUrl: 'LeanSL.lk',
    howItWorks: 'Copy the coupon code and paste it at checkout on Lean SL to get 20% discount on any supplement.',
  },
];

/* ── Section header ─────────────────────────────────────────────────── */
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <p className="font-bold text-gray-900" style={{ fontSize: 15 }}>{title}</p>
      <span className="text-xs font-medium text-gray-400">{count} Available</span>
    </div>
  );
}

/* ── Expire Soon card ───────────────────────────────────────────────── */
function ExpireCard({ reward, onTap }: { reward: Reward; onTap(): void }) {
  return (
    <button onClick={onTap}
      className="flex-shrink-0 bg-white rounded-2xl p-3 text-left transition active:scale-95"
      style={{ width: 210, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
          <Image src={reward.logo} alt={reward.brand} width={36} height={36} className="w-full h-full object-cover" />
        </div>
        <p className="flex-1 font-semibold text-gray-900 text-xs leading-tight line-clamp-1">{reward.brand}</p>
        <div className="rounded-full inline-flex flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#4A8FFF,#934DFF,#FF4DBA)', padding: '1px' }}>
          <span className="rounded-full px-2 py-0.5 font-bold"
            style={{ fontSize: 10, background: '#FFFFFF', color: '#934DFF' }}>
            {reward.discount}
          </span>
        </div>
      </div>
      {/* Description */}
      <p className="text-gray-500 mb-3 leading-snug line-clamp-2" style={{ fontSize: 11 }}>
        {reward.description}
      </p>
      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{ background: '#F3F4F6', fontSize: 10 }}>
          <span className="text-gray-500 font-medium">{reward.pointsNeeded} pts</span>
        </span>
        <span className="text-gray-400" style={{ fontSize: 10 }}>Exp: {reward.expiryShort}</span>
      </div>
    </button>
  );
}

/* ── In-store / Online card ─────────────────────────────────────────── */
function StoreCard({ reward, onTap }: { reward: Reward; onTap(): void }) {
  return (
    <button onClick={onTap}
      className="flex-shrink-0 bg-white rounded-2xl p-3 flex flex-col items-center text-center transition active:scale-95"
      style={{ width: 150, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      {/* Logo */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100 mb-2 flex-shrink-0">
        <Image src={reward.logo} alt={reward.brand} width={40} height={40} className="w-full h-full object-cover" />
      </div>
      {/* Name */}
      <p className="font-bold text-gray-900 text-xs leading-tight mb-2 line-clamp-1 w-full">{reward.brand}</p>
      {/* Points badge */}
      <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 mb-2"
        style={{ background: '#F3F4F6', fontSize: 10 }}>
        <span className="text-gray-500 font-medium">Spend {reward.pointsNeeded} pts</span>
      </span>
      {/* Discount pill */}
      <div className="rounded-full inline-flex"
        style={{ background: 'linear-gradient(135deg,#4A8FFF,#934DFF,#FF4DBA)', padding: '1px' }}>
        <span className="rounded-full px-3 py-1 font-semibold"
          style={{ fontSize: 11, background: '#FFFFFF', color: '#934DFF' }}>
          {reward.discount}
        </span>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export function RewardsPage() {
  const [selected,  setSelected]  = useState<Reward | null>(null);
  const [drawerIn,  setDrawerIn]  = useState(false);
  const [copied,    setCopied]    = useState(false);

  const openDrawer = (reward: Reward) => {
    setSelected(reward);
    setCopied(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerIn(true)));
  };

  const closeDrawer = useCallback(() => {
    setDrawerIn(false);
    setTimeout(() => setSelected(null), 320);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      <div className="w-full h-full overflow-y-auto pb-32">

        {/* Header */}
        <div className="px-4 pt-6 pb-4 bg-white border-b border-gray-100">
          <h1 className="font-bold text-gray-900" style={{ fontSize: 16 }}>Rewards</h1>
        </div>

        {/* ── Expiry Warning Banner ───────────────────────────────────── */}
        <div className="mx-4 mt-4 mb-5 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#FF8C00 0%,#FFB800 100%)' }}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Image src="/images/rewards/expire.png" alt="Expiring" width={36} height={36} className="flex-shrink-0" />
            <div>
              <p className="text-white font-bold text-sm">3 rewards expiring in the next 7 days.</p>
              <p className="text-white/80 text-xs mt-0.5">Use them now!</p>
            </div>
          </div>
        </div>

        {/* ── Expire Soon ─────────────────────────────────────────────── */}
        <div className="mb-5">
          <SectionHeader title="Expire Soon" count={3} />
          <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {EXPIRE_SOON.map(r => (
              <ExpireCard key={r.id} reward={r} onTap={() => openDrawer(r)} />
            ))}
          </div>
        </div>

        {/* ── In Store Rewards ─────────────────────────────────────────── */}
        <div className="mb-5">
          <SectionHeader title="In Store Rewards" count={7} />
          <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {IN_STORE.map(r => (
              <StoreCard key={r.id} reward={r} onTap={() => openDrawer(r)} />
            ))}
          </div>
        </div>

        {/* ── Online Offers ────────────────────────────────────────────── */}
        <div className="mb-5">
          <SectionHeader title="Online Offers" count={2} />
          <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {ONLINE.map(r => (
              <StoreCard key={r.id} reward={r} onTap={() => openDrawer(r)} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Reward Drawer ══════════════════════════════════════════════ */}
      {selected && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ background: drawerIn ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0)', transition: 'background 0.32s ease' }}
          onClick={closeDrawer}>
          <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8"
            style={{ transform: drawerIn ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
            onClick={e => e.stopPropagation()}>

            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

            {/* Brand header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                <Image src={selected.logo} alt={selected.brand} width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <p className="text-gray-900 font-bold text-base">{selected.brand}</p>
            </div>

            {/* Coupon code — online only */}
            {selected.type === 'online' && selected.couponCode && (
              <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-4"
                style={{ border: '1.5px dashed #D1D5DB' }}>
                <p className="text-gray-900 font-bold text-sm tracking-widest">{selected.couponCode}</p>
                <button onClick={() => handleCopy(selected.couponCode!)}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition active:scale-95"
                  style={{ background: '#111', color: '#fff' }}>
                  {copied
                    ? <Check size={13} />
                    : <Copy size={13} />}
                  <span className="text-xs font-semibold">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}

            {/* Stats grid */}
            <div className="flex rounded-2xl overflow-hidden mb-4" style={{ background: '#F5F5F7' }}>
              <div className="flex-1 px-4 py-3">
                <p className="text-gray-400 text-xs mb-1">Points Needed</p>
                <p className="text-gray-900 font-bold text-2xl">{selected.pointsNeeded}</p>
              </div>
              <div className="w-px bg-gray-200 my-3" />
              <div className="flex-1 px-4 py-3">
                <p className="text-gray-400 text-xs mb-1">Discount</p>
                <p className="font-bold text-2xl text-gray-900">{selected.discountValue}</p>
              </div>
            </div>

            {/* Detail rows */}
            <div className="mb-4">
              <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <p className="text-gray-400 text-sm">Expiry Date</p>
                <p className="text-gray-900 font-bold text-sm">{selected.expiry}</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p className="text-gray-400 text-sm">Reward Type</p>
                <span className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: '#F3F4F6', color: '#374151' }}>
                  {selected.type === 'in-store' ? 'In Store Rewards' : 'Online Coupon'}
                </span>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl p-4 mb-5" style={{ background: '#F5F5F7' }}>
              <p className="text-gray-900 text-sm leading-relaxed">
                <span className="font-bold">How it works: </span>
                {selected.howItWorks}
              </p>
            </div>

            {/* CTA button */}
            {selected.type === 'in-store' ? (
              <button className="w-full rounded-full py-3.5 text-white font-bold text-sm transition active:scale-95"
                style={{ background: '#111' }}>
                Scan to Redeem
              </button>
            ) : (
              <button className="w-full rounded-full py-3.5 text-white font-bold text-sm transition active:scale-95"
                style={{ background: '#111' }}>
                Visit {selected.visitUrl}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
