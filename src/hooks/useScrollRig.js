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

    // Keep ScrollTrigger in sync with Lenis virtual scroll position
    lenis.on('scroll', ({ scroll, limit }) => {
      ScrollTrigger.update()
      // Update shared state for R3F useFrame to read
      scrollState.y        = scroll
      scrollState.progress = limit > 0 ? scroll / limit : 0
    })

    // Wire into GSAP's ticker
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])
}
