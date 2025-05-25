import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Paper, FilterState } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterPapers(papers: Paper[], filters: FilterState): Paper[] {
  return papers.filter((paper) => {
    // Year range filter
    if (paper.year < filters.yearRange[0] || paper.year > filters.yearRange[1]) {
      return false;
    }

    // Country filter
    if (
      filters.selectedCountries.length > 0 &&
      !paper.affil_countries_unique.some((country) =>
        filters.selectedCountries.includes(country)
      )
    ) {
      return false;
    }

    // Algorithm filter
    if (
      filters.selectedAlgorithms.length > 0 &&
      !filters.selectedAlgorithms.some((algo) => paper[`algo_${algo}` as keyof Paper])
    ) {
      return false;
    }

    // Feature filter
    if (
      filters.selectedFeatures.length > 0 &&
      !filters.selectedFeatures.some((feat) => paper[`feat_${feat}` as keyof Paper])
    ) {
      return false;
    }

    // Specialty filter
    if (
      filters.selectedSpecialties.length > 0 &&
      !filters.selectedSpecialties.some((spec) => paper[`spec_${spec}` as keyof Paper])
    ) {
      return false;
    }

    // Subspecialty filter
    if (
      filters.selectedSubSpecialties.length > 0 &&
      !filters.selectedSubSpecialties.some(
        (subspec) => paper[`subspec_${subspec}` as keyof Paper]
      )
    ) {
      return false;
    }

    return true;
  });
}

export function calculateStats(papers: Paper[]) {
  const stats = {
    totalPapers: papers.length,
    totalCountries: new Set(papers.flatMap((p) => p.affil_countries_unique)).size,
    topAlgorithms: [] as { name: string; count: number }[],
    topSpecialties: [] as { name: string; count: number }[],
    yearlyTrend: [] as { year: number; count: number }[],
    countryDistribution: [] as { country: string; count: number }[],
  };

  // Calculate algorithm distribution
  const algoCounts = new Map<string, number>();
  papers.forEach((paper) => {
    Object.keys(paper)
      .filter((key) => key.startsWith("algo_"))
      .forEach((key) => {
        if (paper[key as keyof Paper]) {
          const algoName = key.replace("algo_", "");
          algoCounts.set(algoName, (algoCounts.get(algoName) || 0) + 1);
        }
      });
  });
  stats.topAlgorithms = Array.from(algoCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate specialty distribution
  const specCounts = new Map<string, number>();
  papers.forEach((paper) => {
    Object.keys(paper)
      .filter((key) => key.startsWith("spec_"))
      .forEach((key) => {
        if (paper[key as keyof Paper]) {
          const specName = key.replace("spec_", "");
          specCounts.set(specName, (specCounts.get(specName) || 0) + 1);
        }
      });
  });
  stats.topSpecialties = Array.from(specCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate yearly trend
  const yearCounts = new Map<number, number>();
  papers.forEach((paper) => {
    yearCounts.set(paper.year, (yearCounts.get(paper.year) || 0) + 1);
  });
  stats.yearlyTrend = Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  // Calculate country distribution
  const countryCounts = new Map<string, number>();
  papers.forEach((paper) => {
    paper.affil_countries_unique.forEach((country) => {
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    });
  });
  stats.countryDistribution = Array.from(countryCounts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  return stats;
} 