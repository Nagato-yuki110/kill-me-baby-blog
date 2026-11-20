<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { saveDiary, supportsFileSystem } from '@/lib/save-diary'
import { moodEmoji, moods } from '@/site'

function today(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const title = ref('')
const date = ref(today())
const mood = ref<string>('平静')
const weather = ref('')
const body = ref('')
const files = ref<{ file: File; url: string }[]>([])
const status = ref<'idle' | 'saving' | 'done' | 'error'>('idle')
const message = ref('')
const savedPath = ref('')

const canSave = computed(() => supportsFileSystem && title.value.trim().length > 0 && status.value !== 'saving')

function onPickPhotos(event: Event) {
  const input = event.target as HTMLInputElement
  for (const file of Array.from(input.files ?? [])) {
    if (!file.type.startsWith('image/')) continue
    files.value.push({ file, url: URL.createObjectURL(file) })
  }
  input.value = ''
}

function removePhoto(index: number) {
  URL.revokeObjectURL(files.value[index]!.url)
  files.value.splice(index, 1)
}

async function submit() {
  if (!canSave.value) return
  status.value = 'saving'
  message.value = '正在写入项目目录…'
  try {
    const result = await saveDiary({
      title: title.value.trim(),
      date: date.value,
      mood: mood.value,
      weather: weather.value.trim(),
      body: body.value,
      photos: files.value.map((item) => item.file),
    })
    savedPath.value = result.markdownPath
    status.value = 'done'
    message.value = '写好了，刷新页面就能看到。'
  } catch (error) {
    status.value = 'error'
    const name = error instanceof Error ? error.name : ''
    message.value =
      name === 'AbortError'
        ? '你取消了目录选择。'
        : `保存失败：${error instanceof Error ? error.message : String(error)}`
  }
}

onBeforeUnmount(() => files.value.forEach((item) => URL.revokeObjectURL(item.url)))
</script>

<template>
  <div class="container-page pt-8 sm:pt-12">
    <RouterLink
      to="/diary"
      class="inline-flex items-center gap-1 border-[3px] border-ink-800 bg-white px-2.5 py-1 font-pop text-[11px] font-black transition hover:bg-pop-200 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100"
    >
      ← 返回日记
    </RouterLink>

    <header class="mt-5">
      <p class="inline-block -rotate-2 border-[3px] border-ink-800 bg-pop-200 px-2 py-1 font-pop text-[11px] font-black tracking-[0.2em] text-ink-800">
        新しい日記 / NEW ENTRY
      </p>
      <h1 class="mt-3 font-pop text-3xl font-black tracking-tight sm:text-4xl">写日记</h1>
      <p class="mt-3 text-sm font-bold leading-7 text-ink-800/70 dark:text-pop-200/70">
        左边写内容，右边选好日子和心情。保存时会直接写进你电脑上的项目目录，不需要服务器。
      </p>

      <p
        v-if="!supportsFileSystem"
        class="pop-card-sm mt-4 border-[3px] border-ink-800 bg-pop-100 p-3 text-xs font-bold leading-6 text-ink-800"
      >
        当前浏览器不支持直接写文件。请用 Edge 或 Chrome 打开；或者手动在
        <code class="border-2 border-ink-800 bg-white px-1 font-mono">src/diary/</code> 下新建 md 文件。
      </p>
    </header>

    <div class="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <!-- 正文 -->
      <div class="pop-card p-4 sm:p-6">
        <label class="inline-block border-2 border-ink-800 bg-pop-200 px-2 py-0.5 font-pop text-[11px] font-black text-ink-800" for="diary-body">
          本文 / BODY
        </label>
        <textarea
          id="diary-body"
          v-model="body"
          rows="18"
          placeholder="今天…"
          class="mt-3 w-full resize-y border-[3px] border-ink-800 bg-white p-4 text-[15px] font-medium leading-8 text-ink-800 outline-none transition placeholder:text-ink-800/40 focus:bg-pop-50 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100 dark:placeholder:text-pop-200/40 dark:focus:bg-ink-600"
        />
        <p class="mt-3 text-[11px] font-bold leading-6 text-ink-800/60 dark:text-pop-200/60">
          支持 Markdown：空行分段，<code class="border-2 border-ink-800 bg-pop-200 px-1 font-mono text-ink-800">##</code> 小标题，
          <code class="border-2 border-ink-800 bg-pop-200 px-1 font-mono text-ink-800">**加粗**</code>，
          <code class="border-2 border-ink-800 bg-pop-200 px-1 font-mono text-ink-800">- 列表</code>。
        </p>
      </div>

      <!-- 侧栏 -->
      <div class="space-y-5">
        <div class="pop-card space-y-5 p-5">
          <div>
            <label class="block font-pop text-[11px] font-black tracking-[0.15em]" for="diary-title">标题</label>
            <input
              id="diary-title"
              v-model="title"
              type="text"
              placeholder="今天的一句话"
              class="mt-2 w-full border-[3px] border-ink-800 bg-white px-3 py-2 font-pop text-base font-black text-ink-800 outline-none transition placeholder:font-bold placeholder:text-ink-800/35 focus:bg-pop-50 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100 dark:focus:bg-ink-600"
            />
          </div>

          <div>
            <label class="block font-pop text-[11px] font-black tracking-[0.15em]" for="diary-date">日期</label>
            <input
              id="diary-date"
              v-model="date"
              type="date"
              class="mt-2 w-full border-[3px] border-ink-800 bg-white px-3 py-2 font-mono text-sm font-bold text-ink-800 outline-none transition focus:bg-pop-50 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100 dark:focus:bg-ink-600"
            />
          </div>

          <div>
            <span class="block font-pop text-[11px] font-black tracking-[0.15em]">心情</span>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="item in moods"
                :key="item"
                type="button"
                class="border-2 border-ink-800 px-2 py-1 font-pop text-[11px] font-bold transition"
                :class="
                  mood === item
                    ? 'rotate-1 bg-ink-800 text-pop-200'
                    : 'bg-white text-ink-800 hover:bg-pop-200 dark:bg-ink-700 dark:text-pop-100 dark:hover:bg-ink-600'
                "
                @click="mood = item"
              >
                {{ item }}<span class="ml-1 text-[9px] opacity-70">{{ moodEmoji[item] }}</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block font-pop text-[11px] font-black tracking-[0.15em]" for="diary-weather">天气</label>
            <input
              id="diary-weather"
              v-model="weather"
              type="text"
              placeholder="阴 / 小雨 / 有风"
              class="mt-2 w-full border-[3px] border-ink-800 bg-white px-3 py-2 text-sm font-bold text-ink-800 outline-none transition placeholder:text-ink-800/35 focus:bg-pop-50 dark:border-pop-200 dark:bg-ink-700 dark:text-pop-100 dark:focus:bg-ink-600"
            />
          </div>
        </div>

        <!-- 图片 -->
        <div class="pop-card p-5">
          <div class="flex items-center justify-between">
            <span class="font-pop text-[11px] font-black tracking-[0.15em]">配图</span>
            <label class="cursor-pointer border-2 border-ink-800 bg-pop-200 px-2 py-0.5 font-pop text-[11px] font-black text-ink-800 transition hover:-translate-y-0.5">
              ＋ 添加
              <input type="file" accept="image/*" multiple class="hidden" @change="onPickPhotos" />
            </label>
          </div>

          <div v-if="files.length" class="mt-3 grid grid-cols-3 gap-2">
            <div
              v-for="(photo, index) in files"
              :key="photo.url"
              class="group relative aspect-square overflow-hidden border-[3px] border-ink-800"
            >
              <img :src="photo.url" alt="" class="size-full object-cover" />
              <button
                type="button"
                class="absolute right-1 top-1 grid size-5 place-items-center border-2 border-ink-800 bg-white text-[10px] font-black text-ink-800"
                aria-label="移除这张图"
                @click="removePhoto(index)"
              >
                ✕
              </button>
            </div>
          </div>
          <p v-else class="mt-2 text-[11px] font-bold leading-5 text-ink-800/60 dark:text-pop-200/60">
            会压缩到最长边 1600px，存进
            <code class="border-2 border-ink-800 bg-pop-200 px-1 font-mono text-ink-800">public/uploads/</code>。
          </p>
        </div>

        <!-- 保存 -->
        <div class="pop-card p-5">
          <button type="button" class="pop-btn w-full justify-center disabled:translate-none disabled:cursor-not-allowed disabled:opacity-40" :disabled="!canSave" @click="submit">
            {{ status === 'saving' ? '写入中…' : '保存到这个项目' }}
          </button>

          <p
            v-if="message"
            class="mt-3 border-2 border-ink-800 px-2 py-1.5 text-[11px] font-bold leading-6"
            :class="
              status === 'error'
                ? 'bg-[#f5d4d0] text-ink-800'
                : status === 'done'
                  ? 'bg-pop-200 text-ink-800'
                  : 'bg-white text-ink-800 dark:bg-ink-700 dark:text-pop-100'
            "
          >
            {{ message }}
            <span v-if="savedPath" class="mt-1 block font-mono">{{ savedPath }}</span>
          </p>

          <p class="mt-3 text-[11px] font-bold leading-6 text-ink-800/60 dark:text-pop-200/60">
            第一次保存会让你选一次项目根目录（<code class="border-2 border-ink-800 bg-pop-200 px-1 font-mono text-ink-800">my-blog</code> 文件夹），之后会记住。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
