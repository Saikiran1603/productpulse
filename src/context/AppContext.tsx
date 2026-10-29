import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'
import type { R } from '../types'

export const Ctx = createContext<R>({})
export const useApp = () => useContext(Ctx)
export function AppProvider({ children }: R) {
  const [user, _setUser] = useState<R | null>(() => JSON.parse(localStorage.getItem('pp_user') || 'null'))
  const [wsId, _setWs] = useState<number | null>(() => Number(localStorage.getItem('pp_ws')) || null)
  const [ws, setWs] = useState<R | null>(null)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(!!wsId)
  const [tick, setTick] = useState(0)
  const [msg, setMsg] = useState<R | null>(null)
  const setUser = (u: R | null) => { u ? localStorage.setItem('pp_user', JSON.stringify(u)) : localStorage.removeItem('pp_user'); _setUser(u) }
  const pickWs = (id: number | null) => { id ? localStorage.setItem('pp_ws', String(id)) : localStorage.removeItem('pp_ws'); _setWs(id) }
  const logout = () => { setUser(null); pickWs(null) }
  const toast = (text: string, type = 'ok') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3000) }
  useEffect(() => {
    if (!user || !wsId) { setWs(null); setLoading(false); return }
    setLoading(true)
    Promise.all([api.get('/workspaces/' + wsId), api.get('/workspaceMembers', { params: { userId: user.id, workspaceId: wsId } })])
      .then(([w, m]) => { setWs(w.data); setRole(m.data[0]?.role || '') })
      .catch(() => setWs(null)).finally(() => setLoading(false))
  }, [user, wsId, tick])
  return <Ctx.Provider value={{ user, setUser, wsId, pickWs, ws, role, loading, logout, toast, refreshWs: () => setTick(t => t + 1) }}>
    {children}
    {msg && <div role="status" className={`fixed bottom-4 right-4 z-[60] rounded-md px-4 py-2 text-white shadow ${msg.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>{msg.text}</div>}
  </Ctx.Provider>
}
