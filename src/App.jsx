import { ThemeProvider } from './ThemeContext'
import { RouterProvider } from './RouterContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Projects />
          <About />
          <Contact />
        </main>
      </RouterProvider>
    </ThemeProvider>
  )
}
