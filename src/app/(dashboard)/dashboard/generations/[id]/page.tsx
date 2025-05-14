"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/utils";
import { useNotification } from "@/context/notification-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, MessageSquare, Trash2, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { BlogPostPreview } from "@/components/tools/blog-post-preview";

interface Generation {
  id: string;
  userId: string;
  toolType: "blog" | "caption";
  inputParams: any;
  outputContent: string;
  createdAt: string;
  updatedAt: string;
}

export default function GenerationDetailsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGeneration = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/generations/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            showNotification("error", t("dashboard.generationNotFound"));
            router.push("/dashboard");
            return;
          }
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        setGeneration(data);
      } catch (error) {
        console.error("Error fetching generation:", error);
        showNotification("error", t("errors.general"));
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchGeneration();
    }
  }, [params.id, router, showNotification, t]);

  const handleDelete = async () => {
    if (!generation) return;

    if (!window.confirm(t("dashboard.confirmDelete"))) {
      return;
    }

    try {
      setIsDeleting(true);

      // Immediately redirect to dashboard to prevent trying to reload deleted content
      // This prevents the error where the page tries to load a deleted generation
      router.push("/dashboard");

      // Then perform the deletion in the background
      const response = await fetch(`/api/generations/${generation.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      showNotification("success", t("dashboard.generationDeleted"));
    } catch (error) {
      console.error("Error deleting generation:", error);
      showNotification("error", t("errors.general"));
    }
  };

  const handleCopy = async () => {
    if (!generation) return;

    try {
      await copyToClipboard(generation.outputContent);
      showNotification("success", t("common.contentCopied"));
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  const renderInputParams = () => {
    if (!generation) return null;

    const params = generation.inputParams;

    return (
      <div className="space-y-2">
        {Object.entries(params).map(([key, value]) => (
          <div key={key} className="flex flex-wrap gap-1">
            <span className="font-medium">{key}:</span>
            <span className="text-muted-foreground">
              {typeof value === "string" ? value : JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!generation) return null;

    if (generation.toolType === "blog") {
      return <BlogPostPreview content={generation.outputContent} />;
    } else {
      // For captions, split by newlines and render each caption
      return (
        <div className="space-y-4">
          {generation.outputContent.split("\n\n").map((caption, index) => (
            caption.trim() && (
              <Card key={index}>
                <CardContent className="p-4">
                  <p className="whitespace-pre-wrap">{caption}</p>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">{t("dashboard.generationNotFound")}</h2>
        <p className="text-muted-foreground mb-6">{t("dashboard.generationNotFoundDesc")}</p>
        <Button onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.backToDashboard")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {generation.toolType === "blog"
              ? t("blogGenerator.title")
              : t("captionGenerator.title")}
          </h1>
          <Badge variant={generation.toolType === "blog" ? "default" : "secondary"}>
            {generation.toolType === "blog"
              ? <FileText className="mr-1 h-3 w-3" />
              : <MessageSquare className="mr-1 h-3 w-3" />}
            {generation.toolType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            {t("common.copy")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? t("common.deleting") : t("common.delete")}
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {t("common.created")}: {formatDate(generation.createdAt, "PPpp")}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.inputParameters")}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderInputParams()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.generatedContent")}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
