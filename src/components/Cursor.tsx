import { useEffect, useRef } from 'react'

export default function Cursor() {
  const el = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf = 0
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    const loop = () => {
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      if (el.current) el.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null
      const text = t?.dataset.cursor
      if (text) {
        if (label.current) label.current.textContent = text
        el.current?.classList.add('big')
      } else el.current?.classList.remove('big')
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="cursor" ref={el}>
      <span ref={label} />
    </div>
  )
}
