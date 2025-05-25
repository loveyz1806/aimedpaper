"use client";

import { useAtom } from "jotai";
import { statsAtom, filterStateAtom } from "@/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

export function DashboardCharts() {
  const stats = useAtom(statsAtom)[0];
  const [filterState, setFilterState] = useAtom(filterStateAtom);

  const yearlyData = Object.entries(stats.yearlyTrend || {}).map(([year, count]) => ({
    year: parseInt(year),
    count,
  }));

  const algorithmData = Object.entries(stats.topAlgorithms || {})
    .map(([name, count]) => ({
      name,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const specialtyData = Object.entries(stats.topSpecialties || {})
    .map(([name, count]) => ({
      name,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 处理年份点击事件
  const handleYearClick = (data: { activePayload?: Array<{ payload: { year: number } }> }) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedYear = data.activePayload[0].payload.year;
      // 如果点击的是当前选中的年份，则取消选择
      const newSelectedYear = filterState.selectedYear === clickedYear ? null : clickedYear;
      setFilterState({
        ...filterState,
        selectedYear: newSelectedYear,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 论文发表趋势 - 可点击选择年份 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-xs font-medium text-slate-700">论文发表趋势</h5>
          {filterState.selectedYear && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 font-medium">
                已选择: {filterState.selectedYear}年
              </span>
              <button
                onClick={() => setFilterState({ ...filterState, selectedYear: null })}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                清除
              </button>
            </div>
          )}
        </div>
        <div className="h-32 cursor-pointer">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={yearlyData} 
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              onClick={handleYearClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  fontSize: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
                formatter={(value, name, props) => [
                  `${value} 篇论文`,
                  `${props.payload.year}年`
                ]}
                labelFormatter={() => '点击选择年份'}
              />
              <Bar 
                dataKey="count" 
                radius={[2, 2, 0, 0]}
                fill="#3b82f6"
              >
                {yearlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.year === filterState.selectedYear ? "#1d4ed8" : "#3b82f6"}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          点击柱状图选择特定年份的论文
        </p>
      </div>

      {/* AI算法分布 - 紧凑版 */}
      <div>
        <h5 className="text-xs font-medium text-slate-700 mb-2">AI算法分布</h5>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={algorithmData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {algorithmData.map((entry, index) => (
                  <Cell
                    key={`algorithm-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  fontSize: '11px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 图例 */}
        <div className="grid grid-cols-1 gap-1 mt-2">
          {algorithmData.slice(0, 3).map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-slate-600 truncate">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 医学专科分布 - 紧凑版 */}
      <div>
        <h5 className="text-xs font-medium text-slate-700 mb-2">医学专科分布</h5>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={specialtyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {specialtyData.map((entry, index) => (
                  <Cell
                    key={`specialty-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  fontSize: '11px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* 图例 */}
        <div className="grid grid-cols-1 gap-1 mt-2">
          {specialtyData.slice(0, 3).map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-slate-600 truncate">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 