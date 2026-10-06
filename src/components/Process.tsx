import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PROCESS } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Process() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const dist = () => Math.max(0, track.current!.scrollWidth - window.innerWidth + 40)
      gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + dist() * 1.15,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleX(${self.progress})` },
        },
      })
      gsap.from('.step', {
        y: 70, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="process" ref={root}>
      <div className="process-pin">
        <div className="process-head">
          <h2>From script<br />to <em style={{ color: 'var(--accent)' }}>final cut</em></h2>
          <span className="mono">Process — 制作流程 SOP</span>
        </div>
        <div className="process-track" ref={track}>
          {PROCESS.map((s) => (
            <article className="step" key={s.no} data-cursor="">
              <div>
                <div className="step-no">{s.no}</div>
              </div>
              <div>
                <span className="mono">{s.en}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
          <div className="process-end">13 people.<br />7 days.<br />One film.</div>
        </div>
        <div className="process-bar"><i ref={bar} /></div>
      </div>
    </section>
  )
}
