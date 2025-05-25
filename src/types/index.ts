export interface Paper {
  pmid: string;
  doi: string;
  title: string;
  abstract: string;
  keywords: string;
  article_date: string;
  date: string;
  year: number;
  article_type: string;
  lang: string;
  journal: string;
  journal_short: string;
  journal_country: string;
  authors: string;
  author_affils: string;
  algo_neural_net: boolean;
  algo_support_vector: boolean;
  algo_decision_tree: boolean;
  algo_random_forest: boolean;
  algo_naive_bayes: boolean;
  algo_knn: boolean;
  algo_clustering: boolean;
  algo_deep_learning: boolean;
  algo_transfer_learning: boolean;
  algo_reinforcement_learning: boolean;
  algo_other: boolean;
  feat_xr: boolean;
  feat_ct: boolean;
  feat_mri: boolean;
  feat_ultrasound: boolean;
  feat_pet: boolean;
  feat_other: boolean;
  spec_onc: boolean;
  spec_cvs: boolean;
  spec_neuro: boolean;
  spec_paeds: boolean;
  spec_id: boolean;
  spec_other: boolean;
  subspec_lungca: boolean;
  subspec_icu: boolean;
  subspec_ed: boolean;
  subspec_other: boolean;
  affil_countries: string;
  affil_countries_unique: string[];
  affil_first_country: string;
  affil_last_country: string;
  countries_lc: string[];
}

export interface FilterState {
  selectedYear: number | null;
  selectedCountries: string[];
  selectedAlgorithms: string[];
  selectedFeatures: string[];
  selectedSpecialties: string[];
  selectedSubSpecialties: string[];
}

export interface DashboardStats {
  totalPapers: number;
  totalCountries: number;
  topAlgorithms: { name: string; count: number }[];
  topSpecialties: { name: string; count: number }[];
  yearlyTrend: { year: number; count: number }[];
  countryDistribution: { country: string; count: number }[];
} 