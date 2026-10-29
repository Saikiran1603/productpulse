import { api } from '../../api/client'
import { Crud } from '../../components/forms/Crud'
import { ROLES } from '../../constants'
import type { R } from '../../types'

export function Team() {
  const prep = async (v: R) => { const { data } = await api.get('/users', { params: { email: v.email } }); let u = data[0]; if (!u) u = (await api.post('/users', { name: v.name, email: v.email, password: 'demo' })).data; return { ...v, userId: u.id } }
  return <div className="space-y-3"><h1 className="text-xl font-semibold">Team & Roles</h1>
    <Crud res="workspaceMembers" title="Members" limit="members" prep={prep} guard={(m: R) => m.role === 'owner' ? 'The workspace owner cannot be removed' : ''}
      fields={[{ k: 'name', label: 'Name', req: 1 }, { k: 'email', label: 'Email', type: 'email', req: 1 }, { k: 'role', label: 'Role', type: 'select', options: ROLES, req: 1 }, { k: 'status', label: 'Status', type: 'select', options: ['Active', 'Invited', 'Suspended'], req: 1 }]} /></div>
}
