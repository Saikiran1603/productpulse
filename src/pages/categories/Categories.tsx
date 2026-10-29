import { useApp } from '../../context/AppContext'
import { Crud } from '../../components/forms/Crud'
import { MGR } from '../../constants'

export const Categories = () => { const { role } = useApp(); const ok = MGR.includes(role); return <div className="space-y-6"><h1 className="text-xl font-semibold">Categories & Tags</h1>
  <Crud res="categories" title="Categories" canEdit={ok} fields={[{ k: 'name', label: 'Name', req: 1 }, { k: 'description', label: 'Description' }]} />
  <Crud res="tags" title="Tags" canEdit={ok} fields={[{ k: 'name', label: 'Name', req: 1 }]} /></div> }
