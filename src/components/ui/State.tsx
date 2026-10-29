import { Spin } from './Spin'
import type { R } from '../../types'

export function State({ r, empty, msg = 'Nothing here yet. Create the first item to get started.', children }: R) {
  if (r.loading) return <Spin />
  if (r.error) return <div className="card text-red-600">{r.error} <button className="btn ml-2" onClick={r.reload}>Retry</button></div>
  if (empty) return <p className="card text-slate-500">{msg}</p>
  return <>{children}</>
}
