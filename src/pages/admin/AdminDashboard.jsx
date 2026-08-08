import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrderServices from "../../controllers/order.controller";
import ProductServices from "../../controllers/product.controller";
import {
  FaShoppingBag,
  FaClock,
  FaSyncAlt,
  FaCheckCircle,
  FaBoxOpen,
  FaChartBar,
  FaPlus,
  FaArrowRight,
  FaSpinner,
  FaTags,
  FaCoins
} from "react-icons/fa";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Calculated Metrics
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });

  const [categoryCounts, setCategoryCounts] = useState({});
  const [monthlyStats, setMonthlyStats] = useState([]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch products and orders concurrently
        const [productsData, ordersData] = await Promise.all([
          ProductServices.getAllProducts().catch(() => []),
          OrderServices.getAllOrders(0, 500).catch(() => ({ orders: [] })),
        ]);

        const fetchedProducts = productsData || [];
        const fetchedOrders = ordersData?.orders || [];

        setProducts(fetchedProducts);
        setOrders(fetchedOrders);

        // 1. Calculate Order Metrics
        let totalRev = 0;
        let pending = 0;
        let processing = 0;
        let delivered = 0;

        fetchedOrders.forEach((order) => {
          if (order.status === "Pending") pending++;
          if (order.status === "Processing") processing++;
          if (order.status === "Delivered") {
            delivered++;
            totalRev += Number(order.total_amount || 0);
          }
        });

        setMetrics({
          totalOrders: fetchedOrders.length,
          pendingOrders: pending,
          processingOrders: processing,
          deliveredOrders: delivered,
          totalRevenue: totalRev,
        });

        // 2. Group Products by Category
        const catMap = {};
        fetchedProducts.forEach((prod) => {
          const categoryName = prod.category?.trim() || "Uncategorized";
          catMap[categoryName] = (catMap[categoryName] || 0) + 1;
        });
        setCategoryCounts(catMap);

        // 3. Process Monthly Order Analytics for Bar Chart
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyMap = Array(12).fill(0).map((_, idx) => ({
          month: monthNames[idx],
          total: 0,
          delivered: 0,
        }));

        fetchedOrders.forEach((order) => {
          if (order.created_at) {
            const date = new Date(order.created_at);
            const monthIdx = date.getMonth();
            if (monthIdx >= 0 && monthIdx < 12) {
              monthlyMap[monthIdx].total += 1;
              if (order.status === "Delivered") {
                monthlyMap[monthIdx].delivered += 1;
              }
            }
          }
        });

        // Slice to current rolling 6 months for a clean display
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const idx = (currentMonth - i + 12) % 12;
          last6Months.push(monthlyMap[idx]);
        }
        setMonthlyStats(last6Months);

      } catch (error) {
        console.error("Dashboard data load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Highest value for bar chart normalization
  const maxChartVal = Math.max(...monthlyStats.map((s) => s.total), 1);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <FaSpinner size={32} className="animate-spin text-[var(--color-primary)]" />
        <p className="text-xs font-bold text-[var(--color-text-secondary)]">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-[var(--color-text)]">
      
      {/* 1. HERO WELCOME BANNER */}
      <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-secondary)]">
            Overview Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text)]">
            Welcome Back, Admin
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-xl">
            Here is your live summary of orders, sales performance, and active product inventory.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center gap-2"
          >
            <FaPlus size={12} />
            <span>Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-5 py-2.5 bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-2"
          >
            <span>Manage Orders</span>
            <FaArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* 2. ORDER KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Orders */}
        <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-[var(--color-text-secondary)]">Total Orders</span>
            <h3 className="text-3xl font-serif font-bold text-[var(--color-text)]">{metrics.totalOrders}</h3>
            <p className="text-[11px] text-[var(--color-text-secondary)]">All lifetime orders</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <FaShoppingBag size={20} />
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-[var(--color-text-secondary)]">Pending</span>
            <h3 className="text-3xl font-serif font-bold text-amber-600">{metrics.pendingOrders}</h3>
            <p className="text-[11px] text-[var(--color-text-secondary)]">Awaiting fulfillment</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <FaClock size={20} />
          </div>
        </div>

        {/* Card 3: Processing Orders */}
        <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-[var(--color-text-secondary)]">Processing</span>
            <h3 className="text-3xl font-serif font-bold text-blue-600">{metrics.processingOrders}</h3>
            <p className="text-[11px] text-[var(--color-text-secondary)]">In transit / preparing</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <FaSyncAlt size={20} />
          </div>
        </div>

        {/* Card 4: Delivered Orders */}
        <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-[var(--color-text-secondary)]">Delivered</span>
            <h3 className="text-3xl font-serif font-bold text-emerald-600">{metrics.deliveredOrders}</h3>
            <p className="text-[11px] text-[var(--color-text-secondary)]">Successfully completed</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <FaCheckCircle size={20} />
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION: MONTHLY ANALYTICS BAR CHART & CATEGORY COUNTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Monthly Orders Bar Chart */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-[var(--color-text)] flex items-center gap-2">
                <FaChartBar className="text-[var(--color-primary)]" size={18} />
                <span>Monthly Orders Breakdown</span>
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Total received vs. delivered orders per month
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-3 h-3 bg-indigo-500 rounded-sm"></span> Total Orders
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Delivered
              </span>
            </div>
          </div>

          {/* Pure CSS Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-2 px-2">
            {monthlyStats.map((stat, idx) => {
              const totalHeight = Math.round((stat.total / maxChartVal) * 100);
              const deliveredHeight = Math.round((stat.delivered / maxChartVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Bars Container */}
                  <div className="w-full max-w-[40px] flex items-end gap-1 h-full relative">
                    
                    {/* Total Bar */}
                    <div
                      style={{ height: `${totalHeight || 4}%` }}
                      className="w-1/2 bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-600 relative"
                      title={`Total: ${stat.total}`}
                    />
                    
                    {/* Delivered Bar */}
                    <div
                      style={{ height: `${deliveredHeight || 4}%` }}
                      className="w-1/2 bg-emerald-500 rounded-t-lg transition-all group-hover:bg-emerald-600 relative"
                      title={`Delivered: ${stat.delivered}`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                    {stat.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Revenue Highlight Footer */}
          <div className="bg-[var(--color-background)] p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FaCoins size={16} />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] font-bold uppercase">Delivered Revenue</p>
                <p className="text-lg font-serif font-bold text-[var(--color-primary)]">
                  LKR {metrics.totalRevenue.toLocaleString()}.00
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>

        </div>

        {/* Right Column (1 Col): Product Categories Breakdown */}
        <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-[var(--color-text)] flex items-center gap-2">
                <FaTags className="text-[var(--color-secondary)]" size={16} />
                <span>Product Categories</span>
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Total catalog items per category
              </p>
            </div>
            <span className="text-xs font-bold bg-[var(--color-background)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
              {Object.keys(categoryCounts).length} Types
            </span>
          </div>

          {/* Category Cards List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-xs text-[var(--color-text-secondary)] text-center py-8">
                No product categories available.
              </p>
            ) : (
              Object.entries(categoryCounts).map(([catName, count]) => (
                <div
                  key={catName}
                  className="bg-[var(--color-background)] p-4 rounded-2xl border border-[var(--color-border)] flex items-center justify-between hover:border-[var(--color-primary)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                      <FaBoxOpen size={14} />
                    </div>
                    <span className="text-xs font-bold truncate text-[var(--color-text)] uppercase tracking-wider">
                      {catName}
                    </span>
                  </div>

                  <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full shadow-xs">
                    {count} {count === 1 ? "Item" : "Items"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Explore Catalog Link */}
          <Link
            to="/admin/products"
            className="w-full py-3 bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-text)] rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Manage Product Catalog</span>
            <FaArrowRight size={11} />
          </Link>
        </div>

      </div>

      {/* 4. RECENT ORDERS QUICK PREVIEW */}
      <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-[var(--color-text)]">Recent Orders</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Latest purchases needing administrative attention
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <FaArrowRight size={10} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-[var(--color-text-secondary)] text-center py-8">
            No recent orders available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] uppercase font-bold">
                  <th className="p-3 pl-4">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.order_id} className="hover:bg-[var(--color-background)] transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-[var(--color-primary)]">
                      #{ord.order_id}
                    </td>
                    <td className="p-3 font-bold text-[var(--color-text)]">
                      {ord.customer_name}
                    </td>
                    <td className="p-3 font-bold text-[var(--color-primary)]">
                      LKR {Number(ord.total_amount || 0).toLocaleString()}.00
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 border border-gray-200 text-gray-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs font-bold text-[var(--color-primary)] hover:underline"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}