import { useState, useMemo, useEffect } from 'react';
import { getExpenses } from '../services/expenseService';
import { useTheme } from '../context/ThemeContext';

/**
 * Shows spending history grouped by day, week, or month.
 */
export default function History({ onBack }) {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('day');                 // day/week/month view
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const { theme } = useTheme();

  const todayMonth = new Date().toISOString().slice(0, 7);     // Current YYYY-MM

  // Load saved expenses once
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpenses(getExpenses());
  }, []);

  // Go to previous month
  const goToPreviousMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);

    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;

    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Go forward a month (disabled on the current month)
  const goToNextMonth = () => {
    if (selectedMonth === todayMonth) return;

    const [year, month] = selectedMonth.split('-').map(Number);
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;

    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Jump back to current month
  const goToCurrentMonth = () => {
    setSelectedMonth(todayMonth);
  };

  // Group expenses by selected filter
  const groupedExpenses = useMemo(() => {
    const grouped = {};

    expenses.forEach(expense => {
      const expDate = new Date(expense.date);
      const expenseMonth = expense.date.slice(0, 7);

      // Month view only shows selected month
      if (filter === 'month' && expenseMonth !== selectedMonth) return;

      let periodKey;

      if (filter === 'day') periodKey = expense.date;
      else if (filter === 'week') {
        const weekStart = new Date(expDate);
        weekStart.setDate(expDate.getDate() - expDate.getDay()); // Sunday start
        periodKey = weekStart.toISOString().slice(0, 10);
      }
      else if (filter === 'month') periodKey = expenseMonth;

      if (!grouped[periodKey]) {
        grouped[periodKey] = { expenses: [], total: 0, income: 0 };
      }

      const amount = Number(expense.amount || 0);

      grouped[periodKey].expenses.push(expense);

      if (expense.type === 'income') grouped[periodKey].income += amount;
      else grouped[periodKey].total += amount;
    });

    // Sort newest first
    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses, filter, selectedMonth]);

  // Format period titles for day/week/month
  const formatPeriod = (key) => {
    if (filter === 'day') {
      return new Date(key).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }

    if (filter === 'week') {
      const start = new Date(key);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      return `Week of ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    if (filter === 'month') {
      return new Date(key + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
  };

  // Theme classes
  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textMutedClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} p-3 sm:p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">History</h1>
            <p className={`text-sm ${textMutedClass}`}>Track your spending history over time</p>
          </div>

          <button
            onClick={onBack}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium ${
              theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Back
          </button>
        </header>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {['day', 'week', 'month'].map(period => (
            <button
              key={period}
              onClick={() => setFilter(period)}
              className={`px-3 py-2 rounded-lg font-medium capitalize ${
                filter === period
                  ? 'bg-orange-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Month navigation (visible only in "month" view) */}
        {filter === 'month' && (
          <div className={`${cardClass} p-4 rounded-lg border ${borderClass} mb-8`}>
            <div className="flex flex-wrap items-center justify-between gap-3">

              {/* Previous month */}
              <button
                onClick={goToPreviousMonth}
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                ← Previous
              </button>

              {/* Month selector */}
              <div className="flex items-center gap-3">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${borderClass} ${
                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  }`}
                />
                <span className="font-semibold">
                  {new Date(selectedMonth + '-01').toLocaleDateString('en-US', {
                    month: 'long', year: 'numeric'
                  })}
                </span>
              </div>

              {/* Next month */}
              <button
                onClick={goToNextMonth}
                disabled={selectedMonth === todayMonth}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedMonth === todayMonth
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Next →
              </button>

              {/* Jump to current month */}
              <button
                onClick={goToCurrentMonth}
                className={`px-4 py-2 rounded-lg font-medium ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Today
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {groupedExpenses.length === 0 ? (
            <div className={`${cardClass} p-6 rounded-lg text-center`}>
              <p className={textMutedClass}>No transactions found</p>
            </div>
          ) : (
            groupedExpenses.map(([period, data]) => (
              <div key={period} className={`${cardClass} p-6 rounded-lg border ${borderClass}`}>

                {/* Period header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-lg font-semibold">{formatPeriod(period)}</h2>

                  <div className="flex gap-4 text-sm">
                    {data.income > 0 && (
                      <span className="text-green-600 font-medium">
                        Income: +${data.income.toFixed(2)}
                      </span>
                    )}
                    <span className="text-red-600 font-medium">
                      Spent: ${data.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Each transaction */}
                <div className="space-y-2">
                  {data.expenses.map(expense => (
                    <div
                      key={expense.id}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold ${
                            expense.type === 'income'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {expense.category[0]}
                        </div>

                        <div>
                          <p className="font-medium">{expense.category}</p>
                          {expense.notes && (
                            <p className={`text-xs ${textMutedClass}`}>
                              {expense.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <p
                        className={`font-semibold ${
                          expense.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
