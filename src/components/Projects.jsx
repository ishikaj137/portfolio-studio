import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRouter } from '../RouterContext'
import styles from './Projects.module.css'

const EASE = [0.16, 1, 0.3, 1]

const PROJECTS = [
  {
    id: 'tribot',
    name: 'TriBoT',
    badgeTag: 'RAG AI',
    image: '/projects/tribot.jpg',
    avatar: '/avatars/ai.jpg',
    topMetric: { val: '< 1.2s', lbl: 'Query Latency' },
    rating: '5.0',
    ratingDetail: '5K+ Docs Grounded',
    title: 'TriBoT AI Knowledge Platform',
    subtitle: 'Sovereign RAG knowledge engine delivering verified policy guidance for the Ministry of Tribal Affairs.',
    status: 'In Production',
    accentColor: '#cd445d',
    secondaryBtnText: 'Architecture',
    category: 'AI & Intelligence',
    year: '2024',
    metrics: [
      { value: '< 1.2s', label: 'Query Latency' },
      { value: '100%', label: 'Grounded Responses' },
      { value: '5,000+', label: 'Documents Indexed' },
    ],
    tags: ['AI Assistant', 'RAG', 'GovTech', 'FastAPI'],
    challenge: 'Government welfare schemes and constitutional rights documentation spanned thousands of complex administrative circulars. Citizens and field administrators struggled with slow discovery, bureaucratic legal jargon, and inconsistent interpretations across regional departments.',
    solution: 'Engineered a sovereign enterprise RAG assistant featuring semantic vector embeddings, chunked domain taxonomies, cross-encoder re-ranking, and strict document source citations to guarantee hallucination-free explanations in simple language.',
    technologies: ['OpenAI GPT-4', 'LangChain', 'Python', 'FastAPI', 'Qdrant Vector DB', 'Docker', 'React'],
    architecture: [
      'Automated ingestion & semantic chunking pipeline parsing thousands of ministerial PDFs and legal gazettes.',
      'Hybrid BM25 + dense vector embedding retrieval with cross-encoder re-ranking for ultra-precise context.',
      'Strict source attribution system providing direct page citations for transparent verification.',
      'Containerized high-concurrency FastAPI microservice ready for millions of public requests.'
    ],
    impact: 'Reduced policy lookup time from days to sub-second responses. Empowered departmental officers and tribal citizens with verified, instant guidance across pan-India administrative offices.',
    client: 'Ministry of Tribal Affairs, Govt. of India',
  },
  {
    id: 'fra-atlas',
    name: 'FRA Atlas',
    badgeTag: 'WebGIS',
    image: '/projects/fra-atlas.jpg',
    avatar: '/avatars/gis.jpg',
    topMetric: { val: '1.2K+', lbl: 'Parcels Mapped' },
    rating: '5.0',
    ratingDetail: '60 FPS Vector GIS',
    title: 'Forest Rights Spatial Platform',
    subtitle: 'Interactive geospatial intelligence platform for land parcel demarcation and analytical review.',
    status: 'Live Platform',
    accentColor: '#d35206',
    secondaryBtnText: 'View GIS Specs',
    category: 'GIS & Spatial Intelligence',
    year: '2024',
    metrics: [
      { value: '1,248+', label: 'Parcels Mapped' },
      { value: '60 FPS', label: 'Vector Speed' },
      { value: '30+', label: 'Spatial Layers' },
    ],
    tags: ['WebGIS', 'Geospatial', 'Mapbox GL', 'PostGIS'],
    challenge: 'Forest rights claims, cadastral maps, revenue village boundaries, and satellite imagery existed in fragmented GIS formats. Decision-makers lacked a unified, real-time spatial platform to inspect boundary conflicts, overlaps, and historical claim progress.',
    solution: 'Designed and engineered an enterprise WebGIS platform streaming dynamic vector tiles with spatial buffering, multi-criteria layer filtering, automated parcel overlap detection, and administrative telemetry dashboards.',
    technologies: ['React', 'Mapbox GL JS', 'PostgreSQL', 'PostGIS', 'Node.js', 'GeoServer', 'Turf.js'],
    architecture: [
      'Dynamic Mapbox vector tile generation for seamless, lag-free streaming of 500,000+ spatial features.',
      'Spatial topological query engine calculating boundary conflicts, buffer intersections, and area metrics.',
      'Role-based spatial access control for district collectors, forest officers, and survey teams.',
      'Exportable spatial telemetry reporting suite with real-time analytics for governance review.'
    ],
    impact: 'Transformed administrative verification of forest titles, enabling multi-tier committees to adjudicate claims transparently with verified boundaries, zero map lag, and audit-ready data.',
    client: 'Department of Forest & Land Administration',
  },
  {
    id: 'land-mapping',
    name: 'Land Mapping',
    badgeTag: 'Offline GIS',
    image: '/projects/land-mapping.jpg',
    avatar: '/avatars/product.jpg',
    topMetric: { val: '99.9%', lbl: 'Offline Uptime' },
    rating: '4.9',
    ratingDetail: '3.5x Speedup',
    title: 'Field Geotagging & Survey Telemetry',
    subtitle: 'Resilient mobile survey application engineered for capturing sub-meter GPS polygons in zero-connectivity terrain.',
    status: 'Field Verified',
    accentColor: '#cd445d',
    secondaryBtnText: 'Field Specs',
    category: 'Mobile & Field GIS',
    year: '2023',
    metrics: [
      { value: '99.9%', label: 'Offline Reliability' },
      { value: '3.5x', label: 'Survey Speedup' },
      { value: '0.01%', label: 'Sync Errors' },
    ],
    tags: ['Mobile GIS', 'Offline-First', 'SQLite', 'Telemetry'],
    challenge: 'Field teams conducted land surveys in dense jungle and rural valleys where mobile connectivity was completely absent. Generic mobile survey apps suffered data loss, GPS inaccuracies, and manual paper-logging backlogs.',
    solution: 'Engineered an offline-first mobile survey application featuring local SQLite spatial caching, high-accuracy GPS polygon collection, timestamped geotagged camera capture, and conflict-free background synchronizations upon network discovery.',
    technologies: ['React Native', 'SQLite', 'Mapbox Mobile', 'Turf.js', 'Python', 'FastAPI'],
    architecture: [
      'Local spatial database with spatial indexing capable of storing months of field survey records.',
      'Multi-point GPS polygon boundary tracer with sub-meter smoothing and geometry validation.',
      'Encrypted media storage for photographic evidence with cryptographic metadata hashing.',
      'Resilient background queue syncing data payloads through differential state replication.'
    ],
    impact: 'Eliminated paper survey handoffs and accelerated district mapping velocity by 350%, recording tamper-proof digital boundary geometries for over 15,000 acres of surveyed land.',
    client: 'State Land Records & Revenue Department',
  },
]

function ProjectCard({ project, onSelect, delay }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(project)
        }
      }}
      aria-label={`View details for ${project.name}`}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {/* Background Media */}
      <img
        src={project.image}
        alt={project.name}
        className={styles.cardBg}
        loading="lazy"
      />

      {/* Dark Vignette Overlay */}
      <div className={styles.cardOverlay} />

      {/* Floating Card Content */}
      <div className={styles.cardContent}>
        {/* Top Header Bar */}
        <div className={styles.topBar}>
          <div className={styles.profilePill}>
            <img src={project.avatar} alt="" className={styles.profileAvatar} />
            <span className={styles.profileName}>
              {project.name}
              <span className={styles.verifiedCheck} aria-label="Verified Case Study">
                ✓
              </span>
            </span>
            <span className={styles.badgeTag}>{project.badgeTag}</span>
          </div>

          <div className={styles.metricBadge}>
            <span className={styles.metricNumber}>{project.topMetric.val}</span>
            <span className={styles.metricLabel}>{project.topMetric.lbl}</span>
          </div>
        </div>

        {/* Bottom Glassmorphic Panel */}
        <div className={styles.bottomCardPanel}>
          <div className={styles.metaRow}>
            <div className={styles.ratingGroup}>
              <span className={styles.starScore}>★ {project.rating}</span>
              <span className={styles.ratingSubtext}>&middot; {project.ratingDetail}</span>
            </div>

            <div className={styles.liveGroup}>
              <span
                className={styles.statusDot}
                style={{ backgroundColor: project.accentColor }}
              />
              <span>{project.status}</span>
            </div>
          </div>

          <div>
            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.cardSubtitle}>{project.subtitle}</p>
          </div>

          <div className={styles.actionButtonGroup}>
            <button
              className={styles.btnPrimary}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(project)
              }}
            >
              Case Study ↗
            </button>
            <button
              className={styles.btnSecondary}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(project)
              }}
            >
              {project.secondaryBtnText}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function CaseStudyModal({ project, onClose }) {
  const { navigate } = useRouter()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const handleCtaClick = (e) => {
    e.preventDefault()
    onClose()
    navigate('#contact')
  }

  return (
    <motion.div
      className={styles.modalBackdrop}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <motion.div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.94, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 16, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {/* Close Button */}
        <button
          className={styles.modalCloseBtn}
          onClick={onClose}
          aria-label="Close case study modal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Hero Banner with Image */}
        <div className={styles.modalHeroBanner}>
          <img src={project.image} alt={project.name} className={styles.modalHeroImg} />
          <div className={styles.modalHeroOverlay} />
        </div>

        <div className={styles.modalBody}>
          {/* Modal Header */}
          <header className={styles.modalHeader}>
            <div className={styles.modalMetaRow}>
              <span className={styles.modalCategory}>
                {project.category} &middot; {project.year}
              </span>
              <div className={styles.statusBadge}>
                <span
                  className={styles.statusDot}
                  style={{ backgroundColor: project.accentColor }}
                />
                <span>{project.status}</span>
              </div>
            </div>

            <h2 className={styles.modalTitle} id="modal-project-title">
              {project.title}
            </h2>
            <p className={styles.modalSubtitle}>{project.subtitle}</p>
          </header>

          {/* Key Metrics Grid */}
          <div className={styles.modalMetricsGrid}>
            {project.metrics.map((m) => (
              <div key={m.label} className={styles.modalMetricCard}>
                <span className={styles.modalMetricNumber}>{m.value}</span>
                <span className={styles.modalMetricText}>{m.label}</span>
              </div>
            ))}
          </div>

          {/* Two-Column Challenge & Solution */}
          <div className={styles.modalColumns}>
            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                <span className={styles.modalSectionDot} />
                The Challenge
              </h3>
              <p className={styles.modalSectionBody}>{project.challenge}</p>
            </section>

            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                <span className={styles.modalSectionDot} />
                Engineering Solution
              </h3>
              <p className={styles.modalSectionBody}>{project.solution}</p>
            </section>
          </div>

          {/* Technical Architecture */}
          <section className={styles.modalSection}>
            <h3 className={styles.modalSectionTitle}>
              <span className={styles.modalSectionDot} />
              Key Architecture &amp; Delivery Highlights
            </h3>
            <ul className={styles.architectureList}>
              {project.architecture.map((item, idx) => (
                <li key={idx} className={styles.architectureItem}>
                  <span className={styles.architectureMarker}>▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Impact & Tech Stack */}
          <div className={styles.modalColumns}>
            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                <span className={styles.modalSectionDot} />
                Proven Impact
              </h3>
              <p className={styles.modalSectionBody}>{project.impact}</p>
            </section>

            <section className={styles.modalSection}>
              <h3 className={styles.modalSectionTitle}>
                <span className={styles.modalSectionDot} />
                Technology Stack
              </h3>
              <div className={styles.techPillsGrid}>
                {project.technologies.map((t) => (
                  <span key={t} className={styles.techPill}>
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Modal Footer */}
          <footer className={styles.modalFooter}>
            <div className={styles.modalFooterInfo}>
              <span className={styles.modalFooterLabel}>Client / Ecosystem:</span>
              <span className={styles.modalFooterClient}>{project.client}</span>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalSecondaryBtn} onClick={onClose}>
                Close
              </button>
              <a
                href="#contact"
                onClick={handleCtaClick}
                className={styles.modalPrimaryBtn}
              >
                Discuss a Similar Project &rarr;
              </a>
            </div>
          </footer>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section id="work" className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.container}>
        {/* Section Header */}
        <header className={styles.header}>
          <div className={styles.sectionTag}>
            <span className={styles.sectionTagDot} />
            <span>03 &middot; Selected Work</span>
          </div>
          <h2 className={styles.heading} id="projects-heading">
            Engineering with Impact. Built to Scale.
          </h2>
          <p className={styles.subheading}>
            A curated portfolio of production AI systems, geospatial WebGIS platforms, and offline-first
            field telemetry applications engineered for high-stakes domains.
          </p>
        </header>

        {/* 3-Column Dribbble Card Grid */}
        <div className={styles.grid} role="list">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
              delay={i * 0.12}
            />
          ))}
        </div>
      </div>

      {/* Case Study Popup Modal */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
