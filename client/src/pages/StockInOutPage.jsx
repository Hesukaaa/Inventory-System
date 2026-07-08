import { useState, useEffect, useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import api from "../lib/api";

const mockTransactions = [
  { _id: "1", date: "May 30, 2025", time: "10:28 AM", type: "Stock In", reference: "SIN-2025-0529-001", item: "Wall Light Box Cabinet", warehouse: "Cebu Warehouse", unit: "pcs", quantity: 15, value: 37500.00, person: "Juan Dela Cruz", status: "Completed" },
  { _id: "2", date: "May 30, 2025", time: "09:15 AM", type: "Stock Out", reference: "SOUT-2025-0529-002", item: "LED Strip Light 5M", warehouse: "Bacolod Warehouse", unit: "roll", quantity: 10, value: 350.00, person: "Maria Santos", status: "Completed" },
  { _id: "3", date: "May 29, 2025", time: "04:32 PM", type: "Stock In", reference: "SIN-2025-0529-003", item: "Aluminum Display Rack", warehouse: "Palawan Warehouse", unit: "pcs", quantity: 8, value: 25600.00, person: "Pedro Reyes", status: "Completed" },
  { _id: "4", date: "May 29, 2025", time: "02:10 PM", type: "Stock Out", reference: "SOUT-2025-0529-004", item: "Screw #8 x 1\"", warehouse: "Cebu Warehouse", unit: "pcs", quantity: 25, value: 12.50, person: "Anna Garcia", status: "Completed" },
  { _id: "5", date: "May 28, 2025", time: "09:40 AM", type: "Stock In", reference: "SIN-2025-0528-005", item: "Paint (Gloss White) 1L", warehouse: "Manila Warehouse", unit: "can", quantity: 20, value: 5600.00, person: "Michael Tan", status: "Completed" },
  { _id: "6", date: "May 28, 2025", time: "09:40 AM", type: "Stock Out", reference: "SOUT-2025-0528-006", item: "Cabinet Hinge (2\")", warehouse: "Bacolod Warehouse", unit: "pcs", quantity: 5, value: 225.00, person: "Robert Lim", status: "Pending" },
  { _id: "7", date: "May 27, 2025", time: "03:22 PM", type: "Stock In", reference: "SIN-2025-0527-007", item: "Acrylic Sheet 3mm", warehouse: "Palawan Warehouse", unit: "pcs", quantity: 10, value: 650.00, person: "Juan Dela Cruz", status: "Completed" },
  { _id: "8", date: "May 27, 2025", time: "01:15 PM", type: "Stock Out", reference: "SOUT-2025-0527-008", item: "LED Bulb 9W", warehouse: "Manila Warehouse", unit: "pcs", quantity: 10, value: 1200.00, person: "Maria Santos", status: "Completed" },
  { _id: "9", date: "May 26, 2025", time: "05:00 PM", type: "Stock In", reference: "SIN-2025-0526-009", item: "Silicone Sealant (Clear)", warehouse: "Cebu Warehouse", unit: "tube", quantity: 12, value: 140.00, person: "Pedro Reyes", status: "Completed" },
  { _id: "10", date: "May 26, 2025", time: "10:30 AM", type: "Stock Out", reference: "SOUT-2025-0526-010", item: "Cabinet Lock", warehouse: "Iloilo Warehouse", unit: "pcs", quantity: 3, value: 195.00, person: "Michael Tan", status: "Cancelled" },
];

const typeOptions = ["", "Stock In", "Stock Out"];
const statusOptions = ["", "Completed", "Pending", "Cancelled"];

const warehouseList = ["Cebu Warehouse", "Bacolod Warehouse", "Palawan Warehouse", "Manila Warehouse", "Davao Warehouse", "Iloilo Warehouse"];

const sparklineBlue = "M0 24 Q 12 20, 25 22 T 50 16 T 75 12 T 100 8";
const sparklineGreen = "M0 22 Q 15 25, 30 18 T 60 14 T 100 10";
const sparklinePurple = "M0 20 Q 18 24, 35 18 T 70 14 T 100 16";
const sparklineYellow = "M0 26 Q 10 22, 20 24 T 45 18 T 70 20 T 100 14";
const sparklinePink = "M0 18 Q 15 22, 30 16 T 60 12 T 100 10";

export default function StockInOutPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const filtered = useMemo(() => {
    let list = transactions;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => (t.item || "").toLowerCase().includes(q) || (t.reference || "").toLowerCase().includes(q) || (t.person || "").toLowerCase().includes(q));
    }
    if (typeFilter) {
      list = list.filter((t) => t.type === typeFilter);
    }
    if (warehouseFilter) {
      list = list.filter((t) => t.warehouse === warehouseFilter);
    }
    if (statusFilter) {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (activeTab === "stock-in") list = list.filter((t) => t.type === "Stock In");
    if (activeTab === "stock-out") list = list.filter((t) => t.type === "Stock Out");
    return list;
  }, [transactions, search, typeFilter, warehouseFilter, statusFilter, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [search, typeFilter, warehouseFilter, statusFilter, activeTab]);

  const totalStockIn = transactions.filter((t) => t.type === "Stock In").length;
  const totalStockOut = transactions.filter((t) => t.type === "Stock Out").length;
  const netMovement = totalStockIn - totalStockOut;
  const totalItemsAffected = transactions.length;
  const totalValue = transactions.reduce((sum, t) => sum + Number(t.value || 0), 0);

  const statusBadge = (status) => {
    switch (status) {
      case "Completed": return "ok";
      case "Pending": return "pending";
      case "Cancelled": return "low";
      default: return "ok";
    }
  };

  return (
    <div className="page-container page-enter">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Stock In / Out</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Stock In / Out</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Excel
          </button>
          <button className="ghost-btn" onClick={() => alert("Print")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: "middle" }}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print
          </button>
          <button className="primary" onClick={() => alert("New Stock Transaction")}>+ New Stock Transaction</button>
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
                <div className="stat-icon-wrap">
                  <div className="stat-icon" style={{ background: "#3b82f6" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </div>
                  <div className="stat-info">
                    <div className="stat-title">TOTAL STOCK IN</div>
                    <div className="stat-value">{totalStockIn}</div>
                    <div className="stat-sub">Transactions</div>
                  </div>
                </div>
              </div>
              <div className="stat-chart"><svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}><path d={sparklineBlue} fill="none" stroke="#3b82f6" strokeWidth="2"/></svg></div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon-wrap">
                  <div className="stat-icon" style={{ background: "#10b981" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </div>
                  <div className="stat-info">
                    <div className="stat-title">TOTAL STOCK OUT</div>
                    <div className="stat-value">{totalStockOut}</div>
                    <div className="stat-sub">Transactions</div>
                  </div>
                </div>
              </div>
              <div className="stat-chart"><svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}><path d={sparklineGreen} fill="none" stroke="#10b981" strokeWidth="2"/></svg></div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon-wrap">
                  <div className="stat-icon" style={{ background: "#8b5cf6" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                  </div>
                  <div className="stat-info">
                    <div className="stat-title">NET MOVEMENT</div>
                    <div className="stat-value">{netMovement > 0 ? `+${netMovement}` : netMovement}</div>
                    <div className="stat-sub">This Period</div>
                  </div>
                </div>
              </div>
              <div className="stat-chart"><svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}><path d={sparklinePurple} fill="none" stroke="#8b5cf6" strokeWidth="2"/></svg></div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon-wrap">
                  <div className="stat-icon" style={{ background: "#f59e0b" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  </div>
                  <div className="stat-info">
                    <div className="stat-title">TOTAL ITEMS AFFECTED</div>
                    <div className="stat-value">{totalItemsAffected}</div>
                    <div className="stat-sub">Items</div>
                  </div>
                </div>
              </div>
              <div className="stat-chart"><svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}><path d={sparklineYellow} fill="none" stroke="#f59e0b" strokeWidth="2"/></svg></div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon-wrap">
                  <div className="stat-icon" style={{ background: "#ec4899" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h6M9 15h6"/></svg>
                  </div>
                  <div className="stat-info">
                    <div className="stat-title">TOTAL VALUE MOVEMENT</div>
                    <div className="stat-value">₱{totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</div>
                    <div className="stat-sub">This Period</div>
                  </div>
                </div>
              </div>
              <div className="stat-chart"><svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: "100%", height: "40px" }}><path d={sparklinePink} fill="none" stroke="#ec4899" strokeWidth="2"/></svg></div>
            </div>
          </>
        )}
      </div>

      <div className="card hover-lift">
        <div className="filters-card">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search by item name, code, or reference..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            {typeOptions.map((t) => (<option key={t} value={t}>{t || "All Types"}</option>))}
          </select>
          <select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
            <option value="">All Warehouses</option>
            {warehouseList.map((w) => (<option key={w} value={w}>{w}</option>))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((s) => (<option key={s} value={s}>{s || "All Status"}</option>))}
          </select>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={() => { setSearch(""); setTypeFilter(""); setWarehouseFilter(""); setStatusFilter(""); }}>Reset</button>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All Transactions</button>
          <button className={`tab ${activeTab === "stock-in" ? "active" : ""}`} onClick={() => setActiveTab("stock-in")}>Stock In</button>
          <button className={`tab ${activeTab === "stock-out" ? "active" : ""}`} onClick={() => setActiveTab("stock-out")}>Stock Out</button>
        </div>

        <div className="table-wrap">
          {loading ? (
            <SkeletonTable rows={8} cols={10} />
          ) : filtered.length === 0 ? (
            <EmptyState icon={<ArrowLeftRight size={48} color="#6366f1" />} title="No transactions found" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date & Time <span className="sort-icon">⇅</span></th>
                  <th>Type <span className="sort-icon">⇅</span></th>
                  <th>Reference No. <span className="sort-icon">⇅</span></th>
                  <th>Item <span className="sort-icon">⇅</span></th>
                  <th>Warehouse</th>
                  <th>Unit</th>
                  <th>Value <span className="sort-icon">⇅</span></th>
                  <th>Received By / Issued To</th>
                  <th>Status</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div className="datetime-cell">
                        <span className="date-text">{t.date}</span>
                        <span className="time-text">{t.time}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`type-badge ${t.type === "Stock In" ? "in" : "out"}`}>
                        {t.type === "Stock In" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td>{t.reference}</td>
                    <td>
                      <div className="item-cell">
                        <div className="item-icon">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.item)}&background=random&size=32`} alt="" />
                        </div>
                        <span>{t.item}</span>
                      </div>
                    </td>
                    <td>
                      <div className="warehouse-cell">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        {t.warehouse}
                      </div>
                    </td>
                    <td>{t.unit}</td>
                    <td>₱{Number(t.value || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
                    <td>
                      <div className="item-cell">
                        <div className="avatar-sm">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.person)}&background=random&size=32`} alt="" />
                        </div>
                        <span>{t.person}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge(t.status)}`}>{t.status}</span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" title="View" onClick={() => alert(`View ${t.reference}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="icon-btn" title="Edit" onClick={() => alert(`Edit ${t.reference}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                        </button>
                        <button className="icon-btn" title="More" onClick={() => alert(`More options for ${t.reference}`)}>
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
          <div className="pagination-info">Showing {startIdx} to {endIdx} of {filtered.length} transactions</div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === safePage ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>›</button>
            <select value={pageSize} onChange={(e) => {}}>
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
