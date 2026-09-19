import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Services.module.css'

const EASE = [0.16, 1, 0.3, 1]

const SERVICES_DATA = [
  {
    id: 'ai-intelligence',
    tag: 'Recommended',
    title: 'AI & Intelligence',
    desc: 'Build autonomous agent workflows, enterprise RAG search engines, and multi-modal AI assistants.',
    tasks: '350 tasks',
    projects: '12 projects',
    progress: 88,
    bannerClass: styles.bannerAi,
    avatar: '/avatars/ai.jpg',
    bottomKey: 'Delivery:',
    bottomVal: 'Production Ready',
    actionText: 'Explore',
  },
  {
    id: 'product-engineering',
    tag: 'Popular',
    title: 'Web & Product Engineering',
    desc: 'Develop scalable web platforms, high-throughput SaaS architectures, and cloud APIs.',
    tasks: '622 tasks',
    projects: '16 projects',
    progress: 94,
    bannerClass: styles.bannerProduct,
    avatar: '/avatars/product.jpg',
    bottomKey: 'Uptime:',
    bottomVal: '99.99% Edge SLA',
    actionText: 'Continue',
  },
  {
    id: 'gis-geospatial',
    tag: 'Specialized',
    title: 'GIS & Geospatial',
    desc: 'Harness spatial telemetry, interactive WebGIS platforms, and land parcel mapping systems.',
    tasks: '410 tasks',
    projects: '8 projects',
    progress: 82,
    bannerClass: styles.bannerGis,
    avatar: '/avatars/gis.jpg',
    bottomKey: 'Accuracy:',
    bottomVal: '1,248 Parcels Mapped',
    actionText: 'Explore',
  },
  {
    id: 'automation-data',
    tag: 'High Impact',
    title: 'Automation & Data',
    desc: 'Streamline mission-critical data pipelines, automated webhook syncs, and internal operations.',
    tasks: '530 tasks',
    projects: '14 projects',
    progress: 90,
    bannerClass: styles.bannerAutomation,
    avatar: '/avatars/automation.jpg',
    bottomKey: 'Throughput:',
    bottomVal: '14.2K Events/mo',
    actionText: 'Explore',
  },
  {
    id: 'ui-ux-design',
    tag: 'Featured',
    title: 'UI/UX & Design Systems',
    desc: 'Design pixel-perfect interfaces, scalable tokenized design systems, and delightful experiences.',
    tasks: '280 tasks',
    projects: '10 projects',
    progress: 76,
    bannerClass: styles.bannerDesign,
    avatar: '/avatars/design.jpg',
    bottomKey: 'Tokens:',
    bottomVal: '100% Figma to Code',
    actionText: 'Explore',
  },
  {
    id: 'custom-solutions',
    tag: 'Enterprise',
    title: 'Custom Architecture',
    desc: 'Tailor-made software engineering, specialized technical advisory, and dedicated studio sprints.',
    tasks: 'Unlimited',
    projects: 'Dedicated Sprints',
    progress: 100,
    bannerClass: styles.bannerAdvisory,
    avatar: '/avatars/product.jpg',
    bottomKey: 'Availability:',
    bottomVal: 'Immediate Sprints',
    actionText: 'Apply',
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="services" className={styles.section} aria-labelledby="services-heading">
      {/* Seamless transition elements from Hero */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.topDivider} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.sectionTag}>
            <span className={styles.sectionTagDot} />
            <span>02 &middot; Capabilities &amp; Services</span>
          </div>
          <h2 className={styles.heading} id="services-heading">
            Choose your track. Build with precision.
          </h2>
          <p className={styles.subheading}>
            From autonomous agent intelligence and spatial platforms to full-stack engineering and product design.
          </p>
        </header>

        {/* 2-Column Grid */}
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
          {SERVICES_DATA.map((svc) => (
            <motion.article
              key={svc.id}
              className={styles.card}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              {/* Top Hero Banner */}
              <div className={`${styles.heroBanner} ${svc.bannerClass}`}>
                <div className={styles.bannerLeft}>
                  <div>
                    <span className={styles.tagPill}>{svc.tag}</span>
                    <h3 className={styles.cardTitle}>{svc.title}</h3>
                    <p className={styles.cardDesc}>{svc.desc}</p>
                  </div>

                  <div>
                    {/* Metadata with icons */}
                    <div className={styles.metaRow}>
                      <span className={styles.metaItem}>
                        <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        <span>{svc.tasks}</span>
                      </span>

                      <span className={styles.metaDot}>&bull;</span>

                      <span className={styles.metaItem}>
                        <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        <span>{svc.projects}</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span>Readiness</span>
                        <span>{svc.progress}%</span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${svc.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: 3D Memoji Character Avatar */}
                <div className={styles.bannerRight}>
                  <img
                    src={svc.avatar}
                    alt={svc.title}
                    className={styles.avatarImage}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Bottom Info & Action Bar */}
              <div className={styles.bottomBar}>
                <div className={styles.bottomInfo}>
                  <span>{svc.bottomKey} </span>
                  <strong>{svc.bottomVal}</strong>
                </div>

                <a href="#contact" className={styles.actionBtn}>
                  <span>{svc.actionText}</span>
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
