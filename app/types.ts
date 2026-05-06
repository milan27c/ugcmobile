export type PostType = 'video' | 'image' | 'carousel' | 'story';

export interface Post {
  id: string;
  type: PostType;
  username: string;
  caption: string;
  logo: string;
  points: number;
  bonusPoints?: string;
  content: string | string[];
  likes: number;
  views: number;
}

export const POSTS: Post[] = [
  {
    id: 'post1',
    type: 'video',
    username: '@sura.vibes',
    caption: 'Crafting the perfect espresso shot. Pure artistry in every cup!',
    logo: '/images/posts/post1/logo.jpg',
    points: 320,
    bonusPoints: '100 likes',
    content: '/images/posts/post1/barista.mp4',
    likes: 5400,
    views: 45200,
  },
  {
    id: 'post2',
    type: 'video',
    username: '@thashi.chills',
    caption: 'Slow motion magic. Watch how the bingchun transforms your morning.',
    logo: '/images/posts/post2/logo.jpg',
    points: 320,
    bonusPoints: '1K likes',
    content: '/images/posts/post2/bingchun.mp4',
    likes: 3200,
    views: 28500,
  },
  {
    id: 'post3',
    type: 'carousel',
    username: '@nimal.coffee.ed',
    caption: 'A journey through our roastery. Swipe to see all the magic!',
    logo: '/images/posts/post3/logo.jpg',
    points: 320,
    bonusPoints: '1K likes',
    content: [
      '/images/posts/post3/image1.jpg',
      '/images/posts/post3/image2.jpg',
      '/images/posts/post3/image3.jpg',
      '/images/posts/post3/image4.jpg',
      '/images/posts/post3/image5.jpg',
    ],
    likes: 1200,
    views: 15300,
  },
  {
    id: 'post4',
    type: 'image',
    username: '@bing_chun_moments',
    caption: 'Our signature blend captured in one perfect moment.',
    logo: '/images/posts/post4/logo.jpg',
    points: 320,
    bonusPoints: undefined,
    content: '/images/posts/post4/flyingravana.jpg',
    likes: 2100,
    views: 19800,
  },
  {
    id: 'post5',
    type: 'image',
    username: '@brew.culture.lk',
    caption: 'Where coffee meets nature. Our peaceful corner by the water.',
    logo: '/images/posts/post5/logo.png',
    points: 320,
    bonusPoints: '100K views',
    content: '/images/posts/post5/watersedge.jpg',
    likes: 8900,
    views: 125600,
  },
];

export function getBonusPointIcon(bonusType?: string): string | null {
  if (!bonusType) return null;
  const iconMap: Record<string, string> = {
    '100 likes': '/images/bonus points/100 likes.png',
    '1K likes': '/images/bonus points/1K likes.png',
    '100K likes': '/images/bonus points/100K likes.png',
    '100K views': '/images/bonus points/100K views.png',
    '1M views': '/images/bonus points/1M views.png',
    '10M views': '/images/bonus points/10M views.png',
  };
  return iconMap[bonusType] || null;
}
