/**
 * 站点配置：改这里就能换名字、简介、社交链接，不用翻组件
 */
export const site = {
  title: 'キルミー日記',
  titleEn: 'KILL ME BABY DIARY',
  author: '长门大法师',
  email: '3100024843@qq.com',
  /** 首页主视觉下面的那句话 */
  tagline: '白天写代码，晚上当忍者。偶尔写点日记——反正最后都会变成笑料。',
  description: '一个动画迷的前端日记本：代码、吐槽和随手记下的日子。',
  bio: '前端开发者，重度动画观众。喜欢《キルミーベイベー》那种一本正经胡闹的劲儿，所以把博客也弄成了这个样子。',
  poster: '/images/poster.png',
  heroImage: '/images/poster.png',
  portrait: '/images/portrait.jpg',
  nav: [
    { label: '首页', jp: 'ホーム', to: '/' },
    { label: '文章', jp: 'コラム', to: '/blog' },
    { label: '日记', jp: 'ダイアリー', to: '/diary' },
    { label: '关于', jp: 'アバウト', to: '/about' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Email', href: 'mailto:3100024843@qq.com' },
    { label: 'RSS', href: '/rss.xml' },
  ],
  footer: `© ${new Date().getFullYear()} 长门大法师`,
  /** 顶部滚动字幕条的内容 */
  marquee: ['キルミーベイベー', 'KILL ME BABY', '忍法・日記の術', 'あんた、バカ？', '今日も元気に殺し屋営業中'],
} as const

/** 日记的心情选项，新建日记时从这里选 */
export const moods = ['平静', '开心', '疲惫', '低落', '专注', '想念'] as const
export type Mood = (typeof moods)[number]

/** 心情对应的颜文字，贴在日记上 */
export const moodEmoji: Record<string, string> = {
  平静: '(-_-)',
  开心: '(≧▽≦)',
  疲惫: '(=_=)',
  低落: '(´；ω；`)',
  专注: '(-_・)',
  想念: '(´ω`)',
}
