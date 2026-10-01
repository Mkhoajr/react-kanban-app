import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/header';
import { FiLayout, FiPlus, FiStar } from 'react-icons/fi';

const TEMPLATES = [
  {
    id: 'kanban-basic',
    title: 'Basic Kanban Board',
    description: 'A simple To Do, Doing, Done workflow for agile teams.',
    category: 'Project Management',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    id: 'product-roadmap',
    title: 'Product Roadmap',
    description: 'Track high-level product features and quarterly releases.',
    category: 'Product',
    gradient: 'from-purple-600 to-indigo-500',
  },
  {
    id: 'bug-tracking',
    title: 'Bug Tracking & QA',
    description: 'Capture bugs, assign priorities, and track resolution status.',
    category: 'Engineering',
    gradient: 'from-rose-600 to-orange-500',
  },
  {
    id: 'content-calendar',
    title: 'Content Editorial Calendar',
    description: 'Plan, draft, and publish marketing and blog content seamlessly.',
    category: 'Marketing',
    gradient: 'from-emerald-600 to-teal-500',
  },
];

export default function TemplatesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1d2125] text-[#9fadbc] font-sans">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-white text-xl font-bold mb-2">
            <FiLayout className="text-[#579dff]" />
            <h1>Featured Trello & Kanban Templates</h1>
          </div>
          <p className="text-sm text-[#8c9bab]">
            Get started quickly with pre-built board structures tailored for any team or workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group rounded-xl bg-[#22272b] border border-[#38414a] overflow-hidden hover:border-[#579dff] transition-all flex flex-col justify-between"
            >
              <div className={`h-32 bg-gradient-to-r ${tmpl.gradient} p-4 flex flex-col justify-between`}>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded text-white self-start">
                  {tmpl.category}
                </span>
                <h3 className="text-lg font-bold text-white drop-shadow">{tmpl.title}</h3>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#8c9bab] mb-4">{tmpl.description}</p>
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#282e33] py-2 text-xs font-semibold text-[#b6c2cf] group-hover:bg-[#579dff] group-hover:text-[#1d2125] transition"
                >
                  <FiPlus size={14} /> Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
