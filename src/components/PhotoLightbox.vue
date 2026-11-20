<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  photos: string[]
  columns?: 2 | 3
}>()

const active = ref<number | null>(null)
const hasPhotos = computed(() => props.photos.length > 0)

function open(index: number) {
  active.value = index
}
function close() {
  active.value = null
}
function step(delta: number) {
  if (active.value === null) return
  active.value = (active.value + delta + props.photos.length) % props.photos.length
}

function onKey(event: KeyboardEvent) {
  if (active.value === null) return
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowRight') step(1)
  if (event.key === 'ArrowLeft') step(-1)
}

watch(active, (value) => {
  if (value === null) {
    window.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
  } else {
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="hasPhotos">
    <div class="grid gap-3" :class="columns === 3 ? 'grid-cols-3' : 'grid-cols-2'">
      <button
        v-for="(photo, index) in photos"
        :key="photo"
        type="button"
        class="group relative aspect-[4/3] overflow-hidden border-[3px] border-ink-800 bg-white shadow-[5px_5px_0_#1f1b1d] transition hover:-translate-y-0.5 dark:border-pop-200 dark:shadow-[5px_5px_0_#fdf46d]"
        :aria-label="`查看第 ${index + 1} 张图`"
        @click="open(index)"
      >
        <img
          :src="photo"
          alt=""
          loading="lazy"
          class="size-full object-cover transition duration-300 group-hover:scale-[1.04]"
        />
        <span class="absolute bottom-1 left-1 border-2 border-ink-800 bg-pop-200 px-1 font-pop text-[10px] font-black text-ink-800">
          {{ index + 1 }}
        </span>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="active !== null"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/95 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="查看图片"
        @click.self="close"
      >
        <button
          type="button"
          class="absolute right-4 top-4 grid size-11 place-items-center border-[3px] border-pop-200 bg-ink-800 font-pop text-lg font-black text-pop-200 transition hover:bg-pop-200 hover:text-ink-800"
          aria-label="关闭"
          @click="close"
        >
          ✕
        </button>

        <button
          v-if="photos.length > 1"
          type="button"
          class="absolute left-3 grid size-11 place-items-center border-[3px] border-pop-200 bg-ink-800 font-pop text-lg font-black text-pop-200 transition hover:bg-pop-200 hover:text-ink-800 sm:left-6"
          aria-label="上一张"
          @click="step(-1)"
        >
          ←
        </button>

        <figure class="max-h-full">
          <img
            :src="photos[active]"
            alt=""
            class="max-h-[82dvh] max-w-[90vw] border-[4px] border-pop-200 object-contain shadow-[8px_8px_0_#fdf46d]"
          />
          <figcaption class="mt-4 text-center font-pop text-xs font-black tracking-[0.2em] text-pop-200">
            {{ active + 1 }} / {{ photos.length }}
          </figcaption>
        </figure>

        <button
          v-if="photos.length > 1"
          type="button"
          class="absolute right-3 grid size-11 place-items-center border-[3px] border-pop-200 bg-ink-800 font-pop text-lg font-black text-pop-200 transition hover:bg-pop-200 hover:text-ink-800 sm:right-6"
          aria-label="下一张"
          @click="step(1)"
        >
          →
        </button>
      </div>
    </Teleport>
  </div>
</template>
