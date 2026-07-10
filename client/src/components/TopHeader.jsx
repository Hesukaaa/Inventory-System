import { Search, Bell, ChevronDown } from "lucide-react";

function TopHeader({ user }) {
  return (
    <header className="top-header">
      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder="Search for items, categories, serial no..." aria-label="Search" />
      </div>
      <div className="top-header-right">
        <button className="top-icon-btn" aria-label="Notifications" title="Notifications">
          <Bell size={20} />
          <span className="notif-dot" />
        </button>
        <button className="top-icon-btn" aria-label="Calendar" title="Calendar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
        <button className="top-icon-btn" aria-label="Fullscreen" title="Fullscreen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
        <div className="top-user">
          <div className="top-avatar">
            <img src="https://i.pravatar.cc/150?u=joel" alt="Joel" />
          </div>
          <div className="top-user-info">
            <div className="top-user-name">{user?.name || "Joel Dibidib"}</div>
            <div className="top-user-role">Administrator</div>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
