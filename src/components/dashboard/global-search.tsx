"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { searchQueryAtom, filteredPapersAtom } from "@/store";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [filteredPapers] = useAtom(filteredPapersAtom);
  const [isSearching, setIsSearching] = useState(false);

  // 实时搜索 - 300ms 延迟
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        
        <Input
          type="text"
          placeholder="搜索论文标题、摘要、关键词或作者..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-12 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <FaTimes className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        )}
      </div>
      
      {/* 搜索状态和结果提示 */}
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
          <span>
            {isSearching ? (
              "搜索中..."
            ) : (
              `找到 ${filteredPapers.length} 篇相关论文`
            )}
          </span>
          
          {searchQuery && !isSearching && (
            <span className="text-xs text-gray-500">
              搜索关键词: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>
      )}
    </div>
  );
} 