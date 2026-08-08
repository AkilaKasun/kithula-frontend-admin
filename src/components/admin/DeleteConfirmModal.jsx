import React from "react";
import { FaExclamationTriangle, FaTimes, FaSpinner } from "react-icons/fa";

export default function DeleteConfirmModal({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isDeleting = false,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[var(--color-surface)] w-full max-w-md rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Top Header & Close Icon */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
            <FaExclamationTriangle size={22} />
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Text Content */}
        <div className="space-y-2 text-left">
          <h3 className="text-xl font-serif font-bold text-[var(--color-text)]">
            {title}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {message}
          </p>

          {/* Highlighted Item Name */}
          {itemName && (
            <div className="p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] mt-2">
              <span className="text-xs font-bold text-[var(--color-text)] break-all">
                "{itemName}"
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isDeleting && <FaSpinner size={12} className="animate-spin" />}
            <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}