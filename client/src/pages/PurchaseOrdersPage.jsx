import { useState, useMemo, useEffect } from "react";
import { Download, Printer, Plus, Eye, Edit, MoreVertical, Search, ShoppingCart } from "lucide-react";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const purchaseOrders = [
  { id: "PO-2025-0529-001", supplier: "ABC Hardware Corp.", category: "Office Supplies", warehouse: "Cebu Warehouse", date: "May 29, 2025", totalItems: 8, status: "Completed", totalValue: 45600.00, expectedDelivery: "Jun 05, 2025" },
  { id: "PO-2025-0528-002", supplier: "Philippine Electrical, Inc.", category: "Electrical Materials", warehouse: "Bacolod Warehouse", date: "May 28, 2025", totalItems: 12, status: "Pending", totalValue: 128350.00, expectedDelivery: "Jun 04, 2025" },
  { id: "PO-2025-0527-003", supplier: "Wood Solutions Co.", category: "Carpentry Materials", warehouse: "Palawan Warehouse", date: "May 27, 2025", totalItems: 15, status: "Completed", totalValue: 256780.00, expectedDelivery: "May 30, 2025" },
  { id: "PO-2025-0526-004", supplier: "BuildRight Hardware", category: "Hardware Supplies", warehouse: "Manila Warehouse", date: "May 26, 2025", totalItems: 9, status: "Pending", totalValue: 78950.00, expectedDelivery: "Jun 02, 2025" },
  { id: "PO-2025-0525-005", supplier: "ColorPlus Paint Center", category: "Painting Materials", warehouse: "Cebu Warehouse", date: "May 25, 2025", totalItems: 6, status: "Completed", totalValue: 36240.00, expectedDelivery: "May 28, 2025" },
  { id: "PO-2025-0524-006", supplier: "AquaFlow Supplies", category: "Plumbing Materials", warehouse: "Bacolod Warehouse", date: "May 24, 2025", totalItems: 10, status: "Cancelled", totalValue: 62100.00, expectedDelivery: "May 29, 2025" },
  { id: "PO-2025-0523-007", supplier: "ToolMaster Trading", category: "Tools & Equipment", warehouse: "Davao Warehouse", date: "May 23, 2025", totalItems: 7, status: "Pending", totalValue: 89500.00, expectedDelivery: "Jun 01, 2025" },
  { id: "PO-2025-0522-008", supplier: "SafetyFirst Corp.", category: "Safety Equipment", warehouse: "Iloilo Warehouse", date: "May 22, 2025", totalItems: 4, status: "Completed", totalValue: 24880.00, expectedDelivery: "May 27, 2025" },
  { id: "PO-2025-0521-009", supplier: "OfficeWare Co.", category: "Office Supplies", warehouse: "Manila Warehouse", date: "May 21, 2025", totalItems: 11, status: "Pending", totalValue: 52450.00, expectedDelivery: "May 31, 2025" },
  { id: "PO-2025-0520-010", supplier: "BrightLight Inc.", category: "Lighting Fixtures", warehouse: "Cebu Warehouse", date: "May 20, 2025", totalItems: 5, status: "Cancelled", totalValue: 15600.00, expectedDelivery: "May 26, 2025" },
];

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const totalOrders = purchaseOrders.length;
  const completed = purchaseOrders.filter((po) => po.status === "Completed").length;
  const pending = purchaseOrders.filter((po) => po.status === "Pending").length;
  const cancelled = purchaseOrders.filter((po) => po.status === "Cancelled").length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalValue, 0);

  const filtered = useMemo(() => {
    let list = purchaseOrders;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((po) => po.id.toLowerCase().includes(q) || po.supplier.toLowerCase().includes(q) || po.category.toLowerCase().includes(q));
    }
    if (supplierFilter) list = list.filter((po) => po.supplier === supplierFilter);
    if (statusFilter) list = list.filter((po) => po.status === statusFilter);
    if (warehouseFilter) list = list.filter((po) => po.warehouse === warehouseFilter);
    return list;
  }, [search, supplierFilter, statusFilter, warehouseFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [search, supplierFilter, statusFilter, warehouseFilter]);

  const suppliers = useMemo(() => [...new Set(purchaseOrders.map((po) => po.supplier))], []);
  const warehouses = useMemo(() => [...new Set(purchaseOrders.map((po) => po.warehouse))], []);
  const statuses = ["Completed", "Pending", "Cancelled"];

  const statusColor = (s) => {
    if (s === "Completed") return "bg-green-100 text-green-700";
    if (s === "Pending") return "bg-amber-100 text-amber-700";
    if (s === "Cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const sparklinePaths = {
    blue: "M0 22 Q 10 18, 20 20 T 40 14 T 60 10 T 80 12 T 100 6",
    green: "M0 18 Q 10 16, 20 14 T 40 12 T 60 10 T 80 8 T 100 6",
    amber: "M0 20 Q 10 16, 20 22 T 40 18 T 60 14 T 80 16 T 100 10",
    red: "M0 16 Q 10 20, 20 18 T 40 16 T 60 20 T 80 14 T 100 10",
    purple: "M0 24 Q 10 20, 20 22 T 40 16 T 60 12 T 80 14 T 100 8",
  };

  return (
    <div className="page-enter page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Purchase Orders</h1>
          <div className="breadcrumb">Dashboard &nbsp;/&nbsp; Purchase Orders</div>
        </div>
        <div className="page-header-actions">
          <button className="ghost-btn" onClick={() => alert("Export Excel")}><Download size={16} style={{ marginRight: 6 }} /> Export Excel</button>
          <button className="ghost-btn" onClick={() => alert("Print")}><Printer size={16} style={{ marginRight: 6 }} /> Print</button>
          <button className="primary" onClick={() => alert("New Purchase Order")}><Plus size={16} style={{ marginRight: 6 }} /> New Purchase Order</button>
        </div>
      </div>

      <div className="stats-grid stagger">
        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-header">
                  <Skeleton.Box w={24} h={24} />
                  <div style={{ flex: 1 }}>
                    <Skeleton.Box w="120px" h={12} />
                    <Skeleton.Box w="80px" h={20} style={{ marginTop: 4 }} />
                    <Skeleton.Box w="100px" h={12} style={{ marginTop: 4 }} />
                  </div>
                </div>
                <div className="stat-chart">
                  <Skeleton.Box w="100%" h={40} />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: "#3b82f6" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-title">TOTAL ORDERS</div>
                  <div className="stat-value">{totalOrders}</div>
                  <div className="stat-sub">All purchase orders</div>
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
                  <div className="stat-sub">Orders</div>
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
                  <div className="stat-title">PENDING</div>
                  <div className="stat-value">{pending}</div>
                  <div className="stat-sub">Orders</div>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>
                <div className="stat-info">
                  <div className="stat-title">CANCELLED</div>
                  <div className="stat-value">{cancelled}</div>
                  <div className="stat-sub">Orders</div>
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
                  <div className="stat-title">TOTAL VALUE</div>
                  <div className="stat-value">₱{totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="stat-sub">All orders value</div>
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
            <input placeholder="Search by PO no., supplier, or item..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
            <option value="">All Suppliers</option>
            {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
            <option value="">All Warehouses</option>
            {warehouses.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <div className="date-range">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>May 01, 2025 - May 30, 2025</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <button className="ghost-btn" onClick={() => alert("More Filters")}>More Filters</button>
          <button className="ghost-btn" onClick={() => { setSearch(""); setSupplierFilter(""); setStatusFilter(""); setWarehouseFilter(""); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Reset</button>
        </div>

        {loading ? (
          <div className="table-wrap">
            <Skeleton.Table rows={8} cols={9} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="table-wrap">
            <EmptyState icon={<ShoppingCart size={48} strokeWidth={1.5} />} title="No purchase orders found" />
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO No.</th>
                    <th>Supplier</th>
                    <th>Order Date</th>
                    <th>Warehouse</th>
                    <th>Total Items</th>
                    <th>Status</th>
                    <th>Total Value</th>
                    <th>Expected Delivery Date</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((po) => (
                    <tr key={po.id}>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>{po.id}</td>
                      <td>
                        <div className="item-cell">
                          <div className="item-icon" style={{ width: 28, height: 28, borderRadius: "50%" }}>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(po.supplier)}&background=random&size=28`} alt="" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: "#0f172a" }}>{po.supplier}</div>
                            <div className="item-code">{po.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>{po.date}</td>
                      <td>
                        <div className="warehouse-cell">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                          {po.warehouse}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>{po.totalItems}</td>
                      <td><span className={`badge ${statusColor(po.status)}`}>{po.status}</span></td>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>₱{po.totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{po.expectedDelivery}</td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn" title="View" onClick={() => alert(`View ${po.id}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button className="icon-btn" title="Edit" onClick={() => alert(`Edit ${po.id}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                          </button>
                          <button className="icon-btn" title="More" onClick={() => alert(`More options for ${po.id}`)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <div className="pagination-info">Showing {startIdx} to {endIdx} of {filtered.length} purchase orders</div>
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
          </>
        )}
      </div>
    </div>
  );
}
