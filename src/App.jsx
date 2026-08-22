import { ThemeProvider } from './ThemeContext'
import { RouterProvider, useRouter } from './RouterContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Botway from './components/Botway'

function AppContent() {
  const { isBotway } = useRouter()

  if (isBotway) {
    return <Botway />
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  )
}
