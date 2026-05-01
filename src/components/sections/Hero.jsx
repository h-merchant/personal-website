import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Hero.module.css'

export default function Hero() {
  const nameRef = useRef(null)
  const tagRef  = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(nameRef.current,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 0.4)
      .fromTo(tagRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 },   0.7)
      .fromTo(scrollRef.current,{ opacity: 0 },        { opacity: 1, duration: 0.8 },        1.4)
  }, [])

  return (
    <section id="section-hero" className={styles.hero}>
      {/* "WELCOME TO MY WORLD" top label */}
      <p className={`${styles.welcome} label`}>WELCOME TO MY WORLD</p>

      {/* HUR — can is in the middle — ABBAS */}
      <div ref={nameRef} className={styles.nameRow}>
        <span className={`${styles.namePart} ${styles.left}`}>HUR</span>
        <span className={styles.spacer} />
        <span className={`${styles.namePart} ${styles.right}`}>ABBAS</span>
      </div>

      {/* Scroll prompt */}
      <div ref={scrollRef} className={styles.scrollPrompt}>
        <div className={styles.mouseIcon}>
          <div className={styles.mouseWheel} />
        </div>
        <p className="label">SCROLL TO ROTATE</p>
        <span className={styles.chevron}>∨</span>
      </div>

      {/* Subtle tag below name — hidden on mobile */}
      <div ref={tagRef} className={styles.tag}>
        <span>MERCHANT</span>
        <span className="teal">TINKERER</span>
        <span>BUILDER</span>
      </div>
    </section>
  )
}
