import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createHead } from '@vueuse/head'
import './index.css'

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  const metrics = {
    startTime: performance.now(),
    fcp: null,
    lcp: null
  }

  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        metrics.fcp = entry.startTime
        console.log('FCP:', metrics.fcp)
      }
      if (entry.name === 'largest-contentful-paint') {
        metrics.lcp = entry.startTime
        console.log('LCP:', metrics.lcp)
      }
    }
  }).observe({ entryTypes: ['paint'] })

  window.addEventListener('load', () => {
    const loadTime = performance.now() - metrics.startTime
    console.log('Total load time:', loadTime)
  })
}

const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)
app.mount('#app')