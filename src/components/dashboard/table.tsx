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
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showAllAffils, setShowAllAffils] = useState(false);
  const itemsPerPage = 20;

  // 按年份降序排序（最新年份在前）
  const sortedPapers = [...papers].sort((a, b) => b.year - a.year);

  // 分页逻辑
  const totalPages = Math.ceil(sortedPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = sortedPapers.slice(startIndex, endIndex);

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

  // 智能分割文本的函数
  const smartSplit = (text: string, type: 'keywords' | 'authors' | 'affils') => {
    if (!text) return [];
    
    let splitPattern;
    switch (type) {
      case 'keywords':
        // 关键词通常用逗号、分号分隔
        splitPattern = /[,;，；\n\r]+/;
        break;
      case 'authors':
        // 作者通常用逗号分隔，有时用 "and" 连接
        splitPattern = /[,;，；\n\r]|\s+and\s+/i;
        break;
      case 'affils':
        // 机构信息需要特殊处理
        return smartSplitAffiliations(text);
      default:
        splitPattern = /[,;，；\n\r]+/;
    }
    
    return text
      .split(splitPattern)
      .map(item => item.trim())
      .filter(item => item.length > 0 && item !== '.' && item !== ',');
  };

  // 智能分割机构信息的专用函数
  const smartSplitAffiliations = (text: string) => {
    if (!text) return [];
    
    // 需要过滤的行政区划和通用地名
    const administrativeRegions = new Set([
      // 中国主要城市和省份
      '北京', '上海', '天津', '重庆', '广州', '深圳', '杭州', '南京', '武汉', '成都', 
      '西安', '沈阳', '大连', '青岛', '厦门', '苏州', '无锡', '宁波', '温州', '佛山',
      '东莞', '中山', '珠海', '惠州', '江门', '湛江', '茂名', '肇庆', '梅州', '汕头',
      '潮州', '揭阳', '清远', '韶关', '河源', '阳江', '云浮', '汕尾', '台山', '开平',
      '鹤山', '恩平', '廉江', '雷州', '吴川', '高州', '化州', '信宜', '高要', '四会',
      '广东', '浙江', '江苏', '山东', '河南', '湖北', '湖南', '四川', '福建', '安徽',
      '河北', '山西', '陕西', '辽宁', '吉林', '黑龙江', '江西', '贵州', '云南', '甘肃',
      '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门',
      // 国家名称
      'China', 'USA', 'UK', 'Japan', 'Korea', 'Germany', 'France', 'Italy', 'Spain',
      'Canada', 'Australia', 'India', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam',
      '中国', '美国', '英国', '日本', '韩国', '德国', '法国', '意大利', '西班牙',
      '加拿大', '澳大利亚', '印度', '新加坡', '马来西亚', '泰国', '越南',
      // 常见的通用词汇
      'P.R.', 'P.R', 'PR', 'People\'s Republic', 'Republic'
    ]);
    
    // 首先按照句号分割，因为机构信息通常用句号分隔
    let items = text.split(/[\.。]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // 如果句号分割后只有一个项目，尝试用逗号分割
    if (items.length === 1) {
      items = text.split(/[,，]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    // 过滤掉行政区划和过短的项目
    return items.filter(item => {
      // 移除首尾的引号、括号等
      const cleanItem = item.replace(/^['"`\[\(]+|['"`\]\)]+$/g, '').trim();
      
      // 过滤条件：
      // 1. 长度太短（小于3个字符）
      if (cleanItem.length < 3) return false;
      
      // 2. 是纯数字
      if (/^\d+$/.test(cleanItem)) return false;
      
      // 3. 是行政区划
      if (administrativeRegions.has(cleanItem)) return false;
      
      // 4. 只包含标点符号
      if (/^[^\w\u4e00-\u9fff]+$/.test(cleanItem)) return false;
      
      // 5. 包含明显的机构关键词才保留
      const institutionKeywords = [
        'University', 'Hospital', 'Institute', 'College', 'School', 'Department', 
        'Center', 'Centre', 'Laboratory', 'Lab', 'Clinic', 'Medical', 'Health',
        '大学', '医院', '学院', '研究所', '研究院', '中心', '科室', '实验室', 
        '诊所', '医学', '健康', '卫生', '附属', '第一', '第二', '第三', '第四', '第五',
        '人民', '中医', '西医', '综合', '专科', '妇幼', '儿童', '肿瘤', '心血管',
        '神经', '骨科', '眼科', '耳鼻喉', '皮肤', '精神', '康复', '急救', '放射',
        '影像', '检验', '病理', '药学', '护理', '公共卫生'
      ];
      
      return institutionKeywords.some(keyword => 
        cleanItem.toLowerCase().includes(keyword.toLowerCase())
      );
    }).map(item => item.replace(/^['"`\[\(]+|['"`\]\)]+$/g, '').trim());
  };

  // 重置展开状态当选择新论文时
  const handlePaperSelect = (paper: typeof papers[0] | null) => {
    setSelectedPaper(paper);
    setShowAllKeywords(false);
    setShowAllAuthors(false);
    setShowAllAffils(false);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">标题</TableHead>
            <TableHead className="w-[8%]">年份</TableHead>
            <TableHead className="w-[15%]">期刊</TableHead>
            <TableHead className="w-[12%]">第一作者国家和地区</TableHead>
            <TableHead className="w-[25%]">研究标签</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPapers.map((paper, index) => (
            <TableRow
              key={`${paper.pmid}-${index}`}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handlePaperSelect(paper)}
            >
              <TableCell className="font-medium">
                <div className="line-clamp-2 text-sm leading-relaxed">
                  {paper.title}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {paper.year}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                  {paper.journal_short}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
                  {paper.affil_first_country}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {getAlgorithmTags(paper).map((algo, i) => (
                    <Badge key={i} variant="secondary" className="text-xs flex items-center gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
                      <FaRobot className="w-3 h-3" />
                      {algo}
                    </Badge>
                  ))}
                  {getSpecialtyTags(paper).map((spec, i) => (
                    <Badge key={i} variant="outline" className="text-xs flex items-center gap-1 bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100">
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
            显示第 {startIndex + 1}-{Math.min(endIndex, sortedPapers.length)} 条，共 {sortedPapers.length} 条记录
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

      <Dialog open={!!selectedPaper} onOpenChange={() => handlePaperSelect(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg leading-relaxed pr-8">
              {selectedPaper?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">发表年份:</span>
                <span className="ml-2 text-sm">{selectedPaper?.year}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">发表时间:</span>
                <span className="ml-2 text-sm">
                  {selectedPaper?.article_date ? 
                    new Date(selectedPaper.article_date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 
                    (selectedPaper?.date ? 
                      new Date(selectedPaper.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      '暂无数据'
                    )
                  }
                </span>
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
              <div>
                <span className="text-sm font-medium text-gray-600">语言:</span>
                <span className="ml-2 text-sm">{selectedPaper?.lang || '暂无数据'}</span>
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
                <div className="flex flex-wrap gap-2">
                  {selectedPaper?.keywords ? (() => {
                    const keywords = smartSplit(selectedPaper.keywords, 'keywords');
                    const displayKeywords = showAllKeywords ? keywords : keywords.slice(0, 15);
                    
                    return (
                      <>
                        {displayKeywords.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                          >
                            {keyword}
                          </Badge>
                        ))}
                        {keywords.length > 15 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllKeywords(!showAllKeywords)}
                            className="text-xs text-green-700 hover:text-green-900 h-6 px-2"
                          >
                            {showAllKeywords ? `收起 (${keywords.length - 15} 个)` : `显示更多 (+${keywords.length - 15})`}
                          </Button>
                        )}
                      </>
                    );
                  })() : (
                    <span className="text-sm text-gray-500">暂无关键词</span>
                  )}
                </div>
              </div>
            </div>

            {/* 作者信息 */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">作者信息</h3>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex flex-wrap gap-2">
                  {selectedPaper?.authors ? (() => {
                    const authors = smartSplit(selectedPaper.authors, 'authors');
                    const displayAuthors = showAllAuthors ? authors : authors.slice(0, 10);
                    
                    return (
                      <>
                        {displayAuthors.map((author, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300"
                          >
                            {author}
                          </Badge>
                        ))}
                        {authors.length > 10 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllAuthors(!showAllAuthors)}
                            className="text-xs text-purple-700 hover:text-purple-900 h-6 px-2"
                          >
                            {showAllAuthors ? `收起 (${authors.length - 10} 个)` : `显示更多 (+${authors.length - 10})`}
                          </Button>
                        )}
                      </>
                    );
                  })() : (
                    <span className="text-sm text-gray-500">暂无作者信息</span>
                  )}
                </div>
              </div>
            </div>

            {/* 机构信息 */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">机构信息</h3>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex flex-wrap gap-2">
                  {selectedPaper?.author_affils ? (() => {
                    const affils = smartSplit(selectedPaper.author_affils, 'affils');
                    const displayAffils = showAllAffils ? affils : affils.slice(0, 8);
                    
                    return (
                      <>
                        {displayAffils.map((affil, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300"
                          >
                            {affil}
                          </Badge>
                        ))}
                        {affils.length > 8 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllAffils(!showAllAffils)}
                            className="text-xs text-orange-700 hover:text-orange-900 h-6 px-2"
                          >
                            {showAllAffils ? `收起 (${affils.length - 8} 个)` : `显示更多 (+${affils.length - 8})`}
                          </Button>
                        )}
                      </>
                    );
                  })() : (
                    <span className="text-sm text-gray-500">暂无机构信息</span>
                  )}
                </div>
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