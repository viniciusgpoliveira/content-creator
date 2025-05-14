/**
 * MetricsChart Component
 *
 * A responsive, theme-aware chart component using Recharts library.
 * This component displays engagement metrics with proper theming for both
 * light and dark modes, with special attention to contrast and readability.
 *
 * Key features:
 * - Theme-aware colors that adapt to light/dark mode
 * - Neon blue colors for dark theme for better visibility
 * - Proper contrast for axis labels and tooltips
 * - Responsive design that works on all screen sizes
 *
 * @bug Fixed: Poor contrast in dark theme making charts unreadable
 * @bug Fixed: Tooltip background transparency issue
 * @bug Fixed: Missing axis labels for accessibility
 */

"use client";

import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { RechartsWrapper } from "@/components/ui/recharts-wrapper";
import { ChartData } from "@/types";

interface MetricsChartProps {
  data: ChartData;
}

export function MetricsChart({ data }: MetricsChartProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Convert Chart.js data format to Recharts format
  const chartData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };

    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });

    return dataPoint;
  });

  /**
   * Get theme-specific colors for chart elements
   *
   * This function returns different color values based on the current theme (dark/light)
   * to ensure proper contrast and visibility in both modes.
   *
   * For dark theme: Higher opacity text, subtle grid lines, and dark tooltip background
   * For light theme: Dark text, light grid lines, and white tooltip background
   */
  const getColors = () => {
    if (theme === "dark") {
      return {
        text: "rgba(255, 255, 255, 0.9)",      // High contrast text for dark theme
        grid: "rgba(255, 255, 255, 0.1)",      // Subtle grid lines
        tooltip: "hsl(var(--background))",      // Background color from theme
        axisLabel: "rgba(255, 255, 255, 0.9)", // High contrast axis labels
        tooltipBg: "rgba(0, 0, 0, 0.8)",       // Semi-transparent black for tooltip
        tooltipBorder: "rgba(255, 255, 255, 0.2)", // Subtle border
      };
    }
    return {
      text: "rgba(0, 0, 0, 0.8)",           // Dark text for light theme
      grid: "rgba(0, 0, 0, 0.1)",           // Subtle grid lines
      tooltip: "hsl(var(--background))",     // Background color from theme
      axisLabel: "rgba(0, 0, 0, 0.8)",      // Dark axis labels
      tooltipBg: "rgba(255, 255, 255, 0.95)", // Nearly opaque white for tooltip
      tooltipBorder: "rgba(0, 0, 0, 0.1)",   // Subtle border
    };
  };

  const colors = getColors();

  /**
   * Generate a unique line color for each dataset based on current theme
   *
   * For dark theme: Brighter, neon-like colors with blue focus for better visibility
   * For light theme: Deeper, more saturated colors for better contrast on white
   *
   * @param index - The dataset index to get color for
   * @returns A hex color code appropriate for the current theme
   */
  const getLineColor = (index: number) => {
    // Neon colors for dark theme, softer colors for light theme
    const colorOptions = theme === "dark"
      ? [
          "#3b82f6", // blue-500 - Primary color
          "#60a5fa", // blue-400 - Lighter blue
          "#38bdf8", // sky-400 - Sky blue
          "#22d3ee", // cyan-400 - Cyan
          "#2dd4bf", // teal-400 - Teal
          "#4ade80", // green-400 - Green
        ]
      : [
          "#2563eb", // blue-600 - Deeper blue for light theme
          "#4f46e5", // indigo-600 - Indigo
          "#0891b2", // cyan-600 - Deeper cyan
          "#0d9488", // teal-600 - Deeper teal
          "#059669", // emerald-600 - Emerald
          "#16a34a", // green-600 - Deeper green
        ];

    return colorOptions[index % colorOptions.length];
  };

  /**
   * Generate semi-transparent fill colors for the area under each line
   *
   * Dark theme uses higher opacity (0.3) for more vibrant appearance
   * Light theme uses lower opacity (0.15) for subtle appearance
   *
   * @param index - The dataset index to get color for
   * @returns An rgba color string with appropriate opacity
   */
  const getAreaColor = (index: number) => {
    // More vibrant area colors for dark theme
    const colorOptions = theme === "dark"
      ? [
          "rgba(59, 130, 246, 0.3)", // blue-500 with opacity
          "rgba(96, 165, 250, 0.3)", // blue-400 with opacity
          "rgba(56, 189, 248, 0.3)", // sky-400 with opacity
          "rgba(34, 211, 238, 0.3)", // cyan-400 with opacity
          "rgba(45, 212, 191, 0.3)", // teal-400 with opacity
          "rgba(74, 222, 128, 0.3)", // green-400 with opacity
        ]
      : [
          "rgba(37, 99, 235, 0.15)", // blue-600 with opacity
          "rgba(79, 70, 229, 0.15)", // indigo-600 with opacity
          "rgba(8, 145, 178, 0.15)", // cyan-600 with opacity
          "rgba(13, 148, 136, 0.15)", // teal-600 with opacity
          "rgba(5, 150, 105, 0.15)", // emerald-600 with opacity
          "rgba(22, 163, 74, 0.15)", // green-600 with opacity
        ];

    return colorOptions[index % colorOptions.length];
  };

  return (
    <RechartsWrapper className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={{ stroke: colors.grid }}
            axisLine={{ stroke: colors.grid }}
            label={{
              value: "Day",
              position: "insideBottomRight",
              offset: -5,
              fill: colors.axisLabel,
              style: { textShadow: theme === "dark" ? "0 0 2px rgba(0,0,0,0.8)" : "none" }
            }}
          />
          <YAxis
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={{ stroke: colors.grid }}
            axisLine={{ stroke: colors.grid }}
            width={30}
            label={{
              value: "Value",
              angle: -90,
              position: "insideLeft",
              fill: colors.axisLabel,
              style: { textShadow: theme === "dark" ? "0 0 2px rgba(0,0,0,0.8)" : "none" }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              color: colors.text,
              padding: "8px 12px",
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: "0.25rem" }}
            cursor={{ stroke: colors.grid, strokeWidth: 1 }}
            animationDuration={200}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ paddingTop: "10px" }}
          />
          {data.datasets.map((dataset, index) => (
            <Line
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              name={dataset.label}
              stroke={getLineColor(index)}
              strokeWidth={2}
              fill={getAreaColor(index)}
              fillOpacity={1}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </RechartsWrapper>
  );
}
