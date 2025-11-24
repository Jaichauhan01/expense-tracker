import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Form to add a new expense or income.
 * Sends the final data to the parent component  using onAdd().
 */
export default function ExpenseForm({ onAdd }) {

  // initalising form data with empty state and current date
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    type: "expense"
  });

  const { theme } = useTheme();

  // Updates form fields on change 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission:
   * - Checks amount is valid
   * - Creates a new expense object
   * - Sends it to parent
   * - Resets the form
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Build transaction
    const newExpense = {
      id: `exp-${Date.now()}`,
      amount: parseFloat(formData.amount),
      category: formData.type === "income" ? "Income" : formData.category,
      date: formData.date,
      notes: formData.notes,
      type: formData.type
    };

    onAdd(newExpense);

    // Reset form
    setFormData({
      amount: "",
      category: "Food",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
      type: "expense"
    });
  };

  // Theme styling
  const bgClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white';
  const inputClass =
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900';
  const labelClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  return (
    <form onSubmit={handleSubmit} className={`${bgClass} p-3 sm:p-4 rounded-xl shadow-sm`}>
      
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        Add Transaction
      </h3>

      <div className="space-y-3 sm:space-y-4">

        {/* Expense or Income */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-2 ${labelClass}`}>
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 text-sm sm:text-base ${inputClass}`}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Amount field */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-2 ${labelClass}`}>
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full border rounded-lg p-2 text-sm sm:text-base ${inputClass}`}
          />
        </div>

        {/* Category (only for expenses) */}
        {formData.type === "expense" && (
          <div>
            <label className={`block text-xs sm:text-sm font-medium mb-2 ${labelClass}`}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-sm sm:text-base ${inputClass}`}
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Entertainment</option>
              <option>Utilities</option>
              <option>Shopping</option>
              <option>Others</option>
            </select>
          </div>
        )}

        {/* date form*/}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-2 ${labelClass}`}>
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 text-sm sm:text-base ${inputClass}`}
          />
        </div>

        {/* Notes (optional) */}
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-2 ${labelClass}`}>
            Notes
          </label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional"
            className={`w-full border rounded-lg p-2 text-sm sm:text-base ${inputClass}`}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-semibold rounded-lg p-2 sm:p-3 hover:bg-orange-400 transition text-sm sm:text-base"
        >
          Add
        </button>

      </div>
    </form>
  );
}
