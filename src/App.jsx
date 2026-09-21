import { ThemeProvider } from './ThemeContext'
import { RouterProvider } from './RouterContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import GlowCursor from './components/GlowCursor'

function AppContent() {
  return (
    <RouterProvider>
      <GlowCursor
        global
        color="#cd445d"
        secondaryColor="#a7a7a7"
        trailLength={42}
        trailWidth={10}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={1}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
    </RouterProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
