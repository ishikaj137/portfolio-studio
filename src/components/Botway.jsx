import { useEffect } from 'react'
import botwayVideo from '../assets/commingsoon.mp4'
import botwayPoster from '../assets/commingsoon.png'
import styles from './Botway.module.css'

export default function Botway() {
  useEffect(() => {
    document.title = 'Botway — AI Chatbot Platform'
    const prevBg = document.body.style.backgroundColor
    const prevOverflow = document.body.style.overflow
    document.body.style.backgroundColor = '#0a0118'
    document.body.style.overflow = 'hidden'

    return () => {
      document.title = 'Latent Labs — AI, GIS & Product Engineering Studio'
      document.body.style.backgroundColor = prevBg
      document.body.style.overflow = prevOverflow
    }
  }, [])

  return (
    <div className={styles.container}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={botwayPoster}
      >
        <source src={botwayVideo} type="video/mp4" />
        <source src="/assets/botway-hero.webm" type="video/webm" />
        <source src="/assets/botway-hero.mp4" type="video/mp4" />
        <source src="/commingsoon.mp4" type="video/mp4" />
        <source src="/assest/commingsoon.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
