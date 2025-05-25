import { atom } from "jotai";
import { Paper, FilterState } from "@/types";

export const papersAtom = atom<Paper[]>([]);

export const searchQueryAtom = atom<string>("");

export const filterStateAtom = atom<FilterState>({
  selectedYear: null,
  selectedCountries: [],
  selectedAlgorithms: [],
  selectedFeatures: [],
  selectedSpecialties: [],
  selectedSubSpecialties: [],
});

export const filteredPapersAtom = atom((get) => {
  const papers = get(papersAtom);
  const filterState = get(filterStateAtom);
  const searchQuery = get(searchQueryAtom);
  
  return papers.filter((paper) => {
    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        paper.title?.toLowerCase().includes(query) ||
        paper.abstract?.toLowerCase().includes(query) ||
        paper.keywords?.toLowerCase().includes(query) ||
        paper.authors?.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // 年份过滤
    if (filterState.selectedYear !== null) {
      if (paper.year !== filterState.selectedYear) {
        return false;
      }
    }
    
    // 国家过滤
    if (filterState.selectedCountries.length > 0) {
      const hasMatchingCountry = filterState.selectedCountries.some(country =>
        paper.affil_countries_unique.includes(country)
      );
      if (!hasMatchingCountry) return false;
    }
    
    // AI算法过滤
    if (filterState.selectedAlgorithms.length > 0) {
      const hasMatchingAlgorithm = filterState.selectedAlgorithms.some(algo =>
        paper[`algo_${algo}` as keyof Paper]
      );
      if (!hasMatchingAlgorithm) return false;
    }
    
    // 医学影像/数据特征过滤
    if (filterState.selectedFeatures.length > 0) {
      const hasMatchingFeature = filterState.selectedFeatures.some(feat =>
        paper[`feat_${feat}` as keyof Paper]
      );
      if (!hasMatchingFeature) return false;
    }
    
    // 医学专科过滤
    if (filterState.selectedSpecialties.length > 0) {
      const hasMatchingSpecialty = filterState.selectedSpecialties.some(spec =>
        paper[`spec_${spec}` as keyof Paper]
      );
      if (!hasMatchingSpecialty) return false;
    }
    
    // 医学亚专科过滤
    if (filterState.selectedSubSpecialties.length > 0) {
      const hasMatchingSubSpecialty = filterState.selectedSubSpecialties.some(subspec =>
        paper[`subspec_${subspec}` as keyof Paper]
      );
      if (!hasMatchingSubSpecialty) return false;
    }
    
    return true;
  });
});

export const statsAtom = atom((get) => {
  const papers = get(filteredPapersAtom);
  return {
    totalPapers: papers.length,
    totalCountries: new Set(papers.flatMap((p) => p.affil_countries_unique)).size,
    topAlgorithms: papers
      .flatMap((p) =>
        Object.entries(p)
          .filter(([key, value]) => key.startsWith("algo_") && value)
          .map(([key]) => key.replace("algo_", ""))
      )
      .reduce((acc, algo) => {
        acc[algo] = (acc[algo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    topSpecialties: papers
      .flatMap((p) =>
        Object.entries(p)
          .filter(([key, value]) => key.startsWith("spec_") && value)
          .map(([key]) => key.replace("spec_", ""))
      )
      .reduce((acc, spec) => {
        acc[spec] = (acc[spec] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    yearlyTrend: papers.reduce((acc, paper) => {
      acc[paper.year] = (acc[paper.year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
    countryDistribution: papers
      .flatMap((p) => p.affil_countries_unique)
      .reduce((acc, country) => {
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
  };
}); 