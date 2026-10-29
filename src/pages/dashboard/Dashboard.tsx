import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useApp } from '../../context/AppContext'
import { useRes, all } from '../../hooks/useRes'
import { State } from '../../components/ui/State'
import { STAGES } from '../../constants'
import type { R } from '../../types'

export function Dashboard() {
  const { wsId } = useApp(); const q = { workspaceId: wsId }
  const fb = useRes('feedback', q), vt = useRes('votes', q), rm = useRes('roadmapItems', q), ct = useRes('categories', q), lg = useRes('activityLogs', { ...q, _sort: 'at', _order: 'desc', _limit: 6 })
  const done = rm.data.filter(x => x.stage === 'Completed').length
  const stats = [['Total feedback', fb.data.length], ['Total votes', vt.data.length], ['Open requests', fb.data.filter(x => !['Completed', 'Closed'].includes(x.status)).length], ['Completed features', done], ['Roadmap progress', (rm.data.length ? Math.round(done / rm.data.length * 100) : 0) + '%']]
  const byCat = ct.data.map(c => ({ name: c.name, count: fb.data.filter(x => x.categoryId === c.id).length }))
  const byStage = STAGES.map(s => ({ name: s, count: rm.data.filter(x => x.stage === s).length }))
  const chart = (title: string, d: R[]) => <div className="card"><h3 className="mb-2 font-medium">{title}</h3><div className="h-60"><ResponsiveContainer><BarChart data={d}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={12} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="var(--brand)" /></BarChart></ResponsiveContainer></div></div>
  return <div className="space-y-4"><h1 className="text-xl font-semibold">Dashboard</h1>
    <State r={all(fb, vt, rm, ct, lg)}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{stats.map(s => <div key={s[0]} className="card"><div className="text-2xl font-bold">{s[1]}</div><div className="text-sm text-slate-500">{s[0]}</div></div>)}</div>
      <div className="grid gap-4 lg:grid-cols-2">{chart('Feedback by category', byCat)}{chart('Roadmap by stage', byStage)}</div>
      <div className="card"><h3 className="mb-2 font-medium">Recent activity</h3>{lg.data.length ? lg.data.map(l => <p key={l.id} className="text-sm"><b>{l.user}</b> {l.text} <span className="text-slate-400">{new Date(l.at).toLocaleDateString()}</span></p>) : <p className="text-sm text-slate-500">No activity yet.</p>}</div>
    </State></div>
}
