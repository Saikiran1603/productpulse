import { useApp } from '../../context/AppContext'
import { useRes } from '../../hooks/useRes'
import type { R } from '../../types'

export function Field({ f, v, set, err }: R) {
  const { wsId } = useApp()
  const src = useRes(f.from ? f.from.res : null, { workspaceId: wsId, ...(f.from?.q || {}) })
  const opts = f.from ? src.data.map(d => ({ v: d.id, l: d[f.from.label] })) : (f.options || []).map((o: string) => ({ v: o, l: o }))
  let el
  if (f.type === 'textarea') el = <textarea className="input" rows={3} value={v || ''} onChange={e => set(e.target.value)} />
  else if (f.type === 'select') el = <select className="input" value={v ?? ''} onChange={e => set(f.from ? Number(e.target.value) || '' : e.target.value)}><option value="">Select…</option>{opts.map((o: R) => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
  else if (f.type === 'multi') el = <div className="flex flex-wrap gap-2">{opts.map((o: R) => <label key={o.v} className="badge"><input type="checkbox" checked={(v || []).includes(o.v)} onChange={() => set((v || []).includes(o.v) ? v.filter((x: any) => x !== o.v) : [...(v || []), o.v])} /> {o.l}</label>)}{!opts.length && <span className="text-sm text-slate-400">No options available</span>}</div>
  else if (f.type === 'checkbox') el = <input type="checkbox" checked={!!v} onChange={e => set(e.target.checked)} />
  else el = <input className="input" type={f.type === 'date' || f.type === 'color' ? f.type : 'text'} value={v || ''} onChange={e => set(e.target.value)} />
  return <label className="block text-sm"><span className="mb-1 block font-medium">{f.label}{f.req && ' *'}</span>{el}{err && <span className="text-xs text-red-600">{err}</span>}</label>
}
