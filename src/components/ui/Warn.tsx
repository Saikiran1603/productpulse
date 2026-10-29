import type { R } from '../../types'

export const Warn = ({ lim, label }: R) => (lim.warn && lim.max !== Infinity) ? <div className={`rounded-md border p-2 text-sm ${lim.reached ? 'border-red-300 bg-red-50 text-red-700' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
  {lim.reached ? `Plan limit reached for ${label}` : `Approaching plan limit for ${label}`} ({lim.used}/{lim.max}). Upgrade on the Subscription page.</div> : null
