import { Crud } from '../../components/forms/Crud'
import { STAGES } from '../../constants'

export const Roadmap = () => <div className="space-y-3"><h1 className="text-xl font-semibold">Roadmap Board</h1>
  <Crud res="roadmapItems" title="Roadmap items" limit="roadmapItems" groupBy={{ key: 'stage', values: STAGES }} fields={[{ k: 'title', label: 'Title', req: 1 }, { k: 'description', label: 'Description', type: 'textarea' }, { k: 'stage', label: 'Stage', type: 'select', options: STAGES, req: 1 }, { k: 'published', label: 'Show on public roadmap', type: 'checkbox' }, { k: 'feedbackIds', label: 'Linked feedback', type: 'multi', from: { res: 'feedback', label: 'title' } }]} /></div>
