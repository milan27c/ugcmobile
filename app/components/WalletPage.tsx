'use client';

import Image from 'next/image';
import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { X } from 'lucide-react';

type TimePeriod = '30d' | '3m' | '1y';

interface TxDetail { label: string; value: string }
interface Transaction {
  id: string; brand: string; logo: string;
  points: number; type: 'earned' | 'redeemed';
  details: TxDetail[];
}

/* ── Graph data ─────────────────────────────────────────────────────── */
const GRAPH_DATA: Record<TimePeriod, number[]> = {
  '30d': [
    210,320,280,460,390,530,610,550,720,680,
    810,760,920,870,1040,990,1150,1090,1270,1340,
    1500,1450,1630,1580,1760,1700,1870,1820,1980,1930,
  ],
  '3m': [480,590,740,860,970,1120,1040,1280,1190,1430,1320,1500,1600],
  '1y': [420,780,640,1140,1560,1280,2080,2620,2300,3100,2840,3920],
};
const PERIOD_X: Record<TimePeriod, string[]> = {
  '30d': ['1','6','12','18','24','30'],
  '3m':  ['Feb','Mar','Apr','May'],
  '1y':  ['Jan','Mar','May','Jul','Sep','Nov'],
};

/* ── Transactions ───────────────────────────────────────────────────── */
const TRANSACTIONS: Transaction[] = [
  { id:'1', brand:'Keells',        logo:'/images/wallet/brands/Keells.png',        points: 750, type:'earned',
    details:[{label:'Post Type',value:'Instagram Reel'},{label:'Reward Type',value:'Per Post'},{label:'Status',value:'Approved'}] },
  { id:'2', brand:'Dialog',        logo:'/images/wallet/brands/Dialog.png',        points:-500, type:'redeemed',
    details:[{label:'Reward',value:'10% Discount'},{label:'Redeemed At',value:'Dialog Colombo 07'},{label:'Status',value:'Used'}] },
  { id:'3', brand:'Munchee',       logo:'/images/wallet/brands/Munchee.png',       points: 620, type:'earned',
    details:[{label:'Post Type',value:'TikTok Video'},{label:'Reward Type',value:'Per Views'},{label:'Status',value:'Approved'}] },
  { id:'4', brand:'Sampath Bank',  logo:'/images/wallet/brands/Sampath Bank.png',  points:-300, type:'redeemed',
    details:[{label:'Reward',value:'Free Transfer Fee'},{label:'Redeemed At',value:'Online'},{label:'Status',value:'Used'}] },
  { id:'5', brand:'Dilmah',        logo:'/images/wallet/brands/Dilmah.png',        points: 880, type:'earned',
    details:[{label:'Post Type',value:'Facebook Post'},{label:'Reward Type',value:'Per Post'},{label:'Status',value:'Approved'}] },
  { id:'6', brand:'Elephant House',logo:'/images/wallet/brands/Elephant House.png',points: 540, type:'earned',
    details:[{label:'Post Type',value:'Instagram Photo'},{label:'Reward Type',value:'Per Post'},{label:'Status',value:'Approved'}] },
];

/* ── SVG chart ──────────────────────────────────────────────────────── */
const CW = 320, CH = 110;
function buildChart(data: number[]) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const px = 2, py = 10;
  const pts = data.map((v, i) => ({
    x: px + (i / (data.length - 1)) * (CW - px * 2),
    y: py + (1 - (v - min) / span) * (CH - py * 2),
  }));
  const line = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    const pr = pts[i - 1], cx = ((pr.x + p.x) / 2).toFixed(1);
    return `${acc} C${cx},${pr.y.toFixed(1)} ${cx},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }, '');
  const area = `${line} L${pts[pts.length-1].x.toFixed(1)},${CH} L${pts[0].x.toFixed(1)},${CH} Z`;
  return { line, area };
}

/* ── Period pill ────────────────────────────────────────────────────── */
function Pill({ val, active, onClick }: { val: TimePeriod; active: boolean; onClick(): void }) {
  return (
    <button onClick={onClick} className="rounded-full text-xs transition"
      style={active
        ? { background:'#111', color:'#fff', padding:'3px 10px', fontWeight:600 }
        : { border:'1px solid #E5E7EB', color:'#9CA3AF', background:'transparent', padding:'3px 10px', fontWeight:500 }}>
      {val === '30d' ? '30D' : val === '3m' ? '3M' : '1Y'}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export function WalletPage() {
  const uid = useId().replace(/:/g, '');
  const lineId = `ln-${uid}`, areaId = `ar-${uid}`;

  const [graphPeriod, setGraphPeriod] = useState<TimePeriod>('30d');
  const [txPeriod,    setTxPeriod]    = useState<TimePeriod>('30d');
  const [drawerTx,    setDrawerTx]    = useState<Transaction | null>(null);
  const [drawerIn,    setDrawerIn]    = useState(false);
  const [scanning,    setScanning]    = useState(false);
  const [showLifetime, setShowLifetime] = useState(false);
  const [lifetimeIn,  setLifetimeIn]  = useState(false);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openDrawer = (tx: Transaction) => {
    setDrawerTx(tx);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerIn(true)));
  };
  const closeDrawer = useCallback(() => {
    setDrawerIn(false);
    setTimeout(() => setDrawerTx(null), 320);
  }, []);

  const openLifetime = () => {
    setShowLifetime(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setLifetimeIn(true)));
  };
  const closeLifetime = useCallback(() => {
    setLifetimeIn(false);
    setTimeout(() => setShowLifetime(false), 320);
  }, []);

  const openScanner = async () => {
    setScanning(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch { /* denied — show UI */ }
  };
  const closeScanner = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setScanning(false);
  };
  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()); }, []);

  const { line, area } = buildChart(GRAPH_DATA[graphPeriod]);
  const totalEarned   = TRANSACTIONS.filter(t => t.type === 'earned').reduce((s,t) => s + t.points, 0);
  const totalRedeemed = Math.abs(TRANSACTIONS.filter(t => t.type === 'redeemed').reduce((s,t) => s + t.points, 0));

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      <div className="w-full h-full overflow-y-auto pb-32">

        {/* Header */}
        <div className="px-4 pt-6 pb-4 bg-white border-b border-gray-100">
          <h1 className="font-bold text-gray-900" style={{ fontSize: 16 }}>Wallet</h1>
        </div>

        {/* ══ Card area ══════════════════════════════════════════════════ */}
        <div className="px-4 mt-4 mb-5">
          <style>{`
            @keyframes azBlob1 {
              0%,100% { transform:translate(0px,0px) scale(1); }
              25%     { transform:translate(28px,-18px) scale(1.12); }
              50%     { transform:translate(-12px,22px) scale(0.9); }
              75%     { transform:translate(18px,12px) scale(1.05); }
            }
            @keyframes azBlob2 {
              0%,100% { transform:translate(0px,0px) scale(1); }
              25%     { transform:translate(-22px,14px) scale(0.92); }
              50%     { transform:translate(18px,-24px) scale(1.1); }
              75%     { transform:translate(-8px,-10px) scale(0.95); }
            }
            @keyframes azBlob3 {
              0%,100% { transform:translate(0px,0px) scale(1); }
              25%     { transform:translate(14px,26px) scale(1.08); }
              50%     { transform:translate(-22px,-12px) scale(0.88); }
              75%     { transform:translate(10px,-18px) scale(1.04); }
            }
            @keyframes azBlob4 {
              0%,100% { transform:translate(0px,0px) scale(1); }
              25%     { transform:translate(-18px,-22px) scale(1.1); }
              50%     { transform:translate(24px,14px) scale(0.9); }
              75%     { transform:translate(-10px,20px) scale(1.06); }
            }
            @keyframes azBlob5 {
              0%,100% { transform:translate(0px,0px) scale(1); opacity:0.5; }
              50%     { transform:translate(20px,-16px) scale(1.15); opacity:0.75; }
            }
          `}</style>
          <div className="relative overflow-hidden rounded-3xl" style={{ background:'linear-gradient(135deg, #1e40af 0%, #5b21b6 50%, #be185d 100%)', height:210 }}>

            {/* Animated gradient blobs */}
            <div className="absolute" style={{ width:220,height:220,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(74,143,255,0.65) 0%,transparent 65%)',
              top:-110,left:-55,
              animation:'azBlob1 9s ease-in-out infinite' }} />
            <div className="absolute" style={{ width:210,height:210,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(147,77,255,0.7) 0%,transparent 65%)',
              top:-90,right:-45,
              animation:'azBlob2 11s ease-in-out infinite' }} />
            <div className="absolute" style={{ width:190,height:190,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(255,77,186,0.6) 0%,transparent 65%)',
              bottom:-85,right:5,
              animation:'azBlob3 8s ease-in-out infinite' }} />
            <div className="absolute" style={{ width:130,height:130,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(74,143,255,0.45) 0%,transparent 65%)',
              bottom:-45,left:15,
              animation:'azBlob4 13s ease-in-out infinite' }} />
            <div className="absolute" style={{ width:100,height:100,borderRadius:'50%',
              background:'radial-gradient(circle,rgba(255,77,186,0.5) 0%,transparent 65%)',
              top:'50%',left:'45%',
              animation:'azBlob5 7s ease-in-out infinite' }} />

            {/* Top row — more top margin */}
            <div className="absolute left-5 right-5 flex items-center justify-between z-10" style={{ top:28 }}>
              <div className="flex items-center gap-2.5">
                <div className="p-0.5 rounded-full flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#4A8FFF,#934DFF,#FF4DBA)' }}>
                  <div className="w-8 h-8 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.2)' }}>
                    <Image src="/images/wallet/avatar.jpg" alt="User" width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-semibold" style={{ fontSize:11 }}>Sithara Perera</p>
                  <p className="text-white/40" style={{ fontSize:9 }}>@sithara_p</p>
                </div>
              </div>
              <p className="font-bold text-white/80" style={{ fontSize:12,letterSpacing:3 }}>AZBOW</p>
            </div>

            {/* Animated counter + label + lifetime button — more top margin */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2" style={{ top:20 }}>
              <p className="font-black" style={{
                fontSize:56, lineHeight:1,
                background:'linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.75) 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>
                4,250
              </p>
              <p style={{ fontSize:9,letterSpacing:3,color:'rgba(255,255,255,0.35)',fontWeight:500 }}>
                POINTS AVAILABLE
              </p>
            </div>

            {/* Subtle inner border */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none z-20"
              style={{ border:'1px solid rgba(255,255,255,0.08)' }} />

            {/* Lifetime earnings button */}
            <button onClick={openLifetime}
              className="absolute bottom-4 left-1/2 z-20 rounded-full px-4 py-1.5 transition active:scale-95"
              style={{ transform:'translateX(-50%)', background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.15)' }}>
              <p className="text-white font-semibold" style={{ fontSize:10,letterSpacing:0.5 }}>LIFETIME EARNINGS</p>
            </button>
          </div>
        </div>

        {/* ══ Points Activity Graph ══════════════════════════════════════ */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-900">Points Activity</p>
            <div className="flex gap-1">
              {(['30d','3m','1y'] as TimePeriod[]).map(p => (
                <Pill key={p} val={p} active={graphPeriod===p} onClick={() => setGraphPeriod(p)} />
              ))}
            </div>
          </div>

          <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" height={CH} style={{ display:'block', overflow:'visible' }}>
            <defs>
              <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#4A8FFF" />
                <stop offset="55%"  stopColor="#934DFF" />
                <stop offset="100%" stopColor="#FF4DBA" />
              </linearGradient>
              <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#934DFF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF4DBA" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${areaId})`} />
            <path d={line} fill="none" stroke={`url(#${lineId})`} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="flex justify-between mt-2">
            {PERIOD_X[graphPeriod].map(l => (
              <span key={l} className="text-gray-400" style={{ fontSize:10 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* ══ Scan to Pay ══════════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <button
            onClick={openScanner}
            className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 transition active:scale-95"
            style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <Image
              src="/images/wallet/scan.png"
              alt="Scan QR"
              width={44}
              height={44}
              className="object-contain flex-shrink-0"
            />
            <div className="text-left">
              <p className="text-gray-900 font-semibold text-sm">Scan to Pay</p>
              <p className="text-gray-400 text-xs mt-0.5">Scan a QR code to redeem points</p>
            </div>
          </button>
        </div>

        {/* ══ Points Breakdown ═════════════════════════════════════════════ */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>

            <div className="px-4 pt-4 pb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Points Breakdown</p>
              <div className="flex gap-1">
                {(['30d','3m','1y'] as TimePeriod[]).map(p => (
                  <Pill key={p} val={p} active={txPeriod===p} onClick={() => setTxPeriod(p)} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="px-4 pb-3 flex gap-5 items-center">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Total Earned</p>
                <p className="font-bold text-sm text-gray-900">+{totalEarned.toLocaleString()} pts</p>
              </div>
              <div style={{ width:1, background:'#F3F4F6', alignSelf:'stretch' }} />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Total Redeemed</p>
                <p className="font-bold text-sm" style={{ color:'#FF3B30' }}>-{totalRedeemed.toLocaleString()} pts</p>
              </div>
            </div>

            <div className="h-px bg-gray-100 mx-4" />

            {/* List */}
            <div className="px-4 py-1">
              {TRANSACTIONS.map((tx, i) => (
                <button key={tx.id} onClick={() => openDrawer(tx)}
                  className="w-full flex items-center gap-3 py-3 text-left transition active:scale-95"
                  style={i < TRANSACTIONS.length - 1 ? { borderBottom:'1px solid #F9FAFB' } : {}}>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <Image src={tx.logo} alt={tx.brand} width={32} height={32} className="w-full h-full object-cover" />
                  </div>
                  <p className="flex-1 text-gray-900 font-medium text-sm">{tx.brand}</p>
                  <p className="font-bold text-sm flex-shrink-0"
                    style={{ color: tx.type === 'redeemed' ? '#FF3B30' : '#111111' }}>
                    {tx.type === 'earned' ? '+' : ''}{tx.points.toLocaleString()} pts
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ QR Scanner ════════════════════════════════════════════════════ */}
      {scanning && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 pt-12 pb-4">
            <p className="text-white font-bold" style={{ fontSize:16 }}>Scan QR Code</p>
            <button onClick={closeScanner} className="p-2 rounded-full" style={{ background:'rgba(255,255,255,0.15)' }}>
              <X size={20} className="text-white" />
            </button>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute top-0 left-0 right-0 bg-black/65" style={{ bottom:'calc(50% + 112px)' }} />
              <div className="absolute bottom-0 left-0 right-0 bg-black/65" style={{ top:'calc(50% + 112px)' }} />
              <div className="absolute left-0 bg-black/65" style={{ top:'calc(50% - 112px)',bottom:'calc(50% - 112px)',right:'calc(50% + 112px)' }} />
              <div className="absolute right-0 bg-black/65" style={{ top:'calc(50% - 112px)',bottom:'calc(50% - 112px)',left:'calc(50% + 112px)' }} />
              <div className="absolute w-56 h-56" style={{ top:'calc(50% - 112px)',left:'calc(50% - 112px)' }}>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-purple-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-purple-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-purple-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-purple-400 rounded-br-lg" />
                <div className="absolute left-2 right-2 h-0.5 animate-bounce"
                  style={{ top:'50%',background:'linear-gradient(90deg,transparent,#934DFF,#FF4DBA,transparent)',animationDuration:'1.5s' }} />
              </div>
            </div>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="text-white/50 text-sm">Point the camera at a QR code to redeem points</p>
          </div>
        </div>
      )}

      {/* ═══ Transaction Drawer ════════════════════════════════════════════ */}
      {drawerTx && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ background: drawerIn ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0)', transition:'background 0.32s ease' }}
          onClick={closeDrawer}>
          <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8"
            style={{ transform: drawerIn ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                <Image src={drawerTx.logo} alt={drawerTx.brand} width={44} height={44} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-bold text-base">{drawerTx.brand}</p>
                <p className="text-xs mt-0.5" style={{ color: drawerTx.type === 'redeemed' ? '#FF3B30' : '#4A8FFF' }}>
                  {drawerTx.type === 'earned' ? 'Points Earned' : 'Points Redeemed'}
                </p>
              </div>
              <div className="rounded-full px-3 py-1.5"
                style={{ background: drawerTx.type === 'earned' ? 'rgba(17,17,17,0.06)' : 'rgba(255,59,48,0.08)',
                  color: drawerTx.type === 'redeemed' ? '#FF3B30' : '#111111' }}>
                <p className="font-bold text-sm">
                  {drawerTx.type === 'earned' ? '+' : ''}{drawerTx.points.toLocaleString()} pts
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 overflow-hidden">
              {drawerTx.details.map((d, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3"
                  style={i < drawerTx.details.length - 1 ? { borderBottom:'1px solid #F3F4F6' } : {}}>
                  <p className="text-gray-400 text-sm">{d.label}</p>
                  <p className="text-gray-900 font-semibold text-sm">{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Lifetime Earnings Drawer ══════════════════════════════════════ */}
      {showLifetime && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ background: lifetimeIn ? 'rgba(0,0,0,0.46)' : 'rgba(0,0,0,0)', transition:'background 0.32s ease' }}
          onClick={closeLifetime}>
          <div className="bg-white rounded-t-3xl px-5 pt-3 pb-8"
            style={{ transform: lifetimeIn ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.32s cubic-bezier(0.32,0.72,0,1)' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
            <p className="text-gray-900 font-bold text-lg mb-6">Lifetime Earnings</p>

            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-1">Total Earned</p>
                <p className="text-gray-900 font-bold text-2xl">+4,670 pts</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-1">Total Redeemed</p>
                <p className="font-bold text-2xl" style={{ color:'#FF3B30' }}>-800 pts</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-1">Lifetime Balance</p>
                <p className="text-gray-900 font-bold text-2xl">3,870 pts</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 border border-blue-100">
              <p className="text-gray-600 text-xs mb-1 font-semibold">You're in the top</p>
              <p className="text-gray-900 font-bold text-base">5% of all users</p>
              <p className="text-gray-400 text-xs mt-2">Amazing work! Keep posting to unlock rewards.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
