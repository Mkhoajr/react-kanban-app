import { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiMoreHorizontal, FiPlus, FiMaximize2, FiTrash2, FiEdit2,
  FiX, FiShare2, FiFilter, FiStar, FiChevronDown,
  FiInbox, FiCalendar, FiTrello, FiGrid
} from 'react-icons/fi';
import { BsPlug } from 'react-icons/bs';
import Header from '../components/ui/header';
import InboxDrawer from '../components/inbox/InboxDrawer';
import { initialBoard } from '../data/boardData';
import { allBoards } from '../data/boardList';
import { initialInboxItems } from '../data/inboxData';

// Helper: Tính vị trí chèn trong cột dựa trên vị trí con trỏ so với đường giữa của các thẻ
// Trả về index theo "không gian hiển thị" (vẫn bao gồm thẻ đang kéo)
function computeDropPosition(e, containerEl, fallback) {
  let position = fallback;
  const cards = containerEl.querySelectorAll('[data-card-index]');
  for (const cardEl of cards) {
    const rect = cardEl.getBoundingClientRect();
    if (e.clientY < rect.top + rect.height / 2) {
      position = Number(cardEl.dataset.cardIndex);
      break;
    }
  }
  return position;
}

export default function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  // Khởi tạo board từ localStorage (nếu có) hoặc fallback về initialBoard
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem(`kanban_board_${boardId || 'default'}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved board', e);
      }
    }
    return initialBoard;
  });

  // Tự động đồng bộ khi chuyển đổi boardId
  useEffect(() => {
    const saved = localStorage.getItem(`kanban_board_${boardId || 'default'}`);
    if (saved) {
      try {
        setBoard(JSON.parse(saved));
        return;
      } catch (e) {
        console.error('Failed to parse saved board', e);
      }
    }
    setBoard(initialBoard);
  }, [boardId]);

  // Lưu trạng thái board vào localStorage mỗi khi có cập nhật
  useEffect(() => {
    if (board) {
      localStorage.setItem(`kanban_board_${boardId || 'default'}`, JSON.stringify(board));
    }
  }, [board, boardId]);

  // States Drag & Drop
  const [draggedTask, setDraggedTask] = useState(null); // { task, sourceColumnId, inboxItemId? }
  const [dropTarget, setDropTarget] = useState(null); // { columnId, index } - index theo không gian hiển thị

  // States Inbox Drawer
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxItems, setInboxItems] = useState(initialInboxItems);

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

  const unconvertedInboxCount = inboxItems.filter((i) => !i.isConverted).length;

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
      columns: [...prev.columns, newColumn],
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

  // --- 5. DRAG & DROP LOGIC (Trello-style với drop indicator trực quan) ---
  const handleDragStart = (e, task, sourceColumnId) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    setDraggedTask({ task, sourceColumnId });
  };

  const handleDragStartInboxItem = (e, item) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', item.id);
    const task = {
      id: `task-inbox-${Date.now()}`,
      title: item.title,
      tag: item.tag || 'Email',
      assignee: item.sender.slice(0, 2).toUpperCase(),
      color: 'bg-indigo-200',
      memberColor: item.avatarBg || 'bg-rose-500',
      description: item.snippet,
    };
    setDraggedTask({ task, sourceColumnId: 'inbox', inboxItemId: item.id });
  };

  const handleAddInboxItemToColumn = (item, targetColumnId) => {
    const newTask = {
      id: `task-inbox-${Date.now()}`,
      title: item.title,
      tag: item.tag || 'Email',
      assignee: item.sender.slice(0, 2).toUpperCase(),
      color: 'bg-indigo-200',
      memberColor: item.avatarBg || 'bg-rose-500',
      description: item.snippet,
    };

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        if (col.id !== targetColumnId) return col;
        return {
          ...col,
          tasks: [...col.tasks, newTask],
        };
      }),
    }));

    setInboxItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isConverted: true } : i))
    );
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDropTarget(null);
  };

  // Kéo qua cột: tính vị trí chèn theo khoảng cách con trỏ đến đường giữa của từng thẻ
  const handleColumnDragOver = (e, columnId) => {
    if (!draggedTask) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedTask.sourceColumnId === 'inbox' ? 'copy' : 'move';

    const col = board.columns.find((c) => c.id === columnId);
    if (!col) return;

    const position = computeDropPosition(e, e.currentTarget, col.tasks.length);

    setDropTarget((prev) =>
      prev && prev.columnId === columnId && prev.index === position
        ? prev
        : { columnId, index: position }
    );
  };

  // Rời khỏi cột thì ẩn placeholder (trừ khi đang rê sang con của cột)
  const handleColumnDragLeave = (e, columnId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDropTarget((prev) => (prev?.columnId === columnId ? null : prev));
  };

  const handleDropOnColumn = (e, targetColumnId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedTask) return;

    const col = board.columns.find((c) => c.id === targetColumnId);
    const position = col ? computeDropPosition(e, e.currentTarget, col.tasks.length) : 0;
    executeDrop(targetColumnId, position);
  };

  const executeDrop = (targetColumnId, position) => {
    if (!draggedTask) return;

    const { task, sourceColumnId, inboxItemId } = draggedTask;

    // 1. Kéo từ Inbox vào Board (thêm mới, không cần điều chỉnh index)
    if (sourceColumnId === 'inbox') {
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id !== targetColumnId) return col;
          const newTasks = [...col.tasks];
          newTasks.splice(Math.max(0, Math.min(position, newTasks.length)), 0, task);
          return { ...col, tasks: newTasks };
        }),
      }));

      if (inboxItemId) {
        setInboxItems((prev) =>
          prev.map((i) => (i.id === inboxItemId ? { ...i, isConverted: true } : i))
        );
      }
      handleDragEnd();
      return;
    }

    // 2. Đổi coordinate từ "không gian hiển thị" (chưa trừ thẻ đang kéo)
    //    sang index chèn thực sự sau khi đã loại thẻ đó ra khỏi danh sách
    let insertAt = position;
    if (sourceColumnId === targetColumnId) {
      const col = board.columns.find((c) => c.id === targetColumnId);
      const sourceIndex = col ? col.tasks.findIndex((t) => t.id === task.id) : -1;
      if (sourceIndex !== -1) {
        insertAt = position > sourceIndex ? position - 1 : position;
        // Thả đúng chỗ cũ -> không cần update
        if (insertAt === sourceIndex) {
          handleDragEnd();
          return;
        }
      }
    }

    // 3. Di chuyển thẻ: loại khỏi cột nguồn + chèn vào cột đích
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => {
        let tasks = col.tasks;
        if (col.id === sourceColumnId) {
          tasks = tasks.filter((t) => t.id !== task.id);
        }
        if (col.id === targetColumnId) {
          const safeIndex = Math.max(0, Math.min(insertAt, tasks.length));
          tasks = [...tasks];
          tasks.splice(safeIndex, 0, task);
        }
        return tasks === col.tasks ? col : { ...col, tasks };
      }),
    }));
    handleDragEnd();
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
          {/* Nút Toggle Inbox */}
          <button
            onClick={() => setIsInboxOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition border ${isInboxOpen
              ? 'bg-[#579dff] text-[#1d2125] border-[#579dff]'
              : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
            title="Mở / Đóng Inbox"
          >
            <FiInbox size={14} />
            <span>Inbox</span>
            {unconvertedInboxCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unconvertedInboxCount}
              </span>
            )}
          </button>

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
        {board.columns.map((column) => {
          const isDropTarget = dropTarget?.columnId === column.id;
          const draggedSourceIndex =
            draggedTask?.sourceColumnId === column.id
              ? column.tasks.findIndex((t) => t.id === draggedTask.task.id)
              : -1;

          // Placeholder chỉ hiện ở đúng vị trí đang rê chuột; ẩn khi thả đúng chỗ cũ
          const showPlaceholderAt = (index) =>
            isDropTarget &&
            dropTarget.index === index &&
            !(
              draggedSourceIndex !== -1 &&
              (index === draggedSourceIndex || index === draggedSourceIndex + 1)
            );

          const renderPlaceholder = () => (
            <div className="h-16 w-full shrink-0 rounded-lg border-2 border-dashed border-[#579dff]/50 bg-[#579dff]/10" />
          );

          return (
          <div
            key={column.id}
            onDragOver={(e) => handleColumnDragOver(e, column.id)}
            onDrop={(e) => handleDropOnColumn(e, column.id)}
            onDragLeave={(e) => handleColumnDragLeave(e, column.id)}
            className={`flex max-h-[calc(100vh-160px)] w-[280px] flex-shrink-0 flex-col rounded-xl bg-[#101214]/90 p-2 shadow-xl backdrop-blur-md border transition-all duration-150 ${
              isDropTarget
                ? 'border-[#579dff] ring-1 ring-[#579dff]/40 bg-[#161a1d]'
                : 'border-[#38414a]/40'
            }`}
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
            <div
              className="flex min-h-[50px] flex-1 flex-col gap-2 overflow-y-auto px-1 py-1 scrollbar-thin scrollbar-thumb-white/10"
            >
              {column.tasks.map((task, index) => (
                <Fragment key={task.id}>
                  {/* Drop indicator: khe hở tại vị trí sẽ chèn thẻ */}
                  {showPlaceholderAt(index) && renderPlaceholder()}
                  <div
                    data-card-index={index}
                    draggable={editingTaskId !== task.id}
                    onDragStart={(e) => handleDragStart(e, task, column.id)}
                    onDragEnd={handleDragEnd}
                    className={`group relative flex cursor-grab active:cursor-grabbing flex-col gap-2 rounded-lg border bg-[#22272b] p-3 text-sm text-[#b6c2cf] shadow transition-all duration-150 ${
                      draggedTask?.task?.id === task.id
                        ? 'opacity-30 border-dashed border-[#579dff] scale-[0.98]'
                        : 'border-[#38414a]/60 hover:border-[#579dff]'
                    }`}
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
                </Fragment>
              ))}

              {/* Drop indicator ở cuối danh sách */}
              {showPlaceholderAt(column.tasks.length) && renderPlaceholder()}

              {/* Hiển thị khi cột trống */}
              {column.tasks.length === 0 && !showPlaceholderAt(0) && (
                <div className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#38414a]/40 text-xs text-[#8c9bab]/40">
                  Empty list
                </div>
              )}
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
          );
        })}

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
        <button
          onClick={() => setIsInboxOpen((prev) => !prev)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${isInboxOpen
            ? 'bg-[#579dff] text-[#1d2125] font-semibold'
            : 'text-[#8c9bab] hover:bg-[#282e33] hover:text-white'
            }`}
        >
          <FiInbox size={14} />
          <span>Inbox {unconvertedInboxCount > 0 ? `(${unconvertedInboxCount})` : ''}</span>
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

      {/* 5. Left Inbox Drawer */}
      <InboxDrawer
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        inboxItems={inboxItems}
        onDragStartInboxItem={handleDragStartInboxItem}
        onAddInboxItemToColumn={handleAddInboxItemToColumn}
        columns={board.columns}
      />
    </div>
  );
}