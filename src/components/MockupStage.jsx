import { useEffect, useRef } from 'react'
import { scrollState } from '../hooks/scrollState.js'
import styles from './MockupStage.module.css'

/**
 * 3D scroll-driven scene.
 *
 * The page is treated as one giant 3D card that rotates 180° around the
 * Y axis as the user scrolls:
 *   • 0° → 90°    Hero (front face) tilts away
 *   • 90°         Card edge-on (invisible)
 *   • 90° → 180°  Experience (back face) tilts in
 *
 * The About mockup is overlaid on top during the middle of the scroll
 * (when the card is edge-on / mostly invisible) so it bridges the flip
 * cleanly. This gives a real 3D "spinning can" feel while preserving
 * the photographic quality of the mockup art.
 */
export default function MockupStage() {
  const cardRef  = useRef(null)
  const aboutRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    let raf
    const clamp01 = (v) => Math.max(0, Math.min(1, v))
    // ease-in-out so the rotation feels weighted near the middle
    const easeInOut = (t) => t * t * (3 - 2 * t)

    const tick = () => {
      const p = scrollState.progress

      // ── Card rotation: 0° → 180° across the page, eased ──────────────
      const cardRot = easeInOut(p) * 180

      // Subtle parallax-style scale for cinematic breathing
      const cardScale = 1 + Math.sin(p * Math.PI) * 0.04

      // ── About overlay: bridge the flip ───────────────────────────────
      // Fade in 25%–40%, hold 40%–60%, fade out 60%–75%
      const aboutA =
        p < 0.25 ? 0 :
        p < 0.40 ? (p - 0.25) / 0.15 :
        p < 0.60 ? 1 :
        p < 0.75 ? clamp01(1 - (p - 0.60) / 0.15) : 0

      // About also gets a tiny rotation so it feels in motion, not static
      const aboutRot = (p - 0.50) * 30   // ~−7.5° to +7.5° over its lifetime
      const aboutScale = 1 + Math.sin((p - 0.30) / 0.40 * Math.PI) * 0.03

      if (cardRef.current) {
        cardRef.current.style.transform =
          `rotateY(${cardRot}deg) scale(${cardScale})`
      }
      if (aboutRef.current) {
        aboutRef.current.style.opacity = aboutA
        aboutRef.current.style.transform =
          `rotateY(${aboutRot}deg) scale(${aboutScale})`
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={stageRef} className={styles.stage}>
      {/* The 3D card with hero/experience as its two faces */}
      <div className={styles.cardWrap}>
        <div ref={cardRef} className={styles.card}>
          <img
            className={`${styles.face} ${styles.front}`}
            src="mockups/hero.png"
            alt=""
            draggable={false}
          />
          <img
            className={`${styles.face} ${styles.back}`}
            src="mockups/experience.png"
            alt=""
            draggable={false}
          />
        </div>
      </div>

      {/* About mockup overlays during the flip */}
      <img
        ref={aboutRef}
        className={styles.aboutOverlay}
        src="mockups/about.png"
        alt=""
        draggable={false}
        style={{ opacity: 0 }}
      />
    </div>
  )
}
