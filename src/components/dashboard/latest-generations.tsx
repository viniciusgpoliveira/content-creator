"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { formatDate, truncateString } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/context/notification-context";
import { FileText, MessageSquare, ExternalLink, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Generation = {
  id: string;
  toolType: string;
  outputContent: string;
  createdAt: string;
};

export function LatestGenerations() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 6,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGenerations = async (page = 1) => {
    try {
      setIsLoading(true);

      // Add a timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/generations?limit=${pagination.limit}&page=${page}&t=${timestamp}`);

      if (!response.ok) {
        console.warn(`API returned status: ${response.status}`);
        // For 400 errors, just show empty data instead of throwing
        if (response.status === 400) {
          setGenerations([]);
          setPagination({
            total: 0,
            pages: 0,
            page: 1,
            limit: pagination.limit
          });
          setCurrentPage(1);
          setIsLoading(false);
          return;
        }
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log("Fetched generations:", data);

      // Set the generations and pagination data
      setGenerations(data.generations || []);
      setPagination(data.pagination || {
        total: 0,
        pages: 0,
        page: 1,
        limit: pagination.limit
      });
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching generations:", error);
      // Set empty data on error to prevent continuous retries
      setGenerations([]);
      showNotification("error", t("errors.general"));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a generation
  const deleteGeneration = async (id: string) => {
    try {
      // Show loading state
      setIsLoading(true);

      const response = await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      // Refresh the generations list
      showNotification("success", t("dashboard.generationDeleted"));

      // Wait a moment before refreshing to avoid rapid API calls
      setTimeout(() => {
        fetchGenerations(currentPage);
      }, 500);
    } catch (error) {
      console.error("Error deleting generation:", error);
      showNotification("error", t("errors.general"));
      setIsLoading(false);
    }
  };

  // Use a ref to track if we've already fetched data to prevent multiple calls
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already fetched data
    if (!hasFetchedRef.current) {
      fetchGenerations(1);
      hasFetchedRef.current = true;
    }
  }, []); // Empty dependency array to run only once

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchGenerations(newPage);
  };

  // Loading state is handled in the main return

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center gap-2 text-primary">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">{t("dashboard.loadingGenerations")}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <div className="p-4 flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="p-2 border-t">
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : generations.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center">
          <div className="mb-6 bg-muted/50 rounded-full p-6 inline-flex">
            <Sparkles className="h-12 w-12 text-primary/70" />
          </div>
          <h3 className="text-xl font-medium mb-2">{t("dashboard.noGenerationsTitle")}</h3>
          <p className="text-muted-foreground max-w-md mb-6">{t("dashboard.noGenerations")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="gap-2">
              <Link href="/tools/blog">
                <FileText className="h-4 w-4" />
                {t("blogGenerator.title")}
              </Link>
            </Button>
            <Button asChild className="gap-2" variant="outline">
              <Link href="/tools/caption">
                <MessageSquare className="h-4 w-4" />
                {t("captionGenerator.title")}
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {generations.map((generation) => (
                <div
                  key={generation.id}
                  className="flex flex-col h-full border rounded-lg hover:bg-muted/50 transition-colors overflow-hidden group"
                >
                  <div className="p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {generation.toolType === "blog" ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <MessageSquare className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">
                          {generation.toolType === "blog"
                            ? t("blogGenerator.title")
                            : t("captionGenerator.title")}
                        </h4>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatDate(generation.createdAt, "PPp")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {truncateString(generation.outputContent, 100)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto p-2 border-t bg-muted/20 flex justify-between">
                    <Button variant="ghost" size="sm" asChild className="flex-1 justify-center">
                      <Link
                        href={`/dashboard/generations/${generation.id}`}
                        className="text-xs"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        {t("common.viewDetails")}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        if (window.confirm(t("dashboard.confirmDelete"))) {
                          deleteGeneration(generation.id);
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center mt-6 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                {t("common.pageXofY", { current: currentPage, total: pagination.pages })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
