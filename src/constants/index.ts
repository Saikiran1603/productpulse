export const STAGES = ['Under Review', 'Planned', 'In Progress', 'Completed']
export const PRI = ['Low', 'Medium', 'High', 'Critical']
export const STAT = ['Open', 'Under Review', 'Planned', 'In Progress', 'Completed', 'Closed']
export const ROLES = ['owner', 'admin', 'pm', 'customer']
export const MGR = ['owner', 'admin', 'pm']
export const NAV: [string, string, string[]][] = [
  ['dashboard', 'Dashboard', MGR], ['feedback', 'Feedback', ROLES], ['roadmap', 'Roadmap Board', MGR],
  ['categories', 'Categories & Tags', MGR], ['releases', 'Release Notes', MGR],
  ['team', 'Team & Roles', ['owner', 'admin']], ['plan', 'Subscription & Usage', ['owner']], ['settings', 'Workspace Settings', ['owner']]]
