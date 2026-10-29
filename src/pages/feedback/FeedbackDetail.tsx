import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'
import { useRes, all } from '../../hooks/useRes'
import { State } from '../../components/ui/State'
import { toggleVote } from '../../utils/votes'
import { logAct } from '../../utils/activity'
import { MGR, STAT } from '../../constants'
import type { R } from '../../types'

export function FeedbackDetail() {
  const { id } = useParams(); const { wsId, user, role, toast } = useApp(); const nav = useNavigate()
  const fb = useRes('feedback', { workspaceId: wsId }), cm = useRes('comments', { feedbackId: id, _sort: 'createdAt' }), vt = useRes('votes', { feedbackId: id }), ct = useRes('categories', { workspaceId: wsId }), tg = useRes('tags', { workspaceId: wsId })
  const [text, setText] = useState(''); const [err, setErr] = useState('')
  const it = fb.data.find(x => String(x.id) === id); const mgr = MGR.includes(role)
  const patch = async (b: R, m: string) => { try { await api.patch('/feedback/' + id, b); toast(m); fb.reload() } catch { toast('Update failed', 'error') } }
  const vote = async () => { try { await toggleVote(wsId, user.id, Number(id), vt.data); vt.reload() } catch { toast('Vote failed', 'error') } }
  const comment = async (e: any) => {
    e.preventDefault(); if (!text.trim()) return setErr('Write a comment before posting')
    try { await api.post('/comments', { workspaceId: wsId, feedbackId: Number(id), userId: user.id, author: user.name, text: text.trim(), createdAt: new Date().toISOString() }); setText(''); setErr(''); cm.reload() } catch { toast('Comment failed', 'error') }
  }
  const del = async () => { if (!confirm('Delete this feedback? This cannot be undone.')) return; try { await api.delete('/feedback/' + id); logAct(wsId, user, 'deleted feedback: ' + it?.title); toast('Deleted'); nav('/feedback') } catch { toast('Delete failed', 'error') } }
  const linked = fb.data.filter(d => d.duplicateOf === it?.id), mine = vt.data.some(v => v.userId === user.id)
  return <State r={all(fb, cm, vt, ct, tg)} empty={!it} msg="Feedback not found."><div className="space-y-4">{it && <>
    <Link to="/feedback" className="text-sm text-slate-500">← All feedback</Link>
    <div className="card space-y-2">
      <div className="flex items-start justify-between gap-2"><h1 className="text-xl font-semibold">{it.title}</h1><button className={`btn ${mine ? 'btn-p' : ''}`} onClick={vote}>▲ {vt.data.length} {mine ? 'Voted' : 'Vote'}</button></div>
      <p>{it.description}</p>
      <div className="flex flex-wrap gap-1"><span className="badge">{ct.data.find(c => c.id === it.categoryId)?.name}</span><span className="badge">{it.status}</span><span className="badge">{it.priority}</span>{it.tagIds?.map((t: number) => <span key={t} className="badge">#{tg.data.find(g => g.id === t)?.name}</span>)}<span className="badge">by {it.submitter}</span></div>
      {(mgr || it.submitterId === user.id) && <div className="flex flex-wrap gap-2"><Link className="btn" to={`/feedback/${id}/edit`}>Edit</Link><button className="btn text-red-600" onClick={del}>Delete</button></div>}
      {mgr && <div className="flex flex-wrap items-center gap-2 text-sm">Status <select className="input !w-auto" value={it.status} onChange={e => patch({ status: e.target.value }, 'Status updated')}>{STAT.map(s => <option key={s}>{s}</option>)}</select>
        {it.duplicateOf ? <><span>Duplicate of <Link className="underline" to={'/feedback/' + it.duplicateOf}>#{it.duplicateOf}</Link></span><button className="btn" onClick={() => patch({ duplicateOf: null }, 'Unlinked')}>Unlink</button></>
          : <select aria-label="Mark as duplicate of" className="input !w-auto" value="" onChange={e => e.target.value && confirm('Link this as a duplicate and close it?') && patch({ duplicateOf: Number(e.target.value), status: 'Closed' }, 'Linked as duplicate')}><option value="">Mark as duplicate of…</option>{fb.data.filter(d => d.id !== it.id && !d.duplicateOf).map(d => <option key={d.id} value={d.id}>{d.title}</option>)}</select>}</div>}
      {linked.length > 0 && <div className="text-sm"><b>{linked.length} linked duplicate{linked.length > 1 ? 's' : ''}:</b> {linked.map(l => <Link key={l.id} className="mr-2 underline" to={'/feedback/' + l.id}>{l.title}</Link>)}</div>}
    </div>
    <div className="card space-y-2"><h2 className="font-medium">Comments ({cm.data.length})</h2>
      {cm.data.length ? cm.data.map(c => <p key={c.id} className="text-sm"><b>{c.author}</b>: {c.text}</p>) : <p className="text-sm text-slate-500">No comments yet. Start the discussion.</p>}
      <form onSubmit={comment} className="space-y-1"><textarea className="input" rows={2} placeholder="Add a comment" value={text} onChange={e => setText(e.target.value)} />{err && <p className="text-xs text-red-600">{err}</p>}<button className="btn btn-p">Post comment</button></form></div>
  </>}</div></State>
}
