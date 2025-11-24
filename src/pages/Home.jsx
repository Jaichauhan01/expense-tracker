import { useState, useEffect, useMemo, useCallback } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import ChartComponent from "../components/ChartComponent";
import { getExpenses, saveExpenses } from "../services/expenseService";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import History from "./History";

export default function Home() {
  const [expenses, setExpenses] = useState([]);                  // All transactions
  const [filters, setFilters] = useState({ category: "All", from: "", to: "" });
  const [currentPage, setCurrentPage] = useState("home");        // home / history
  const { theme } = useTheme();

  // Load saved data on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpenses(getExpenses());
  }, []);

  // Save changes whenever expenses update
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  // Add new transaction
  const handleAdd = useCallback((expense) => {
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  // Delete a transaction
  const handleDelete = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Build category totals
  const summary = useMemo(() => {
    return expenses.reduce((acc, ex) => {
      const cat = ex.category || "Misc";
      acc[cat] = (acc[cat] || 0) + Number(ex.amount || 0);
      return acc;
    }, {});
  }, [expenses]);

  // Switch to History page
  if (currentPage === "history") {
    return <History onBack={() => setCurrentPage("home")} />;
  }

  // Theme styles
  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const cardClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${bgClass} p-3 sm:p-4 md:p-8`}>

      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">

          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
              Ex
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold truncate">
                Expense Tracker
              </h1>
              <p className={`text-xs sm:text-sm ${textMutedClass} truncate`}>
                Track and manage your spending
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentPage("history")}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
                theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              History
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* LEFT + MIDDLE COLUMNS */}
        <section className="lg:col-span-2 space-y-4 sm:space-y-6">

          {/* Form + Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <ExpenseForm onAdd={handleAdd} />
            <ExpenseSummary summary={summary} />
          </div>

          {/* List of transactions */}
          <ExpenseList
            expenses={expenses}
            onDelete={handleDelete}
            filters={filters}
            onFilterChange={setFilters}
          />
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4 sm:space-y-6">

          {/* Category list */}
          <div className={`${cardClass} p-3 sm:p-4 rounded-xl shadow-sm`}>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Categories
            </h3>

            <div className="space-y-2 sm:space-y-3">
              {Object.keys(summary).length === 0 ? (
                <div className={textMutedClass}>No categories yet</div>
              ) : (
                Object.entries(summary).map(([cat, amt]) => (
                  <div key={cat} className="flex items-center justify-between gap-2">

                    {/* Icon + Name */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        } flex items-center justify-center shrink-0 text-xs sm:text-sm font-semibold`}
                      >
                        {cat[0]}
                      </div>
                      <div className="text-sm truncate">{cat}</div>
                    </div>

                    {/* Total */}
                    <div className="font-semibold text-sm shrink-0">
                      ${amt.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chart */}
          <ChartComponent summary={summary} expenses={expenses} />
        </aside>
      </main>
    </div>
  );
}
