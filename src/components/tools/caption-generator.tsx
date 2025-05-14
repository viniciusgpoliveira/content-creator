"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNotification } from "@/context/notification-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface CaptionGeneratorProps {
  productTheme: string;
  platform: string;
  description?: string;
  onSave: (captions: string[]) => Promise<void>;
}

export const CaptionGenerator = forwardRef<
  { complete: (prompt: string, options?: any) => void },
  CaptionGeneratorProps
>(({ productTheme, platform, description, onSave }, ref) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Expose the complete function to the parent component
  useImperativeHandle(ref, () => ({
    complete: generateCaptions
  }));

  const generateCaptions = async (prompt: string, options?: any) => {
    // Prevent multiple calls if already loading
    if (isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      setCaptions([]);

      console.log("Sending caption generation request:", { productTheme, platform, description });
      const response = await fetch("/api/tools/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productTheme,
          platform,
          description
        }),
      });

      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        throw new Error(`Error: ${response.status}`);
      }

      console.log("Received response from API");
      const data = await response.json();
      console.log("Parsed JSON response");

      if (!data.captions) {
        console.error("No captions in response:", data);
        throw new Error("No captions received from API");
      }

      console.log("Captions received, processing");

      // Process the captions
      const captionText = data.captions;
      const captionList = captionText
        .split(/\d+\.\s+/)
        .filter((caption: string) => caption.trim().length > 0);

      console.log("Processed captions:", captionList.length);

      // First, show a brief delay with the loading state before showing captions
      setTimeout(() => {
        // Start the animation with a fade-out animation on the loading state
        setIsLoading(false);

        // Add a slight delay before showing captions for a smoother transition
        setTimeout(() => {
          setCaptions(captionList);
          showNotification("success", t("captionGenerator.captionsGenerated"));

          // Automatically save the captions
          handleSave(captionList);
        }, 300);
      }, 1500); // Show loading state for 1.5 seconds before showing captions
    } catch (error) {
      console.error("Error generating captions:", error);
      setError(t("errors.general"));
      setIsLoading(false);
      showNotification("error", t("errors.general"));
    }
  };

  const handleSave = async (captionList: string[]) => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      await onSave(captionList);
      showNotification("success", t("captionGenerator.captionsSaved"));
    } catch (error) {
      console.error("Error saving captions:", error);
      showNotification("error", t("errors.general"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    generateCaptions("", {
      body: {
        productTheme,
        platform,
        description
      }
    });
  };

  const handleCopyCaption = async (caption: string) => {
    try {
      await copyToClipboard(caption);
      showNotification("success", t("captionGenerator.captionCopied"));
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  const handleCopyAll = async () => {
    try {
      const allCaptions = captions.join("\n\n");
      await copyToClipboard(allCaptions);
      showNotification("success", t("captionGenerator.allCaptionsCopied"));
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  const renderCaptionItem = (caption: string, index: number) => {
    return (
      <Card key={index} className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-sm whitespace-pre-wrap">{caption}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyCaption(caption)}
              className="flex items-center gap-1 text-xs"
            >
              <Copy className="h-3.5 w-3.5" />
              {t("common.copy")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center space-x-2 bg-muted/20 p-4 rounded-md border border-muted">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <p className="text-base font-medium">{t("captionGenerator.generatingCaptions")}</p>
            </div>
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : captions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 animate-fade-in"
          >
            {captions.map((caption, index) => renderCaptionItem(caption, index))}

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                {t("captionGenerator.copyAll")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                {t("captionGenerator.regenerate")}
              </Button>
            </div>
          </motion.div>
        ) : error ? (
          <div className="text-destructive">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-8 border border-dashed border-muted rounded-md">
              <p className="text-muted-foreground mb-2">{t("captionGenerator.readyToGenerate")}</p>
              <p className="text-sm text-muted-foreground mb-4">{t("captionGenerator.clickToStart")}</p>
            </div>
            <Button
              onClick={handleRegenerate}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t("captionGenerator.generate")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
