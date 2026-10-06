import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScroll } from './lib/scroll'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Works from './components/Works'
import type { WorksApi } from './components/Works'
import Modal from './components/Modal'
import Statement from './components/Statement'
import Marquee from './components/Marquee'
import Process from './components/Process'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Footer from './components/Footer'

export default function App() {
  const [assetsReady, setAssetsReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [modal, setModal] = useState<{ index: number; rect: DOMRect } | null>(null)
  const worksApi = useRef<WorksApi | null>(null)

  useEffect(() => {
    const cleanup = initScroll()
    window.scrollTo(0, 0)
    history.scrollRestoration = 'manual'
    return cleanup
  }, [])

  useEffect(() => {
    let done = false
    const ok = () => { if (!done) { done = true; setAssetsReady(true) } }
    const v = document.createElement('video')
    v.preload = 'auto'
    v.muted = true
    v.src = '/video/showreel.mp4'
    v.addEventListener('canplaythrough', ok, { once: true })
    const timeout = setTimeout(ok, 5000)
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
    fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => clearTimeout(timeout)
  }, [])

  const onDone = useCallback(() => {
    setLoaded(true)
    ScrollTrigger.refresh()
  }, [])

  const open = useCallback((index: number, rect: DOMRect) => setModal({ index, rect }), [])
  const nav = useCallback((i: number) => {
    worksApi.current?.focus(i)
    setModal((m) => (m ? { ...m, index: i } : m))
  }, [])

  return (
    <>
      {!loaded && <Loader assetsReady={assetsReady} onDone={onDone} />}
      <Cursor />
      <div className="grain" />
      <Nav />
      <main>
        <Hero ready={loaded} />
        <Works apiRef={worksApi} onOpen={open} modalOpen={!!modal} />
        <Statement />
        <Marquee />
        <div id="process"><Process /></div>
        <Projects />
        <Experience />
        <Footer />
      </main>
      {modal && (
        <Modal
          index={modal.index}
          origin={modal.rect}
          getRect={(i) => worksApi.current?.rect(i) ?? null}
          onNav={nav}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
