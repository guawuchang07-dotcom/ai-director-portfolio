import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { KIND_LABEL, WORKS } from '../data'
import { clamp, easeOutExpo, map, wrap } from '../lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export interface WorksApi {
  focus: (i: number) => void
  rect: (i: number) => DOMRect | null
}

interface Props {
  apiRef: MutableRefObject<WorksApi | null>
  onOpen: (index: number, rect: DOMRect) => void
  modalOpen: boolean
}

const N = WORKS.length
const pad = (n: number) => String(n).padStart(2, '0')

function geom() {
  const vw = window.innerWidth
  const mobile = vw < 820
  const R = Math.max(mobile ? 700 : 1000, vw * (mobile ? 1.5 : 1.08))
  const step = mobile ? 0.34 : 0.165
  return { vw, vh: window.innerHeight, mobile, R, step }
}

export default function Works({ apiRef, onOpen, modalOpen }: Props) {
  const root = useRef<HTMLElement>(null)
  const arc = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const vids = useRef<(HTMLVideoElement | null)[]>([])
  const dims = useRef<(HTMLDivElement | null)[]>([])
  const bg = useRef<HTMLDivElement>(null)
  const titleBox = useRef<HTMLDivElement>(null)
  const metaEl = useRef<HTMLSpanElement>(null)
  const titleEl = useRef<HTMLHeadingElement>(null)
  const countEl = useRef<HTMLDivElement>(null)
  const prog = useRef<HTMLElement>(null)
  const modalOpenRef = useRef(modalOpen)
  modalOpenRef.current = modalOpen
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen

  const S = useRef({ progress: 0, sp: 0, off: 0, offT: 0, e: 0, inView: false, active: -1 })

  const setActive = (idx: number) => {
    const s = S.current
    if (s.active === idx) return
    const first = s.active === -1
    s.active = idx
    const w = WORKS[idx]
    if (metaEl.current) metaEl.current.textContent = `${KIND_LABEL[w.kind]} · ${w.released ? '红果上架' : '未上架'} · ${w.duration}`
    if (titleEl.current) titleEl.current.textContent = w.title
    if (countEl.current) countEl.current.innerHTML = `${pad(idx + 1)}<small> / ${pad(N)}</small>`
    if (bg.current) bg.current.textContent = pad(idx + 1)
    if (!first) {
      gsap.fromTo(titleEl.current, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'expo.out', overwrite: true })
      gsap.fromTo(bg.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', overwrite: true })
    }
  }

  const render = (dt: number) => {
    const s = S.current
    const { vh, R, step } = geom()
    const turns = clamp((s.progress - 0.1) / 0.9)
    const spT = turns * N
    s.sp += (spT - s.sp) * (1 - Math.exp(-dt * 9))
    s.off += (s.offT - s.off) * (1 - Math.exp(-dt * 7))
    const eT = easeOutExpo(map(s.progress, 0, 0.1))
    s.e += (eT - s.e) * (1 - Math.exp(-dt * 8))
    const e = s.e
    const pos = s.sp + s.off

    for (let i = 0; i < N; i++) {
      const el = cards.current[i]
      if (!el) continue
      const rel = wrap(i - pos + N / 2, N) - N / 2
      const ar = Math.abs(rel)
      const a = rel * step * (0.2 + 0.8 * e)
      const x = R * Math.sin(a)
      const y = R * (1 - Math.cos(a)) + (1 - e) * vh * 0.5
      const rot = (a * 180) / Math.PI + (1 - e) * (i % 2 ? 10 : -10)
      const sc = (1.13 - 0.1 * Math.min(ar, 1) - 0.035 * Math.max(ar - 1, 0)) * (0.7 + 0.3 * e)
      const op = e * (1 - clamp((ar - 2.5) / 1.1))
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(3)}deg) scale(${sc.toFixed(4)})`
      el.style.opacity = op.toFixed(3)
      el.style.zIndex = String(100 - Math.round(ar * 10))
      el.style.pointerEvents = op < 0.15 ? 'none' : 'auto'
      el.dataset.cursor = ar < 0.5 ? 'PLAY' : 'VIEW'
      const d = dims.current[i]
      if (d) d.style.opacity = Math.min(0.78, ar * 0.24).toFixed(3)

      const v = vids.current[i]
      if (v) {
        const near = s.inView && ar < 1.7 && e > 0.6
        if (near && v.paused) {
          if (!v.src) v.src = v.dataset.src || ''
          v.play().then(() => v.classList.add('on')).catch(() => {})
        } else if (!near && !v.paused) {
          v.pause()
          v.classList.remove('on')
        }
      }
    }
    setActive(wrap(Math.round(pos), N))
    if (prog.current) prog.current.style.transform = `scaleX(${turns})`
  }

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => { S.current.progress = self.progress },
        onToggle: (self) => { S.current.inView = self.isActive },
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => { S.current.inView = self.isActive },
      })
      setActive(0)
      render(16)
      const tick = (_t: number, dtMs: number) => {
        if (!S.current.inView && !modalOpenRef.current) return
        render(Math.min(dtMs, 64) / 1000)
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: root },
  )

  useEffect(() => {
    const s = S.current
    const focus = (i: number) => {
      const relT = wrap(i - (s.sp + s.offT) + N / 2, N) - N / 2
      s.offT += relT
    }
    apiRef.current = {
      focus,
      rect: (i) => cards.current[i]?.getBoundingClientRect() ?? null,
    }

    const el = arc.current!
    let down = false, moved = false, startX = 0, startOff = 0, lastX = 0, lastT = 0, vel = 0
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || modalOpenRef.current) return
      down = true; moved = false; startX = e.clientX; startOff = s.offT; lastX = e.clientX; lastT = performance.now(); vel = 0
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 7) { moved = true; el.setPointerCapture(e.pointerId) }
      if (moved) {
        const { R, step } = geom()
        s.offT = startOff - dx / (R * step * 0.95)
        const now = performance.now()
        const dt = Math.max(1, now - lastT)
        vel = (e.clientX - lastX) / dt
        lastX = e.clientX; lastT = now
      }
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      down = false
      if (moved) {
        const { R, step } = geom()
        const inertia = -(vel * 260) / (R * step)
        s.offT = Math.round(s.sp + s.offT + inertia) - s.sp
        return
      }
      const card = (e.target as HTMLElement).closest('.card') as HTMLElement | null
      if (!card) return
      const idx = Number(card.dataset.i)
      const rel = wrap(idx - (s.sp + s.offT) + N / 2, N) - N / 2
      if (Math.abs(rel) < 0.55) {
        const r = card.getBoundingClientRect()
        onOpenRef.current(idx, r)
      } else {
        focus(idx)
      }
    }
    const onWheel = (e: WheelEvent) => {
      if (!s.inView || modalOpenRef.current) return
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) s.offT += e.deltaX * 0.0045
    }
    const onKey = (e: KeyboardEvent) => {
      if (!s.inView || modalOpenRef.current) return
      const cur = wrap(Math.round(s.sp + s.offT), N)
      if (e.key === 'ArrowRight') focus(wrap(cur + 1, N))
      else if (e.key === 'ArrowLeft') focus(wrap(cur - 1, N))
      else if (e.key === 'Enter') { const c = cards.current[cur]; if (c) onOpenRef.current(cur, c.getBoundingClientRect()) }
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [apiRef])

  const step = (d: number) => {
    const s = S.current
    const cur = wrap(Math.round(s.sp + s.offT), N)
    apiRef.current?.focus(wrap(cur + d, N))
  }

  return (
    <section className="works" ref={root} id="works">
      <div className="works-pin">
        <div className="works-bg serif" ref={bg}>01</div>
        <div className="works-head mono">
          <span>Selected Works — {pad(N)}</span>
          <span>Drag · Scroll · Click</span>
        </div>

        <div className="arc" ref={arc}>
          {WORKS.map((w, i) => (
            <div className="card" key={w.slug} data-i={i} data-cursor="VIEW" ref={(el) => { cards.current[i] = el }}>
              <div className="card-media">
                <img src={`/poster/${w.slug}.jpg`} alt={w.title} draggable={false} loading="eager" />
                <video
                  ref={(el) => { vids.current[i] = el }}
                  data-src={`/loop/${w.slug}.mp4`}
                  muted loop playsInline preload="none"
                />
              </div>
              <div className="card-grad" />
              <div className="card-dim" ref={(el) => { dims.current[i] = el }} />
              <div className="card-top">
                <span style={{ display: 'flex', gap: 6 }}>
                  {w.released && <span className="badge live">红果上架</span>}
                  <span className="badge">{KIND_LABEL[w.kind]}</span>
                </span>
                <span className="mono">{pad(i + 1)}</span>
              </div>
              <div className="card-bot">
                <b>{w.title}</b>
                <span className="mono">{w.duration}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="works-info">
          <div className="works-title" ref={titleBox}>
            <span className="mono" ref={metaEl} />
            <h3 ref={titleEl} />
          </div>
          <div>
            <div className="works-count" ref={countEl} />
            <div className="works-ctrl">
              <button aria-label="上一部" onClick={() => step(-1)} data-cursor="PREV">←</button>
              <button aria-label="下一部" onClick={() => step(1)} data-cursor="NEXT">→</button>
            </div>
          </div>
          <div className="works-hint mono">
            <span>点击中间作品播放</span>
            <span>← → 键切换</span>
          </div>
        </div>
        <div className="works-prog"><i ref={prog} /></div>
      </div>
    </section>
  )
}
