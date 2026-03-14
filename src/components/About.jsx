import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './About.module.css'

const EASE = [0.16, 1, 0.3, 1]

const TEAM = [
  {
    name: 'Jayesh Malviya',
    role: 'Co-founder & AI Engineer',
    bio: 'Specialises in WebGIS platforms and spatial data infrastructure. Contributed to forest rights mapping across eleven Indian states.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Ishika Jain',
    role: 'Co-founder & AI Engineer',
    bio: 'Builds RAG systems and AI pipelines. Has worked on government AI tools deployed at national scale across tribal welfare and civic data.',
    github: '#',
    linkedin: '#',
  },
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
            A small studio. Serious work.
          </h2>
          <p className={styles.studioText}>
            Latent Labs is a small AI and geospatial studio. We build tools that are useful,
            accurate, and built to last — for organizations that care about impact.
          </p>
          <p className={styles.studioText}>
            We have worked on government AI projects, forest rights mapping platforms,
            and civic technology tools across India.
          </p>
        </motion.div>

        {/* Vertical divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Right — team */}
        <motion.div
          className={styles.team}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {TEAM.map(member => (
            <motion.div
              key={member.name}
              className={styles.member}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              <p className={styles.memberName}>{member.name}</p>
              <p className={styles.memberRole}>{member.role}</p>
              <p className={styles.memberBio}>{member.bio}</p>
              <div className={styles.memberLinks}>
                <a href={member.github} className={styles.memberLink} aria-label={`${member.name} GitHub`}>
                  GitHub &rarr;
                </a>
                <a href={member.linkedin} className={styles.memberLink} aria-label={`${member.name} LinkedIn`}>
                  LinkedIn &rarr;
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
