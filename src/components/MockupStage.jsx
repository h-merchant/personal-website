import { useEffect, useRef } from 'react'
import { scrollState } from '../hooks/scrollState.js'
import styles from './MockupStage.module.css'

/**
 * Fixed full-screen "stage" that crossfades between the mockup images
 * as the user scrolls. Each mockup is a complete designed page — we just
 * smoothly transition between them, giving the illusion of motion.
 *
 * Scroll progress maps:
 *   0.00 – 0.30   hero (full opacity)
 *   0.30 – 0.45   hero → about crossfade
 *   0.45 – 0.60   about (full opacity)
 *   0.60 – 0.75   about → experience crossfade
 *   0.75 – 1.00   experience (full opacity)
 */
export default function MockupStage() {
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const expRef = useRef(null)

  // Slight parallax / scale on each image as you scroll within its section
  const heroWrapRef = useRef(null)
  const aboutWrapRef = useRef(null)
  const expWrapRef = useRef(null)

  useEffect(() => {
    let raf
    const clamp01 = (v) => Math.max(0, Math.min(1, v))
    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      const p = scrollState.progress

      // ── Crossfade alphas ──────────────────────────────────────────────
      // Hero stays solid 0–0.30, fades out by 0.45
      const heroA = p < 0.30 ? 1 : clamp01(1 - (p - 0.30) / 0.15)
      // About fades in 0.30–0.45, holds, fades out 0.60–0.75
      const aboutA =
        p < 0.30 ? 0 :
        p < 0.45 ? (p - 0.30) / 0.15 :
        p < 0.60 ? 1 :
        p < 0.75 ? clamp01(1 - (p - 0.60) / 0.15) : 0
      // Experience fades in 0.60–0.75, then solid
      const expA = p < 0.60 ? 0 : clamp01((p - 0.60) / 0.15)

      // ── Subtle scale "breathing" for cinematic feel ───────────────────
      // Hero scales 1.0 → 1.05 across its dwell time
      const heroScale = lerp(1.0, 1.06, clamp01(p / 0.45))
      // About also slowly scales while visible
      const aboutScale = lerp(1.0, 1.05, clamp01((p - 0.30) / 0.45))
      // Experience scales similarly
      const expScale = lerp(1.0, 1.04, clamp01((p - 0.60) / 0.40))

      if (heroRef.current)  heroRef.current.style.opacity = heroA
      if (aboutRef.current) aboutRef.current.style.opacity = aboutA
      if (expRef.current)   expRef.current.style.opacity = expA

      if (heroWrapRef.current)  heroWrapRef.current.style.transform = `scale(${heroScale})`
      if (aboutWrapRef.current) aboutWrapRef.current.style.transform = `scale(${aboutScale})`
      if (expWrapRef.current)   expWrapRef.current.style.transform = `scale(${expScale})`

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={styles.stage}>
      <div ref={heroWrapRef} className={styles.layer}>
        <img ref={heroRef} src="mockups/hero.png" alt="" className={styles.img} />
      </div>
      <div ref={aboutWrapRef} className={styles.layer}>
        <img ref={aboutRef} src="mockups/about.png" alt="" className={styles.img} style={{ opacity: 0 }} />
      </div>
      <div ref={expWrapRef} className={styles.layer}>
        <img ref={expRef} src="mockups/experience.png" alt="" className={styles.img} style={{ opacity: 0 }} />
      </div>
    </div>
  )
}
