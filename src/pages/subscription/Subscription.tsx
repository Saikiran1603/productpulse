import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'
import { usePlan } from '../../hooks/usePlan'
import { useRes, all } from '../../hooks/useRes'
import { State } from '../../components/ui/State'
import { Warn } from '../../components/ui/Warn'
import { logAct } from '../../utils/activity'
import type { R } from '../../types'

export function Subscription() {
  const { wsId, toast, user } = useApp(); const p = usePlan()
  const m = useRes('workspaceMembers', { workspaceId: wsId }), f = useRes('feedback', { workspaceId: wsId }), rm = useRes('roadmapItems', { workspaceId: wsId })
  const used: R = { members: m.data.length, feedback: f.data.length, roadmapItems: rm.data.length }
  const sw = async (pl: R) => {
    const bad = Object.keys(pl.limits).filter(k => used[k] > pl.limits[k])
    if (bad.length) return toast(`Current usage exceeds ${pl.name} limits: ${bad.join(', ')}`, 'error')
    try { await api.patch('/workspaceSubscriptions/' + p.sub.id, { planId: pl.id }); toast('Plan changed to ' + pl.name); logAct(wsId, user, 'changed plan to ' + pl.name); p.reload() } catch { toast('Could not change plan', 'error') }
  }
  const labels: R = { members: 'Members', feedback: 'Feedback items', roadmapItems: 'Roadmap items' }
  return <div className="space-y-4"><h1 className="text-xl font-semibold">Subscription & Usage</h1>
    <State r={all(p, m, f, rm)} empty={!p.plan} msg="No subscription found for this workspace."><div className="space-y-4">
      <div className="card space-y-3"><h2 className="font-medium">Current plan: {p.plan?.name}</h2>
        {p.plan && Object.keys(labels).map(k => { const lim = { used: used[k], max: p.plan.limits[k], warn: used[k] >= p.plan.limits[k] * .8, reached: used[k] >= p.plan.limits[k] }
          return <div key={k}><div className="flex justify-between text-sm"><span>{labels[k]}</span><span>{lim.used}/{lim.max}</span></div><div className="h-2 rounded bg-slate-200"><div className={`h-2 rounded ${lim.reached ? 'bg-red-500' : lim.warn ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: Math.min(100, lim.used / lim.max * 100) + '%' }} /></div><Warn lim={lim} label={labels[k].toLowerCase()} /></div> })}</div>
      <div className="grid gap-3 sm:grid-cols-2">{p.plans.map(pl => <div key={pl.id} className="card"><h3 className="font-semibold">{pl.name} — ${pl.price}/mo</h3><ul className="my-2 text-sm text-slate-600">{Object.keys(labels).map(k => <li key={k}>{labels[k]}: up to {pl.limits[k]}</li>)}</ul>
        <button className="btn btn-p" disabled={pl.id === p.plan?.id} onClick={() => sw(pl)}>{pl.id === p.plan?.id ? 'Current plan' : `Switch to ${pl.name}`}</button></div>)}</div>
      <p className="text-xs text-slate-500">Demo only: no payment is taken.</p></div></State></div>
}
