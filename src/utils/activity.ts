import { api } from '../api/client'
import type { R } from '../types'

export const logAct = (workspaceId: any, user: R, text: string) =>
  api.post('/activityLogs', { workspaceId, user: user.name, text, at: new Date().toISOString() }).catch(() => {})
