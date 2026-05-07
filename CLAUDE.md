# UGC Mobile Feed — Implementation Guide

## Current Implementation: TikTok-Style Feed

This is a modern, scrollable UGC feed built with **Next.js 16**, **React 19**, and **Tailwind CSS**. The feed supports 4 content types with smooth animations and professional brand integration.

### What This Feed Does

- **TikTok-style vertical scroll** with smooth 600ms transitions
- **4 content types**: Videos, Images, Carousels, Stories
- **Auto-advance**: Videos/stories auto-play and navigate to next post when finished
- **15-second images**: Static images auto-advance after 15 seconds
- **Swipable carousels**: Full-screen carousel with left/right navigation, black background, centered images
- **Points system**: Brand-colored (orange #FF6B35) points badge with star icon
- **Desktop mockup**: iPhone 16 frame (370px × 802px) centered on gray background
- **Mobile responsive**: Full-screen feed on mobile devices
- **Smooth progress bars**: Orange-colored progress indicators for videos/stories

### Target Device

- **Desktop**: Centered iPhone 16-style frame on gray background (1024px+ screens)
- **Mobile**: Full-screen feed (below 1024px breakpoint)

---

## Feed Components & Structure

### Main Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `Feed.tsx` | Main feed controller | Wheel/touch scroll, smooth transitions, post navigation |
| `VideoPost.tsx` | Video content | Auto-play, progress bar, smooth animations |
| `ImagePost.tsx` | Static images | 15-second auto-advance with progress bar |
| `CarouselPost.tsx` | Multi-image carousel | Black background, centered images, swipe navigation |
| `StoryPost.tsx` | Story videos | Auto-play + auto-advance like videos |
| `PhoneMockup.tsx` | Desktop wrapper | iPhone 16 frame, gray background, responsive sizing |

### Content Structure

```
public/images/posts/
├── post1/          (video type)
│   ├── barista.mp4
│   └── logo.jpg
├── post2/          (video type)
│   ├── bingchun.mp4
│   └── logo.jpg
├── post3/          (carousel type - 5 images)
│   ├── image1.jpg
│   ├── image2.jpg
│   ├── image3.jpg
│   ├── image4.jpg
│   ├── image5.jpg
│   └── logo.jpg
├── post4/          (image type)
│   ├── flyingravana.jpg
│   └── logo.jpg
└── post5/          (image type)
    ├── watersedge.jpg
    └── logo.png
```

### Bonus Points Icons

Located in `public/images/bonus points/`:
- `100 likes.png`
- `1K likes.png`
- `100K likes.png`
- `100K views.png`
- `1M views.png`
- `10M views.png`

---

## Design System

### Primary Gradient
Three-color gradient used throughout for buttons, accents, badges, nav, covers:
- `#4A8FFF` (blue)
- `#934DFF` (purple)
- `#FF4DBA` (pink)

CSS:
```css
--grad:   linear-gradient(135deg, #4A8FFF 0%, #934DFF 55%, #FF4DBA 100%);
--grad-h: linear-gradient(90deg,  #4A8FFF 0%, #934DFF 55%, #FF4DBA 100%);
```

### Theme — Light (default) / Dark
| Token       | Light              | Dark              |
|-------------|--------------------|-------------------|
| `--bg`      | `#F5F5F7`          | `#0D0D0F`         |
| `--bg2`     | `#FFFFFF`          | `#1C1C1E`         |
| `--bg3`     | `#EBEBED`          | `#2C2C2E`         |
| `--card`    | `#FFFFFF`          | `#1C1C1E`         |
| `--text1`   | `#111111`          | `#F0F0F2`         |
| `--text2`   | `#555555`          | `#ABABAB`         |
| `--text3`   | `#999999`          | `#636366`         |
| `--border`  | `#E5E5EA`          | `#2C2C2E`         |
| `--nav-bg`  | `rgba(255,255,255,0.96)` | `rgba(13,13,15,0.97)` |

Dark mode is toggled from **Profile → Settings → Dark Mode**. Default is **light mode**.

### Supporting Colors
- Points badge (orange): `#FF6B35` (brand color) - used for points counter
- Progress bars: `#FF6B35` (brand orange)
- Points star: `#FCD34D` (yellow)
- Danger: `#FF3B30`
- Success: `#34C759`

### Brand Colors Integration

The feed uses **Barista brand orange** (`#FF6B35`) as the primary accent:
- Points badge background
- Progress bar fill color
- Icon hover states

### Border Radius
- Cards: `18–20px`
- Buttons (pill): `22px`
- Chips / tags: `20px`
- Logos / avatars: `14–17px`
- Bottom sheet: `28px`

### Typography
System font stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif`

| Use              | Size  | Weight |
|------------------|-------|--------|
| App bar title    | 16px  | 700    |
| Page title       | 22px  | 800    |
| Section title    | 17px  | 700    |
| Card title       | 14–15px | 600–700 |
| Body / caption   | 13px  | 400    |
| Label / small    | 10–12px | 500–600 |

---

## App Structure — 5 Main Screens

### 1. Home (`/home`)
- TikTok-style full-screen vertical feed
- Content types: **Posts**, **Reels**, **Videos** (tab filter at top)
- Stories row overlaid at top of feed
- Right-side action bar: Like, Comment, Share, Save
- Bottom overlay: username, points badge, caption, brand chip
- Brand logo avatar (top-right of post)
- Swipe up/down or scroll wheel to navigate posts
- **Location-based filtering happens server-side** — no UI for it
- Nav bar goes semi-transparent dark when on Home screen

### 2. Brands (`/brands`)
- Search bar at top
- Category filter chips: All, Food & Drink, Fashion, Tech, Electronics, Beauty, Fitness
- Map preview block (SVG mock) with "View Map" overlay button
- Brand list: logo, name, location, points pill ("Up to X pts")
- Toggle: Grid view ↔ List view
- Clicking a brand → Brand Detail screen (not yet prototyped beyond entry point)

### 3. Rewards (`/rewards`)
- Expiry warning banner (gradient, urgent tone)
- **Expire Soon** horizontal scroll — cards show brand logo, discount badge, description, points cost, expiry date
- **In Store Rewards** horizontal scroll — logo, name, points to spend, discount value
- **Online Offers** horizontal scroll — same card style, online-only brands
- "See All" links on each section

### 4. Wallet (`/wallet`)
- **Premium card** — Mastercard-inspired dark gradient card (deep blue→purple→magenta), user avatar (top-left), username, "AZBOW" wordmark, gold chip element, two overlapping MC-style circles (bottom-right), large point balance
- **Points Activity graph** — SVG bezier area chart (gradient stroke + fade fill). Three period selectors: 30D (30 daily pts), 3M (13 weekly pts), 1Y (12 monthly pts)
- **Scan to Pay** — tappable card opens device camera with scan-frame overlay + animated scan line; uses `scan.png` icon on gradient square
- **Points Breakdown** — single combined list (earned + redeemed together), period filter (30D / 3M / 1Y), summary row above cards showing total earned (black) and total redeemed (red `#FF3B30`). Brand logo (32px), brand name, points only — no date shown. Redeemed points shown in red, earned in black `#111111`
- **Transaction drawer** — slides up from bottom with `cubic-bezier(0.32,0.72,0,1)` animation; shows brand logo, name, type label, point chip, detail rows (post type / reward type / status — no views/likes). Closes by tapping backdrop or dragging down. No close button.

### 5. Profile (`/profile`)
- Gradient cover photo
- Avatar (initials fallback), name, handle, bio, location
- Stats: Posts, Points, Brands, Followers
- Edit Profile / Share Profile buttons
- Three-tab grid: **All Posts** | **Pending** | **Approved**
  - Pending posts show orange "Pending" badge
  - Approved posts show green checkmark + points earned
- Settings accessible via ⚙️ icon on cover

### Settings (sub-screen of Profile)
- Profile mini-card
- Appearance: **Dark Mode** toggle, Font Size, Language
- Account: Edit Profile, Connected Accounts (Instagram / TikTok), Notifications, Privacy
- Support: Help Center, Terms & Privacy, Rate the App
- Sign Out (red destructive)

---

## Desktop Mockup Wrapper

When the HTML prototype is opened on desktop, it shows an **iPhone 16-style frame** centered on a mid-gray background (`#6B6B70`). The frame is:
- Width: 393px × Height: 852px
- Border radius: 54px
- Dynamic Island at top center
- Side hardware buttons simulated with CSS pseudo-elements
- App viewport has `border-radius: 48px` to match inner screen curvature

---

## Feed Interaction Patterns

### Navigation
- **Mouse wheel scroll**: Smooth 600ms transition to next/previous post
- **Touch swipe**: Up/down swipe gestures on mobile
- **Keyboard arrows**: ↑↓ arrow keys for desktop navigation
- **Smooth animations**: CSS ease-out transitions between posts

### Post Auto-Advance
| Type | Trigger | Behavior |
|------|---------|----------|
| Video | Video ends | Auto-advance to next post |
| Image | 15 seconds | Progress bar completes → next post |
| Story | Video ends | Auto-advance to next post |
| Carousel | Manual only | User swipes/clicks arrows |

### UI Elements

**Top Section:**
- Left: Points badge (orange bg, white text, star icon)
- Right: Search icon (lucide Search)
- Below: Progress bar (orange fill, smooth animation)

**Bottom Section:**
- Left: Username handle (@username)
- Left below: Caption text (expandable with "View more" if >80 chars)
- Right: Brand logo (48px, circular, white border, glowing effect)

**Removed Elements:**
- Post counter (1/5)
- Scroll indicator arrow

### Icons & Libraries

- **Icon library**: [Lucide React](https://lucide.dev/) - `lucide-react` package
- **Current icons used**:
  - `Search` - Search functionality
  - `ChevronLeft` / `ChevronRight` - Carousel navigation

---

## Standard UI Components

### App Bar (for Rewards, Wallet, Profile, and other pages)

Used consistently across all pages (except Home feed) for a unified header experience.

**Structure:**
```jsx
<div className="px-4 pt-6 pb-4 bg-white border-b border-gray-100">
  <h1 className="font-bold text-gray-900" style={{ fontSize: 16 }}>Page Title</h1>
  {/* Optional: action buttons on the right */}
</div>
```

**Spacing:**
- `px-4` — horizontal padding
- `pt-6` — top padding
- `pb-4` — bottom padding
- `bg-white` — white background
- `border-b border-gray-100` — subtle bottom divider

**Title Typography:**
- Font size: `16px`
- Font weight: `700` (bold)
- Color: `text-gray-900` (#111)

**Following Section:**
- Add `mt-4` to the first content section after the app bar for consistent spacing

**Examples:** Rewards page, Wallet page, Profile page

---

## Key UX Conventions

- **No explicit location filter UI** — filtering is backend/silent
- Bottom nav: Brands | Rewards | [Home center] | Wallet | Profile
- Home center button is always the gradient circle (not a standard tab)
- All scrollable horizontal lists hide the scrollbar
- Cards have `box-shadow: 0 2px 12px rgba(0,0,0,0.07)` in light, stronger in dark
- Active states use `transform: scale(0.96–0.98)` on tap
- Gradient text achieved via `-webkit-background-clip: text`

---

## Reference Screenshots Provided

| Screen        | Notes |
|---------------|-------|
| Rewards page  | Expire Soon section, In Store, Online Offers — horizontal scroll cards |
| Brand detail  | Hero image, brand info, per-post earnings, photo grid with points overlay |
| Brands list   | Search, categories, map, list/grid toggle |
| Home post     | Full-screen reel with points, caption, brand tag |
| Login screen  | HCM Smiles — reference for desktop mockup style (iPhone frame on gray bg) |

## Tone & Feel
- Social media native — feels like TikTok/Instagram, not a loyalty card app
- Modern, premium, clean
- Gradient is the personality — used liberally but tastefully
- Light mode is polished white/gray; dark mode is true near-black

---

## Files in This Project

| File            | Description                          |
|-----------------|--------------------------------------|
| `prototype.html`| Full interactive HTML prototype (all 5 screens + settings, dark mode, feed scroll, like interaction) |
| `CLAUDE.md`     | This file — project context for future sessions |

---

## Future Screens to Design

- Brand Detail page (hero image, brand bio, points breakdown, bonus points tab, post grid)
- Post Detail / expanded view
- Onboarding / Sign-up flow
- Notification center
- Map full-screen view with brand pins
- Redeem flow (confirm → success)
- Post submission flow (connect social → tag brand → submit)
