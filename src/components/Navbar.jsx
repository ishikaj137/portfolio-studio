import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../ThemeContext'
import styles from './Navbar.module.css'

const EASE = [0.16, 1, 0.3, 1]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const navLinks = [
    { label: 'Work',     href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'About',    href: '#about' },
    { label: 'Contact',  href: '#contact' },
  ]

  return (
    <>
      <motion.header
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        role="banner"
      >
        <div className={styles.inner}>
          <a href="#" className={styles.brand} aria-label="Latent Labs home">
            Latent Labs
          </a>

          <div className={styles.rightGroup}>
            {/* Desktop links */}
            <nav className={styles.links} aria-label="Main navigation">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Theme toggle */}
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>

            {/* Mobile menu button */}
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              Menu
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <div className={styles.overlayTop}>
              {/* Theme toggle inside overlay too */}
              <button className={styles.themeToggle} onClick={toggleTheme}>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button
                className={styles.closeBtn}
                onClick={closeMenu}
                aria-label="Close navigation menu"
              >
                Close
              </button>
            </div>

            <motion.nav
              className={styles.overlayLinks}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
              }}
            >
              {navLinks.map(link => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={styles.overlayLink}
                  onClick={closeMenu}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
