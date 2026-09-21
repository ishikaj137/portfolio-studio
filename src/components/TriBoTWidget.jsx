import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from '../RouterContext'
import styles from './TriBoTWidget.module.css'

// =========================================================================
// MOCK RAG KNOWLEDGE BASE — Ministry of Tribal Affairs Policies
// In production, replace with real backend call (e.g., POST /api/tribot/chat)
// =========================================================================
const KNOWLEDGE_BASE = [
  {
    keywords: ['dajgua', 'dharti', 'gram utkarsh', 'abhiyan', 'what is dajgua', 'mission'],
    answer:
      'The Dharti Aaba Janjatiya Gram Utkarsh Abhiyan (DAJGUA) is a landmark national saturation initiative spanning over 63,000 tribal-majority villages across 549 districts. It orchestrates 17 central ministries across 25 targeted interventions, delivering pucca housing (PMAY-G), all-weather tap water (Jal Jeevan Mission), solar electrification, dedicated mobile medical clinics, and broadband 4G connectivity towers to unreached hamlets.',
    sources: ['📄 DAJGUA_Mission_Framework_2024.pdf', '📄 MoTA_InterMinisterial_Convergence.pdf'],
  },
  {
    keywords: ['fra', 'forest right', 'claim', 'patta', 'process', 'sdlc', 'dlc', 'gram sabha', 'procedure'],
    answer:
      'Under the Forest Rights Act (FRA) 2006, title adjudication proceeds through a statutory 3-tier architecture: (1) Gram Sabha & FRC: The village Forest Rights Committee registers claims, undertakes physical demarcations with forest/revenue officers, and passes formal resolutions; (2) SDLC (Sub-Divisional Committee): Reconciles cadastral overlaps and drafts title recommendations; (3) DLC (District Level Committee): Final judicial authority issuing title deeds for Individual (IFR) or Community Forest Rights (CFR).',
    sources: ['📄 FRA_2006_Statutory_Rules.pdf', '📄 MoTA_FRA_Standard_Operating_Procedure.pdf'],
  },
  {
    keywords: ['track', 'scheme', 'welfare', 'dapst', 'funding', 'budget', 'monitor', 'telemetry', 'how are'],
    answer:
      'Tribal welfare allocations are tracked via the Development Action Plan for Scheduled Tribes (DAPST) and MoTA’s integrated spatial telemetry portal. The platform unifies ministerial budget appropriations, audits Aadhaar-seeded Direct Benefit Transfers (DBT), verifies physical asset milestones through geo-tagged satellite telemetry, and benchmarks district-level governance KPIs in real time.',
    sources: ['📄 DAPST_Expenditure_Monitoring_System.pdf', '📄 PM-JANMAN_Telemetric_Tracking.pdf'],
  },
  {
    keywords: ['cfr', 'community', 'eligible', 'traditional', 'otfd', 'minor forest produce', 'mfp', 'who is eligible'],
    answer:
      'Community Forest Rights (CFR) under Section 3(1)(i) are granted to Gram Sabhas of Scheduled Tribes (STs) and Other Traditional Forest Dwellers (OTFDs). OTFD claimants must demonstrate customary residency and forest livelihood dependence for at least three generations (75 years prior to 13 Dec 2005). CFR vests sustainable ownership of minor forest produce (MFP), grazing pastures, water bodies, and community conservation areas.',
    sources: ['📄 FRA_Section_3_Community_Rights.pdf', '📄 CFR_Title_Issuance_Manual.pdf'],
  },
]

const DEFAULT_FALLBACK = {
  answer:
    'I am currently operating in sandboxed portfolio demo mode with grounded access to Ministry of Tribal Affairs mandates. I can provide verified policy guidance on: (1) DAJGUA infrastructure saturation, (2) Forest Rights Act (FRA) claim procedures, and (3) Tribal welfare tracking & DAPST telemetry. Try one of the suggested prompts below!',
  sources: ['📄 MoTA_Public_Information_Digest.pdf'],
}

const STARTER_PROMPTS = [
  'What is DAJGUA?',
  'Explain the FRA claim process',
  'How are tribal welfare schemes tracked?',
  'Who is eligible for Community Forest Rights?',
]

const MAX_QUERIES = 5
const STORAGE_KEY = 'tribot_demo_queries'

// =========================================================================
// SERVER-SIDE RATE LIMIT & API STUB
// In production, route requests to an edge endpoint (e.g. POST /api/tribot/chat)
// enforcing server-side Redis/Upstash IP rate-limiting (5 reqs/session per IP)
// to prevent client-side localStorage bypass:
//
// export async function queryTriBoTAPI(queryText, sessionToken) {
//   const res = await fetch('/api/tribot/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'X-Session-Token': sessionToken },
//     body: JSON.stringify({ query: queryText })
//   });
//   if (res.status === 429) throw new Error('Rate limit exceeded');
//   return res.json();
// }
// =========================================================================

export default function TriBoTWidget({ onClose, onOpenCaseStudy }) {
  const { navigate } = useRouter()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Retrieve or initialize query counter from localStorage
  const [queriesUsed, setQueriesUsed] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? Math.min(MAX_QUERIES, parseInt(stored, 10) || 0) : 0
    } catch {
      return 0
    }
  })

  const [inputVal, setInputVal] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  // Message history
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am TriBoT, the sovereign RAG knowledge assistant for India’s Ministry of Tribal Affairs. Ask me anything about tribal welfare policies, FRA land claims, or DAJGUA guidelines.',
      sources: ['📄 MoTA_Overview_2024.pdf'],
      completed: true,
    },
  ])

  // Save queriesUsed to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, queriesUsed.toString())
    } catch (e) {
      console.warn('localStorage access failed', e)
    }
  }, [queriesUsed])

  // Auto-scroll to bottom of message thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking, isStreaming])

  // Find matching answer from mock knowledge base
  const findAnswer = (query) => {
    const qLower = query.toLowerCase()
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some((kw) => qLower.includes(kw))) {
        return item
      }
    }
    return DEFAULT_FALLBACK
  }

  // Typewriter streaming effect for realistic RAG feel
  const streamBotResponse = (matchedItem, onComplete) => {
    const fullText = matchedItem.answer
    const words = fullText.split(' ')
    let currentIdx = 0

    const botMsgId = `bot-${Date.now()}`

    // Insert empty message placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: botMsgId,
        sender: 'bot',
        text: '',
        sources: matchedItem.sources,
        completed: false,
      },
    ])

    setIsStreaming(true)

    const interval = setInterval(() => {
      currentIdx++
      const partialText = words.slice(0, currentIdx).join(' ')

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, text: partialText } : msg
        )
      )

      if (currentIdx >= words.length) {
        clearInterval(interval)
        setIsStreaming(false)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, completed: true } : msg
          )
        )
        onComplete?.()
      }
    }, 28) // ~28ms per word simulates streaming SSE tokens
  }

  const handleSend = (textToSend) => {
    const query = (textToSend || inputVal).trim()
    if (!query || isThinking || isStreaming) return
    if (queriesUsed >= MAX_QUERIES) return

    // Append user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      completed: true,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal('')

    const nextQueriesCount = queriesUsed + 1
    setQueriesUsed(nextQueriesCount)

    // Simulate RAG retrieval latency (~700ms)
    setIsThinking(true)
    setTimeout(() => {
      setIsThinking(false)
      const matched = findAnswer(query)
      streamBotResponse(matched, () => {
        // Callback after response finishes typing
      })
    }, 750)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const remainingQueries = MAX_QUERIES - queriesUsed
  const isLimitReached = queriesUsed >= MAX_QUERIES && !isStreaming && !isThinking

  // Placeholder text changes based on remaining queries
  let placeholderText = 'Ask a tribal policy question...'
  if (remainingQueries === 1) {
    placeholderText = '1 question left — make it count...'
  } else if (remainingQueries <= 0) {
    placeholderText = 'Demo query limit reached'
  }

  return (
    <div
      className={styles.widgetContainer}
      onClick={(e) => e.stopPropagation()}
      role="region"
      aria-label="TriBoT Interactive AI Demo"
    >
      {/* ── HUD Header Bar ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatarWrapper}>
            <img src="/avatars/ai.jpg" alt="TriBoT" className={styles.botAvatar} />
            <span className={styles.onlineDot} />
          </div>

          <div className={styles.headerTitles}>
            <div className={styles.titleRow}>
              <span className={styles.botName}>TriBoT</span>
              <span className={styles.verifiedCheck} title="Verified Ministry System">✓</span>
              <span className={styles.ragBadge}>RAG AI</span>
            </div>
            <div className={styles.statusRow}>
              <span className={styles.statusPulse} />
              <span className={styles.statusText}>Online — Demo Mode</span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close TriBoT Demo"
            title="Close demo (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── HUD Metadata Telemetry Banner ── */}
      <div className={styles.hudStrip}>
        <span className={styles.hudItem}>[ MOTA-INDEX // V2.4 ]</span>
        <span className={styles.hudDivider}>•</span>
        <span className={styles.hudItem}>LATENCY: ~1.2s</span>
        <span className={styles.hudDivider}>•</span>
        <span className={styles.hudItem}>GROUNDED CITATIONS</span>
      </div>

      {/* ── Message Scroll Area ── */}
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${
              msg.sender === 'user' ? styles.userRow : styles.botRow
            }`}
          >
            {msg.sender === 'bot' && (
              <div className={styles.botAvatarMini}>
                <span>🤖</span>
              </div>
            )}

            <div className={styles.messageBubbleWrapper}>
              <div
                className={`${styles.bubble} ${
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble
                }`}
              >
                <p className={styles.messageText}>{msg.text}</p>
              </div>

              {/* Source citations under bot response */}
              {msg.sender === 'bot' && msg.sources && msg.sources.length > 0 && (
                <div
                  className={`${styles.sourcesRow} ${
                    msg.completed ? styles.sourcesVisible : styles.sourcesHidden
                  }`}
                >
                  <span className={styles.sourcesLabel}>Sources:</span>
                  {msg.sources.map((src, sIdx) => (
                    <span key={sIdx} className={styles.sourceChip}>
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 3-dot thinking pulse animation */}
        {isThinking && (
          <div className={`${styles.messageRow} ${styles.botRow}`}>
            <div className={styles.botAvatarMini}>
              <span>🤖</span>
            </div>
            <div className={`${styles.bubble} ${styles.botBubble} ${styles.thinkingBubble}`}>
              <div className={styles.typingDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
              <span className={styles.thinkingText}>Querying vector embeddings...</span>
            </div>
          </div>
        )}

        {/* ── Final inline limit reached banner (after 5th answer completes) ── */}
        {isLimitReached && (
          <motion.div
            className={styles.limitBanner}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.limitHeader}>
              <span className={styles.limitIcon}>⚡</span>
              <span className={styles.limitTitle}>
                You’ve reached the demo limit (5/5 queries used).
              </span>
            </div>
            <p className={styles.limitDesc}>
              Want to deploy an enterprise RAG knowledge engine or discuss sovereign AI architecture?
            </p>
            <div className={styles.limitActions}>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                  navigate('#contact')
                }}
                className={styles.limitPrimaryBtn}
              >
                Contact me →
              </a>
              <button
                onClick={() => {
                  onClose()
                  onOpenCaseStudy?.()
                }}
                className={styles.limitSecondaryBtn}
              >
                View full case study →
              </button>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Starter Prompts (Show when message thread is fresh & queries remain) ── */}
      {messages.length <= 3 && !isLimitReached && (
        <div className={styles.starterPrompts}>
          <div className={styles.promptsScroll}>
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className={styles.promptChip}
                onClick={() => handleSend(prompt)}
                disabled={isThinking || isStreaming}
              >
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer Input & Usage Indicator Bar ── */}
      {!isLimitReached ? (
        <div className={styles.inputSection}>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              type="text"
              className={styles.textInput}
              value={inputVal}
              placeholder={placeholderText}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isThinking || isStreaming}
              maxLength={200}
            />
            <button
              className={styles.sendBtn}
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isThinking || isStreaming}
              aria-label="Send Query"
            >
              <svg className={styles.sendIcon} viewBox="0 0 16 16" fill="currentColor">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.55a.5.5 0 0 1-.928.026L6.5 9.5 1.737 6.783a.5.5 0 0 1 .026-.928L16.314.036a.5.5 0 0 1 .54.11z" />
              </svg>
            </button>
          </div>

          {/* 5-dot subtle query limit indicator */}
          <div className={styles.usageIndicator}>
            <div className={styles.dotsGroup}>
              {Array.from({ length: MAX_QUERIES }).map((_, i) => (
                <span
                  key={i}
                  className={`${styles.usageDot} ${
                    i < queriesUsed ? styles.dotFilled : styles.dotEmpty
                  }`}
                />
              ))}
            </div>
            <span className={styles.usageLabel}>
              {remainingQueries > 0
                ? `${remainingQueries} demo ${remainingQueries === 1 ? 'query' : 'queries'} left`
                : 'Limit reached'}
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.footerEnded}>
          <div className={styles.dotsGroup}>
            {Array.from({ length: MAX_QUERIES }).map((_, i) => (
              <span key={i} className={`${styles.usageDot} ${styles.dotFilled}`} />
            ))}
          </div>
          <span className={styles.usageLabel}>Demo session complete</span>
        </div>
      )}
    </div>
  )
}
