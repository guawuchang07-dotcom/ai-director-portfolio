import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { EMAIL } from '../data'
import { scrollToTarget } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Footer() {
  const root = useRef<HTMLElement>(null)
  const [toast, setToast] = useState(false)

  useGSAP(
    () => {
      gsap.from('.footer-cta', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.footer-cta', start: 'top 92%' } })
    },
    { scope: root },
  )

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault()
    try { await navigator.clipboard.writeText(EMAIL) } catch { window.location.href = `mailto:${EMAIL}` }
    setToast(true)
    setTimeout(() => setToast(false), 2200)
  }

  return (
    <footer className="footer" id="contact" ref={root}>
      <div className="label mono">Contact — 联系</div>
      <span className="footer-cta">
        Let’s make<br />something <em>that moves.</em>
      </span>
      <a className="footer-mail" href={`mailto:${EMAIL}`} onClick={copy} data-cursor="COPY">
        {EMAIL} <span>↗</span>
      </a>
      <div className="footer-row">
        <a className="pill" href="/zhang-yuanbo-resume.pdf" download="张远博_AI内容创作简历.pdf" data-cursor="">Download Résumé (PDF)</a>
        <a className="pill" href={`mailto:${EMAIL}`} data-cursor="">Send an email</a>
        <button className="pill" onClick={() => scrollToTarget(0)}>Back to top ↑</button>
      </div>
      <div className="footer-bot mono">
        <span>© 2026 Zhang Yuanbo — AI Director &amp; Content Creator</span>
        <span>Hangzhou, China</span>
      </div>
      <div className={`toast${toast ? ' show' : ''}`}>邮箱已复制 · Email copied</div>
    </footer>
  )
}
