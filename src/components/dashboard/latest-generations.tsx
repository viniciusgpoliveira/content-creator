"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { formatDate, truncateString } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/context/notification-context";
import { FileText, MessageSquare, ExternalLink, Sparkles } from "lucide-react";

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

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/generations?limit=5');
        // const data = await response.json();

        // In a real app, we would fetch from the API and set the data
        // For now, we'll just set an empty array to show the empty state
        setTimeout(() => {
          setGenerations([]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching generations:", error);
        showNotification("error", t("errors.general"));
        setIsLoading(false);
      }
    };

    fetchGenerations();
  }, [t, showNotification]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {generations.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generations.map((generation) => (
            <div
              key={generation.id}
              className="flex flex-col h-full border rounded-lg hover:bg-muted/50 transition-colors overflow-hidden"
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
              <div className="mt-auto p-2 border-t bg-muted/20">
                <Button variant="ghost" size="sm" asChild className="w-full justify-center">
                  <Link
                    href={`/dashboard/generations/${generation.id}`}
                    className="text-xs"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    {t("common.viewDetails")}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
