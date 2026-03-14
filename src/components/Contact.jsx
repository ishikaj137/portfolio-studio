import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Contact.module.css'

const EASE = [0.16, 1, 0.3, 1]

const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:hello@latentlabs.in', text: 'hello@latentlabs.in' },
  { label: 'Schedule a call', href: 'https://calendly.com', text: 'Book a call →', external: true },
  { label: 'GitHub', href: 'https://github.com', text: 'See our code →', external: true },
]

export default function Contact() {
  const ref = useRef()
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <>
      <section id="contact" className={styles.section} aria-labelledby="contact-heading">
        <div className={styles.header}>
          <p className="mono-label">Work with us</p>
        </div>

        <motion.div
          ref={ref}
          className={styles.inner}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <h2 className={styles.heading} id="contact-heading">
              Let&rsquo;s build something.
            </h2>
            <p className={styles.sub}>
              We take on select projects. If you are building something that needs AI, maps, or
              both — reach out.
            </p>
          </motion.div>

          <motion.div
            className={styles.links}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {CONTACT_LINKS.map(item => (
              <motion.div
                key={item.label}
                className={styles.linkItem}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                }}
              >
                <p className={styles.linkLabel}>{item.label}</p>
                <a
                  href={item.href}
                  className={styles.linkText}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.text}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <span className={styles.footerBrand}>Latent Labs</span>
          <span className={styles.footerMeta}>Bhopal, India &middot; 2025</span>
        </div>
      </footer>
    </>
  )
}
