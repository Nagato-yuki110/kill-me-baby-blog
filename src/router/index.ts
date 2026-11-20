import { createRouter, createWebHistory } from 'vue-router'
import { posts } from '@/lib/posts'
import { getDiary } from '@/lib/diary'
import { site } from '@/site'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '首页' },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
      meta: { title: '文章' },
    },
    {
      path: '/blog/:slug',
      name: 'post',
      component: () => import('@/views/PostView.vue'),
      meta: { title: '文章' },
    },
    {
      path: '/diary',
      name: 'diary',
      component: () => import('@/views/DiaryListView.vue'),
      meta: { title: '日记' },
    },
    {
      path: '/diary/new',
      name: 'diary-new',
      component: () => import('@/views/DiaryComposeView.vue'),
      meta: { title: '写日记' },
    },
    {
      path: '/diary/:slug',
      name: 'diary-entry',
      component: () => import('@/views/DiaryDetailView.vue'),
      meta: { title: '日记' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: '关于' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '页面不存在' },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
    return { top: 0 }
  },
})

// 标题：文章和日记用各自的标题
router.afterEach((to) => {
  const slug = to.params.slug as string | undefined
  const post = slug && to.name === 'post' ? posts.find((p) => p.slug === slug) : undefined
  const diary = slug && to.name === 'diary-entry' ? getDiary(slug) : undefined
  const pageTitle = diary?.title ?? post?.title ?? (to.meta.title as string | undefined)
  document.title = pageTitle ? `${pageTitle} · ${site.title}` : site.title
})

export default router
