import React, { useState, useMemo } from 'react';
import { 
  FiX, 
  FiSearch, 
  FiMail, 
  FiPlus, 
  FiPaperclip, 
  FiClock, 
  FiCheck, 
  FiMove,
  FiMessageSquare,
  FiGlobe,
  FiLayers
} from 'react-icons/fi';
import { SiGmail, SiGooglechrome } from 'react-icons/si';
import { BsMicrosoftTeams } from 'react-icons/bs';

export default function InboxDrawer({ 
  isOpen, 
  onClose, 
  inboxItems, 
  onDragStartInboxItem,
  onAddInboxItemToColumn,
  columns = []
}) {
  const [activeTab, setActiveTab] = useState('gmail'); // default to 'gmail' as requested
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnPickerId, setShowColumnPickerId] = useState(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return inboxItems.filter((item) => {
      const matchSource = activeTab === 'all' || item.source === activeTab;
      const matchSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.snippet.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSource && matchSearch;
    });
  }, [inboxItems, activeTab, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: inboxItems.length,
      gmail: inboxItems.filter(i => i.source === 'gmail').length,
      teams: inboxItems.filter(i => i.source === 'teams').length,
      chrome: inboxItems.filter(i => i.source === 'chrome').length,
    };
  }, [inboxItems]);

  const getSourceBadge = (source) => {
    switch (source) {
      case 'gmail':
        return (
          <span className="flex items-center gap-1 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/20">
            <SiGmail size={10} />
            <span>Gmail</span>
          </span>
        );
      case 'teams':
        return (
          <span className="flex items-center gap-1 rounded bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
            <BsMicrosoftTeams size={10} />
            <span>Teams</span>
          </span>
        );
      case 'chrome':
        return (
          <span className="flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
            <SiGooglechrome size={10} />
            <span>Chrome</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen w-88 max-w-[90vw] flex-col border-r border-[#38414a]/80 bg-[#161a1d] text-[#b6c2cf] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#282e33] px-4 py-3 bg-[#1d2125]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#579dff]/20 text-[#579dff]">
              <FiMail size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Inbox
                <span className="rounded-full bg-[#282e33] px-2 py-0.2 text-[11px] font-medium text-[#8c9bab]">
                  {counts[activeTab] || 0}
                </span>
              </h2>
              <p className="text-[11px] text-[#8c9bab]">Chuyển đổi email & tin nhắn thành thẻ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8c9bab] hover:bg-[#282e33] hover:text-white transition"
            title="Đóng Inbox"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Source Tabs */}
        <div className="flex items-center border-b border-[#282e33] bg-[#1a1f24] px-2 py-1 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('gmail')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition ${
              activeTab === 'gmail'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30 font-semibold'
                : 'text-[#8c9bab] hover:bg-[#22272b] hover:text-white'
            }`}
          >
            <SiGmail size={12} className={activeTab === 'gmail' ? 'text-red-400' : 'text-red-400/70'} />
            <span>Gmail</span>
            <span className="text-[10px] opacity-75">({counts.gmail})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1 rounded-md px-2 py-1.5 font-medium transition ${
              activeTab === 'all'
                ? 'bg-[#282e33] text-white font-semibold'
                : 'text-[#8c9bab] hover:bg-[#22272b] hover:text-white'
            }`}
          >
            <FiLayers size={12} />
            <span>Tất cả</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition ${
              activeTab === 'teams'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-[#8c9bab] hover:bg-[#22272b] hover:text-white'
            }`}
          >
            <BsMicrosoftTeams size={12} className={activeTab === 'teams' ? 'text-indigo-400' : 'text-indigo-400/70'} />
            <span>Teams</span>
          </button>

          <button
            onClick={() => setActiveTab('chrome')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition ${
              activeTab === 'chrome'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                : 'text-[#8c9bab] hover:bg-[#22272b] hover:text-white'
            }`}
          >
            <SiGooglechrome size={12} className={activeTab === 'chrome' ? 'text-amber-400' : 'text-amber-400/70'} />
            <span>Chrome</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-[#282e33]">
          <div className="relative">
            <FiSearch className="absolute top-2.5 left-2.5 text-[#8c9bab]" size={14} />
            <input
              type="text"
              placeholder="Tìm kiếm trong inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#38414a] bg-[#22272b] py-1.5 pr-3 pl-8 text-xs text-white placeholder-[#8c9bab] focus:border-[#579dff] focus:outline-none"
            />
          </div>
        </div>

        {/* Drag Hint Banner */}
        <div className="flex items-center gap-2 bg-[#1f2937]/50 px-3 py-2 text-[11px] text-[#8c9bab] border-b border-[#282e33]">
          <FiMove size={12} className="text-[#579dff] shrink-0" />
          <span>Kéo thẻ từ đây thả vào cột Kanban bất kỳ để tạo task</span>
        </div>

        {/* Inbox Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-white/10">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#8c9bab]">
              <FiMail size={32} className="mb-2 opacity-40" />
              <p className="text-xs">Không có thư mục nào</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                draggable={true}
                onDragStart={(e) => onDragStartInboxItem(e, item)}
                className={`group relative flex flex-col gap-2 rounded-lg border p-3 transition-all cursor-grab active:cursor-grabbing ${
                  item.isConverted
                    ? 'border-[#38414a]/40 bg-[#1a1f24]/60 opacity-60 hover:opacity-100'
                    : 'border-[#38414a] bg-[#22272b] hover:border-[#579dff] hover:shadow-lg'
                }`}
              >
                {/* Header: Source badge + Sender + Time */}
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    {getSourceBadge(item.source)}
                    <span className="font-semibold text-white truncate max-w-[130px]">
                      {item.sender}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-[#8c9bab] shrink-0">
                    <FiClock size={10} />
                    {item.receivedAt}
                  </span>
                </div>

                {/* Email Title */}
                <h4 className="text-xs font-semibold text-white leading-snug">
                  {item.title}
                </h4>

                {/* Snippet preview */}
                <p className="text-[11px] text-[#8c9bab] line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>

                {/* Footer of Card: Tag & Converted Status / Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-[#38414a]/40 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    {item.tag && (
                      <span className={`rounded px-1.5 py-0.5 font-medium border ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    )}
                    {item.hasAttachment && (
                      <span className="flex items-center text-[#8c9bab]" title="Có tệp đính kèm">
                        <FiPaperclip size={11} />
                      </span>
                    )}
                  </div>

                  {item.isConverted ? (
                    <span className="flex items-center gap-1 font-medium text-emerald-400">
                      <FiCheck size={12} />
                      <span>Đã thêm</span>
                    </span>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowColumnPickerId(showColumnPickerId === item.id ? null : item.id);
                        }}
                        className="flex items-center gap-1 rounded bg-[#282e33] px-2 py-1 font-medium text-[#b6c2cf] hover:bg-[#579dff] hover:text-[#1d2125] transition"
                        title="Thêm nhanh vào cột"
                      >
                        <FiPlus size={11} />
                        <span>Thêm vào board</span>
                      </button>

                      {/* Dropdown chọn cột thêm nhanh */}
                      {showColumnPickerId === item.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 bottom-full mb-1 z-50 w-44 rounded-lg border border-[#38414a] bg-[#1d2125] p-1.5 shadow-2xl"
                        >
                          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8c9bab]">
                            Chọn cột đích:
                          </div>
                          {columns.map((col) => (
                            <button
                              key={col.id}
                              onClick={() => {
                                onAddInboxItemToColumn(item, col.id);
                                setShowColumnPickerId(null);
                              }}
                              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-xs text-white hover:bg-[#282e33] transition"
                            >
                              <span className="truncate">{col.title}</span>
                              <FiPlus size={11} className="text-[#579dff]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Status / Summary */}
        <div className="border-t border-[#282e33] bg-[#1a1f24] px-4 py-2.5 text-xs text-[#8c9bab] flex items-center justify-between">
          <span>{inboxItems.filter(i => !i.isConverted).length} email chưa chuyển</span>
          <span className="text-[11px] text-[#579dff]">Gmail Connected</span>
        </div>
      </aside>
    </>
  );
}
