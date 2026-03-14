import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Services.module.css'

const EASE = [0.16, 1, 0.3, 1]

const SERVICES = [
  {
    name: 'AI & Chatbots',
    desc: 'Custom AI assistants, RAG systems, LLM integrations, WhatsApp and Telegram bots.',
    tag: 'AI',
  },
  {
    name: 'GIS & Mapping',
    desc: 'WebGIS dashboards, land mapping, geo-tagging apps, spatial data tools.',
    tag: 'Geospatial',
  },
  {
    name: 'Web Development',
    desc: 'Startup websites, SaaS dashboards, CMS platforms, landing pages.',
    tag: 'Web',
  },
  {
    name: 'UI/UX Design',
    desc: 'App interfaces, design systems, prototyping, Figma to code.',
    tag: 'Design',
  },
]

export default function Services() {
  const ref = useRef()
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" className={styles.section} aria-labelledby="services-heading">
      <div className={styles.header}>
        <p className="mono-label">What we build</p>
      </div>

      <motion.div
        ref={ref}
        className={styles.grid}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {SERVICES.map((svc) => (
          <motion.article
            key={svc.name}
            className={styles.card}
            aria-labelledby={`svc-${svc.name.replace(/\s/g, '-')}`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <span className="tag" style={{ marginBottom: 16 }}>{svc.tag}</span>
            <h3
              className={styles.cardName}
              id={`svc-${svc.name.replace(/\s/g, '-')}`}
            >
              {svc.name}
            </h3>
            <p className={styles.cardDesc}>{svc.desc}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
