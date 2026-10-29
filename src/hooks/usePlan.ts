import { useApp } from '../context/AppContext'
import { useRes, all } from './useRes'

export function usePlan() {
  const { wsId } = useApp()
  const sub = useRes('workspaceSubscriptions', { workspaceId: wsId }), plans = useRes('subscriptionPlans')
  const s = sub.data[0]
  return { sub: s, plan: plans.data.find(p => p.id === s?.planId), plans: plans.data, reload: sub.reload, ...all(sub, plans) }
}
export function useLimit(kind: string | undefined, used: number) {
  const { plan } = usePlan()
  const max = kind && plan ? plan.limits[kind] : Infinity
  return { max, used, reached: used >= max, warn: used >= max * 0.8 }
}
