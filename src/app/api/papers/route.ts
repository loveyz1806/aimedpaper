import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { Paper } from "@/types";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    // Read the Excel file from the public directory
    const filePath = path.join(process.cwd(), "public", "test1.xlsx");
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      return NextResponse.json(
        { error: "Excel file not found" },
        { status: 404 }
      );
    }

    // Check file permissions
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
    } catch {
      console.error(`File not readable at path: ${filePath}`);
      return NextResponse.json(
        { error: "Excel file not readable" },
        { status: 403 }
      );
    }

    console.log(`Reading Excel file from: ${filePath}`);
    // Read file content first
    const fileContent = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileContent, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Transform the data to match our Paper type
    const papers: Paper[] = data.map((row) => {
      const typedRow = row as Record<string, unknown>;
      return {
        pmid: typedRow.pmid?.toString() || "",
        doi: typedRow.doi?.toString() || "",
        title: typedRow.title?.toString() || "",
        abstract: typedRow.abstract?.toString() || "",
        keywords: typedRow.keywords?.toString() || "",
        article_date: typedRow.article_date?.toString() || "",
        date: typedRow.date?.toString() || "",
        year: parseInt(typedRow.year?.toString() || "0"),
        article_type: typedRow.article_type?.toString() || "",
        lang: typedRow.lang?.toString() || "",
        journal: typedRow.journal?.toString() || "",
        journal_short: typedRow.journal_short?.toString() || "",
        journal_country: typedRow.journal_country?.toString() || "",
        authors: typedRow.authors?.toString() || "",
        author_affils: typedRow.author_affils?.toString() || "",
        algo_neural_net: Boolean(typedRow.algo_neural_net),
        algo_support_vector: Boolean(typedRow.algo_support_vector),
        algo_decision_tree: Boolean(typedRow.algo_decision_tree),
        algo_random_forest: Boolean(typedRow.algo_random_forest),
        algo_naive_bayes: Boolean(typedRow.algo_naive_bayes),
        algo_knn: Boolean(typedRow.algo_knn),
        algo_clustering: Boolean(typedRow.algo_clustering),
        algo_deep_learning: Boolean(typedRow.algo_deep_learning),
        algo_transfer_learning: Boolean(typedRow.algo_transfer_learning),
        algo_reinforcement_learning: Boolean(typedRow.algo_reinforcement_learning),
        algo_other: Boolean(typedRow.algo_other),
        feat_xr: Boolean(typedRow.feat_xr),
        feat_ct: Boolean(typedRow.feat_ct),
        feat_mri: Boolean(typedRow.feat_mri),
        feat_ultrasound: Boolean(typedRow.feat_ultrasound),
        feat_pet: Boolean(typedRow.feat_pet),
        feat_other: Boolean(typedRow.feat_other),
        spec_onc: Boolean(typedRow.spec_onc),
        spec_cvs: Boolean(typedRow.spec_cvs),
        spec_neuro: Boolean(typedRow.spec_neuro),
        spec_paeds: Boolean(typedRow.spec_paeds),
        spec_id: Boolean(typedRow.spec_id),
        spec_other: Boolean(typedRow.spec_other),
        subspec_lungca: Boolean(typedRow.subspec_lungca),
        subspec_icu: Boolean(typedRow.subspec_icu),
        subspec_ed: Boolean(typedRow.subspec_ed),
        subspec_other: Boolean(typedRow.subspec_other),
        affil_countries: typedRow.affil_countries?.toString() || "",
        affil_countries_unique: (typedRow.affil_countries_unique?.toString() || "")
          .split(",")
          .map((country: string) => {
            // 移除所有引号、括号等特殊字符
            return country.trim()
              .replace(/^['"`\[\(]+/g, '')  // 移除开头的引号、反引号、括号
              .replace(/['"`\]\)]+$/g, '')  // 移除结尾的引号、反引号、括号
              .trim();  // 再次去除空白
          })
          .filter(Boolean),
        affil_first_country: typedRow.affil_first_country?.toString() || "",
        affil_last_country: typedRow.affil_last_country?.toString() || "",
        countries_lc: (typedRow.countries_lc?.toString() || "")
          .split(",")
          .map((country: string) => {
            // 移除所有引号、括号等特殊字符
            return country.trim()
              .replace(/^['"`\[\(]+/g, '')  // 移除开头的引号、反引号、括号
              .replace(/['"`\]\)]+$/g, '')  // 移除结尾的引号、反引号、括号
              .trim();  // 再次去除空白
          })
          .filter(Boolean),
      };
    });

    console.log(`Successfully processed ${papers.length} papers`);
    return NextResponse.json(papers);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return NextResponse.json(
      { error: "Failed to read Excel file", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 