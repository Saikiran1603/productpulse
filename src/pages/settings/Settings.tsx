import { api } from '../../api/client'
import { useApp } from '../../context/AppContext'
import { Form } from '../../components/forms/Form'
import { logAct } from '../../utils/activity'
import type { R } from '../../types'

export function Settings() {
  const { ws, wsId, user, toast, refreshWs } = useApp()
  const save = async (v: R) => { try { await api.patch('/workspaces/' + wsId, v); logAct(wsId, user, 'updated workspace settings'); toast('Settings saved'); refreshWs(); setTimeout(refreshWs, 150) } catch { toast('Could not save settings', 'error') } }
  return <div className="space-y-3"><h1 className="text-xl font-semibold">Workspace Settings</h1>
    <Form key={`${wsId}-${ws?.name}-${ws?.description}-${ws?.brandColor}-${ws?.publicRoadmap}`} inline init={ws || {}} onSave={save} fields={[{ k: 'name', label: 'Name', req: 1 }, { k: 'description', label: 'Description', type: 'textarea' }, { k: 'logoUrl', label: 'Logo URL', type: 'url' }, { k: 'brandColor', label: 'Brand color', type: 'color', req: 1 }, { k: 'publicRoadmap', label: 'Make the public roadmap visible', type: 'checkbox' }]} />
    <p className="text-sm">Public link: <a className="underline" href={'/public/' + wsId} target="_blank" rel="noreferrer">{location.origin}/public/{wsId}</a></p></div>
}
