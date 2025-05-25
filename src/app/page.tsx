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
  FaTimes,
  FaBrain,
  FaHeartbeat,
  FaMicroscope,
  FaSearch,
  FaDna,
  FaVirus,
  FaPills,
  FaUserMd,
  FaHospital,
  FaAmbulance,
  FaSyringe,
  FaXRay
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [papers, setPapers] = useAtom(papersAtom);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

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
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl relative overflow-hidden">
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* 医学背景装饰元素 */}
        <div className="absolute inset-0 opacity-8">
          {/* DNA螺旋 - 增加更多 */}
          <FaDna className="absolute top-4 left-8 w-8 h-8 text-cyan-400 animate-spin" style={{animationDuration: '20s'}} />
          <FaDna className="absolute bottom-6 right-12 w-6 h-6 text-blue-400 animate-spin" style={{animationDuration: '25s', animationDirection: 'reverse'}} />
          <FaDna className="absolute top-32 left-96 w-5 h-5 text-purple-400 animate-spin" style={{animationDuration: '30s'}} />
          <FaDna className="absolute bottom-20 right-80 w-7 h-7 text-teal-400 animate-spin" style={{animationDuration: '18s', animationDirection: 'reverse'}} />
          
          {/* 病毒分子 - 增加更多 */}
          <FaVirus className="absolute top-12 right-20 w-5 h-5 text-purple-400 animate-pulse" />
          <FaVirus className="absolute bottom-8 left-16 w-7 h-7 text-indigo-400 animate-bounce" style={{animationDelay: '2s'}} />
          <FaVirus className="absolute top-28 left-72 w-4 h-4 text-red-400 animate-pulse" style={{animationDelay: '3s'}} />
          <FaVirus className="absolute bottom-32 right-96 w-6 h-6 text-pink-400 animate-bounce" style={{animationDelay: '1s'}} />
          <FaVirus className="absolute top-40 right-64 w-3 h-3 text-orange-400 animate-pulse" style={{animationDelay: '4s'}} />
          
          {/* 药物相关 - 大幅增加 */}
          <FaPills className="absolute top-20 left-32 w-4 h-4 text-emerald-400 animate-pulse" style={{animationDelay: '1s'}} />
          <FaPills className="absolute bottom-12 right-32 w-6 h-6 text-teal-400 animate-bounce" style={{animationDelay: '3s'}} />
          <FaPills className="absolute top-36 left-48 w-5 h-5 text-green-400 animate-pulse" style={{animationDelay: '2s'}} />
          <FaPills className="absolute bottom-28 right-48 w-4 h-4 text-lime-400 animate-bounce" style={{animationDelay: '4s'}} />
          <FaPills className="absolute top-44 left-80 w-3 h-3 text-cyan-300 animate-pulse" style={{animationDelay: '5s'}} />
          <FaPills className="absolute bottom-36 right-72 w-5 h-5 text-blue-300 animate-bounce" style={{animationDelay: '1.5s'}} />
          <FaStethoscope className="absolute top-52 left-24 w-4 h-4 text-purple-300 animate-pulse" style={{animationDelay: '3.5s'}} />
          <FaStethoscope className="absolute bottom-44 right-24 w-6 h-6 text-indigo-300 animate-bounce" style={{animationDelay: '2.5s'}} />
          
          {/* 医疗设备和工具 */}
          <FaStethoscope className="absolute top-8 left-56 w-5 h-5 text-red-400 animate-pulse" style={{animationDelay: '6s'}} />
          <FaStethoscope className="absolute bottom-16 right-56 w-4 h-4 text-pink-400 animate-bounce" style={{animationDelay: '2s'}} />
          <FaSyringe className="absolute top-16 left-60 w-4 h-4 text-purple-300 animate-bounce" style={{animationDelay: '1.5s'}} />
          <FaSyringe className="absolute bottom-24 right-40 w-5 h-5 text-violet-300 animate-pulse" style={{animationDelay: '4.5s'}} />
          <FaHeartbeat className="absolute top-24 left-88 w-3 h-3 text-orange-400 animate-pulse" style={{animationDelay: '7s'}} />
          <FaHeartbeat className="absolute bottom-40 right-88 w-4 h-4 text-yellow-400 animate-bounce" style={{animationDelay: '3s'}} />
          <FaUserMd className="absolute top-48 left-40 w-4 h-4 text-pink-300 animate-pulse" style={{animationDelay: '8s'}} />
          <FaUserMd className="absolute bottom-52 right-16 w-3 h-3 text-rose-300 animate-bounce" style={{animationDelay: '1s'}} />
          
          {/* 医学影像和检测 */}
          <FaXRay className="absolute bottom-16 right-60 w-5 h-5 text-indigo-300 animate-pulse" style={{animationDelay: '3.5s'}} />
          <FaXRay className="absolute top-56 left-64 w-4 h-4 text-slate-300 animate-bounce" style={{animationDelay: '6s'}} />
          <FaMicroscope className="absolute top-60 left-16 w-6 h-6 text-cyan-300 animate-pulse" style={{animationDelay: '9s'}} />
          <FaMicroscope className="absolute bottom-60 right-32 w-5 h-5 text-blue-300 animate-bounce" style={{animationDelay: '4s'}} />
          <FaBrain className="absolute top-64 left-32 w-4 h-4 text-green-300 animate-pulse" style={{animationDelay: '10s'}} />
          <FaBrain className="absolute bottom-64 right-48 w-3 h-3 text-emerald-300 animate-bounce" style={{animationDelay: '5s'}} />
          
          {/* 人体器官和解剖 */}
          <FaHeartbeat className="absolute top-68 left-48 w-5 h-5 text-red-300 animate-pulse" style={{animationDelay: '11s'}} />
          <FaHeartbeat className="absolute bottom-68 right-64 w-4 h-4 text-pink-300 animate-bounce" style={{animationDelay: '6s'}} />
          <FaBrain className="absolute top-72 left-64 w-6 h-6 text-purple-300 animate-pulse" style={{animationDelay: '12s'}} />
          <FaBrain className="absolute bottom-72 right-80 w-5 h-5 text-violet-300 animate-bounce" style={{animationDelay: '7s'}} />
          <FaStethoscope className="absolute top-76 left-80 w-4 h-4 text-cyan-300 animate-pulse" style={{animationDelay: '13s'}} />
          <FaStethoscope className="absolute bottom-76 right-96 w-3 h-3 text-teal-300 animate-bounce" style={{animationDelay: '8s'}} />
          <FaRobot className="absolute top-80 left-96 w-5 h-5 text-gray-300 animate-pulse" style={{animationDelay: '14s'}} />
          <FaRobot className="absolute bottom-80 right-112 w-4 h-4 text-slate-300 animate-bounce" style={{animationDelay: '9s'}} />
          <FaMicroscope className="absolute top-84 left-112 w-3 h-3 text-white animate-pulse" style={{animationDelay: '15s'}} />
          <FaMicroscope className="absolute bottom-84 right-128 w-4 h-4 text-gray-200 animate-bounce" style={{animationDelay: '10s'}} />
          
          {/* 医疗机构和人员 */}
          <FaUserMd className="absolute top-8 right-40 w-6 h-6 text-blue-300 animate-pulse" style={{animationDelay: '4s'}} />
          <FaUserMd className="absolute bottom-88 right-144 w-5 h-5 text-indigo-300 animate-bounce" style={{animationDelay: '11s'}} />
          <FaHospital className="absolute bottom-4 left-40 w-5 h-5 text-cyan-300 animate-pulse" style={{animationDelay: '2.5s'}} />
          <FaHospital className="absolute top-88 left-128 w-4 h-4 text-blue-300 animate-bounce" style={{animationDelay: '12s'}} />
          <FaAmbulance className="absolute top-6 right-80 w-4 h-4 text-emerald-300 animate-pulse" style={{animationDelay: '5s'}} />
          <FaAmbulance className="absolute bottom-92 right-160 w-3 h-3 text-green-300 animate-bounce" style={{animationDelay: '13s'}} />
          <FaHospital className="absolute top-92 left-144 w-4 h-4 text-orange-300 animate-pulse" style={{animationDelay: '16s'}} />
          <FaUserMd className="absolute bottom-96 right-176 w-5 h-5 text-red-300 animate-bounce" style={{animationDelay: '14s'}} />
          
          {/* 科学研究相关 */}
          <FaMicroscope className="absolute top-96 left-160 w-4 h-4 text-green-300 animate-pulse" style={{animationDelay: '17s'}} />
          <FaMicroscope className="absolute bottom-100 right-192 w-3 h-3 text-lime-300 animate-bounce" style={{animationDelay: '15s'}} />
          <FaRobot className="absolute top-100 left-176 w-5 h-5 text-blue-300 animate-spin" style={{animationDuration: '15s'}} />
          <FaRobot className="absolute bottom-104 right-208 w-4 h-4 text-cyan-300 animate-spin" style={{animationDuration: '22s', animationDirection: 'reverse'}} />
          <FaBrain className="absolute top-104 left-192 w-3 h-3 text-yellow-300 animate-pulse" style={{animationDelay: '18s'}} />
          <FaBrain className="absolute bottom-108 right-224 w-4 h-4 text-orange-300 animate-bounce" style={{animationDelay: '16s'}} />
          
          {/* 疾病和过敏相关 */}
          <FaVirus className="absolute top-108 left-208 w-4 h-4 text-red-300 animate-pulse" style={{animationDelay: '19s'}} />
          <FaVirus className="absolute bottom-112 right-240 w-3 h-3 text-pink-300 animate-bounce" style={{animationDelay: '17s'}} />
          <FaStethoscope className="absolute top-112 left-224 w-5 h-5 text-purple-300 animate-pulse" style={{animationDelay: '20s'}} />
          
          {/* 更多装饰圆点和几何元素 */}
          <div className="absolute top-10 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 right-24 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-24 right-16 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-24 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-40 left-104 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '6s'}}></div>
          <div className="absolute bottom-48 right-104 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '8s'}}></div>
          <div className="absolute top-56 left-120 w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '10s'}}></div>
          <div className="absolute bottom-56 right-120 w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '12s'}}></div>
          <div className="absolute top-72 left-136 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '14s'}}></div>
          <div className="absolute bottom-72 right-136 w-3 h-3 bg-violet-400 rounded-full animate-ping" style={{animationDelay: '16s'}}></div>
          <div className="absolute top-88 left-152 w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '18s'}}></div>
          <div className="absolute bottom-88 right-152 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '20s'}}></div>
          
          {/* 连接线条效果 */}
          <div className="absolute top-16 left-44 w-8 h-0.5 bg-gradient-to-r from-cyan-400/30 to-transparent rotate-45 animate-pulse" style={{animationDelay: '5s'}}></div>
          <div className="absolute bottom-32 right-44 w-12 h-0.5 bg-gradient-to-l from-purple-400/30 to-transparent -rotate-45 animate-pulse" style={{animationDelay: '7s'}}></div>
          <div className="absolute top-64 left-68 w-6 h-0.5 bg-gradient-to-r from-blue-400/30 to-transparent rotate-12 animate-pulse" style={{animationDelay: '9s'}}></div>
          <div className="absolute bottom-64 right-68 w-10 h-0.5 bg-gradient-to-l from-green-400/30 to-transparent -rotate-12 animate-pulse" style={{animationDelay: '11s'}}></div>
          <div className="absolute top-96 left-84 w-4 h-0.5 bg-gradient-to-r from-pink-400/30 to-transparent rotate-30 animate-pulse" style={{animationDelay: '13s'}}></div>
          <div className="absolute bottom-96 right-84 w-8 h-0.5 bg-gradient-to-l from-yellow-400/30 to-transparent -rotate-30 animate-pulse" style={{animationDelay: '15s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="flex items-center gap-2 text-blue-400">
                <FaBrain className="w-8 h-8 animate-pulse" />
                <FaRobot className="w-7 h-7" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-wider drop-shadow-2xl transform hover:scale-105 transition-all duration-300 relative z-20 font-mono uppercase">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent relative">
                  aimed
                  <span className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></span>
                </span>
                <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent relative ml-2">
                  paper
                  <span className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                </span>
              </h1>
              <div className="flex items-center gap-2 text-emerald-400">
                <FaHeartbeat className="w-7 h-7 animate-pulse" />
                <FaMicroscope className="w-7 h-7" />
              </div>
            </div>
                         <div className="flex items-center justify-center gap-2 text-slate-300">
               <FaSearch className="w-4 h-4" />
               <p className="text-lg font-medium font-mono tracking-wide">
                 AI Medical Research Papers Dashboard
               </p>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
          
          {/* 全局搜索框 */}
          <div className="mt-6 max-w-2xl mx-auto">
            <GlobalSearch />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 左侧面板：筛选条件 + 研究趋势 */}
        {isFilterPanelOpen && (
          <aside className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 h-[calc(100vh-180px)] sticky top-[180px] overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* 筛选条件区域 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
                      <FaFilter className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      筛选条件
                    </h3>
                  </div>
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

              {/* 研究趋势与分布区域 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md">
                    <FaChartBar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    研究趋势与分布
                  </h3>
                </div>
                <div className="space-y-4">
                  <InsightsPanel />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* 主内容区域：论文列表 */}
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
              <div className="p-6">
                <DashboardTable />
              </div>
            </div>

            {/* 左侧面板快速展开按钮 */}
            {!isFilterPanelOpen && (
              <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
                <Button
                  variant="default"
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="flex items-center gap-2 shadow-lg"
                >
                  <FaFilter className="w-4 h-4" />
                  筛选与趋势
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
