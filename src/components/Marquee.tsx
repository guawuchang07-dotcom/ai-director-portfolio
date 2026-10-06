import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const items = ['Script Breakdown', '脚本拆解', 'Storyboard', '分镜', 'Shot Language', '镜头语言', 'Generation Strategy', '生成策略', 'Final Cut', '成片质检']

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tween = gsap.to(track.current, { xPercent: -50, ease: 'none', duration: 46, repeat: -1 })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity() / 380
          gsap.to(tween, { timeScale: 1 + Math.abs(v) * (v < 0 ? -1 : 1), duration: 0.25, overwrite: true })
          gsap.to(tween, { timeScale: 1, duration: 1.1, delay: 0.25, overwrite: 'auto' })
        },
      })
    },
    { scope: root },
  )

  const row = items.map((t, i) => (
    <span key={t}>
      <i>✦</i>
      {i % 2 === 0 ? <em>{t}</em> : t}
    </span>
  ))
  return (
    <div className="marquee" ref={root}>
      <div className="marquee-track" ref={track}>
        {row}
        {row}
      </div>
    </div>
  )
}
