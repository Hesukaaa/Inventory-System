import { useState } from "react";
import { Search, ChevronDown, Download, Printer, Plus, Eye, MoreVertical, Wrench } from "lucide-react";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const today = new Date();
const fmt = (d) => d && new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const maintenanceData = [
  { id: "MNT-2025-001", item: "Wall Light Box Cabinet", type: "Repair", reportedBy: "Juan Dela Cruz", warehouse: "Cebu Warehouse", priority: "High", status: "In Progress", reportedDate: "May 30, 2025", dueDate: "Jun 02, 2025", cost: 2500.00 },
  { id: "MNT-2025-002", item: "LED Strip Light 5M", type: "Replace", reportedBy: "Maria Santos", warehouse: "Bacolod Warehouse", priority: "Medium", status: "In Progress", reportedDate: "May 30, 2025", dueDate: "Jun 04, 2025", cost: 350.00 },
  { id: "MNT-2025-003", item: "Aluminum Display Rack", type: "Repair", reportedBy: "Pedro Reyes", warehouse: "Palawan Warehouse", priority: "Medium", status: "Completed", reportedDate: "May 29, 2025", dueDate: "May 31, 2025", cost: 1800.00 },
  { id: "MNT-2025-004", item: "Screw #8 x 1\"", type: "Inspect", reportedBy: "Anna Garcia", warehouse: "Cebu Warehouse", priority: "Low", status: "Completed", reportedDate: "May 29, 2025", dueDate: "May 30, 2025", cost: 0.00 },
  { id: "MNT-2025-005", item: "Paint (Gloss White) 1L", type: "Maintenance", reportedBy: "Michael Tan", warehouse: "Manila Warehouse", priority: "High", status: "In Progress", reportedDate: "May 28, 2025", dueDate: "Jun 01, 2025", cost: 600.00 },
  { id: "MNT-2025-006", item: "Cabinet Hinge (2\")*1", type: "Replace", reportedBy: "Robert Lim", warehouse: "Bacolod Warehouse", priority: "Low", status: "Pending", reportedDate: "May 28, 2025", dueDate: "Jun 05, 2025", cost: 225.00 },
  { id: "MNT-2025-007", item: "Acrylic Sheet 3mm", type: "Repair", reportedBy: "Juan Dela Cruz", warehouse: "Palawan Warehouse", priority: "Medium", status: "Pending", reportedDate: "May 27, 2025", dueDate: "Jun 03, 2025", cost: 450.00 },
  { id: "MNT-2025-008", item: "LED Bulb 9W", type: "Replace", reportedBy: "Maria Santos", warehouse: "Manila Warehouse", priority: "Low", status: "Completed", reportedDate: "May 27, 2025", dueDate: "May 28, 2025", cost: 120.00 },
  { id: "MNT-2025-009", item: "Silicone Sealant (Clear)", type: "Maintenance", reportedBy: "Pedro Reyes", warehouse: "Cebu Warehouse", priority: "Low", status: "Completed", reportedDate: "May 26, 2025", dueDate: "May 27, 2025", cost: 95.00 },
  { id: "MNT-2025-010", item: "Cabinet Lock", type: "Repair", reportedBy: "Robert Lim", warehouse: "Iloilo Warehouse", priority: "High", status: "Overdue", reportedDate: "May 26, 2025", dueDate: "May 28, 2025", cost: 195.00 },
];

export default function MaintenancePage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const totalRequests = maintenanceData.length;
  const completed = maintenanceData.filter((m) => m.status === "Completed").length;
  const inProgress = maintenanceData.filter((m) => m.status === "In Progress").length;
  const overdue = maintenanceData.filter((m) => m.status === "Overdue").length;
  const totalCost = maintenanceData.reduce((sum, m) => sum + m.cost, 0);

  const filtered = maintenanceData.filter((m) => {
    const matchSearch = !search || m.item.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()) || m.reportedBy.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || m.type === typeFilter;
    const matchPriority = !priorityFilter || m.priority === priorityFilter;
    const matchStatus = !statusFilter || m.status === statusFilter;
    const matchWarehouse = !warehouseFilter || m.warehouse === warehouseFilter;
    return matchSearch && matchType && matchPriority && matchStatus && matchWarehouse;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setPriorityFilter("");
    setStatusFilter("");
    setWarehouseFilter("");
  };

  const types = [...new Set(maintenanceData.map((m) => m.type))];
  const priorities = [...new Set(maintenanceData.map((m) => m.priority))];
  const statuses = [...new Set(maintenanceData.map((m) => m.status))];
  const warehouses = [...new Set(maintenanceData.map((m) => m.warehouse))];

  const sparklinePaths = {
    blue: "M0 22 Q 10 18, 20 20 T 40 14 T 60 10 T 80 12 T 100 6",
    green: "M0 18 Q 10 16, 20 14 T 40 12 T 60 10 T 80 8 T 100 6",
    amber: "M0 20 Q 10 16, 20 22 T 40 18 T 60 14 T 80 16 T 100 10",
    red: "M0 16 Q 10 20, 20 18 T 40 16 T 60 20 T 80 14 T 100 10",
    purple: "M0 24 Q 10 20, 20 22 T 40 16 T 60 12 T 80 14 T 100 8",
  };

  const statusColor = (s) => {
    if (s === "Completed") return "bg-green-100 text-green-700";
    if (s === "In Progress") return "bg-amber-100 text-amber-700";
    if (s === "Pending") return "bg-yellow-100 text-yellow-700";
    if (s === "Overdue") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const priorityColor = (p) => {
    if (p === "High") return "bg-red-100 text-red-700";
    if (p === "Medium") return "bg-orange-100 text-orange-700";
    if (p === "Low") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const typeColor = (t) => {
    if (t === "Repair") return "bg-blue-100 text-blue-700";
    if (t === "Replace") return "bg-purple-100 text-purple-700";
    if (t === "Inspect") return "bg-gray-100 text-gray-700";
    if (t === "Maintenance") return "bg-teal-100 text-teal-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="page-container maintenance-page page-enter">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Maintenance</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Maintenance</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}><Download size={16} style={{ marginRight: 6 }} /> Export Excel</button>
          <button className="ghost-btn" onClick={() => alert("Print")}><Printer size={16} style={{ marginRight: 6 }} /> Print</button>
          <button className="primary" onClick={() => alert("New Maintenance Request")}><Plus size={16} style={{ marginRight: 6 }} /> New Maintenance Request</button>
        </div>
      </div>

      <div className="stats-grid stagger">
        {loading ? (
          <>
            <Skeleton.Box w="100%" h="90px" />
            <Skeleton.Box w="100%" h="90px" />
            <Skeleton.Box w="100%" h="90px" />
            <Skeleton.Box w="100%" h="90px" />
            <Skeleton.Box w="100%" h="90px" />
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: "#3b82f6" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-title">TOTAL REQUESTS</div>
                  <div className="stat-value">{totalRequests}</div>
                  <div className="stat-sub">All maintenance requests</div>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
                  <path d={sparklinePaths.blue} fill="none" stroke="#3b82f6" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: "#22c55e" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-title">COMPLETED</div>
                  <div className="stat-value">{completed}</div>
                  <div className="stat-sub">This Period</div>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
                  <path d={sparklinePaths.green} fill="none" stroke="#22c55e" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: "#f59e0b" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-title">IN PROGRESS</div>
                  <div className="stat-value">{inProgress}</div>
                  <div className="stat-sub">Currently in progress</div>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
                  <path d={sparklinePaths.amber} fill="none" stroke="#f59e0b" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: "#ef4444" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-title">OVERDUE</div>
                  <div className="stat-value">{overdue}</div>
                  <div className="stat-sub">Past due requests</div>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
                  <path d={sparklinePaths.red} fill="none" stroke="#ef4444" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: "#a855f7" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-title">TOTAL COST</div>
                  <div className="stat-value">₱{totalCost.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="stat-sub">This Period</div>
                </div>
              </div>
              <div className="stat-chart">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}>
                  <path d={sparklinePaths.purple} fill="none" stroke="#a855f7" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="card hover-lift">
        <div className="filters-card">
          <div className="search-wrap">
            <Search className="search-icon" size={18} />
            <input placeholder="Search by item name, code, or request no..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
            <option value="">All Warehouses</option>
            {warehouses.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={resetFilters}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Reset</button>
        </div>

        <div className="table-wrap">
          {loading ? (
            <SkeletonTable rows={8} cols={11} />
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Wrench size={48} color="#6366f1" />} title="No maintenance requests found" />
          ) : (
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Request No.</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Reported By</th>
                  <th>Warehouse</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported Date</th>
                  <th>Due Date</th>
                  <th>Est. Cost</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{m.id}</td>
                    <td>
                      <div className="item-cell">
                        <div className="item-icon">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.item)}&background=random&size=32`} alt="" />
                        </div>
                        <span>{m.item}</span>
                      </div>
                    </td>
                    <td><span className={`badge ${typeColor(m.type)}`}>{m.type}</span></td>
                    <td>
                      <div className="user-cell">
                        <div className="item-icon" style={{ width: 28, height: 28, borderRadius: "50%" }}>
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.reportedBy)}&background=random&size=28`} alt="" />
                        </div>
                        <span>{m.reportedBy}</span>
                      </div>
                    </td>
                    <td>
                      <div className="warehouse-cell">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        {m.warehouse}
                      </div>
                    </td>
                    <td><span className={`badge ${priorityColor(m.priority)}`}>{m.priority}</span></td>
                    <td><span className={`badge ${statusColor(m.status)}`}>{m.status}</span></td>
                    <td>{m.reportedDate}</td>
                    <td>{m.dueDate}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>₱{m.cost.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" title="View" onClick={() => alert(`View ${m.id}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="icon-btn" title="More" onClick={() => alert(`More options for ${m.id}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination">
          <div className="pagination-info">Showing 1 to {paged.length} of {filtered.length} requests</div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === safePage ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>›</button>
            <select className="pagination-select" value={pageSize} onChange={(e) => {}}>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
