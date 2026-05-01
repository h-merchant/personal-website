import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollState } from './scrollState.js'

gsap.registerPlugin(ScrollTrigger)

export function useScrollRig() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Lenis-driven updates (for smooth wheel scroll)
    lenis.on('scroll', ({ scroll, limit }) => {
      ScrollTrigger.update()
      scrollState.y        = scroll
      scrollState.progress = limit > 0 ? scroll / limit : 0
    })

    // Native scroll fallback — fires for programmatic scrollTo, jump links, etc.
    const onNativeScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.y = window.scrollY
      scrollState.progress = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onNativeScroll, { passive: true })
    onNativeScroll()  // initial sync

    // Wire Lenis into GSAP's ticker
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      window.removeEventListener('scroll', onNativeScroll)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])
}
