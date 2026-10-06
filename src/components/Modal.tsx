import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { KIND_LABEL, WORKS } from '../data'
import { fmtTime, wrap } from '../lib/utils'
import { lenis } from '../lib/scroll'

interface Props {
  index: number
  origin: DOMRect
  getRect: (i: number) => DOMRect | null
  onNav: (i: number) => void
  onClose: () => void
}

const aspectOf = (spec: string) => {
  const [w, h] = spec.split('×').map((s) => parseInt(s.trim(), 10))
  return w / h
}

export default function Modal({ index, origin, getRect, onNav, onClose }: Props) {
  const bg = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const slot = useRef<HTMLDivElement>(null)
  const info = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const barFill = useRef<HTMLElement>(null)
  const timeEl = useRef<HTMLSpanElement>(null)
  const opened = useRef(false)
  const closing = useRef(false)
  const idxRef = useRef(index)
  idxRef.current = index
  const [paused, setPaused] = useState(true)
  const [muted, setMuted] = useState(false)
  const w = WORKS[index]

  const finalRect = () => {
    const s = slot.current!.getBoundingClientRect()
    const ar = aspectOf(WORKS[idxRef.current].spec)
    let width = s.width
    let height = width / ar
    if (height > s.height) { height = s.height; width = height * ar }
    return { left: s.left + (s.width - width) / 2, top: s.top + (s.height - height) / 2, width, height }
  }

  const load = (i: number) => {
    const v = video.current!
    v.classList.remove('on')
    v.src = `/video/${WORKS[i].slug}.mp4`
    v.currentTime = 0
    v.muted = false
    v.play().catch(() => { v.muted = true; setMuted(true); v.play().catch(() => {}) })
  }

  useEffect(() => {
    lenis?.stop()
    return () => { lenis?.start() }
  }, [])

  useEffect(() => {
    const f = frame.current!
    const poster = `/poster/${w.slug}.jpg`
    f.style.backgroundImage = `url(${poster})`
    const fr = finalRect()
    if (!opened.current) {
      opened.current = true
      gsap.set(f, { left: origin.left, top: origin.top, width: origin.width, height: origin.height, borderRadius: 10 })
      const tl = gsap.timeline()
      tl.to(bg.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
      tl.to(f, { ...fr, borderRadius: 6, duration: 1.05, ease: 'expo.inOut' }, 0)
      tl.fromTo(info.current!.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.55)
      tl.to(closeBtn.current, { opacity: 1, duration: 0.6 }, 0.7)
      tl.add(() => load(idxRef.current), 0.75)
    } else {
      gsap.to(f, { ...fr, duration: 0.9, ease: 'expo.inOut' })
      gsap.fromTo(info.current!.children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.05, delay: 0.25 })
      load(index)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    const onResize = () => { if (!closing.current) gsap.set(frame.current, finalRect()) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const close = () => {
    if (closing.current) return
    closing.current = true
    const v = video.current!
    v.pause()
    v.classList.remove('on')
    const target = getRect(idxRef.current) ?? origin
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(info.current!.children, { y: 24, opacity: 0, duration: 0.4, ease: 'power2.in', stagger: 0.03 }, 0)
    tl.to(closeBtn.current, { opacity: 0, duration: 0.3 }, 0)
    tl.to(frame.current, { left: target.left, top: target.top, width: target.width, height: target.height, borderRadius: 10, duration: 0.85, ease: 'expo.inOut' }, 0.1)
    tl.to(bg.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') onNav(wrap(idxRef.current + 1, WORKS.length))
      else if (e.key === ' ') { e.preventDefault(); toggle() }
      else if (e.key === 'ArrowLeft') onNav(wrap(idxRef.current - 1, WORKS.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    const v = video.current!
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  const onTime = () => {
    const v = video.current!
    if (barFill.current) barFill.current.style.width = `${(v.currentTime / (v.duration || 1)) * 100}%`
    if (timeEl.current) timeEl.current.textContent = `${fmtTime(v.currentTime)} / ${fmtTime(v.duration)}`
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    const v = video.current!
    v.currentTime = ((e.clientX - r.left) / r.width) * (v.duration || 0)
  }

  const fullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const f = frame.current!
    if (document.fullscreenElement) document.exitFullscreen()
    else f.requestFullscreen?.().catch(() => {})
  }

  return (
    <div className="modal" data-cursor="">
      <div className="modal-bg" ref={bg} onClick={close} />
      <button className="pill modal-close" ref={closeBtn} onClick={close} data-cursor="CLOSE">Close — Esc</button>
      <div className="modal-grid">
        <div className="modal-slot" ref={slot} />
        <div className="modal-info" ref={info}>
          <span className="mono">No. {String(index + 1).padStart(2, '0')} / {String(WORKS.length).padStart(2, '0')}</span>
          <h2>{w.title}</h2>
          <dl>
            <div><dt>类型</dt><dd>{KIND_LABEL[w.kind]}</dd></div>
            <div><dt>状态</dt><dd>{w.released ? <><b>红果上架</b> · 热度区间 1000 ~ 1500 万</> : '未上架'}</dd></div>
            <div><dt>片段时长</dt><dd>{w.duration}</dd></div>
            <div><dt>画幅</dt><dd>{w.vertical ? '竖屏' : '横屏'} · {w.spec}</dd></div>
            <div><dt>我的角色</dt><dd>AI 漫剧导演 — 风格把控 · 镜头设计 · 生成策略 · 成片 QC</dd></div>
          </dl>
          <div className="modal-nav">
            <button className="pill" onClick={() => onNav(wrap(index - 1, WORKS.length))}>← Prev</button>
            <button className="pill" onClick={() => onNav(wrap(index + 1, WORKS.length))}>Next →</button>
          </div>
          <p className="modal-note">热度数据为两部上架作品的整体区间，非单部数据。空格键播放 / 暂停。</p>
        </div>
      </div>

      <div className={`modal-frame${paused ? ' paused' : ''}`} ref={frame} onClick={toggle} data-cursor={paused ? 'PLAY' : 'PAUSE'}>
        <video
          ref={video}
          playsInline
          onTimeUpdate={onTime}
          onPlaying={() => { setPaused(false); video.current?.classList.add('on') }}
          onPause={() => setPaused(true)}
          onEnded={() => setPaused(true)}
        />
        <div className={`modal-bigplay${paused ? ' show' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
        </div>
        <div className="modal-ctl" onClick={(e) => e.stopPropagation()}>
          <button onClick={toggle}>{paused ? 'Play' : 'Pause'}</button>
          <div className="bar" onClick={seek}><i ref={barFill} /></div>
          <span className="time" ref={timeEl}>0:00 / {w.duration}</span>
          <button onClick={(e) => { e.stopPropagation(); const v = video.current!; v.muted = !v.muted; setMuted(v.muted) }}>{muted ? 'Muted' : 'Sound'}</button>
          <button onClick={fullscreen}>Full</button>
        </div>
      </div>
    </div>
  )
}
