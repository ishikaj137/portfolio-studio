import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const RouterContext = createContext()

export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/'
    }
    return '/'
  })

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname || '/')
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const navigate = useCallback((to) => {
    if (typeof window === 'undefined') return

    // Full navigation for separate sub-app
    if (to === '/botway' || to.startsWith('/botway/')) {
      window.location.href = to
      return
    }

    // Navigating back to home or a section on home
    if (to.startsWith('/#') || to.startsWith('#')) {
      const hashTarget = to.replace(/^\//, '')
      window.history.pushState({}, '', '/' + hashTarget)
      setCurrentPath('/')
      setTimeout(() => {
        const el = document.querySelector(hashTarget)
        if (el) {
          if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: -30, duration: 1.2 })
          } else {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }, 50)
      return
    }

    if (to === '/' || to === '') {
      window.history.pushState({}, '', '/')
      setCurrentPath('/')
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    window.history.pushState({}, '', to)
    setCurrentPath(to)
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider')
  }
  return context
}
