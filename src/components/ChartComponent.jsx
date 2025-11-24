import { useRef, useEffect } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  DoughnutController,
  LineController
} from "chart.js";

import { useTheme } from "../context/ThemeContext";

// Register chart types and elements
Chart.register(
  DoughnutController,
  LineController,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
);

/**
 * Shows two charts:
 * 1. Doughnut → category-wise expenses
 * 2. Line → last 12 days' net flow
 */
export default function ChartComponent({ summary = {}, expenses = [] }) {
  // Canvas and chart instance refs
  const doughnutRef = useRef(null);
  const lineRef = useRef(null);

  const doughnutChart = useRef(null);
  const lineChart = useRef(null);

  const { theme } = useTheme();

  /* ---------------- Doughnut Chart ---------------- */
  useEffect(() => {
    if (!doughnutRef.current) return;

    const labels = Object.keys(summary);
    const data = Object.values(summary);

    if (doughnutChart.current) doughnutChart.current.destroy();

    const textColor = theme === "dark" ? "#e5e7eb" : "#374151";

    doughnutChart.current = new Chart(doughnutRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "#60A5FA",
              "#F472B6",
              "#34D399",
              "#F59E0B",
              "#A78BFA",
              "#F97316"
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor }
          }
        }
      }
    });
  }, [summary, theme]);

  /* ---------------- Line Chart ---------------- */
  useEffect(() => {
    if (!lineRef.current) return;

    // Prepare last 12 days with default 0 values
    const days = [];
    const map = {};

    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push(key);
      map[key] = 0;
    }

    // Add income (+) or expense (-)
    for (const e of expenses) {
      const key = new Date(e.date).toISOString().slice(0, 10);
      if (map[key] !== undefined) {
        map[key] += Number(e.amount) * (e.type === "income" ? 1 : -1);
      }
    }

    const labels = days.map((d) => new Date(d).toLocaleDateString());
    const values = days.map((d) => map[d]);

    if (lineChart.current) lineChart.current.destroy();

    const textColor = theme === "dark" ? "#e5e7eb" : "#374151";
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";

    lineChart.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Net Flow",
            data: values,
            tension: 0.35,
            fill: true,
            backgroundColor: "rgba(99,102,241,0.12)",
            borderColor: "#6366F1",
            pointRadius: 3,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: textColor },
            grid: { color: gridColor }
          },
          x: {
            ticks: { color: textColor },
            grid: { color: gridColor }
          }
        }
      }
    });
  }, [expenses, theme]);

  /* ---------------- Layout ---------------- */
  const containerBg =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900";

  const chartBg = theme === "dark" ? "bg-gray-700" : "bg-gray-50";

  return (
    <div className={`${containerBg} p-4 rounded-xl shadow-sm`}>
      <h3 className="text-lg font-semibold mb-4">Charts</h3>

      <div className="grid grid-cols-1 gap-4">
        {/* Doughnut */}
        <div className={`p-4 rounded-xl ${chartBg} h-64`}>
          <canvas ref={doughnutRef}></canvas>
        </div>

        {/* Line */}
        <div className={`p-4 rounded-xl ${chartBg} h-64`}>
          <canvas ref={lineRef}></canvas>
        </div>
      </div>
    </div>
  );
}
