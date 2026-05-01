import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experiences } from '../../data/experience.js'
import styles from './Experience.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const [activeId, setActiveId] = useState(experiences[0].id)
  const contentRef  = useRef(null)
  const headingRef  = useRef(null)
  const cardsRef    = useRef(null)

  const active = experiences.find(e => e.id === activeId)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#section-experience',
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, x: 30 },
        {
          opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: '#section-experience',
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Animate card swap
  useEffect(() => {
    if (!cardsRef.current) return
    gsap.fromTo(cardsRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
  }, [activeId])

  return (
    <section id="section-experience" className={styles.experience}>
      {/* Left side: can + pull-tab chain nav */}
      <div className={styles.leftSide}>
        {/* Pull-tab chain */}
        <div className={styles.pullChain}>
          {experiences.map((exp, i) => (
            <button
              key={exp.id}
              className={`${styles.tab} ${activeId === exp.id ? styles.tabActive : ''}`}
              onClick={() => setActiveId(exp.id)}
              style={{ '--accent': exp.color }}
            >
              <div className={styles.tabBubble}>
                <span className={styles.tabAbbr}>{exp.abbr}</span>
              </div>
              {i < experiences.length - 1 && <div className={styles.tabConnector} />}
            </button>
          ))}
        </div>
      </div>

      {/* Right side: heading + card */}
      <div className={styles.rightSide}>
        <div ref={headingRef} className={styles.headingBlock}>
          <h2 className={styles.heading}>Experience</h2>
          <div className={styles.divider} />
          <p className={`label ${styles.subtitle}`}>
            THE BUILDING BLOCKS.{' '}
            <span className="teal">THE ROLES. THE IMPACT. THE JOURNEY.</span>
          </p>
        </div>

        <div ref={contentRef} className={styles.cardArea}>
          <div ref={cardsRef} className={styles.card} style={{ '--accent': active.color }}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardCompany}>{active.company}</p>
                <p className={styles.cardRole}>{active.role}</p>
                <p className={styles.cardPeriod}>{active.period}</p>
              </div>
              <div className={styles.cardLogo}>{active.abbr}</div>
            </div>

            <p className={styles.cardDesc}>{active.description}</p>

            <div className={styles.statsRow}>
              {active.stats.map(stat => (
                <div key={stat.label} className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className={styles.quote}>
            <span className={styles.quoteMark}>&ldquo;</span>
            Each role taught me something. Each experience made me better.
            <span className={styles.quoteMark}>&rdquo;</span>
          </p>
        </div>
      </div>
    </section>
  )
}
