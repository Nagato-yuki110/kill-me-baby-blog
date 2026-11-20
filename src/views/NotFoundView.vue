<template>
  <div class="container-page flex flex-col items-center justify-center py-28 text-center">
    <p class="inline-block -rotate-6 border-[4px] border-ink-800 bg-pop-200 px-4 py-2 font-pop text-6xl font-black text-ink-800 shadow-[6px_6px_0_#1f1b1d]">
      404
    </p>
    <h1 class="mt-8 font-pop text-3xl font-black">这一页不在海报上</h1>
    <p class="mt-2 text-sm font-bold">你要找的页面不存在，或者已经被移动。</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <RouterLink to="/" class="pop-btn">回首页</RouterLink>
      <RouterLink to="/diary" class="pop-btn pop-btn-ghost">翻日记</RouterLink>
    </div>
  </div>
</template>
