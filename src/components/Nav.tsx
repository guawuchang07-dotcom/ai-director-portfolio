import { useEffect, useState } from 'react'
import { scrollToTarget } from '../lib/scroll'

const clock = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' }).format(new Date())

export default function Nav() {
  const [t, setT] = useState(clock())
  useEffect(() => {
    const id = setInterval(() => setT(clock()), 15000)
    return () => clearInterval(id)
  }, [])
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToTarget(id) }
  return (
    <header className="nav">
      <a className="nav-logo" href="#top" onClick={go('#top')}><i />Zhang Yuanbo</a>
      <div className="nav-clock">Hangzhou {t}</div>
      <nav className="nav-links">
        <a href="#works" onClick={go('#works')}>Works</a>
        <a href="#about" onClick={go('#about')}>About</a>
        <a href="#process" onClick={go('#process')}>Process</a>
        <a href="#projects" onClick={go('#projects')}>Systems</a>
        <a href="#contact" onClick={go('#contact')}>Contact</a>
      </nav>
    </header>
  )
}
