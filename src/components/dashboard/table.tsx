"use client";

import { useAtom } from "jotai";
import { filteredPapersAtom } from "@/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaExternalLinkAlt, FaRobot, FaStethoscope } from "react-icons/fa";

export function DashboardTable() {
  const [papers] = useAtom(filteredPapersAtom);
  const [selectedPaper, setSelectedPaper] = useState<typeof papers[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 分页逻辑
  const totalPages = Math.ceil(papers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = papers.slice(startIndex, endIndex);

  // 获取论文的AI算法标签
  const getAlgorithmTags = (paper: typeof papers[0]) => {
    const algorithms = [];
    if (paper.algo_neural_net) algorithms.push("神经网络");
    if (paper.algo_deep_learning) algorithms.push("深度学习");
    if (paper.algo_support_vector) algorithms.push("支持向量机");
    if (paper.algo_random_forest) algorithms.push("随机森林");
    if (paper.algo_decision_tree) algorithms.push("决策树");
    return algorithms.slice(0, 2); // 只显示前2个
  };

  // 获取论文的医学专科标签
  const getSpecialtyTags = (paper: typeof papers[0]) => {
    const specialties = [];
    if (paper.spec_onc) specialties.push("肿瘤科");
    if (paper.spec_cvs) specialties.push("心血管科");
    if (paper.spec_neuro) specialties.push("神经科");
    if (paper.spec_paeds) specialties.push("儿科");
    if (paper.spec_id) specialties.push("感染科");
    return specialties.slice(0, 2); // 只显示前2个
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">标题</TableHead>
            <TableHead className="w-[8%]">年份</TableHead>
            <TableHead className="w-[15%]">期刊</TableHead>
            <TableHead className="w-[12%]">第一作者国家</TableHead>
            <TableHead className="w-[25%]">研究标签</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPapers.map((paper, index) => (
            <TableRow
              key={`${paper.pmid}-${index}`}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedPaper(paper)}
            >
              <TableCell className="font-medium">
                <div className="line-clamp-2 text-sm leading-relaxed">
                  {paper.title}
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">{paper.year}</TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">{paper.journal_short}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {paper.affil_first_country}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {getAlgorithmTags(paper).map((algo, i) => (
                    <Badge key={i} variant="secondary" className="text-xs flex items-center gap-1">
                      <FaRobot className="w-3 h-3" />
                      {algo}
                    </Badge>
                  ))}
                  {getSpecialtyTags(paper).map((spec, i) => (
                    <Badge key={i} variant="outline" className="text-xs flex items-center gap-1">
                      <FaStethoscope className="w-3 h-3" />
                      {spec}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            显示第 {startIndex + 1}-{Math.min(endIndex, papers.length)} 条，共 {papers.length} 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className="text-sm text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg leading-relaxed pr-8">
              {selectedPaper?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">发表年份:</span>
                <span className="ml-2 text-sm">{selectedPaper?.year}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">期刊:</span>
                <span className="ml-2 text-sm">{selectedPaper?.journal_short}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">第一作者国家:</span>
                <span className="ml-2 text-sm">{selectedPaper?.affil_first_country}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">文章类型:</span>
                <span className="ml-2 text-sm">{selectedPaper?.article_type}</span>
              </div>
            </div>

            {/* AI算法和医学专科标签 */}
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FaRobot className="w-4 h-4 text-purple-600" />
                  AI算法标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPaper && getAlgorithmTags(selectedPaper).map((algo, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {algo}
                    </Badge>
                  ))}
                  {selectedPaper && getAlgorithmTags(selectedPaper).length === 0 && (
                    <span className="text-sm text-gray-500">暂无标签</span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <FaStethoscope className="w-4 h-4 text-orange-600" />
                  医学专科标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPaper && getSpecialtyTags(selectedPaper).map((spec, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {selectedPaper && getSpecialtyTags(selectedPaper).length === 0 && (
                    <span className="text-sm text-gray-500">暂无标签</span>
                  )}
                </div>
              </div>
            </div>

            {/* 摘要 */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">摘要</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedPaper?.abstract || "暂无摘要"}
                </p>
              </div>
            </div>

            {/* 关键词 */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">关键词</h3>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  {selectedPaper?.keywords || "暂无关键词"}
                </p>
              </div>
            </div>

            {/* 作者信息 */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">作者信息</h3>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700">
                  {selectedPaper?.authors || "暂无作者信息"}
                </p>
              </div>
            </div>

            {/* 机构信息 */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">机构信息</h3>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-700">
                  {selectedPaper?.author_affils || "暂无机构信息"}
                </p>
              </div>
            </div>

            {/* 外部链接 */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${selectedPaper?.pmid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                  PubMed
                </a>
              </Button>
              {selectedPaper?.doi && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <a
                    href={`https://doi.org/${selectedPaper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt className="w-3 h-3" />
                    DOI
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 