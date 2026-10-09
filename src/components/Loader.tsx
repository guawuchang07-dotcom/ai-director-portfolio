import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function Loader({ assetsReady, onDone }: { assetsReady: boolean; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)
  const st = useRef({ v: 0, minDone: false, assets: false, finished: false })

  const paint = () => {
    if (num.current) num.current.textContent = String(Math.round(st.current.v)).padStart(2, '0')
    if (bar.current) bar.current.style.transform = `scaleX(${st.current.v / 100})`
  }

  const tryFinish = () => {
    const s = st.current
    if (s.finished || !s.minDone || !s.assets) return
    s.finished = true
    gsap
      .timeline({ onComplete: onDone })
      .to(s, { v: 100, duration: 0.5, ease: 'power2.out', onUpdate: paint })
      .to('.loader-top span, .loader-name span', { y: -16, opacity: 0, duration: 0.5, stagger: 0.04 }, '>-0.1')
      .to(num.current, { yPercent: -30, opacity: 0, duration: 0.7, ease: 'power3.in' }, '<')
      .to(root.current, { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, '>-0.2')
  }

  useGSAP(
    () => {
      gsap.to(st.current, {
        v: 92,
        duration: 2.1,
        ease: 'power2.inOut',
        onUpdate: paint,
        onComplete: () => { st.current.minDone = true; tryFinish() },
      })
    },
    { scope: root },
  )

  useEffect(() => {
    st.current.assets = assetsReady
    tryFinish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsReady])

  return (
    <div className="loader" ref={root}>
      <div className="loader-top mono">
        <span>Zhang Yuanbo</span>
        <span>Portfolio — 2026</span>
      </div>
      <div className="loader-center">
        <div className="loader-count" ref={num}>00</div>
        <div className="loader-bar"><i ref={bar} /></div>
      </div>
      <div className="loader-bot">
        <div className="loader-name mono"><span style={{ display: 'inline-block' }}>AI Director &amp; Content Creator<br />Loading showreel…</span></div>
      </div>
    </div>
  )
}
