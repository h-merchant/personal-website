import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const contentRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#section-about',
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section id="section-about" className={styles.about}>
      {/* Left half is empty — can occupies it via fixed canvas */}
      <div className={styles.canSide} />

      <div ref={contentRef} className={styles.content}>
        <h2 className={styles.heading}>About<br />Me</h2>
        <div className={styles.divider} />
        <p className={styles.intro}>
          Hi, I'm <span className="teal">Hur</span>.
        </p>
        <p className={styles.body}>
          I'm a builder at heart.{'\n'}
          I love turning ideas into real,{'\n'}
          impactful experiences through{'\n'}
          code, design, and relentless{'\n'}
          curiosity.
        </p>
        <p className={styles.mantra}>
          Always learning.<br />
          Always creating.<br />
          Always pushing what's possible.
        </p>

        <div className={styles.socials}>
          <a href="https://linkedin.com/in/hamercha" target="_blank" rel="noreferrer" className={styles.socialLink}>
            <LinkedInIcon />
            <span>LINKEDIN</span>
          </a>
          <a href="mailto:hamercha@uwaterloo.ca" className={styles.socialLink}>
            <MailIcon />
            <span>CONTACT</span>
          </a>
          <a href="#section-experience" className={styles.socialLink}>
            <BriefcaseIcon />
            <span>EXPERIENCE</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  )
}
