import React from 'react';
import { 
  FiTrello, 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiStar,
  FiChevronDown
} from 'react-icons/fi';
import { FaRegClock } from "react-icons/fa";
import Header from '../components/layout/Header';
import { allBoards } from '../data/boardList';
import { useNavigate } from 'react-router-dom';

export default function BoardsPage({ boards = [], onSelectBoard }) {
  const navigate = useNavigate(); // Hook to move to another page

  const handleNavigateToBoard = (boardId) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="min-h-screen bg-[#1d2125] text-[#9fadbc] font-sans">
      {/* re-use Header component */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex min-h-[calc(100vh-48px)] w-full bg-[#1d2125]">
        
        {/* Left Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-[#282e33] px-3 py-6 md:block">
          <nav className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-md bg-[#1c2b41] px-3 py-2 text-sm font-medium text-[#579dff]">
              <FiTrello size={16} />
              <span>Boards</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#b6c2cf] hover:bg-[#282e33] hover:text-white">
              <FiHome size={16} />
              <span>Home</span>
            </button>
          </nav>

          <div className="my-4 border-t border-[#282e33]" />

          {/* Workspaces Section */}
          <div className="px-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8c9bab]">
              Workspaces
            </div>
            <div className="group mt-3 flex cursor-pointer items-center justify-between text-[#b6c2cf] hover:text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1f845a] text-xs font-bold text-white">
                  E
                </div>
                <span className="line-clamp-2 text-xs font-semibold leading-tight">
                  BOARD'S NAME
                </span>
              </div>
              <FiChevronDown size={14} className="text-[#8c9bab]" />
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
          <div className="mx-auto max-w-5xl">
            
            {/* Recently Viewed */}
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#b6c2cf]">
                <FaRegClock />
                <span>Recently viewed</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allBoards.slice(0, 1).map((board) => (
                  <div
                    key={`recent-${board.id}`}
                    onClick={() => navigate(`/board/${board.id}`)}
                    className="group relative h-24 cursor-pointer overflow-hidden rounded-md bg-gradient-to-r from-[#205493] via-[#008da6] to-[#00b8d9] p-3 transition-all hover:brightness-110"
                  >
                    <span className="text-sm font-semibold text-white drop-shadow">{board.title}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Workspace Boards */}
            <section>
              <div className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8c9bab]">
                Your Workspaces
              </div>

              {/* Workspace Title & Actions Header */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1f845a] text-sm font-bold text-white">
                    E
                  </div>
                  <h2 className="text-base font-bold text-[#b6c2cf]">
                    BOARD'S NAME
                  </h2>
                </div>

                {/* Action Pills */}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <button className="flex items-center gap-1.5 rounded bg-[#282e33] px-2.5 py-1.5 text-[#b6c2cf] hover:bg-[#333c43]">
                    <FiTrello size={13} />
                    Boards
                  </button>
                  <button className="flex items-center gap-1.5 rounded bg-[#282e33] px-2.5 py-1.5 text-[#b6c2cf] hover:bg-[#333c43]">
                    <FiUsers size={13} />
                    Members
                  </button>
                  <button className="flex items-center gap-1.5 rounded bg-[#282e33] px-2.5 py-1.5 text-[#b6c2cf] hover:bg-[#333c43]">
                    <FiSettings size={13} />
                    Settings
                  </button>
                </div>
              </div>

              {/* Boards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allBoards.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => navigate(`/board/${board.id}`)}
                    className="group relative h-24 cursor-pointer overflow-hidden rounded-md bg-gradient-to-r from-[#205493] via-[#008da6] to-[#00b8d9] p-3 transition-all hover:brightness-110"
                  >
                    <div className="flex h-full flex-col justify-between">
                      <span className="text-sm font-semibold text-white drop-shadow">{board.title}</span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="self-end text-white opacity-0 transition-opacity hover:text-yellow-300 group-hover:opacity-100"
                      >
                        <FiStar size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Create Board Card */}
                <button
                  type="button"
                  className="flex h-24 items-center justify-center rounded-md bg-[#282e33] text-sm text-[#9fadbc] transition hover:bg-[#333c43] hover:text-white"
                >
                  Create new board
                </button>
              </div>

              {/* Closed Boards Button */}
              <div className="mt-6">
                <button className="rounded bg-[#282e33] px-3 py-1.5 text-xs font-medium text-[#b6c2cf] hover:bg-[#333c43]">
                  View all closed boards
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}