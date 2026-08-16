export default function TaskCard({ task, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart?.(event, task)}
      className="cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {task.tag}
        </span>
        <button type="button" className="text-slate-400 hover:text-slate-600">
          ⋯
        </button>
      </div>

      <h4 className="text-[15px] font-medium leading-6 text-slate-700">{task.title}</h4>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex -space-x-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-slate-700 ${task.memberColor}`}
          >
            {task.assignee}
          </div>
        </div>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
          {task.tag}
        </span>
      </div>
    </div>
  );
}