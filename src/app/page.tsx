"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { papersAtom } from "@/store";
import { DashboardFilters } from "@/components/dashboard/filters";
import { DashboardTable } from "@/components/dashboard/table";
import { GlobalSearch } from "@/components/dashboard/global-search";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { 
  FaFileAlt, 
  FaGlobeAsia, 
  FaRobot, 
  FaStethoscope, 
  FaFilter,
  FaChartBar,
  FaTimes
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [papers, setPapers] = useAtom(papersAtom);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);

  // 统计数据
  const totalPapers = papers?.length || 0;
  const totalCountries = papers?.length
    ? new Set(papers.flatMap((p) => p.affil_countries_unique)).size
    : 0;

  // 统计AI算法
  const algorithmMapping = {
    "neural_net": "神经网络",
    "support_vector": "支持向量机",
    "decision_tree": "决策树",
    "random_forest": "随机森林",
    "naive_bayes": "朴素贝叶斯",
    "knn": "K近邻",
    "clustering": "聚类算法",
    "deep_learning": "深度学习",
    "transfer_learning": "迁移学习",
    "reinforcement_learning": "强化学习",
    "other": "其他"
  };
  
  const algoCounts: Record<string, number> = {};
  papers?.forEach((paper) => {
    Object.keys(paper)
      .filter((key) => key.startsWith("algo_") && (paper as unknown as Record<string, unknown>)[key])
      .forEach((key) => {
        const name = key.replace("algo_", "");
        algoCounts[name] = (algoCounts[name] || 0) + 1;
      });
  });
  const mainAIMethods = Object.entries(algoCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${algorithmMapping[k as keyof typeof algorithmMapping] || k}(${v})`)
    .join(", ") || "-";

  // 统计医学专科
  const specialtyMapping = {
    "onc": "肿瘤科",
    "cvs": "心血管科", 
    "neuro": "神经科",
    "paeds": "儿科",
    "id": "感染科",
    "other": "其他"
  };
  
  const specCounts: Record<string, number> = {};
  papers?.forEach((paper) => {
    Object.keys(paper)
      .filter((key) => key.startsWith("spec_") && (paper as unknown as Record<string, unknown>)[key])
      .forEach((key) => {
        const name = key.replace("spec_", "");
        specCounts[name] = (specCounts[name] || 0) + 1;
      });
  });
  const mainMedicalFields = Object.entries(specCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${specialtyMapping[k as keyof typeof specialtyMapping] || k}(${v})`)
    .join(", ") || "-";

  useEffect(() => {
    fetch("/api/papers")
      .then((res) => res.json())
      .then((data) => {
        setPapers(data);
      })
      .catch((error) => {
        console.error("Error loading papers:", error);
      });
  }, [setPapers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 顶部导航栏 */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                AI医疗论文研究进展仪表盘
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                探索全球AI医疗领域学术研究进展
              </p>
            </div>
            
            {/* 操作按钮组 */}
            <div className="flex items-center gap-3">
              <Button
                variant={isFilterPanelOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className="flex items-center gap-2"
              >
                <FaFilter className="w-4 h-4" />
                筛选
              </Button>
              <Button
                variant={isInsightsPanelOpen ? "default" : "outline"}
                size="sm"
                onClick={() => setIsInsightsPanelOpen(!isInsightsPanelOpen)}
                className="flex items-center gap-2"
              >
                <FaChartBar className="w-4 h-4" />
                数据洞察
              </Button>
            </div>
          </div>
          
          {/* 全局搜索框 */}
          <div className="mt-4">
            <GlobalSearch />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 筛选面板侧边栏 */}
        {isFilterPanelOpen && (
          <aside className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 h-[calc(100vh-140px)] sticky top-[140px] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">筛选条件</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="lg:hidden"
                >
                  <FaTimes className="w-4 h-4" />
                </Button>
              </div>
              <DashboardFilters />
            </div>
          </aside>
        )}

        {/* 主内容区域 */}
        <main className={`flex-1 ${isFilterPanelOpen ? 'max-w-[calc(100%-320px)]' : 'max-w-full'}`}>
          <div className="p-6 space-y-6">
            {/* KPI 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">总论文数</p>
                    <p className="text-3xl font-bold text-blue-600">{totalPapers.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaFileAlt className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">涉及国家数</p>
                    <p className="text-3xl font-bold text-emerald-600">{totalCountries}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <FaGlobeAsia className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">主要AI算法</p>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaRobot className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-purple-600 leading-relaxed">{mainAIMethods}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">主要医学专科</p>
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaStethoscope className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-orange-600 leading-relaxed">{mainMedicalFields}</p>
                </div>
              </div>
            </div>

            {/* 论文列表区域 - 核心功能 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">论文列表</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      共 {totalPapers.toLocaleString()} 篇论文
                      {/* 这里可以添加当前筛选条件的显示 */}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      实时更新
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <DashboardTable />
              </div>
            </div>

            {/* 数据洞察可折叠区域 */}
            {isInsightsPanelOpen && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">研究趋势与分布</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsInsightsPanelOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      收起
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <InsightsPanel />
                </div>
              </div>
            )}

            {/* 数据洞察快速展开按钮 */}
            {!isInsightsPanelOpen && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setIsInsightsPanelOpen(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <FaChartBar className="w-4 h-4" />
                  查看研究趋势与分布
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
