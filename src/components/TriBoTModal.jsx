import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from '../RouterContext'
import styles from './TriBoTModal.module.css'

const EASE = [0.16, 1, 0.3, 1]

const KEY_BENCHMARKS = [
  {
    val: '15,000+',
    lbl: 'Gazettes & Acts Parsed',
    detail: 'OCR & Hierarchical Chunking',
  },
  {
    val: '< 1.2s',
    lbl: 'End-to-End Latency',
    detail: 'Hybrid Dense + BM25 Vector Query',
  },
  {
    val: '100%',
    lbl: 'Source Attribution SLA',
    detail: 'Deterministic Page-Level Citations',
  },
  {
    val: '11+',
    lbl: 'Dialects Supported',
    detail: 'Sovereign Multilingual Guardrails',
  },
]

const TECH_GROUPS = [
  { group: 'Retrieval & Indexing', items: ['PostgreSQL', 'pgvector', 'BM25 Keyword Engine', 'Qdrant Vector DB'] },
  { group: 'Backend & Ingestion', items: ['FastAPI', 'Python', 'PyPDF / Tesseract OCR', 'LangChain Core'] },
  { group: 'Deployment & SLA', items: ['Docker CUG Container', 'Air-Gapped Ready', 'Strict Attribution SLA'] },
]

export default function TriBoTModal({ project, onClose, initialTab = 'overview' }) {
  const { navigate } = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab) // 'overview' | 'demo'

  // Manage body scroll lock & escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Stop Lenis background scrolling while modal is active
    window.__lenis?.stop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      // Resume Lenis background scrolling on close
      window.__lenis?.start()
    }
  }, [onClose])

  return (
    <motion.div
      className={styles.modalBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      data-lenis-prevent="true"
    >
      <motion.div
        className={styles.modalContainer}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        role="dialog"
        aria-modal="true"
        aria-label="TriBoT Project Showcase"
      >
        {/* ── Persistent Modal Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatarWrap}>
              <img src="/avatars/tribot-avatar.png" alt="TriBoT" className={styles.avatarImg} />
              <span className={styles.onlineDot} />
            </div>
            <div className={styles.headerTitleGroup}>
              <div className={styles.nameRow}>
                <span className={styles.botTitle}>TriBoT</span>
                <span className={styles.checkBadge} title="Verified Ministry System">✓</span>
                <span className={styles.ragBadge}>SOVEREIGN RAG</span>
              </div>
              <span className={styles.headerSub}>Ministry of Tribal Affairs, Govt. of India</span>
            </div>
          </div>

          {/* 2-Tab Stage Switcher */}
          <div className={styles.tabsNav} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'overview'}
              className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span>Case Study</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'demo'}
              className={`${styles.tabBtn} ${activeTab === 'demo' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('demo')}
            >
              <span className={styles.sparkleIcon}>✦</span>
              <span>Live Assistant Demo</span>
            </button>
          </div>

          {/* Close button */}
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* ── Modal Stage Body (Crossfade Transition) ── */}
        <div className={styles.stageBody}>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              /* ── STAGE 1: OVERVIEW ── */
              <motion.div
                key="stage-overview"
                className={styles.overviewPane}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: EASE }}
                data-lenis-prevent="true"
              >
                {/* Bespoke Project Header (No generic AI stock photos!) */}
                <div className={styles.overviewHero}>
                  <div className={styles.heroLeftCol}>
                    <div className={styles.heroTaglinePill}>
                      <span className={styles.heroTaglineDot} />
                      <span>MINISTRY OF TRIBAL AFFAIRS · PRODUCTION SYSTEM</span>
                    </div>
                    <h2 className={styles.overviewTitle}>
                      TriBoT Sovereign AI Platform
                    </h2>
                    <p className={styles.overviewTagline}>
                      Production RAG knowledge engine grounding 15,000+ pages of legal gazettes, Forest Rights Act entitlements, and DAJGUA ministerial circulars into instant, verified policy intelligence with strict page-level attribution.
                    </p>
                    <div className={styles.heroBadgesRow}>
                      <span className={styles.heroBadge}>⚡ Sub-Second Retrieval</span>
                      <span className={styles.heroBadge}>🛡️ Closed-User-Group (CUG)</span>
                      <span className={styles.heroBadge}>🎯 Zero Hallucination SLA</span>
                    </div>
                  </div>

                  {/* Right: Authentic Mascot Presentation */}
                  <div className={styles.heroMascotWrap}>
                    <div className={styles.heroMascotAura} />
                    <img
                      src="/projects/tribot-mascot.png"
                      alt="TriBoT Sovereign AI Assistant"
                      className={styles.heroMascotImg}
                    />
                    <div className={styles.heroMascotBaseGlow} />
                  </div>
                </div>

                {/* ── 4-Card Operational Benchmark Grid ── */}
                <div className={styles.statsSection}>
                  <div className={styles.statsGrid}>
                    {KEY_BENCHMARKS.map((chip, idx) => (
                      <div key={idx} className={styles.statChip}>
                        <span className={styles.statVal}>{chip.val}</span>
                        <span className={styles.statLbl}>{chip.lbl}</span>
                        <span className={styles.statDetail}>{chip.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Problem vs Solution Structured Engineering Cards ── */}
                <div className={styles.narrativeGrid}>
                  <div className={styles.narrativeCol}>
                    <div className={styles.narrativeHeaderWrap}>
                      <span className={styles.narrativeTagRed}>CHALLENGE</span>
                      <h3 className={styles.narrativeHeader}>The Administrative Challenge</h3>
                    </div>
                    <ul className={styles.challengeList}>
                      <li>
                        <strong>15,000+ Unstructured Pages:</strong> Decades of legal gazettes, state circulars, and tribal welfare guidelines existed across fragmented scanned PDFs.
                      </li>
                      <li>
                        <strong>Verification Bottlenecks:</strong> Field officers and district collectors faced steep delays searching through complex legal clauses to adjudicate forest claims.
                      </li>
                      <li>
                        <strong>Unacceptable Hallucination Risk:</strong> Public LLMs hallucinate state policies, creating catastrophic legal risks for statutory entitlements.
                      </li>
                    </ul>
                  </div>

                  <div className={styles.narrativeCol}>
                    <div className={styles.narrativeHeaderWrap}>
                      <span className={styles.narrativeTagGreen}>SOLUTION</span>
                      <h3 className={styles.narrativeHeader}>The Sovereign Solution</h3>
                    </div>
                    <ul className={styles.solutionList}>
                      <li>
                        <strong>Sovereign CUG Deployment:</strong> Closed-user-group architecture running on protected government infrastructure with zero data leakage.
                      </li>
                      <li>
                        <strong>Hybrid Dense-Sparse Indexing:</strong> Dual-pipeline fusing BM25 exact keyword matching with dense pgvector semantic embeddings.
                      </li>
                      <li>
                        <strong>Deterministic Citations:</strong> Every output links directly to the exact ministry circular, gazette date, and page number for verified auditing.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ── Architecture Pipeline Blueprint Card ── */}
                <div className={styles.archDiagramCard}>
                  <div className={styles.archHeader}>
                    <div className={styles.archTitleGroup}>
                      <span className={styles.archLabel}>[ SYSTEM ARCHITECTURE // DETERMINISTIC RAG ]</span>
                      <span className={styles.archSub}>Sub-second Grounded Retrieval Pipeline</span>
                    </div>
                    <span className={styles.archBadge}>Zero Hallucination SLA</span>
                  </div>
                  <div className={styles.pipelineFlow}>
                    <div className={styles.pipelineStep}>
                      <span className={styles.stepNum}>01</span>
                      <span className={styles.stepTitle}>Ingest &amp; OCR</span>
                      <span className={styles.stepDesc}>Ministerial Gazettes &amp; Circulars</span>
                    </div>
                    <span className={styles.flowArrow}>→</span>
                    <div className={styles.pipelineStep}>
                      <span className={styles.stepNum}>02</span>
                      <span className={styles.stepTitle}>Semantic Chunking</span>
                      <span className={styles.stepDesc}>Domain-Tuned Token Windows</span>
                    </div>
                    <span className={styles.flowArrow}>→</span>
                    <div className={styles.pipelineStep}>
                      <span className={styles.stepNum}>03</span>
                      <span className={styles.stepTitle}>Hybrid Vector DB</span>
                      <span className={styles.stepDesc}>BM25 + pgvector Embeddings</span>
                    </div>
                    <span className={styles.flowArrow}>→</span>
                    <div className={styles.pipelineStep}>
                      <span className={styles.stepNum}>04</span>
                      <span className={styles.stepTitle}>Cross-Encoder &amp; Cite</span>
                      <span className={styles.stepDesc}>Strict Page Citations</span>
                    </div>
                  </div>
                </div>

                {/* ── Categorized Tech Stack ── */}
                <div className={styles.techSection}>
                  <span className={styles.techLabel}>Production Technology Stack:</span>
                  <div className={styles.techGroupsWrap}>
                    {TECH_GROUPS.map((grp, gIdx) => (
                      <div key={gIdx} className={styles.techGroupCard}>
                        <span className={styles.techGroupTitle}>{grp.group}</span>
                        <div className={styles.techPills}>
                          {grp.items.map((item, idx) => (
                            <span key={idx} className={styles.techPill}>{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Overview Bottom Action Row ── */}
                <div className={styles.overviewFooter}>
                  <div className={styles.footerInfo}>
                    <span>Client: </span>
                    <strong>Ministry of Tribal Affairs, Govt. of India</strong>
                  </div>
                  <div className={styles.footerActions}>
                    <button
                      className={styles.stageCtaBtn}
                      onClick={() => setActiveTab('demo')}
                    >
                      <span className={styles.sparkleIcon}>✦</span>
                      <span>Launch TriBoT Live Demo →</span>
                    </button>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault()
                        onClose()
                        navigate('#contact')
                      }}
                      className={styles.secondaryCtaBtn}
                    >
                      Contact Engineering →
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── STAGE 2: LIVE DEMO (User's Actual MoTA Chatbot) ── */
              <motion.div
                key="stage-demo"
                className={styles.actualDemoPane}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25, ease: EASE }}
                data-lenis-prevent="true"
              >
                <iframe
                  src="/tribot_widget/index.html?embedded=true"
                  className={styles.actualChatbotIframe}
                  title="TriBoT Official MoTA Assistant"
                  data-lenis-prevent="true"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
