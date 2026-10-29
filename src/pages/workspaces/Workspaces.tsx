import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'
import { useRes, all } from '../../hooks/useRes'
import { State } from '../../components/ui/State'
import { Form } from '../../components/forms/Form'
import type { R } from '../../types'

export function Workspaces() {
  const { user, pickWs, toast } = useApp(); const nav = useNavigate()
  const mem = useRes('workspaceMembers', { userId: user.id }), wss = useRes('workspaces'); const [make, setMake] = useState(false)
  const mine = wss.data.filter(w => mem.data.some(m => m.workspaceId === w.id))
  const open = (id: number) => { pickWs(id); nav('/dashboard') }
  const create = async (v: R) => {
    try {
      const { data: w } = await api.post('/workspaces', { ...v, logoUrl: '', brandColor: '#4f46e5', publicRoadmap: true })
      await api.post('/workspaceMembers', { workspaceId: w.id, userId: user.id, name: user.name, email: user.email, role: 'owner', status: 'Active' })
      await api.post('/workspaceSubscriptions', { workspaceId: w.id, planId: 1 })
      toast('Workspace created'); open(w.id)
    } catch { toast('Could not create workspace', 'error') }
  }
  return <div className="mx-auto max-w-3xl space-y-4 p-4">
    <div className="flex items-center justify-between"><h1 className="text-xl font-semibold">Your workspaces</h1><div className="flex gap-2"><button className="btn btn-p" onClick={() => setMake(true)}>+ Create workspace</button><button className="btn" onClick={() => { localStorage.clear(); location.href = '/login' }}>Log out</button></div></div>
    <State r={all(mem, wss)} empty={!mine.length} msg="You are not in any workspace yet. Create one to begin.">
      <div className="grid gap-3 sm:grid-cols-2">{mine.map(w => <button key={w.id} onClick={() => open(w.id)} className="card text-left hover:border-slate-400"><div className="font-semibold" style={{ color: w.brandColor }}>{w.name}</div><div className="text-sm text-slate-500">{w.description}</div><div className="mt-1 text-xs">Your role: {mem.data.find(m => m.workspaceId === w.id)?.role}</div></button>)}</div>
    </State>
    {make && <Form title="Create workspace" fields={[{ k: 'name', label: 'Name', req: 1 }, { k: 'description', label: 'Description', type: 'textarea' }]} init={{}} onSave={create} onClose={() => setMake(false)} submitLabel="Create workspace" />}
  </div>
}
