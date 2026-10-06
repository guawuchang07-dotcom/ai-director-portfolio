import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { EXPERIENCE, SKILLS } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Experience() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.job, .skill, .edu').forEach((el) => {
        gsap.from(el, { y: 44, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
    },
    { scope: root },
  )

  return (
    <section className="section exp" id="experience" ref={root}>
      <div className="label mono">Experience — 经历</div>
      <div className="exp-grid">
        <h2>The<br />road<br /><em style={{ color: 'var(--accent)' }}>so far.</em></h2>
        <div>
          {EXPERIENCE.map((j) => (
            <div className="job" key={j.org}>
              <div className="job-top mono"><span>{j.period}</span></div>
              <h3>{j.org}</h3>
              <h4>{j.role}</h4>
              <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
          <div className="skills">
            {SKILLS.map(([k, v]) => (
              <div className="skill" key={k}><span className="mono">{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div className="edu">
            <span><b>山东科技大学泰山科技学院</b> · 土木工程 · 本科</span>
            <span className="mono">2022 — 2024</span>
          </div>
        </div>
      </div>
    </section>
  )
}
