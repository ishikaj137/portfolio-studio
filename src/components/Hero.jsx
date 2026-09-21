import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import GhostFibers from './GhostFibers'
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
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Ghost Fibers background */}
      <div className={styles.fibersBg} aria-hidden="true">
        <GhostFibers
          lineColor="#d35206"
          glowColor="#a03440"
          speed={0.2}
          scale={2}
          rotation={0}
          rotationSpeed={0.25}
          layers={4}
          waveAmplitude={0.015}
          waveFrequency={3}
          waveSpeed={0.15}
          layerSpeed={0.08}
          twist={0.1}
          twistFrequency={5}
          twistSpeed={1.2}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={16}
          glowFalloff={10}
          glowIntensity={1.6}
          brightness={2}
          blueBoost={1.25}
          vignette={0.8}
          grain={0.05}
          lightMode={false}
          dpr={1}
        />
      </div>

      {/* Grain overlay */}
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

      {/* Three.js star field */}
      <div className={styles.threeSceneWrapper} aria-hidden="true">
        <Suspense fallback={null}>
          <ThreeScene />
        </Suspense>
      </div>

      {/* Bottom smooth scrim fade into the next section */}
      <div className={styles.bottomFade} aria-hidden="true" />

      {/* Hero text — bottom left */}
      <div className={styles.content}>
        <motion.p
          className={`${styles.label} mono-label`}
          initial="hidden"
          animate="visible"
          custom={0.2}
          variants={fadeUp}
        >
          AI, GIS &amp; Product Engineering Studio
        </motion.p>

        <motion.h1
          className={styles.heading}
          initial="hidden"
          animate="visible"
          custom={0.4}
          variants={fadeUp}
        >
          AI. Maps. Software.
          <br />
          Built for Organizations That Need
          <br />
          <em>More Than Just Another Website.</em>
        </motion.h1>

        <motion.p
          className={styles.sub}
          initial="hidden"
          animate="visible"
          custom={0.6}
          variants={fadeUp}
        >
          We design and engineer intelligent systems, geospatial platforms, and scalable digital
          products that solve real-world challenges.
        </motion.p>

        <motion.div
          className={styles.ctas}
          initial="hidden"
          animate="visible"
          custom={0.8}
          variants={fadeUp}
        >
          <a href="#work" className={styles.ctaPrimary} aria-label="View our work">
            View Our Work
          </a>
          <a href="#contact" className={styles.ctaSecondary}>
            Let&apos;s Build Together
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
        AI &middot; GIS &middot; Product Engineering &middot; Automation &middot; Modern Web Platforms
      </motion.p>
    </section>
  )
}
