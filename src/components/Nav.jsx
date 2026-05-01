import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <button className={styles.menu} aria-label="Open menu">
        <span className={styles.dots}>⋮</span>
        <span>MENU</span>
      </button>
      <a href="#section-contact" className={styles.contact}>CONTACT</a>
    </nav>
  )
}
