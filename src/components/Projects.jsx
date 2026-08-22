import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRouter } from '../RouterContext'
import styles from './Projects.module.css'

const EASE = [0.16, 1, 0.3, 1]

const PROJECTS = [
  {
    year: '2024',
    name: 'TriBoT',
    desc: 'AI-powered chatbot developed for the Ministry of Tribal Affairs using RAG architecture to provide intelligent access to government schemes and policy information.',
    challenge: 'Government scheme and policy information was difficult to search, interpret, and explain consistently across users.',
    solution: 'Built a retrieval-augmented AI assistant that grounds answers in trusted documents and responds in accessible language.',
    technologies: ['OpenAI', 'LangChain', 'Python', 'FastAPI', 'RAG'],
    impact: 'Improved access to policy knowledge and reduced friction for teams and citizens seeking reliable answers.',
    tags: ['AI', 'RAG', 'Government'],
    href: '#',
  },
  {
    year: '2024',
    name: 'FRA Atlas',
    desc: 'Interactive WebGIS platform for geospatial visualization and analysis of forest rights and land-related datasets.',
    challenge: 'Forest rights and land datasets needed a clear geospatial interface for exploration, comparison, and analysis.',
    solution: 'Engineered a WebGIS platform with interactive map layers, spatial data views, and analysis-ready workflows.',
    technologies: ['React', 'Leaflet', 'Mapbox', 'PostgreSQL', 'GIS'],
    impact: 'Enabled more usable spatial insight for public-sector planning, review, and field-aligned decision-making.',
    tags: ['GIS', 'WebGIS', 'Government'],
    href: '#',
  },
  {
    year: '2023',
    name: 'Land Mapping App',
    desc: 'Mobile geotagging and survey application designed for efficient field data collection and mapping.',
    challenge: 'Field teams needed a faster way to capture location-linked survey data with fewer manual handoffs.',
    solution: 'Designed a mobile-first geotagging workflow for structured surveys, map-linked records, and cleaner data collection.',
    technologies: ['Mobile', 'GIS', 'Geotagging', 'Survey Data'],
    impact: 'Reduced field-data friction and improved the reliability of land mapping and survey operations.',
    tags: ['Mobile', 'GIS', 'Survey'],
    href: '#',
  },
]

function ProjectRow({ project, delay }) {
  const ref = useRef()
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const { navigate } = useRouter()

  const handleLinkClick = (e) => {
    if (project.href.startsWith('/')) {
      e.preventDefault()
      navigate(project.href)
    }
  }

  return (
    <motion.article
      ref={ref}
      className={styles.row}
      aria-labelledby={`proj-${project.name.replace(/\s/g, '-')}`}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      <div className={styles.left}>
        <span className={styles.year}>{project.year}</span>
        <div>
          <h3 className={styles.name} id={`proj-${project.name.replace(/\s/g, '-')}`}>
            {project.name}
          </h3>
          <p className={styles.desc}>{project.desc}</p>
          <dl className={styles.caseDetails}>
            <div>
              <dt>Challenge</dt>
              <dd>{project.challenge}</dd>
            </div>
            <div>
              <dt>Solution</dt>
              <dd>{project.solution}</dd>
            </div>
            <div>
              <dt>Technologies Used</dt>
              <dd>{project.technologies.join(', ')}</dd>
            </div>
            <div>
              <dt>Impact</dt>
              <dd>{project.impact}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.tags}>
          {project.tags.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <a
          href={project.href}
          onClick={handleLinkClick}
          className={styles.caseLink}
          aria-label={`View ${project.name} case study`}
        >
          {project.ctaText || 'View case study →'}
        </a>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section id="work" className={styles.section} aria-labelledby="projects-heading">
      <div className={styles.header}>
        <p className="mono-label">Selected Work</p>
      </div>

      <div className={styles.list} role="list">
        {PROJECTS.map((project, i) => (
          <ProjectRow key={project.name} project={project} delay={i * 0.08} />
        ))}
      </div>
    </section>
  )
}
