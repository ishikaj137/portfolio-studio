import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './About.module.css'

const EASE = [0.16, 1, 0.3, 1]

const WHY_US = [
  'Government Project Experience',
  'AI & GIS Expertise',
  'End-to-End Product Development',
  'Scalable Modern Architecture',
  'Human-Centered Design',
  'Fast Execution',
]

const STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'OpenAI',
  'LangChain',
  'Mapbox',
  'Leaflet',
  'Docker',
  'AWS',
]

export default function About() {
  const ref = useRef()
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className={styles.section} aria-labelledby="about-heading">
      <div className={styles.header}>
        <p className="mono-label">About</p>
      </div>

      <motion.div
        ref={ref}
        className={styles.grid}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {/* Left — studio copy */}
        <motion.div
          className={styles.studioCopy}
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
          }}
        >
          <h2 className={styles.studioHeading} id="about-heading">
            AI, GIS, and software solutions for organizations solving real problems.
          </h2>
          <p className={styles.studioText}>
            Latent Labs is a premium AI and product engineering studio specializing in
            intelligent systems, geospatial platforms, automation, and modern web products.
          </p>
          <p className={styles.studioText}>
            We partner with startups, enterprises, NGOs, and government organizations to turn
            complex operational needs into reliable intelligent digital systems.
          </p>
          <div className={styles.stack} aria-label="Technology stack">
            {STACK.map(item => (
              <span key={item} className="tag">{item}</span>
            ))}
          </div>
        </motion.div>

        {/* Vertical divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Right — why us */}
        <motion.div
          className={styles.team}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {WHY_US.map(item => (
            <motion.div
              key={item}
              className={styles.member}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              <p className={styles.memberRole}>Why Us</p>
              <p className={styles.memberName}>{item}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
