"use client";

import { useAtom } from "jotai";
import { statsAtom } from "@/store";
import { DashboardCharts } from "./charts";

export function InsightsPanel() {
  const [stats] = useAtom(statsAtom);

  return (
    <div className="space-y-4">
      {/* 简化的KPI概览 - 适合左侧面板 */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="text-xs font-medium text-blue-700 mb-1">当前筛选论文数</div>
          <div className="text-lg font-bold text-blue-900">{stats.totalPapers.toLocaleString()}</div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-3 border border-emerald-200">
          <div className="text-xs font-medium text-emerald-700 mb-1">涉及国家数</div>
          <div className="text-lg font-bold text-emerald-900">{stats.totalCountries}</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <div className="text-xs font-medium text-purple-700 mb-1">主要AI算法</div>
          <div className="text-xs font-semibold text-purple-900 leading-relaxed">
            {Object.entries(stats.topAlgorithms)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 2)
              .map(([algo, count]) => `${algo}(${count})`)
              .join(", ") || "暂无数据"}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <div className="text-xs font-medium text-orange-700 mb-1">主要医学专科</div>
          <div className="text-xs font-semibold text-orange-900 leading-relaxed">
            {Object.entries(stats.topSpecialties)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 2)
              .map(([spec, count]) => `${spec}(${count})`)
              .join(", ") || "暂无数据"}
          </div>
        </div>
      </div>

      {/* 紧凑的图表区域 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">趋势分析</h4>
        <DashboardCharts />
      </div>
    </div>
  );
} 