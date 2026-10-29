import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useRes, all } from '../../hooks/useRes'
import { State } from '../../components/ui/State'
import { toggleVote } from '../../utils/votes'
import { STAT, PRI } from '../../constants'
import type { R } from '../../types'

export function FeedbackList() {
  const { wsId, user, toast } = useApp(); const q = { workspaceId: wsId }
  const fb = useRes('feedback', q), vt = useRes('votes', q), ct = useRes('categories', q), tg = useRes('tags', q)
  const [f, setF] = useState({ q: '', cat: '', tag: '', status: '', pri: '', from: '', sort: 'new' })
  const cnt = (id: any) => vt.data.filter(v => v.feedbackId === id).length
  const rows = useMemo(() => fb.data.filter(x => (!f.q || (x.title + ' ' + x.description).toLowerCase().includes(f.q.toLowerCase())) && (!f.cat || x.categoryId === Number(f.cat)) && (!f.tag || x.tagIds?.includes(Number(f.tag))) && (!f.status || x.status === f.status) && (!f.pri || x.priority === f.pri) && (!f.from || x.createdAt.slice(0, 10) >= f.from))
    .sort((a, b) => f.sort === 'votes' ? cnt(b.id) - cnt(a.id) : f.sort === 'old' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)), [fb.data, vt.data, f])
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })
  const vote = async (id: any) => { try { await toggleVote(wsId, user.id, id, vt.data); vt.reload() } catch { toast('Vote failed', 'error') } }
  const sel = (k: string, label: string, opts: R[]) => <select aria-label={label} className="input" value={(f as R)[k]} onChange={set(k)}><option value="">{label}</option>{opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
  const o = (a: string[]) => a.map(x => ({ v: x, l: x }))
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><h1 className="text-xl font-semibold">Feedback</h1><Link to="/feedback/new" className="btn btn-p">+ New feedback</Link></div>
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-7">
      <input className="input lg:col-span-2" placeholder="Search title or description" value={f.q} onChange={set('q')} />
      {sel('cat', 'All categories', ct.data.map(c => ({ v: c.id, l: c.name })))}{sel('tag', 'All tags', tg.data.map(c => ({ v: c.id, l: c.name })))}
      {sel('status', 'All statuses', o(STAT))}{sel('pri', 'All priorities', o(PRI))}
      <input aria-label="From date" type="date" className="input" value={f.from} onChange={set('from')} />
      <select aria-label="Sort" className="input" value={f.sort} onChange={set('sort')}><option value="new">Newest</option><option value="old">Oldest</option><option value="votes">Most votes</option></select></div>
    <State r={all(fb, vt, ct, tg)} empty={!rows.length} msg="No feedback matches. Adjust the filters or submit a new request.">
      <div className="space-y-2">{rows.map(x => { const mine = vt.data.some(v => v.feedbackId === x.id && v.userId === user.id); const linked = fb.data.filter(d => d.duplicateOf === x.id).length
        return <div key={x.id} className="card flex gap-3">
          <button onClick={() => vote(x.id)} aria-pressed={mine} className={`btn flex h-14 w-14 flex-col items-center justify-center ${mine ? 'btn-p' : ''}`}>▲<b>{cnt(x.id)}</b></button>
          <div className="min-w-0 flex-1"><Link to={'/feedback/' + x.id} className="font-medium hover:underline">{x.title}</Link>
            <p className="truncate text-sm text-slate-500">{x.description}</p>
            <div className="mt-1 flex flex-wrap gap-1"><span className="badge">{ct.data.find(c => c.id === x.categoryId)?.name}</span><span className="badge">{x.status}</span><span className="badge">{x.priority}</span>
              {x.tagIds?.map((t: number) => <span key={t} className="badge">#{tg.data.find(g => g.id === t)?.name}</span>)}
              {linked > 0 && <span className="badge">{linked} duplicate{linked > 1 ? 's' : ''} linked</span>}{x.duplicateOf && <span className="badge">Duplicate of #{x.duplicateOf}</span>}</div></div></div> })}</div>
    </State></div>
}
