"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNotification } from "@/context/notification-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Copy, Save } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { BlogPostPreview } from "@/components/tools/blog-post-preview";

interface BlogGeneratorProps {
  topic: string;
  tone: string;
  description?: string;
  onSave: (content: string) => Promise<void>;
}

export const BlogGenerator = forwardRef<
  { complete: (prompt: string, options?: any) => void },
  BlogGeneratorProps
>(({ topic, tone, description, onSave }, ref) => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completion, setCompletion] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Expose the complete function to the parent component
  useImperativeHandle(ref, () => ({
    complete: generateBlogPost
  }));

  const generateBlogPost = async (prompt: string, options?: any) => {
    // Prevent multiple calls if already loading
    if (isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      setCompletion("");

      console.log("Sending blog generation request:", { topic, tone, description });
      const response = await fetch("/api/tools/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone,
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

      if (!data.content) {
        console.error("No content in response:", data);
        throw new Error("No content received from API");
      }

      console.log("Content received, length:", data.content.length);

      // Simulate streaming by revealing content gradually
      let displayedContent = "";
      const contentArray = data.content.split("");

      console.log("Starting streaming simulation");

      // First, show a brief delay with the loading state before starting the animation
      setTimeout(() => {
        // Use a more reliable approach with recursive setTimeout
        let index = 0;
        const totalLength = contentArray.length;

        // Start with empty content
        setCompletion("");

        const simulateStreaming = () => {
          // Process just a few characters at once for a more visible typing effect
          const chunkSize = 3;
          for (let i = 0; i < chunkSize && index < totalLength; i++) {
            displayedContent += contentArray[index];
            index++;
          }

          setCompletion(displayedContent);

          if (index < totalLength) {
            // Continue streaming with a slower speed for better visibility
            // Adjust the timeout to control the typing speed (higher = slower)
            setTimeout(simulateStreaming, 30);
          } else {
            // Finished streaming
            setIsLoading(false);
            showNotification("success", t("blogGenerator.contentGenerated"));
            console.log("Content fully displayed");

            // Automatically save the content
            handleSave(displayedContent);
          }
        };

        // Start the streaming simulation with a fade-out animation on the loading state
        setIsLoading(false);
        setTimeout(simulateStreaming, 300);
      }, 1500); // Show loading state for 1.5 seconds before starting the animation
    } catch (error) {
      console.error("Error generating blog post:", error);
      setError(t("errors.general"));
      setIsLoading(false);
      showNotification("error", t("errors.general"));
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(completion);
      showNotification("success", t("blogGenerator.contentCopied"));
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  const handleSave = async (content: string) => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      await onSave(content);
      showNotification("success", t("blogGenerator.contentSaved"));
    } catch (error) {
      console.error("Error saving blog post:", error);
      showNotification("error", t("errors.general"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    generateBlogPost("", {
      body: {
        topic,
        tone,
        description
      }
    });
  };

  // No automatic generation on mount - we'll let the parent component control this

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center space-x-2 bg-muted/20 p-4 rounded-md border border-muted">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <p className="text-base font-medium">{t("blogGenerator.generatingContent")}</p>
            </div>
            <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded my-2"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded my-2"></div>
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded my-2"></div>
            <div className="h-8 w-1/2 bg-muted animate-pulse rounded mt-4"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded my-2"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded my-2"></div>
          </div>
        ) : completion ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 animate-fade-in"
          >
            <BlogPostPreview content={completion} />

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                {t("blogGenerator.regenerate")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                {t("blogGenerator.copy")}
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
              <p className="text-muted-foreground mb-2">{t("blogGenerator.readyToGenerate")}</p>
              <p className="text-sm text-muted-foreground mb-4">{t("blogGenerator.clickToStart")}</p>
            </div>
            <Button
              onClick={handleRegenerate}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t("blogGenerator.generate")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
