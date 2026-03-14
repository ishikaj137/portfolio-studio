import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Projects.module.css'

const EASE = [0.16, 1, 0.3, 1]

const PROJECTS = [
  {
    year: '2024',
    name: 'TriBoT',
    desc: 'AI chatbot helping tribal citizens navigate the Forest Rights Act through document search and plain-language answers.',
    tags: ['AI', 'RAG', 'Python', 'Government'],
    href: '#',
  },
  {
    year: '2024',
    name: 'FRA Atlas',
    desc: 'WebGIS platform for forest rights mapping across India, built in collaboration with the Ministry of Tribal Affairs.',
    tags: ['GIS', 'React', 'Leaflet', 'Government'],
    href: '#',
  },
  {
    year: '2023',
    name: 'Land Geotagging App',
    desc: 'Mobile application for field-level land parcel mapping and structured data collection in rural areas.',
    tags: ['Flutter', 'GIS', 'Data Collection'],
    href: '#',
  },
]

function ProjectRow({ project, delay }) {
  const ref = useRef()
  const isInView = useInView(ref, { once: true, margin: '-60px' })

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
          className={styles.caseLink}
          aria-label={`View ${project.name} case study`}
        >
          View case study &rarr;
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
