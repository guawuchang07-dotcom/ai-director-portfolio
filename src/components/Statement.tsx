import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { STATS } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const TEXT = '我把一个故事拆成脚本、分镜、镜头语言与生成策略。让 {{AI}} 负责出片，让{{人}}负责判断——这就是我理解的{{AI 导演}}。'

function tokens() {
  const out: { t: string; hl: boolean }[] = []
  TEXT.split(/(\{\{.*?\}\})/).forEach((seg) => {
    const hl = seg.startsWith('{{')
    const s = hl ? seg.slice(2, -2) : seg
    ;(s.match(/[A-Za-z0-9]+|\s|./g) || []).forEach((t) => out.push({ t, hl }))
  })
  return out
}

export default function Statement() {
  const root = useRef<HTMLElement>(null)
  const toks = tokens()

  useGSAP(
    () => {
      gsap.to('.statement .w', {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: '.statement', start: 'top 78%', end: 'bottom 52%', scrub: true },
      })
      gsap.utils.toArray<HTMLElement>('.stat-v .num').forEach((el) => {
        const target = Number(el.dataset.v)
        const o = { v: 0 }
        gsap.to(o, {
          v: target,
          duration: 2.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = String(Math.round(o.v)) },
        })
      })
      gsap.from('.stat', {
        y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: '.stats', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section className="section" id="about" ref={root}>
      <div className="label mono">About — 导演陈述</div>
      <p className="statement">
        {toks.map((k, i) => (
          <span key={i} className={`w${k.hl ? ' hl' : ''}`}>{k.t}</span>
        ))}
      </p>
      <div className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-v">
              {s.suffix === '¥' && <sup>¥</sup>}
              <span className="num" data-v={s.value}>0</span>
              {s.suffix && s.suffix !== '¥' && <sup>{s.suffix}</sup>}
            </div>
            <b>{s.label}</b>
            <span className="n">{s.note}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
