import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../ThemeContext'
import styles from './Hero.module.css'

const ThreeScene = lazy(() => import('./ThreeScene'))

const EASE = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE, delay },
  }),
}

export default function Hero() {
  const { theme } = useTheme()
  const heroRef = useRef(null)
  const gridRef = useRef(null)
  const glowRef = useRef(null)

  const mousePos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const rafId = useRef()

  useEffect(() => {
    mousePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    currentPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const heroEl = heroRef.current
    if (!heroEl) return

    const onMouseMove = (e) => {
      const rect = heroEl.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX,
        y: e.clientY - rect.top,
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const LERP = 0.08
    const PARALLAX_FACTOR = 0.015

    const tick = () => {
      const cx = currentPos.current
      const mx = mousePos.current

      cx.x += (mx.x - cx.x) * LERP
      cx.y += (mx.y - cx.y) * LERP

      if (gridRef.current) {
        const panX = (cx.x - window.innerWidth / 2) * PARALLAX_FACTOR
        const panY = (cx.y - window.innerHeight / 2) * PARALLAX_FACTOR
        gridRef.current.style.transform = `translate(${-panX}px, ${-panY}px)`
      }

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(200px circle at ${cx.x}px ${cx.y}px, rgba(255,255,255,0.04), transparent)`
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Hero">
      {/* Dot grid — visible in both themes */}
      <div ref={gridRef} className={styles.gridLayer} aria-hidden="true" />

      {/* Cursor glow — dark mode only via CSS */}
      <div ref={glowRef} className={styles.glowLayer} aria-hidden="true" />

      {/* Grain overlay — dark mode only */}
      {theme === 'dark' && (
        <div className={styles.grain} aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="ll-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#ll-grain)" />
          </svg>
        </div>
      )}

      {/* Three.js star field */}
      <Suspense fallback={null}>
        <ThreeScene />
      </Suspense>

      {/* Hero text — bottom left */}
      <div className={styles.content}>
        <motion.p
          className={`${styles.label} mono-label`}
          initial="hidden"
          animate="visible"
          custom={0.2}
          variants={fadeUp}
        >
          AI &amp; Geospatial Studio — Indore, India
        </motion.p>

        <motion.h1
          className={styles.heading}
          initial="hidden"
          animate="visible"
          custom={0.4}
          variants={fadeUp}
        >
          We build AI systems
          <br />
          and <em>geospatial tools</em>
          <br />
          that work.
        </motion.h1>

        <motion.p
          className={styles.sub}
          initial="hidden"
          animate="visible"
          custom={0.6}
          variants={fadeUp}
        >
          A small studio focused on AI, GIS, and civic technology — for startups, NGOs, and government.
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial="hidden"
          animate="visible"
          custom={0.8}
          variants={fadeUp}
        >
          <a href="#work" className={styles.ctaPrimary} aria-label="See our work">
            See our work &rarr;
          </a>
          <a href="#contact" className={styles.ctaSecondary}>
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Proof strip — bottom right */}
      <motion.p
        className={styles.proof}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
      >
        MoTA &middot; FRA Atlas &middot; TriBoT &middot; GDG On Campus &middot; AI Summit
      </motion.p>
    </section>
  )
}
