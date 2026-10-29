import { Crud } from '../../components/forms/Crud'

export const Releases = () => <div className="space-y-3"><h1 className="text-xl font-semibold">Release Notes</h1>
  <Crud res="releaseNotes" title="Release notes" fields={[{ k: 'version', label: 'Version', req: 1 }, { k: 'title', label: 'Title', req: 1 }, { k: 'releaseDate', label: 'Release date', type: 'date', req: 1 }, { k: 'summary', label: 'Summary', type: 'textarea', req: 1 }, { k: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published', 'Archived'], req: 1 }, { k: 'featureIds', label: 'Completed features', type: 'multi', from: { res: 'roadmapItems', label: 'title', q: { stage: 'Completed' } } }]} /></div>
