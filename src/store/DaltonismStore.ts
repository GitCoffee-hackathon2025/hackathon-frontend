// src/store/CvdStore.ts
import { defineStore } from 'pinia'

type Mode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'

export const useCvdStore = defineStore('cvd', {
  state: () => ({
      mode: (localStorage.getItem('cvdMode') as Mode) || 'none',
  }),

  actions: {
    setMode(mode: Mode) {
       this.mode = mode 
      const appEl = document.getElementById('app') as HTMLElement | null
      const target = appEl ?? document.documentElement

      target.classList.remove('cvd-none', 'cvd-deuteranopia', 'cvd-protanopia', 'cvd-tritanopia')
      if (mode !== 'none') {
        target.classList.add(`cvd-${mode}`)
      }
      localStorage.setItem('cvdMode', mode)
    },

    restoreFromStorage() {
      const saved = (localStorage.getItem('cvdMode') as Mode) || 'none'
      this.setMode(saved)
    },
  },
})
