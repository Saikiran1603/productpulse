import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'
import { useRes } from '../../hooks/useRes'
import { useLimit } from '../../hooks/usePlan'
import { Warn } from '../../components/ui/Warn'
import { Spin } from '../../components/ui/Spin'
import { Form } from '../../components/forms/Form'
import { logAct } from '../../utils/activity'
import { MGR, PRI, STAT } from '../../constants'
import type { R } from '../../types'

export function FeedbackForm() {
  const { id } = useParams(); const { wsId, user, role, toast } = useApp(); const nav = useNavigate()
  const fb = useRes('feedback', { workspaceId: wsId }); const lim = useLimit('feedback', fb.data.length)
  const ex = fb.data.find(x => String(x.id) === id); const mgr = MGR.includes(role)
  if (fb.loading) return <Spin />
  if (id && !ex) return <p className="card">Feedback not found.</p>
  if (ex && !mgr && ex.submitterId !== user.id) return <p className="card text-red-600">You can only edit your own feedback.</p>
  if (!id && lim.reached) return <div className="space-y-2"><Warn lim={lim} label="feedback items" /><Link className="btn" to="/feedback">Back</Link></div>
  const fields = [{ k: 'title', label: 'Title', req: 1 }, { k: 'description', label: 'Description', type: 'textarea', req: 1 },
    { k: 'categoryId', label: 'Category', type: 'select', req: 1, from: { res: 'categories', label: 'name' } }, { k: 'tagIds', label: 'Tags', type: 'multi', from: { res: 'tags', label: 'name' } },
    ...(mgr ? [{ k: 'priority', label: 'Priority', type: 'select', options: PRI, req: 1 }, { k: 'status', label: 'Status', type: 'select', options: STAT, req: 1 }] : [])]
  const save = async (v: R) => {
    try {
      if (id) await api.patch('/feedback/' + id, v)
      else await api.post('/feedback', { priority: 'Medium', status: 'Open', tagIds: [], ...v, submitter: user.name, submitterId: user.id, workspaceId: wsId, createdAt: new Date().toISOString() })
      logAct(wsId, user, `${id ? 'edited' : 'submitted'} feedback: ${v.title}`); toast('Feedback saved'); nav('/feedback')
    } catch { toast('Could not save feedback', 'error') }
  }
  return <div className="space-y-3"><h1 className="text-xl font-semibold">{id ? 'Edit' : 'New'} feedback</h1><Warn lim={lim} label="feedback items" /><Form inline fields={fields} init={ex || {}} onSave={save} onClose={() => nav('/feedback')} /></div>
}
