import { useState } from 'react'
import { Navigate, NavLink, Link, Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { NAV } from '../../constants'
import { Spin } from '../ui/Spin'

export function Shell() {
  const { ws, role, wsId, loading, logout, user } = useApp(); const [open, setOpen] = useState(false)
  if (!wsId) return <Navigate to="/workspaces" />
  if (loading) return <Spin />
  if (!ws || !role) return <Navigate to="/workspaces" />
  const lk = 'block rounded px-3 py-2 hover:bg-white/10'
  return <div style={{ '--brand': ws.brandColor } as any} className="min-h-screen md:flex">
    <aside className={`${open ? 'block' : 'hidden'} w-full shrink-0 space-y-1 bg-slate-900 p-4 text-slate-100 md:block md:w-60`}>
      <div className="mb-3 flex items-center gap-2 text-lg font-bold">{ws.logoUrl && <img src={ws.logoUrl} alt="" className="h-6 w-6 rounded" />}{ws.name}</div>
      {NAV.filter(n => n[2].includes(role)).map(n => <NavLink key={n[0]} to={'/' + n[0]} onClick={() => setOpen(false)} className={({ isActive }) => `${lk} ${isActive ? 'bg-white/20' : ''}`}>{n[1]}</NavLink>)}
      <a className={lk} href={'/public/' + wsId} target="_blank" rel="noreferrer">Public Roadmap ↗</a>
      <Link className={lk} to="/workspaces">Switch workspace</Link>
    </aside>
    <main className="min-w-0 flex-1">
      <header className="flex items-center justify-between border-b bg-white px-4 py-2 text-sm">
        <button className="btn md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <span className="ml-auto mr-3">{user.name} · <span className="badge">{role}</span></span><button className="btn" onClick={logout}>Log out</button></header>
      <div className="p-4 md:p-6"><Outlet /></div>
    </main></div>
}
