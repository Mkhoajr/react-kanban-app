import Column from './Column';

export default function KanbanBoard({ columns, onAddCard, onDragStart, onDrop }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          onAddCard={onAddCard}
          onDragStart={onDragStart}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}