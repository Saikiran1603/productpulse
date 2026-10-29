import { useState } from 'react'
import { Field } from './Field'
import type { R } from '../../types'

export function Form({ fields, init, onSave, onClose, title, inline, submitLabel = 'Save changes' }: R) {
  const [v, setV] = useState<R>(init); const [err, setErr] = useState<R>({}); const [busy, setBusy] = useState(false)
  const submit = async (e: any) => {
    e.preventDefault(); const er: R = {}
    fields.forEach((f: R) => {
      const x = v[f.k]
      if (f.req && (x === undefined || x === '' || (Array.isArray(x) && !x.length))) er[f.k] = 'This field is required'
      else if (f.type === 'email' && x && !/^\S+@\S+\.\S+$/.test(x)) er[f.k] = 'Enter a valid email address'
      else if (f.type === 'url' && x && !/^https?:\/\//.test(x)) er[f.k] = 'Enter a URL starting with http(s)://'
    })
    setErr(er); if (Object.keys(er).length) return
    setBusy(true); await onSave(v); setBusy(false)
  }
  const body = <form onSubmit={submit} className="space-y-3">
    {fields.map((f: R) => <Field key={f.k} f={f} v={v[f.k]} err={err[f.k]} set={(x: any) => setV({ ...v, [f.k]: x })} />)}
    <div className="flex gap-2"><button className="btn btn-p" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>{onClose && <button type="button" className="btn" onClick={onClose}>Cancel</button>}</div></form>
  return inline ? <div className="card max-w-xl">{body}</div>
    : <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/40 p-4"><div className="card w-full max-w-lg">{title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}{body}</div></div>
}
