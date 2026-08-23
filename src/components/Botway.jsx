import { useEffect, useRef, useState } from 'react'
import { useRouter } from '../RouterContext'
import botwayVideo from '../assets/commingsoonbotway.mp4'
import styles from './Botway.module.css'

export default function Botway() {
  const { navigate } = useRouter()
  const videoRef = useRef(null)
  const bgVideoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    document.title = 'Botway — Coming Soon'
    const prevBg = document.body.style.backgroundColor
    const prevOverflow = document.body.style.overflow
    document.body.style.backgroundColor = '#000000'
    document.body.style.overflow = 'hidden'

    videoRef.current?.play().catch(() => {})
    bgVideoRef.current?.play().catch(() => {})

    return () => {
      document.title = 'Latent Labs — AI, GIS & Product Engineering Studio'
      document.body.style.backgroundColor = prevBg
      document.body.style.overflow = prevOverflow
    }
  }, [])

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <div className={styles.container}>
      {/* Blurred background fill — fills any letterbox/pillarbox bars */}
      <video
        ref={bgVideoRef}
        className={styles.bgVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={botwayVideo} type="video/mp4" />
      </video>
      <div className={styles.bgTint} aria-hidden="true" />

      {/* Main video — full frame, no cropping */}
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={botwayVideo} type="video/mp4" />
        <source src="/commingsoonbotway.mp4" type="video/mp4" />
        <source src="/assets/commingsoonbotway.mp4" type="video/mp4" />
      </video>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          onClick={() => navigate('/')}
          className={styles.btn}
          aria-label="Back to Latent Labs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Latent Labs</span>
        </button>

        <button
          onClick={toggleSound}
          className={styles.btn}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
