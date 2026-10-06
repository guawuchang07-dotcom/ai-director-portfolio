import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PROJECTS } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Projects() {
  const root = useRef<HTMLElement>(null)
  const bodies = useRef<(HTMLDivElement | null)[]>([])
  const [open, setOpen] = useState(0)
  const first = useRef(true)

  useEffect(() => {
    bodies.current.forEach((el, i) => {
      if (!el) return
      const isOpen = i === open
      if (first.current) {
        gsap.set(el, { height: isOpen ? 'auto' : 0 })
        return
      }
      gsap.to(el, {
        height: isOpen ? 'auto' : 0,
        duration: 0.9,
        ease: 'expo.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      })
    })
    first.current = false
  }, [open])

  useGSAP(
    () => {
      gsap.from('.proj', {
        y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.proj-list', start: 'top 82%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="section projects" id="projects" ref={root}>
      <div className="label mono">Systems — 内容生产系统 · 运营 · 工程</div>
      <div className="proj-list">
        {PROJECTS.map((p, i) => (
          <div className={`proj${open === i ? ' open' : ''}`} key={p.no}>
            <button className="proj-head" onClick={() => setOpen(open === i ? -1 : i)} data-cursor={open === i ? 'CLOSE' : 'OPEN'}>
              <span className="proj-no">{p.no}</span>
              <span className="proj-title">
                {p.title}
                <small>{p.en}</small>
              </span>
              <span className="proj-plus" />
            </button>
            <div className="proj-body" ref={(el) => { bodies.current[i] = el }}>
              <div className="proj-inner">
                <div />
                <div>
                  <span className="proj-role mono">{p.role}</span>
                  <p>{p.summary}</p>
                  <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                </div>
                <div className="metrics">
                  {p.metrics.map(([v, l]) => (
                    <div key={l}><b>{v}</b><span>{l}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
