import { useParams } from 'react-router-dom'
import { useRes, all } from '../../hooks/useRes'
import { State } from '../../components/ui/State'
import { STAGES } from '../../constants'
import type { R } from '../../types'

export function PublicRoadmap() {
  const { id } = useParams(); const w = useRes('workspaces', { id }), items = useRes('roadmapItems', { workspaceId: id, published: true })
  const ws = w.data[0]
  return <div style={{ '--brand': ws?.brandColor } as any} className="mx-auto max-w-6xl space-y-4 p-4">
    <State r={all(w, items)} empty={!ws} msg="Workspace not found.">{ws && (!ws.publicRoadmap ? <p className="card">This roadmap is private.</p> : <>
      <div className="flex items-center gap-3">{ws.logoUrl && <img src={ws.logoUrl} alt="" className="h-10 w-10 rounded" />}<div><h1 className="text-2xl font-bold" style={{ color: ws.brandColor }}>{ws.name} roadmap</h1><p className="text-slate-500">{ws.description}</p></div></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{STAGES.map(s => <div key={s} className="rounded-lg bg-slate-100 p-2"><h2 className="mb-2 text-sm font-semibold">{s}</h2><div className="space-y-2">{items.data.filter(i => i.stage === s).map(i => <div key={i.id} className="card"><div className="font-medium">{i.title}</div><p className="text-sm text-slate-500">{i.description}</p></div>)}{!items.data.some(i => i.stage === s) && <p className="text-xs text-slate-400">Nothing here yet</p>}</div></div>)}</div></>)}
    </State></div>
}
