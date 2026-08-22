import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const RouterContext = createContext()

export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '')
      const hash = window.location.hash.toLowerCase()
      if (path === '/botway' || hash === '#/botway' || hash === '#botway') {
        return '/botway'
      }
      return window.location.pathname || '/'
    }
    return '/'
  })

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '')
      const hash = window.location.hash.toLowerCase()
      if (path === '/botway' || hash === '#/botway' || hash === '#botway') {
        setCurrentPath('/botway')
      } else {
        setCurrentPath(window.location.pathname || '/')
      }
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

    if (to === '/botway') {
      window.history.pushState({}, '', '/botway')
      setCurrentPath('/botway')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Navigating back to home or a section on home
    if (to.startsWith('/#') || to.startsWith('#')) {
      const hashTarget = to.replace(/^\//, '')
      if (currentPath === '/botway') {
        window.history.pushState({}, '', '/' + hashTarget)
        setCurrentPath('/')
        setTimeout(() => {
          const el = document.querySelector(hashTarget)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 80)
      } else {
        const el = document.querySelector(hashTarget)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    if (to === '/' || to === '') {
      window.history.pushState({}, '', '/')
      setCurrentPath('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.history.pushState({}, '', to)
    setCurrentPath(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPath])

  const isBotway = currentPath === '/botway'

  return (
    <RouterContext.Provider value={{ currentPath, navigate, isBotway }}>
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
