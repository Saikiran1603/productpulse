import { useState } from 'react'
import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'
import { useRes } from '../../hooks/useRes'
import { useLimit } from '../../hooks/usePlan'
import { State } from '../ui/State'
import { Warn } from '../ui/Warn'
import { Form } from './Form'
import { fmt } from '../../utils/format'
import { logAct } from '../../utils/activity'
import type { R } from '../../types'

export function Crud({ res, title, fields, canEdit = true, limit, groupBy, guard, prep }: R) {
  const { wsId, user, toast } = useApp()
  const r = useRes(res, { workspaceId: wsId }); const lim = useLimit(limit, r.data.length)
  const [edit, setEdit] = useState<R | null>(null)
  const name = (it: R) => it[fields[0].k]
  const done = (m: string, t: string) => { toast(m); logAct(wsId, user, t); r.reload() }
  const save = async (v0: R) => {
    try {
      let v = v0; if (!v.id && prep) v = await prep(v)
      if (v.id) await api.patch(`/${res}/${v.id}`, v)
      else { if (lim.reached) return toast('Plan limit reached', 'error'); await api.post('/' + res, { ...v, workspaceId: wsId, createdAt: new Date().toISOString() }) }
      setEdit(null); done('Saved', `${v.id ? 'Updated' : 'Created'} ${title}: ${name(v)}`)
      setTimeout(r.reload, 150)
    } catch { toast('Save failed. Try again.', 'error') }
  }
  const del = async (it: R) => {
    const g = guard?.(it); if (g) return toast(g, 'error')
    if (!confirm(`Delete "${name(it)}"? This cannot be undone.`)) return
    try { await api.delete(`/${res}/${it.id}`); done('Deleted', `Deleted ${title}: ${name(it)}`) } catch { toast('Delete failed', 'error') }
  }
  const move = async (it: R, s: string) => { try { await api.patch(`/${res}/${it.id}`, { [groupBy.key]: s }); done('Stage updated', `Moved ${name(it)} to ${s}`) } catch { toast('Update failed', 'error') } }
  const card = (it: R) => <div key={it.id} className="card">
    <div className="font-medium">{name(it)}</div>
    <div className="space-y-0.5 text-sm text-slate-500">{fields.slice(1).filter((f: R) => it[f.k] !== undefined && it[f.k] !== '' && !(Array.isArray(it[f.k]) && !it[f.k].length)).map((f: R) => <div key={f.k}><b>{f.label}:</b> {fmt(it[f.k])}</div>)}</div>
    {canEdit && <div className="mt-2 flex flex-wrap gap-2">
      {groupBy && <select aria-label="Stage" className="input !w-auto" value={it[groupBy.key]} onChange={e => move(it, e.target.value)}>{groupBy.values.map((s: string) => <option key={s}>{s}</option>)}</select>}
      <button className="btn" onClick={() => setEdit(it)}>Edit</button><button className="btn text-red-600" onClick={() => del(it)}>Delete</button></div>}
  </div>
  return <div className="space-y-3">
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2>{canEdit && <button className="btn btn-p" disabled={lim.reached} onClick={() => setEdit({})}>+ New</button>}</div>
    {limit && <Warn lim={lim} label={limit} />}
    <State r={r} empty={!r.data.length}>
      {groupBy ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{groupBy.values.map((s: string) => <div key={s} className="rounded-lg bg-slate-100 p-2"><h3 className="mb-2 text-sm font-semibold">{s} ({r.data.filter(i => i[groupBy.key] === s).length})</h3><div className="space-y-2">{r.data.filter(i => i[groupBy.key] === s).map(card)}</div></div>)}</div>
        : <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{r.data.map(card)}</div>}
    </State>
    {edit && <Form fields={fields} init={edit} onSave={save} onClose={() => setEdit(null)} title={`${edit.id ? 'Edit' : 'New'} ${title}`} />}
  </div>
}
