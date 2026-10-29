import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'

export function Login() {
  const { setUser, user } = useApp(); const nav = useNavigate()
  const [f, setF] = useState({ email: '', password: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/workspaces" />
  const go = async (e: any) => {
    e.preventDefault(); if (!f.email || !f.password) return setErr('Email and password are required')
    setBusy(true)
    try { const { data } = await api.get('/users', { params: { email: f.email } }); const u = data[0]; if (!u || u.password !== f.password) setErr('Email or password is incorrect'); else { setUser(u); nav('/workspaces') } }
    catch { setErr('Server unavailable. Start JSON Server and try again.') }
    setBusy(false)
  }
  return <div className="flex min-h-screen items-center justify-center p-4"><form onSubmit={go} className="card w-full max-w-sm space-y-3">
    <h1 className="text-2xl font-bold">ProductPulse</h1>
    <input className="input" placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
    <input className="input" type="password" placeholder="Password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
    {err && <p className="text-sm text-red-600">{err}</p>}
    <button className="btn btn-p w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    <p className="text-xs text-slate-500">Demo: owner@demo.com, admin@demo.com, pm@demo.com, customer@demo.com — password <b>demo</b></p>
  </form></div>
}
