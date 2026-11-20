<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AboutIcon from '@/components/icons/AboutIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import ScrollIcon from '@/components/icons/ScrollIcon.vue'
import ShurikenIcon from '@/components/icons/ShurikenIcon.vue'
import { site } from '@/site'

const route = useRoute()
const open = ref(false)

watch(
  () => route.fullPath,
  () => (open.value = false),
)

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <header class="sticky top-0 z-40">
    <!-- 顶部黄色条 -->
    <div class="border-b-[3px] border-ink-800 bg-pop-200 dark:border-pop-200 dark:bg-ink-800">
      <div class="container-wide flex h-16 items-center justify-between gap-4">
        <RouterLink to="/" class="group flex items-center gap-3">
          <span
            class="grid size-9 -rotate-6 place-items-center rounded-full border-[3px] border-ink-800 bg-ink-800 font-pop text-base font-black leading-none text-pop-200 transition-transform group-hover:rotate-6"
            aria-hidden="true"
          >
            キ
          </span>
          <span class="flex flex-col leading-none">
            <span class="font-pop text-lg font-black tracking-tight text-ink-800 dark:text-pop-200">{{ site.title }}</span>
            <span class="mt-1 text-[9px] font-bold tracking-[0.28em] text-ink-800/70 dark:text-pop-200/70">
              {{ site.titleEn }}
            </span>
          </span>
        </RouterLink>

        <nav class="hidden items-center gap-1.5 sm:flex" aria-label="主导航">
          <RouterLink
            v-for="item in site.nav"
            :key="item.to"
            :to="item.to"
            class="group relative flex items-center gap-1.5 border-[3px] px-3 py-1.5 font-pop text-[13px] font-black transition"
            :class="
              isActive(item.to)
                ? '-rotate-1 border-ink-800 bg-ink-800 text-pop-200 shadow-[3px_3px_0_#fdf46d] dark:border-pop-200 dark:bg-pop-200 dark:text-ink-800 dark:shadow-[3px_3px_0_#fdf46d]'
                : 'border-transparent text-ink-800 hover:border-ink-800 hover:bg-white dark:text-pop-200 dark:hover:border-pop-200 dark:hover:bg-ink-700'
            "
          >
            <HomeIcon v-if="item.to === '/'" :size="15" class="shrink-0" />
            <ShurikenIcon v-else-if="item.to === '/blog'" :size="14" mono class="shrink-0" />
            <ScrollIcon v-else-if="item.to === '/diary'" :size="15" class="shrink-0" />
            <AboutIcon v-else-if="item.to === '/about'" :size="15" class="shrink-0" />
            {{ item.label }}
          </RouterLink>
          <div class="ml-1.5">
            <ThemeToggle />
          </div>
        </nav>

        <div class="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            class="grid size-9 place-items-center border-[3px] border-ink-800 bg-white text-ink-800 dark:border-pop-200 dark:bg-ink-800 dark:text-pop-200"
            :aria-expanded="open"
            aria-label="打开菜单"
            @click="open = !open"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" class="size-5">
              <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
              <path v-else d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 滚动字幕条 -->
    <div class="marquee hidden sm:block">
      <div class="marquee-track py-1.5">
        <span v-for="n in 2" :key="n" class="flex shrink-0 items-center">
          <span
            v-for="(text, i) in site.marquee"
            :key="`${n}-${i}`"
            class="mx-4 flex items-center gap-4 font-pop text-[11px] font-black tracking-[0.2em] text-ink-900"
          >
            <span>{{ text }}</span>
            <span class="text-[9px]">★</span>
          </span>
        </span>
      </div>
    </div>

    <Transition name="fade">
      <nav v-if="open" class="border-b-[3px] border-ink-800 bg-white dark:border-pop-200 dark:bg-ink-800 sm:hidden" aria-label="移动端导航">
        <div class="container-wide flex flex-col py-2">
          <RouterLink
            v-for="item in site.nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center justify-between border-b-2 border-ink-800/10 py-3 font-pop text-sm font-black last:border-0 dark:border-pop-200/20"
            :class="isActive(item.to) ? 'text-pop-600 dark:text-pop-200' : 'text-ink-800 dark:text-pop-100'"
          >
            <span class="flex items-center gap-2">
              <HomeIcon v-if="item.to === '/'" :size="16" />
              <ShurikenIcon v-else-if="item.to === '/blog'" :size="14" mono />
              <ScrollIcon v-else-if="item.to === '/diary'" :size="16" />
              <AboutIcon v-else-if="item.to === '/about'" :size="16" />
              {{ item.label }}
            </span>
            <span class="text-[10px] tracking-[0.2em] opacity-60">{{ item.jp }}</span>
          </RouterLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

