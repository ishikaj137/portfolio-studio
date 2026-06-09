import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Services.module.css'

const EASE = [0.16, 1, 0.3, 1]

const SERVICES = [
  {
    name: 'AI & Intelligence',
    preview: 'ai',
    desc: 'Intelligent digital systems for search, support, knowledge access, and assisted work.',
    tag: 'Intelligence',
    accent: 'ai',
    items: [
      'AI Chatbots',
      'RAG Systems',
      'AI Agents',
      'Knowledge Bases',
      'Document Intelligence',
      'WhatsApp AI Assistants',
      'Voice AI Solutions',
    ],
  },
  {
    name: 'Web & Product Engineering',
    preview: 'product',
    desc: 'Scalable platforms and applications for startups, enterprises, NGOs, and public-sector teams.',
    tag: 'Product',
    accent: 'product',
    items: [
      'Startup Websites',
      'SaaS Platforms',
      'Full-Stack Applications',
      'Admin Dashboards',
      'API Development',
      'System Integrations',
    ],
  },
  {
    name: 'GIS & Geospatial',
    preview: 'gis',
    desc: 'Geospatial technology for mapping, field operations, spatial analysis, and decision support.',
    tag: 'Geospatial',
    accent: 'gis',
    items: [
      'WebGIS Platforms',
      'Interactive Maps',
      'Land Mapping Systems',
      'Geotagging Applications',
      'Survey Dashboards',
      'Spatial Analytics',
    ],
  },
  {
    name: 'Design & Experience',
    preview: 'design',
    desc: 'Human-centered interfaces for complex products, operational tools, and mobile workflows.',
    tag: 'Design',
    accent: 'design',
    items: [
      'UI/UX Design',
      'Product Design',
      'Design Systems',
      'Product Prototyping',
      'Mobile Experiences',
    ],
  },
  {
    name: 'Automation & Data',
    preview: 'automation',
    desc: 'Automated workflows and data systems that reduce manual effort and surface better insight.',
    tag: 'Automation',
    accent: 'automation',
    items: [
      'Workflow Automation',
      'Internal Tools',
      'Analytics Dashboards',
      'Data Pipelines',
      'Business Process Automation',
    ],
  },
]

/* ── AI Preview: chatbot + RAG knowledge flow ── */
function AiPreview() {
  return (
    <div className={`${styles.preview} ${styles.aiPreview}`} aria-hidden="true">
      {/* ambient glow */}
      <div className={styles.aiGlow} />

      {/* window chrome dots */}
      <div className={styles.previewTop}>
        <span className={styles.dotRed} />
        <span className={styles.dotYellow} />
        <span className={styles.dotGreen} />
      </div>

      {/* model label */}
      <div className={styles.aiModelLabel}>
        <span className={styles.aiModelDot} />
        GPT-4o · RAG enabled
      </div>

      {/* chat messages */}
      <div className={styles.chatPanel}>
        <div className={`${styles.message} ${styles.messageUser}`}>
          Find MoTA scheme details
        </div>
        <div className={`${styles.message} ${styles.messageBot}`}>
          <span className={styles.botCursor} />
          Searching verified knowledge base…
        </div>

        {/* RAG pipeline strip */}
        <div className={styles.ragStrip}>
          <span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" /><line x1="2.5" y1="3" x2="5.5" y2="3" stroke="currentColor" strokeWidth="0.8" /><line x1="2.5" y1="4.5" x2="4.5" y2="4.5" stroke="currentColor" strokeWidth="0.8" /></svg>
            Policy PDF
          </span>
          <span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="2.5" stroke="currentColor" strokeWidth="0.9" /><line x1="4" y1="1" x2="4" y2="2" stroke="currentColor" strokeWidth="0.8" /><line x1="4" y1="6" x2="4" y2="7" stroke="currentColor" strokeWidth="0.8" /><line x1="1" y1="4" x2="2" y2="4" stroke="currentColor" strokeWidth="0.8" /><line x1="6" y1="4" x2="7" y2="4" stroke="currentColor" strokeWidth="0.8" /></svg>
            Vector Search
          </span>
          <span>
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><polyline points="1,5 3,3 5,4.5 7,2" stroke="currentColor" strokeWidth="0.9" fill="none" /></svg>
            Grounded
          </span>
        </div>
      </div>

      {/* floating doc ghost */}
      <div className={styles.docPanel}>
        <span /><span /><span />
      </div>
    </div>
  )
}

/* ── Product Preview: SaaS dashboard with cyan accents ── */
function ProductPreview() {
  return (
    <div className={`${styles.preview} ${styles.productPreview}`} aria-hidden="true">
      <div className={styles.productGlow} />
      <div className={styles.previewTop}>
        <span className={styles.dotRed} />
        <span className={styles.dotYellow} />
        <span className={styles.dotGreen} />
      </div>

      {/* nav strip */}
      <div className={styles.dashNav}>
        <span className={styles.dashNavActive}>Overview</span>
        <span>Users</span>
        <span>Billing</span>
        <span>API</span>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.metricCard}>
          <small>ARR</small>
          <strong className={styles.metricCyan}>$82K</strong>
          <div className={styles.metricTrend}>↑ 14%</div>
        </div>
        <div className={styles.metricCard}>
          <small>MAU</small>
          <strong className={styles.metricCyan}>14.8K</strong>
          <div className={styles.metricTrend}>↑ 8%</div>
        </div>
        <div className={styles.chartCard}>
          <span /><span /><span /><span /><span />
        </div>
        <div className={styles.tableCard}>
          <div className={styles.tableRow}><span style={{ width: '62%' }} /><span className={styles.tableStatus} /></div>
          <div className={styles.tableRow}><span style={{ width: '78%' }} /><span className={styles.tableStatus} /></div>
          <div className={styles.tableRow}><span style={{ width: '44%' }} /><span className={styles.tableStatus} /></div>
        </div>
      </div>
    </div>
  )
}

/* ── GIS Preview: interactive map with green layers ── */
function GisPreview() {
  return (
    <div className={`${styles.preview} ${styles.gisPreview}`} aria-hidden="true">
      <div className={styles.gisGlow} />

      {/* toolbar tabs */}
      <div className={styles.mapChrome}>
        <span className={styles.mapTabActive}>Layers</span>
        <span>Survey</span>
        <span>Analytics</span>
        <div className={styles.mapZoom}>
          <button>+</button>
          <button>−</button>
        </div>
      </div>

      {/* map canvas */}
      <div className={styles.mapArea}>
        <div className={styles.mapHeat} />
        {/* grid lines */}
        <div className={styles.mapGrid} />
        {/* region outlines */}
        <div className={styles.mapRegion1} />
        <div className={styles.mapRegion2} />
        {/* pins */}
        <span className={`${styles.pin} ${styles.pinOne}`} />
        <span className={`${styles.pin} ${styles.pinTwo}`} />
        <span className={`${styles.pin} ${styles.pinThree}`} />
        {/* data panel */}
        <div className={styles.mapPanel}>
          <small>Forest rights layer</small>
          <strong>1,248 parcels</strong>
          <div className={styles.mapBar}><div className={styles.mapBarFill} /></div>
        </div>
        {/* layer legend */}
        <div className={styles.mapLegend}>
          <span className={`${styles.legendDot} ${styles.legendGreen}`} />Classified
          <span className={`${styles.legendDot} ${styles.legendAmber}`} />Pending
        </div>
      </div>
    </div>
  )
}

/* ── Design Preview ── */
function DesignPreview() {
  return (
    <div className={`${styles.preview} ${styles.designPreview}`} aria-hidden="true">
      <div className={styles.designToolbar}>
        <span /><span /><span /><span />
      </div>
      <div className={styles.designCanvas}>
        <div className={styles.mobileFrame}>
          <span /><span /><span />
        </div>
        <div className={styles.flowFrame}>
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

/* ── Automation Preview ── */
function AutomationPreview() {
  return (
    <div className={`${styles.preview} ${styles.automationPreview}`} aria-hidden="true">
      <div className={styles.workflow}>
        <span className={styles.workflowNode}>Form</span>
        <span className={styles.workflowNode}>AI</span>
        <span className={styles.workflowNode}>CRM</span>
        <span className={styles.workflowNode}>Report</span>
      </div>
      <div className={styles.pipelineBars}>
        <span /><span /><span />
      </div>
    </div>
  )
}

function ServicePreview({ type }) {
  if (type === 'ai') return <AiPreview />
  if (type === 'product') return <ProductPreview />
  if (type === 'gis') return <GisPreview />
  if (type === 'design') return <DesignPreview />
  return <AutomationPreview />
}

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
            className={`${styles.card} ${styles[`card--${svc.accent}`]}`}
            aria-labelledby={`svc-${svc.name.replace(/\s/g, '-')}`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <ServicePreview type={svc.preview} />
            <span className="tag" style={{ marginBottom: 16 }}>{svc.tag}</span>
            <h3
              className={styles.cardName}
              id={`svc-${svc.name.replace(/\s/g, '-')}`}
            >
              {svc.name}
            </h3>
            <p className={styles.cardDesc}>{svc.desc}</p>
            <ul className={styles.serviceList} aria-label={`${svc.name} capabilities`}>
              {svc.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
