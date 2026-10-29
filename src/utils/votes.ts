import { api } from '../api/client'
import type { R } from '../types'

export const toggleVote = async (wsId: any, uid: any, fid: any, votes: R[]) => {
  const mine = votes.find(v => v.feedbackId === fid && v.userId === uid)
  if (mine) return api.delete('/votes/' + mine.id)
  const chk = await api.get('/votes', { params: { feedbackId: fid, userId: uid } }) // prevent duplicate votes
  if (!chk.data.length) await api.post('/votes', { workspaceId: wsId, feedbackId: fid, userId: uid })
}
