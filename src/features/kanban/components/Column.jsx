import TaskCard from './TaskCard';

export default function Column({ column, onAddCard, onDragStart, onDrop }) {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop?.(event, column.id)}
      className="min-w-[270px] flex-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-3 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            {column.title}
          </h3>
        </div>
        <button type="button" className="text-slate-400 hover:text-slate-600">
          ⋯
        </button>
      </div>

      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}

        <button
          type="button"
          onClick={() => onAddCard(column.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-transparent py-3 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
        >
          <span className="text-xl leading-none">+</span>
          Add a card
        </button>
      </div>
    </div>
  );
}