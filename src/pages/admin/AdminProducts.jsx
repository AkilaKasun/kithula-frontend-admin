import React, { useState, useEffect } from "react";
import ProductServices from "../../controllers/product.controller";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal"; // Import Delete Modal
import { 
  FaPlus, 
  FaList, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaSpinner, 
  FaBoxOpen, 
  FaSearch, 
  FaTimes,
} from "react-icons/fa";

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("list"); // 'list' | 'add'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Form State
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [addFile, setAddFile] = useState(null);
  const [addFilePreview, setAddFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    is_active: true,
  });
  const [editFile, setEditFile] = useState(null);
  const [editFilePreview, setEditFilePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products on component mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductServices.getAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Add Product File Selection
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddFile(file);
      setAddFilePreview(URL.createObjectURL(file));
    }
  };

  // Create Product Submit Handler
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!addFile) {
      alert("Please select a product image file.");
      return;
    }

    try {
      setIsSubmitting(true);
      await ProductServices.createProduct(addFormData, addFile);
      
      // Reset Form & Refresh List
      setAddFormData({ name: "", description: "", price: "", stock: "", category: "" });
      setAddFile(null);
      setAddFilePreview(null);
      setActiveTab("list");
      fetchProducts();
    } catch (error) {
      console.error("Create product failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal with Pre-filled Data
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      is_active: product.is_active ?? true,
    });
    setEditFile(null);
    setEditFilePreview(product.image_url || null);
  };

  // Handle Edit File Selection
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditFilePreview(URL.createObjectURL(file));
    }
  };

  // Update Product Submit Handler
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsUpdating(true);
      await ProductServices.updateProduct(
        editingProduct.product_id,
        editFormData,
        editFile
      );
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Update product failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Trigger Delete Confirmation Modal
  const handlePromptDelete = (product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  // Execute Confirmed Delete Operation
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      setIsDeleting(true);
      await ProductServices.deleteProduct(deletingProduct.product_id);
      setDeleteModalOpen(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Delete product failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Products Search
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans text-[var(--color-text)]">
      
      {/* Header & Sub-section Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-wide">Product Catalog</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Manage, update, and create organic Kithul products
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 bg-[var(--color-surface)] p-1.5 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            <FaList size={13} />
            <span>All Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "add"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            <FaPlus size={13} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* SUBSECTION 1: DISPLAY ALL PRODUCTS */}
      {activeTab === "list" && (
        <div className="space-y-6">
          
          {/* Search Controls */}
          <div className="flex items-center justify-between gap-4 bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-4 top-3.5 text-[var(--color-text-secondary)]">
                <FaSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <FaSpinner size={28} className="animate-spin mx-auto text-[var(--color-primary)]" />
              <p className="text-xs text-[var(--color-text-secondary)]">Loading inventory catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] space-y-4">
              <FaBoxOpen size={40} className="mx-auto text-[var(--color-text-secondary)]" />
              <div>
                <h3 className="font-serif font-bold text-lg">No Products Found</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Try adjusting your search terms or add a new item.</p>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                      <th className="p-4 pl-6">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (LKR)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filteredProducts.map((p) => (
                      <tr key={p.product_id} className="hover:bg-[var(--color-background)] transition-colors">
                        
                        {/* Product info */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image_url || "https://placehold.co/100?text=No+Img"}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border)] bg-gray-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-serif font-bold text-sm truncate">{p.name}</h4>
                              <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">{p.description}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-xs font-semibold uppercase">{p.category || "Organic"}</td>
                        <td className="p-4 font-bold text-[var(--color-primary)]">LKR {Number(p.price || 0).toLocaleString()}.00</td>
                        <td className="p-4 text-xs font-bold">{p.stock} units</td>

                        <td className="p-4">
                          {p.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Disabled
                            </span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-background)] rounded-lg transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <FaEdit size={15} />
                            </button>

                            <button
                              onClick={() => handlePromptDelete(p)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
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

        </div>
      )}

      {/* SUBSECTION 2: ADD NEW PRODUCT FORM */}
      {activeTab === "add" && (
        <div className="max-w-3xl mx-auto bg-[var(--color-surface)] p-8 sm:p-10 rounded-3xl border border-[var(--color-border)] shadow-sm space-y-8">
          <div className="border-b border-[var(--color-border)] pb-4">
            <h2 className="text-2xl font-serif font-bold text-[var(--color-primary)]">Create New Product</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Upload image and fill details to add to catalog</p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-6">
            
            {/* Image File Picker */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                Product Image *
              </label>
              
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-[var(--color-border)] flex items-center justify-center overflow-hidden bg-[var(--color-background)] shrink-0 relative">
                  {addFilePreview ? (
                    <img src={addFilePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaImage size={24} className="text-[var(--color-text-secondary)]" />
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="add-image-input"
                    onChange={handleAddFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="add-image-input"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-background)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                  >
                    <FaImage size={13} />
                    <span>Choose Image</span>
                  </label>
                  <p className="text-[11px] text-[var(--color-text-secondary)]">PNG, JPG, or WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Kithul Treacle 500ml"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Treacle, Jaggery, Chocolate"
                  value={addFormData.category}
                  onChange={(e) => setAddFormData({ ...addFormData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="1500.00"
                  value={addFormData.price}
                  onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                  Available Stock *
                </label>
                <input
                  type="number"
                  required
                  placeholder="50"
                  value={addFormData.stock}
                  onChange={(e) => setAddFormData({ ...addFormData, stock: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe product taste, origin, and packaging..."
                value={addFormData.description}
                onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting && <FaSpinner size={13} className="animate-spin" />}
                <span>{isSubmitting ? "Saving..." : "Create Product"}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] w-full max-w-2xl rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
            
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">
                Update Product #{editingProduct.product_id}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-5">
              
              {/* Image picker */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] bg-gray-100 shrink-0">
                  {editFilePreview ? (
                    <img src={editFilePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaImage size={20} className="m-auto text-gray-400" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    id="edit-image-input"
                    onChange={handleEditFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-image-input"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <FaImage size={12} />
                    <span>Replace Image</span>
                  </label>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">Leave empty to keep current image</p>
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">Category</label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Price, Stock & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">Price (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">Stock</label>
                  <input
                    type="number"
                    required
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">Status</label>
                  <select
                    value={editFormData.is_active ? "true" : "false"}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === "true" })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-secondary)] block">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase border border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-xs font-bold uppercase rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isUpdating && <FaSpinner size={12} className="animate-spin" />}
                  <span>{isUpdating ? "Updating..." : "Save Changes"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* REUSABLE DELETE CONFIRMATION POPUP MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Product"
        message="Are you sure you want to permanently remove this product from your inventory and S3 storage?"
        itemName={deletingProduct?.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setDeletingProduct(null);
          }
        }}
      />

    </div>
  );
}