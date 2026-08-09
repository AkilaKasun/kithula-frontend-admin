import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Added toast import
import OrderServices from "../../controllers/order.controller";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import { 
  FaEye, 
  FaTrash, 
  FaSearch, 
  FaSpinner, 
  FaShoppingBag, 
  FaTimes, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFilter,
  FaStickyNote
} from "react-icons/fa";

// Status Badge Styling Helper
const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Processing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Shipped":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // View Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Change State
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderServices.getAllOrders(0, 100);
      setOrders(data?.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Quick Status Update via Table Dropdown
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatusId(orderId);
      await OrderServices.updateOrderStatus(orderId, newStatus);
      
      // Update state locally
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.order_id === orderId ? { ...ord, status: newStatus } : ord
        )
      );

      // Also update selectedOrder modal if open
      if (selectedOrder && selectedOrder.order_id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Status update failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update status.";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Prompt Delete Order Modal
  const handlePromptDelete = (order) => {
    setDeletingOrder(order);
    setDeleteModalOpen(true);
  };

  // Execute Confirmed Order Deletion
  // Execute Confirmed Order Deletion
  const handleConfirmDelete = async () => {
    if (!deletingOrder) return;

    try {
      setIsDeleting(true);
      await OrderServices.deleteOrder(deletingOrder.order_id);
      
      toast.success(`Order #${deletingOrder.order_id} deleted successfully!`);
      setDeleteModalOpen(false);
      setDeletingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Delete order failed:", error);
      // Do NOT call toast.error() here if OrderServices already calls it
    } finally {
      setIsDeleting(false);
    }
  };
  // Filtered Orders Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      String(order.order_id).includes(searchTerm);

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans text-[var(--color-text)]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-wide">Customer Orders</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Track, process, and manage customer purchases
          </p>
        </div>

        <div className="text-xs font-bold bg-[var(--color-surface)] px-4 py-2 rounded-2xl border border-[var(--color-border)] shadow-sm">
          Total Orders: <span className="text-[var(--color-primary)]">{orders.length}</span>
        </div>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-md">
          <span className="absolute left-4 top-3.5 text-[var(--color-text-secondary)]">
            <FaSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by Order ID, Name, Email, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <span className="text-xs font-bold text-[var(--color-text-secondary)] mr-2 flex items-center gap-1">
            <FaFilter size={11} /> Filter:
          </span>
          {["ALL", ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table View */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <FaSpinner size={28} className="animate-spin mx-auto text-[var(--color-primary)]" />
          <p className="text-xs text-[var(--color-text-secondary)]">Loading customer orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] space-y-4">
          <FaShoppingBag size={40} className="mx-auto text-[var(--color-text-secondary)]" />
          <div>
            <h3 className="font-serif font-bold text-lg">No Orders Found</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              No orders matched your search query or filter selection.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-[var(--color-background)] transition-colors">
                    
                    {/* Order ID */}
                    <td className="p-4 pl-6 font-mono font-bold text-xs text-[var(--color-primary)]">
                      #{order.order_id}
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div>
                        <p className="font-serif font-bold text-sm text-[var(--color-text)]">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] truncate">
                          {order.phone} • {order.email}
                        </p>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="p-4 font-bold text-[var(--color-primary)]">
                      LKR {Number(order.total_amount || 0).toLocaleString()}.00
                    </td>

                    {/* Item Count */}
                    <td className="p-4 text-xs font-semibold">
                      {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                    </td>

                    {/* Inline Status Dropdown */}
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          disabled={updatingStatusId === order.order_id}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-colors ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} className="bg-white text-gray-800">
                              {st}
                            </option>
                          ))}
                        </select>
                        {updatingStatusId === order.order_id && (
                          <FaSpinner size={10} className="animate-spin absolute right-2 top-2.5 text-gray-500" />
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Order Details */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <FaEye size={15} />
                        </button>

                        {/* Delete Order */}
                        <button
                          onClick={() => handlePromptDelete(order)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED ORDER VIEW MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] w-full max-w-3xl rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-[var(--color-secondary)]">Order Details</span>
                <h3 className="text-2xl font-serif font-bold text-[var(--color-primary)]">
                  Order #{selectedOrder.order_id}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Customer & Shipping Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[var(--color-background)] p-5 rounded-2xl border border-[var(--color-border)]">
              
              {/* Customer Contact Info */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs uppercase font-bold text-[var(--color-text-secondary)] tracking-wider">
                  Customer Information
                </h4>
                <p className="font-serif font-bold text-base text-[var(--color-text)]">
                  {selectedOrder.customer_name}
                </p>
                <div className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                  <p className="flex items-center gap-2">
                    <FaPhone size={12} className="text-[var(--color-primary)]" />
                    <span>{selectedOrder.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaEnvelope size={12} className="text-[var(--color-primary)]" />
                    <span>{selectedOrder.email}</span>
                  </p>
                  <p className="flex items-center gap-2 pt-1">
                    <FaCalendarAlt size={12} className="text-[var(--color-primary)]" />
                    <span>Placed on: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "N/A"}</span>
                  </p>
                </div>
              </div>

              {/* Delivery Address & Notes */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs uppercase font-bold text-[var(--color-text-secondary)] tracking-wider">
                  Shipping Destination
                </h4>
                <div className="text-xs text-[var(--color-text)] space-y-1">
                  <p className="flex items-start gap-2">
                    <FaMapMarkerAlt size={13} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.shipping_address?.address_line1}
                      {selectedOrder.shipping_address?.address_line2 && `, ${selectedOrder.shipping_address.address_line2}`}
                      <br />
                      {selectedOrder.shipping_address?.district}, {selectedOrder.shipping_address?.postal_code}
                    </span>
                  </p>
                </div>

                {selectedOrder.notes && (
                  <div className="pt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                    <FaStickyNote size={13} className="shrink-0 mt-0.5" />
                    <span><strong>Note:</strong> {selectedOrder.notes}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Status Quick Select inside Modal */}
            <div className="flex items-center justify-between bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Current Order Status
              </span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.order_id, e.target.value)}
                className={`text-xs font-bold px-4 py-2 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeClass(
                  selectedOrder.status
                )}`}
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st} className="bg-white text-gray-800">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] text-left">
                Order Items ({selectedOrder.items?.length || 0})
              </h4>

              <div className="bg-[var(--color-background)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-bold uppercase">
                      <th className="p-3 pl-4">Product Name</th>
                      <th className="p-3 text-center">Unit Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 pr-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 pl-4 font-serif font-bold text-[var(--color-text)]">
                          {item.product_name}
                        </td>
                        <td className="p-3 text-center text-[var(--color-text-secondary)]">
                          LKR {Number(item.unit_price || 0).toLocaleString()}.00
                        </td>
                        <td className="p-3 text-center font-bold">x{item.quantity}</td>
                        <td className="p-3 pr-4 text-right font-bold text-[var(--color-primary)]">
                          LKR {Number(item.subtotal || 0).toLocaleString()}.00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grand Total Footer */}
            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Grand Total Amount
              </span>
              <span className="text-2xl font-serif font-bold text-[var(--color-primary)]">
                LKR {Number(selectedOrder.total_amount || 0).toLocaleString()}.00
              </span>
            </div>

          </div>
        </div>
      )}

      {/* REUSABLE DELETE CONFIRMATION POPUP MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Order Record"
        message="Are you sure you want to delete this order? (Note: Deletion is permitted only for 'Delivered' or 'Cancelled' orders)."
        itemName={`Order #${deletingOrder?.order_id} - ${deletingOrder?.customer_name}`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeletingOrder(null);
          }
        }}
      />

    </div>
  );
}