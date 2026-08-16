import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiMoreHorizontal, FiPlus, FiMaximize2, FiTrash2, FiEdit2, 
  FiX, FiShare2, FiFilter, FiStar, FiChevronDown, 
  FiInbox, FiCalendar, FiTrello, FiGrid 
} from 'react-icons/fi';
import { BsPlug } from 'react-icons/bs';
import Header from '../components/layout/Header';
import { initialBoard } from '../data/boardData';
import { allBoards } from '../data/boardList';

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(initialBoard);
  const [draggedTask, setDraggedTask] = useState(null);

  // States Thêm & Sửa Task
  const [addingColId, setAddingColId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // States Thêm Cột mới (Add List)
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const selectedBoard = allBoards?.find((item) => item.id === boardId) || {
    title: board.project || 'Kanban Board',
  };

  // --- 1. THÊM CỘT MỚI (NỐI VÀO BÊN PHẢI) ---
  const handleAddColumnSubmit = (e) => {
    e?.preventDefault();
    if (!newColumnTitle.trim()) return;

    const newColumn = {
      id: `col-${Date.now()}`,
      title: newColumnTitle.trim(),
      tasks: [],
    };

    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn], // Nối vào cuối mảng (bên phải cùng)
    }));

    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  // --- 2. THÊM TASK MỚI ---
  const handleAddCardSubmit = (columnId) => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      tag: 'Feature',
      assignee: 'ME',
      color: 'bg-indigo-200',
      memberColor: 'bg-indigo-500',
    };

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: [...col.tasks, newTask],
        };
      }),
    }));

    setNewTaskTitle('');
    setAddingColId(null);
  };

  // --- 3. XÓA TASK ---
  const handleDeleteTask = (columnId, taskId) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        };
      }),
    }));
  };

  // --- 4. SỬA TASK ---
  const handleSaveEdit = (columnId, taskId) => {
    if (!editTitle.trim()) return;

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, title: editTitle.trim() } : t)),
        };
      }),
    }));

    setEditingTaskId(null);
    setEditTitle('');
  };

  // --- 5. DRAG & DROP ---
  const handleDragStart = (e, task, sourceColumnId) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTask({ task, sourceColumnId });
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { task, sourceColumnId } = draggedTask;
    if (sourceColumnId === targetColumnId) return;

    setBoard((prev) => {
      const nextColumns = prev.columns.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      });

      return { ...prev, columns: nextColumns };
    });

    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className="flex h-screen w-screen flex-col overflow-hidden bg-cover bg-center font-sans select-none"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(16, 18, 20, 0.45), rgba(16, 18, 20, 0.75)), url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80')`
      }}
    >
      {/* 1. Main Header */}
      <Header />

      {/* 2. Board Sub-header */}
      <div className="flex h-12 w-full items-center justify-between bg-black/25 px-4 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-base font-bold text-white hover:bg-white/10 px-2 py-1 rounded transition"
          >
            <span>← {selectedBoard.title || board.project}</span>
            <FiChevronDown size={14} />
          </button>
          <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
            {board.workspace}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-white/80 hover:bg-white/10 rounded"><BsPlug size={16} /></button>
          <button className="p-1.5 text-white/80 hover:bg-white/10 rounded"><FiFilter size={16} /></button>
          <button className="p-1.5 text-white/80 hover:bg-white/10 rounded"><FiStar size={16} /></button>
          <button className="flex items-center gap-1.5 rounded bg-white px-3 py-1.5 text-xs font-medium text-[#1d2125] transition hover:bg-white/90">
            <FiShare2 size={13} />
            <span>Share</span>
          </button>
          <button className="p-1.5 text-white/80 hover:bg-white/10 rounded"><FiMoreHorizontal size={16} /></button>
        </div>
      </div>

      {/* 3. Khung Kanban cuộn ngang */}
      <main className="flex flex-1 items-start gap-4 overflow-x-auto p-4 pb-20 scrollbar-thin scrollbar-thumb-white/20">
        
        {/* DANH SÁCH CÁC CỘT KANBAN */}
        {board.columns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="flex max-h-[calc(100vh-160px)] w-[280px] flex-shrink-0 flex-col rounded-xl bg-[#101214]/90 p-2 shadow-xl backdrop-blur-md border border-[#38414a]/40"
          >
            {/* Header Cột */}
            <div className="flex items-center justify-between px-2 py-1.5 text-sm font-semibold text-[#b6c2cf] mb-1">
              <div className="flex items-center gap-2">
                <span className="text-white">{column.title}</span>
                <span className="text-xs text-[#8c9bab] bg-[#22272b] px-1.5 py-0.5 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <button className="rounded p-1 text-[#8c9bab] hover:bg-[#22272b] hover:text-white">
                <FiMoreHorizontal size={16} />
              </button>
            </div>

            {/* Danh sách Task - Cuộn dọc độc lập */}
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-1 py-1 scrollbar-thin scrollbar-thumb-white/10">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                  className="group relative flex cursor-grab active:cursor-grabbing flex-col gap-2 rounded-lg border border-[#38414a]/60 bg-[#22272b] p-3 text-sm text-[#b6c2cf] shadow hover:border-[#579dff] transition-all"
                >
                  {editingTaskId === task.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded bg-[#1d2125] px-2 py-1 text-white border border-[#579dff] focus:outline-none"
                        autoFocus
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSaveEdit(column.id, task.id)}
                          className="rounded bg-[#579dff] px-2.5 py-1 text-xs font-semibold text-[#1d2125]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="rounded p-1 text-[#8c9bab] hover:bg-[#38414a]"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-white text-[13px] leading-snug">
                        {task.title}
                      </span>

                      <div className="flex items-center justify-between pt-1 mt-1 border-t border-[#38414a]/30">
                        {task.tag && (
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded text-slate-800 ${task.color || 'bg-slate-200'}`}>
                            {task.tag}
                          </span>
                        )}
                        {task.assignee && (
                          <div 
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ${task.memberColor || 'bg-blue-600'}`}
                            title={`Assignee: ${task.assignee}`}
                          >
                            {task.assignee}
                          </div>
                        )}
                      </div>

                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 bg-[#22272b] p-1 rounded border border-[#38414a]">
                        <button onClick={() => { setEditingTaskId(task.id); setEditTitle(task.title); }} className="text-[#8c9bab] hover:text-white" title="Edit">
                          <FiEdit2 size={12} />
                        </button>
                        <button onClick={() => handleDeleteTask(column.id, task.id)} className="text-[#8c9bab] hover:text-rose-400" title="Delete">
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Cột - Cố định ở đáy */}
            <div className="mt-2 flex flex-col px-1">
              {addingColId === column.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    rows="2"
                    placeholder="Enter a title for this card..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full rounded-md bg-[#22272b] p-2 text-xs text-white border border-[#579dff] focus:outline-none resize-none shadow-inner"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddCardSubmit(column.id)}
                      className="rounded bg-[#579dff] px-3 py-1.5 text-xs font-semibold text-[#1d2125] hover:bg-[#85b8ff]"
                    >
                      Add card
                    </button>
                    <button
                      onClick={() => setAddingColId(null)}
                      className="rounded p-1.5 text-[#8c9bab] hover:bg-[#22272b] hover:text-white"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setAddingColId(column.id)}
                    className="flex flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-[#8c9bab] transition hover:bg-[#22272b] hover:text-white"
                  >
                    <FiPlus size={15} />
                    <span>Add a card</span>
                  </button>
                  <button className="ml-1 rounded p-1.5 text-[#8c9bab] transition hover:bg-[#22272b] hover:text-white" title="Create from template">
                    <FiMaximize2 size={13} />
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}

        {/* NÚT / FORM "ADD ANOTHER LIST" - ĐẶT Ở PHÍA BÊN PHẢI CÙNG */}
        <div className="w-[280px] flex-shrink-0">
          {isAddingColumn ? (
            <form onSubmit={handleAddColumnSubmit} className="flex flex-col gap-2 rounded-xl bg-[#101214] p-3 shadow-2xl border border-[#38414a]">
              <input
                type="text"
                placeholder="Enter list name..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                className="w-full rounded-md border border-[#579dff] bg-[#22272b] px-3 py-1.5 text-sm text-white placeholder-[#8c9bab] focus:outline-none"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded bg-[#579dff] px-3 py-1.5 text-xs font-semibold text-[#1d2125] hover:bg-[#85b8ff] transition"
                >
                  Add list
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnTitle('');
                  }}
                  className="rounded p-1 text-[#8c9bab] hover:bg-[#22272b] hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="flex w-full items-center gap-2 rounded-xl bg-white/20 p-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/30"
            >
              <FiPlus size={18} />
              <span>Add another list</span>
            </button>
          )}
        </div>

      </main>

      {/* 4. Bottom Dock */}
      <div className="fixed bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-[#1d2125]/90 p-1.5 shadow-2xl backdrop-blur-md border border-[#38414a] z-50">
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[#8c9bab] hover:bg-[#282e33] hover:text-white">
          <FiInbox size={14} />
          <span>Inbox</span>
        </button>
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[#8c9bab] hover:bg-[#282e33] hover:text-white">
          <FiCalendar size={14} />
          <span>Planner</span>
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-[#0055cc]/30 px-3 py-1.5 text-xs font-medium text-[#579dff]">
          <FiTrello size={14} />
          <span>Board</span>
        </button>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[#8c9bab] hover:bg-[#282e33] hover:text-white"
        >
          <FiGrid size={14} />
          <span>Switch boards</span>
        </button>
      </div>
    </div>
  );
}