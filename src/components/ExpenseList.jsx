import { useMemo } from "react";
import { formatDate } from "../utils/FormatDate";
import { useTheme } from "../context/ThemeContext";

/**
 * Shows a list of transactions with filters.
 */
export default function ExpenseList({
  expenses = [],
  onDelete,
  filters = { category: "All", from: "", to: "" },
  onFilterChange
}) {

  const { theme } = useTheme();

  // Filter and  sort the transactions
  const filtered = useMemo(() => {
    const { category, from, to } = filters;

    return expenses
      .filter((e) => {
        if (category !== "All" && e.category !== category) return false;
        if (from && e.date < from) return false;
        if (to && e.date > to) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
  }, [expenses, filters]);

  // Theme styles
  const bgClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white";
  const inputClass =
    theme === "dark"
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300";
  const itemBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <section className={`${bgClass} p-3 sm:p-4 rounded-xl shadow-sm`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Recent Transactions</h3>
        <div className={`text-xs sm:text-sm ${textMutedClass}`}>
          {filtered.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {/* Category dropdown */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className={`border rounded-lg p-2 text-xs sm:text-sm ${inputClass}`}
        >
          <option>All</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Utilities</option>
          <option>Shopping</option>
          <option>Income</option>
          <option>Others</option>
        </select>

        {/* From date */}
        <input
          type="date"
          value={filters.from}
          onChange={(e) => onFilterChange({ ...filters, from: e.target.value })}
          className={`border rounded-lg p-2 text-xs sm:text-sm ${inputClass}`}
        />

        {/* To date */}
        <input
          type="date"
          value={filters.to}
          onChange={(e) => onFilterChange({ ...filters, to: e.target.value })}
          className={`border rounded-lg p-2 text-xs sm:text-sm ${inputClass}`}
        />

        {/* Clear filters */}
        <button
          onClick={() => onFilterChange({ category: "All", from: "", to: "" })}
          className={`border rounded-lg p-2 text-xs sm:text-sm transition ${
            theme === "dark"
              ? "border-gray-600 hover:bg-gray-700"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          Clear
        </button>
      </div>

      {/* List */}
      <div className="space-y-2 sm:space-y-3">

        {/* No items */}
        {filtered.length === 0 && (
          <div className={textMutedClass}>No transactions yet</div>
        )}

        {/* Transaction cards */}
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${itemBgClass} p-2 sm:p-4 rounded-lg`}
          >
            {/* Left: category + notes/date */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">

              {/* Category icon */}
              <div
                className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg border shrink-0 flex items-center justify-center text-xs sm:text-sm font-semibold ${
                  theme === "dark"
                    ? "bg-gray-600 border-gray-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {ex.category[0]}
              </div>

              {/* Notes and date */}
              <div className="min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">
                  {ex.notes || ex.category}
                </div>
                <div className={`text-xs sm:text-sm ${textMutedClass} truncate`}>
                  {formatDate(ex.date)}
                </div>
              </div>
            </div>

            {/* Right: amount and  delete */}
            <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-end">

              {/* Amount */}
              <div
                className={`font-semibold text-sm sm:text-base shrink-0 ${
                  ex.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {ex.type === "income" ? "+" : "-"}${ex.amount.toFixed(2)}
              </div>

              {/* Delete button */}
              <button
                onClick={() => onDelete(ex.id)}
                className={`p-2 rounded-full transition shrink-0 ${
                  theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
                title="Delete"
              >
                {/* Trash icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 6h18"></path>
                  <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"></path>
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                </svg>
              </button>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
