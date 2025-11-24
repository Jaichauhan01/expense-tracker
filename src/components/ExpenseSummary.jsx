/* eslint-disable react-hooks/static-components */
import { useTheme } from "../context/ThemeContext";

/**
 * Shows total spent + highest category + all category amounts.
 */
export default function ExpenseSummary({ summary = {} }) {
  const { theme } = useTheme();

  // Total of all categories
  const total = Object.values(summary).reduce((s, v) => s + v, 0);

  // Category with the highest amount
  const highest = Object.entries(summary).sort((a, b) => b[1] - a[1])[0];

  // Theme styles
  const bgClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white";
  const cardBgClass = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const textClass = theme === "dark" ? "text-gray-300" : "text-gray-600";

  // Large number formatter (auto shrinks)
  const FormatNumber = ({ amount }) => (
    <span className="font-bold text-lg sm:text-2xl max-w-full truncate block text-right sm:text-left">
      {new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)}
    </span>
  );

  // Smaller number version
  const FormatNumberSmall = ({ amount }) => (
    <span className="text-xs sm:text-sm font-semibold max-w-full truncate block text-right sm:text-left">
      ${amount.toFixed(2)}
    </span>
  );

  return (
    <div className={`${bgClass} p-3 sm:p-4 rounded-xl shadow-sm`}>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Summary</h3>
        <div className={`text-xs sm:text-sm ${textMutedClass}`}>Overview</div>
      </div>

      {/* Total + Highest */}
      <div className="grid grid-cols-2 gap-3 mb-4">

        {/* Total */}
        <div className={`p-3 rounded-lg ${cardBgClass} flex flex-col`}>
          <div className={`text-xs sm:text-sm ${textMutedClass}`}>Total Spent</div>
          <div className="max-w-full overflow-hidden text-ellipsis">
            <FormatNumber amount={total} />
          </div>
        </div>

        {/* Highest Category */}
        <div className={`p-3 rounded-lg ${cardBgClass} flex flex-col`}>
          <div className={`text-xs sm:text-sm ${textMutedClass}`}>Highest</div>

          <div className="text-lg sm:text-2xl font-bold truncate">
            {highest ? highest[0] : "—"}
          </div>

          {highest && (
            <div className="mt-1 max-w-full overflow-hidden">
              <FormatNumberSmall amount={highest[1]} />
            </div>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {Object.entries(summary).map(([cat, amt]) => (
          <div key={cat} className="flex items-center justify-between gap-3">

            {/* Category name */}
            <div className={`text-xs sm:text-sm ${textClass} truncate max-w-[60%]`}>
              {cat}
            </div>

            {/* Category amount */}
            <div className="font-semibold text-sm truncate max-w-[40%] text-right">
              <FormatNumberSmall amount={amt} />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
