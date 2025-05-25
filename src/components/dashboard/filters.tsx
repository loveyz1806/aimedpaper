"use client";

import { useAtom } from "jotai";
import { filterStateAtom, papersAtom } from "@/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DashboardFilters() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [papers] = useAtom(papersAtom);

  // 统计每个国家的文章数量并按数量排序
  const countryStats = papers.reduce((acc, paper) => {
    paper.affil_countries_unique.forEach(country => {
      acc[country] = (acc[country] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const countries = Object.entries(countryStats)
    .sort((a, b) => b[1] - a[1]) // 按文章数量降序排序
    .map(([country, count]) => ({ name: country, count }));

  // 调试信息：打印前5个国家
  if (countries.length > 0) {
    console.log("Top 5 countries by paper count:", countries.slice(0, 5));
  }

  // AI算法映射表
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

  // 统计每个AI算法的文章数量并按数量排序
  const algorithmStats = papers.reduce((acc, paper) => {
    Object.keys(algorithmMapping).forEach(algo => {
      if (paper[`algo_${algo}` as keyof typeof paper]) {
        const chineseName = algorithmMapping[algo as keyof typeof algorithmMapping];
        acc[algo] = {
          name: chineseName,
          count: (acc[algo]?.count || 0) + 1,
          key: algo
        };
      }
    });
    return acc;
  }, {} as Record<string, { name: string; count: number; key: string }>);

  const algorithms = Object.values(algorithmStats)
    .sort((a, b) => b.count - a.count); // 按文章数量降序排序

  // 医学影像/数据特征映射表
  const featureMapping = {
    "xr": "X光",
    "ct": "CT扫描",
    "mri": "核磁共振",
    "ultrasound": "超声波",
    "pet": "PET扫描",
    "other": "其他"
  };

  // 统计每个医学影像特征的文章数量并按数量排序
  const featureStats = papers.reduce((acc, paper) => {
    Object.keys(featureMapping).forEach(feat => {
      if (paper[`feat_${feat}` as keyof typeof paper]) {
        const chineseName = featureMapping[feat as keyof typeof featureMapping];
        acc[feat] = {
          name: chineseName,
          count: (acc[feat]?.count || 0) + 1,
          key: feat
        };
      }
    });
    return acc;
  }, {} as Record<string, { name: string; count: number; key: string }>);

  const features = Object.values(featureStats)
    .sort((a, b) => b.count - a.count); // 按文章数量降序排序

  // 医学专科映射表
  const specialtyMapping = {
    "onc": "肿瘤科",
    "cvs": "心血管科", 
    "neuro": "神经科",
    "paeds": "儿科",
    "id": "感染科",
    "other": "其他"
  };

  // 统计每个医学专科的文章数量并按数量排序
  const specialtyStats = papers.reduce((acc, paper) => {
    Object.keys(specialtyMapping).forEach(spec => {
      if (paper[`spec_${spec}` as keyof typeof paper]) {
        const chineseName = specialtyMapping[spec as keyof typeof specialtyMapping];
        acc[spec] = {
          name: chineseName,
          count: (acc[spec]?.count || 0) + 1,
          key: spec
        };
      }
    });
    return acc;
  }, {} as Record<string, { name: string; count: number; key: string }>);

  const specialties = Object.values(specialtyStats)
    .sort((a, b) => b.count - a.count); // 按文章数量降序排序

  // 医学亚专科映射表
  const subSpecialtyMapping = {
    "lungca": "肺癌",
    "icu": "重症监护",
    "ed": "急诊科",
    "other": "其他"
  };

  // 统计每个医学亚专科的文章数量并按数量排序
  const subSpecialtyStats = papers.reduce((acc, paper) => {
    Object.keys(subSpecialtyMapping).forEach(subspec => {
      if (paper[`subspec_${subspec}` as keyof typeof paper]) {
        const chineseName = subSpecialtyMapping[subspec as keyof typeof subSpecialtyMapping];
        acc[subspec] = {
          name: chineseName,
          count: (acc[subspec]?.count || 0) + 1,
          key: subspec
        };
      }
    });
    return acc;
  }, {} as Record<string, { name: string; count: number; key: string }>);

  const subSpecialties = Object.values(subSpecialtyStats)
    .sort((a, b) => b.count - a.count); // 按文章数量降序排序

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">国家/地区</label>
        <Select
          value={filterState.selectedCountries.join(",")}
          onValueChange={(value) =>
            setFilterState({
              ...filterState,
              selectedCountries: value ? value.split(",") : [],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="选择国家/地区" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {countries.map((country, index) => (
              <SelectItem 
                key={`country-${index}-${country.name}`} 
                value={country.name}
                className="cursor-pointer"
              >
                {country.name} ({country.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">AI算法</label>
        <Select
          value={filterState.selectedAlgorithms.join(",")}
          onValueChange={(value) =>
            setFilterState({
              ...filterState,
              selectedAlgorithms: value ? value.split(",") : [],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="选择AI算法" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {algorithms.map((algo, index) => (
              <SelectItem 
                key={`algo-${index}-${algo.key}`} 
                value={algo.key}
                className="cursor-pointer"
              >
                {algo.name} ({algo.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">医学影像/数据特征</label>
        <Select
          value={filterState.selectedFeatures.join(",")}
          onValueChange={(value) =>
            setFilterState({
              ...filterState,
              selectedFeatures: value ? value.split(",") : [],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="选择特征" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {features.map((feat, index) => (
              <SelectItem 
                key={`feat-${index}-${feat.key}`} 
                value={feat.key}
                className="cursor-pointer"
              >
                {feat.name} ({feat.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">医学专科</label>
        <Select
          value={filterState.selectedSpecialties.join(",")}
          onValueChange={(value) =>
            setFilterState({
              ...filterState,
              selectedSpecialties: value ? value.split(",") : [],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="选择专科" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {specialties.map((spec, index) => (
              <SelectItem 
                key={`spec-${index}-${spec.key}`} 
                value={spec.key}
                className="cursor-pointer"
              >
                {spec.name} ({spec.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">医学亚专科</label>
        <Select
          value={filterState.selectedSubSpecialties.join(",")}
          onValueChange={(value) =>
            setFilterState({
              ...filterState,
              selectedSubSpecialties: value ? value.split(",") : [],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="选择亚专科" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {subSpecialties.map((subspec, index) => (
              <SelectItem 
                key={`subspec-${index}-${subspec.key}`} 
                value={subspec.key}
                className="cursor-pointer"
              >
                {subspec.name} ({subspec.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 