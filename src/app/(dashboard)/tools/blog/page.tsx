"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNotification } from "@/context/notification-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogGenerator } from "@/components/tools/blog-generator";
import { RefreshCw } from "lucide-react";

const formSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
  tone: z.enum(["professional", "casual", "humorous", "formal", "friendly"], {
    required_error: "Please select a tone.",
  }),
  description: z.string().optional(),
});

export default function BlogGeneratorPage() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<string>("form");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formValues, setFormValues] = useState({
    topic: "",
    tone: "professional" as const,
    description: "",
  });
  const blogGeneratorRef = useRef<{ complete: (prompt: string, options?: any) => void } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "professional",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Blog form submitted:", values);

    // Set generating state to lock the form
    setIsGenerating(true);

    // Store form values for the BlogGenerator component
    const formattedValues = {
      topic: values.topic,
      tone: values.tone,
      description: values.description || "",
    };

    setFormValues(formattedValues);

    // Switch to preview tab and trigger generation
    setActiveTab("preview");

    // Wait for the next render cycle to ensure the component is mounted
    setTimeout(() => {
      console.log("Triggering blog generation");
      if (blogGeneratorRef.current) {
        blogGeneratorRef.current.complete("", {
          body: formattedValues
        });
      } else {
        console.error("Blog generator ref is not available");
        setIsGenerating(false); // Reset if there's an error
      }
    }, 100);
  }

  // Handle saving generated content to the database
  const handleSave = async (content: string) => {
    // Reset generating state when content is saved
    setIsGenerating(false);
    try {
      // Save to the database
      await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "blog",
          inputParams: formValues,
          outputContent: content,
        }),
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error saving blog post:", error);
      return Promise.reject(error);
    }
  };

  // Function to handle tab change - just changes the tab without triggering generation
  const handleTabChange = (value: string) => {
    // Only allow changing tabs if not generating
    if (!isGenerating || value === "preview") {
      setActiveTab(value);

      // If switching back to form, reset the preview lock
      if (value === "form") {
        // Reset the generation state to lock the preview tab again
        setIsGenerating(false);
      }
    } else {
      showNotification("info", t("blogGenerator.waitForGeneration"));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{t("blogGenerator.title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("blogGenerator.description")}
      </p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="form" disabled={isGenerating}>{t("common.input")}</TabsTrigger>
          <TabsTrigger value="preview" disabled={!formValues.topic}>
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3 w-3 animate-spin" />
                {t("blogGenerator.generating")}
              </div>
            ) : (
              t("blogGenerator.preview")
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="animate-fade-in transition-all duration-300">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("blogGenerator.topic")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("blogGenerator.topicPlaceholder")}
                            {...field}

                          />
                        </FormControl>
                        <FormDescription>
                          {t("blogGenerator.topicDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("blogGenerator.tone")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}

                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("blogGenerator.selectTone")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="professional">
                              {t("blogGenerator.toneOptions.professional")}
                            </SelectItem>
                            <SelectItem value="casual">
                              {t("blogGenerator.toneOptions.casual")}
                            </SelectItem>
                            <SelectItem value="humorous">
                              {t("blogGenerator.toneOptions.humorous")}
                            </SelectItem>
                            <SelectItem value="formal">
                              {t("blogGenerator.toneOptions.formal")}
                            </SelectItem>
                            <SelectItem value="friendly">
                              {t("blogGenerator.toneOptions.friendly")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("blogGenerator.toneDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("blogGenerator.description")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("blogGenerator.descriptionPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("blogGenerator.descriptionDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue("description", "Surprise me")}
                    >
                      {t("blogGenerator.surpriseMe")}
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {t("blogGenerator.generating")}
                      </div>
                    ) : (
                      t("blogGenerator.generate")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="animate-fade-in transition-all duration-300">
          {activeTab === "preview" && (
            <BlogGenerator
              ref={blogGeneratorRef}
              topic={formValues.topic}
              tone={formValues.tone}
              description={formValues.description}
              onSave={handleSave}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
