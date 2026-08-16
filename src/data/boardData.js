export const initialBoard = {
  workspace: 'Design team',
  project: 'Software Project',
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      accent: 'bg-slate-300',
      tasks: [
        {
          id: 'b1',
          title: 'Layouts usability test',
          tag: 'UX',
          assignee: 'AL',
          color: 'bg-rose-200',
          memberColor: 'bg-rose-400',
        },
        {
          id: 'b2',
          title: 'SWIFT UI exploration',
          tag: 'Design',
          assignee: 'NG',
          color: 'bg-cyan-200',
          memberColor: 'bg-cyan-500',
        },
        {
          id: 'b3',
          title: 'Fields spec - priority',
          tag: 'Research',
          assignee: 'JS',
          color: 'bg-emerald-200',
          memberColor: 'bg-emerald-500',
        },
        {
          id: 'b4',
          title: 'Blog about how to best use Jira for designers',
          tag: 'Content',
          assignee: 'DT',
          color: 'bg-violet-200',
          memberColor: 'bg-violet-500',
        },
      ],
    },
    {
      id: 'explore',
      title: 'Exploring',
      accent: 'bg-amber-300',
      tasks: [
        {
          id: 'e1',
          title: 'Workflow spec - editing transition',
          tag: 'Workflow',
          assignee: 'BK',
          color: 'bg-blue-200',
          memberColor: 'bg-blue-500',
        },
        {
          id: 'e2',
          title: 'Fields spec - show more custom fields',
          tag: 'Fields',
          assignee: 'RW',
          color: 'bg-emerald-200',
          memberColor: 'bg-emerald-500',
        },
        {
          id: 'e3',
          title: 'Rule 3: Update an assignee',
          tag: 'Rules',
          assignee: 'PM',
          color: 'bg-fuchsia-200',
          memberColor: 'bg-fuchsia-500',
        },
      ],
    },
    {
      id: 'active',
      title: 'Active research',
      accent: 'bg-emerald-300',
      tasks: [
        {
          id: 'a1',
          title: 'Terminology testing - issues',
          tag: 'QA',
          assignee: 'TR',
          color: 'bg-pink-200',
          memberColor: 'bg-pink-500',
        },
        {
          id: 'a2',
          title: 'Project settings - navigation test',
          tag: 'Testing',
          assignee: 'SK',
          color: 'bg-yellow-200',
          memberColor: 'bg-yellow-500',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      accent: 'bg-sky-300',
      tasks: [
        {
          id: 'd1',
          title: 'Analytics dashboard polish',
          tag: 'Analytics',
          assignee: 'AR',
          color: 'bg-orange-200',
          memberColor: 'bg-orange-500',
        },
      ],
    },
  ],
};

export const boardFilters = [
  { label: 'Workspace', value: 'workspace' },
  { label: 'Recent', value: 'recent' },
  { label: 'Starred', value: 'starred' },
  { label: 'Templates', value: 'templates' },
];

export const sidebarNav = [
  { id: 'workspace', label: 'Workspace', icon: 'workspace', active: true },
  { id: 'boards', label: 'Boards', icon: 'board' },
  { id: 'members', label: 'Members', icon: 'users' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'table', label: 'Table', icon: 'table' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
];