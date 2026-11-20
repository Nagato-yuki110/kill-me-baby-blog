---
title: Vue 3 组合式 API 的几种常见套路
date: 2026-11-10
description: ref、computed、watch 到底怎么选？把日常写代码最常用的几种模式整理一下。
tags: [Vue, 前端]
---

刚接触组合式 API 时，最容易犯的错是把所有东西都塞进 `ref`。其实只要分清「状态」和「派生」两类东西，大部分选择就自然清楚了。

## 用 ref 装状态

`ref` 用来装会变化的数据。模板里自动解包，脚本里要写 `.value`：

```ts
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value += 1
}
```

如果需要的是一组同名的值（比如从接口拿到的对象），可以用 `reactive`，但解构会丢失响应性，所以更推荐继续用 `ref` 然后 `.value.xxx`。

## 用 computed 装派生

能从别的状态算出来的，就不要单独存一份，否则迟早不同步：

```ts
const double = computed(() => count.value * 2)
const isEmpty = computed(() => list.value.length === 0)
```

`computed` 有缓存，依赖不变就不会重新计算，比在模板里写函数调用要省。

## watch 只用来做副作用

不要用 `watch` 去「同步」两个状态，那是 `computed` 的活。`watch` 适合处理：

- 发请求（搜索词变了去查接口）
- 写 localStorage
- 操作 DOM 或第三方实例

```ts
watch(keyword, async (value) => {
  results.value = await search(value)
})
```

需要监听多个源、或者首次立即执行时：

```ts
watch([keyword, page], load, { immediate: true, deep: false })
```

## 把逻辑抽成 composable

当一段逻辑在多个组件里重复，就抽成 `useXxx` 函数。约定返回一个对象，调用方按需取：

```ts
export function useCounter(initial = 0) {
  const count = ref(initial)
  const double = computed(() => count.value * 2)

  function increment(step = 1) {
    count.value += step
  }

  return { count, double, increment }
}
```

这个模式最大的好处是：状态和操作绑定在一起，组件里只剩下 UI 该关心的事。

## 一个判断清单

| 场景 | 用什么 |
| --- | --- |
| 会变的数据 | `ref` |
| 从别的数据算出来 | `computed` |
| 数据变了要做别的事 | `watch` / `watchEffect` |
| 可复用的有状态逻辑 | composable |
| 跨组件共享 | Pinia |

记住这张表，组合式 API 基本就不会用歪了。
