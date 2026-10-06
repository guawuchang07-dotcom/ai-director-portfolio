import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { clamp, easeInOut, map } from '../lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const shade = useRef<HTMLDivElement>(null)
  const veil = useRef<HTMLDivElement>(null)
  const l1 = useRef<HTMLDivElement>(null)
  const l2 = useRef<HTMLDivElement>(null)
  const capL = useRef<HTMLDivElement>(null)
  const capR = useRef<HTMLDivElement>(null)
  const final = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const metaL = useRef<HTMLDivElement>(null)
  const metaR = useRef<HTMLDivElement>(null)
  const S = useRef({ p: 0, intro: 0 })

  const render = () => {
    const w = wrap.current, v = video.current
    if (!w || !v) return
    const { p, intro } = S.current
    const vw = window.innerWidth, vh = window.innerHeight
    const mobile = vw < 820
    const w0 = (mobile ? vw * 0.7 : vw * 0.3) * (0.78 + 0.22 * intro)
    const h0 = w0 * (mobile ? 1.15 : 9 / 16)
    const e = easeInOut(map(p, 0, 0.62))
    const l = ((vw - w0) / 2) * (1 - e)
    const t = ((vh - h0) / 2) * (1 - e)
    const r = 18 * (1 - e)
    w.style.clipPath = `inset(${t}px ${l}px ${t}px ${l}px round ${r}px)`
    w.style.opacity = String(intro)
    v.style.transform = `scale(${1 + 0.2 * (1 - e)})`

    const out = clamp(p / 0.5)
    const eo = easeInOut(out)
    if (l1.current) { l1.current.style.transform = `translate3d(${-eo * 30}vw, ${-eo * 26}vh, 0)`; l1.current.style.opacity = String(1 - clamp(p / 0.42)) }
    if (l2.current) { l2.current.style.transform = `translate3d(${eo * 30}vw, ${eo * 26}vh, 0)`; l2.current.style.opacity = String(1 - clamp(p / 0.42)) }
    const cap = clamp(p / 0.26)
    if (capL.current) { capL.current.style.transform = `translate3d(${-cap * 90}px, -50%, 0)`; capL.current.style.opacity = String((1 - cap) * intro) }
    if (capR.current) { capR.current.style.transform = `translate3d(${cap * 90}px, -50%, 0)`; capR.current.style.opacity = String((1 - cap) * intro) }
    const fade = 1 - clamp(p / 0.1)
    for (const el of [hint.current, metaL.current, metaR.current]) if (el) el.style.opacity = String(fade * intro)

    if (shade.current) shade.current.style.opacity = String(map(p, 0.5, 0.72))
    if (final.current) {
      const a = map(p, 0.66, 0.8) * (1 - map(p, 0.9, 0.99))
      final.current.style.opacity = String(a)
      final.current.style.transform = `translate3d(0, ${(1 - map(p, 0.66, 0.8)) * 50 - map(p, 0.9, 1) * 40}px, 0)`
    }
    if (veil.current) veil.current.style.opacity = String(map(p, 0.9, 1))
  }

  useGSAP(
    () => {
      render()
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          S.current.p = self.progress
          render()
        },
      })
      const onResize = () => render()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (!ready) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(S.current, { intro: 1, duration: 1.8, onUpdate: render }, 0)
      tl.fromTo('.hero-line .mask > span', { yPercent: 112 }, { yPercent: 0, duration: 1.5, stagger: 0.14 }, 0.15)
      tl.fromTo('.hero-reveal', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 }, 0.7)
      video.current?.play().catch(() => {})
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section className="hero" ref={root} id="top">
      <div className="hero-pin">
        <div className="hero-line l1" ref={l1}>
          <span className="mask"><span>AI <em>Director</em></span></span>
        </div>
        <div className="hero-line l2" ref={l2}>
          <span className="mask"><span><em className="acc">&amp;</em> <em>Creator</em></span></span>
        </div>

        <div className="hero-cap l" ref={capL}>
          <b className="hero-reveal">让 AI 拍出<br />有质感的故事</b>
          <span className="hero-reveal" style={{ display: 'block' }}>脚本、分镜、镜头语言与生成策略，<br />交给 AI 出片，由人来判断。</span>
          <span className="mono hero-reveal">Based in Hangzhou</span>
        </div>
        <div className="hero-cap r" ref={capR}>
          <b className="hero-reveal">张远博</b>
          <span className="hero-reveal" style={{ display: 'block' }}>AI 导演 / AI 内容创作<br />红果热度最高 1500 万</span>
          <span className="mono hero-reveal">Portfolio — 2026</span>
        </div>

        <div className="hero-video-wrap" ref={wrap} style={{ opacity: 0 }}>
          <video ref={video} src="/video/showreel.mp4" poster="/poster/showreel.jpg" muted loop playsInline preload="auto" />
          <div className="hero-shade" ref={shade} />
          <div className="hero-veil" ref={veil} />
        </div>

        <div className="hero-meta mono" ref={metaL}>Showreel · 00:18</div>
        <div className="hero-meta r mono" ref={metaR}>08 Works · 2 on Hongguo</div>
        <div className="hero-scroll mono" ref={hint}>Scroll<i /></div>

        <div className="hero-final" ref={final}>
          <h1>
            <small>Portfolio 2026 — AI Director &amp; Content Creator</small>
            Zhang Yuanbo
          </h1>
          <p>用 AI 把内容生产的效率与质感一起拉起来。<br />从内容运营一线，到 120 分钟级 AI 漫剧长篇。</p>
        </div>
      </div>
    </section>
  )
}
