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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaptionGenerator } from "@/components/tools/caption-generator";
import { RefreshCw } from "lucide-react";

const formSchema = z.object({
  productTheme: z.string().min(3, {
    message: "Product/Theme must be at least 3 characters.",
  }),
  platform: z.enum(["twitter", "linkedin", "instagram", "facebook"], {
    required_error: "Please select a platform.",
  }),
  description: z.string().optional(),
});

export default function CaptionGeneratorPage() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<string>("form");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formValues, setFormValues] = useState<{
    productTheme: string;
    platform: "twitter" | "linkedin" | "instagram" | "facebook";
    description: string;
  }>({
    productTheme: "",
    platform: "instagram",
    description: "",
  });
  const captionGeneratorRef = useRef<{ complete: (prompt: string, options?: any) => void } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productTheme: "",
      platform: "instagram",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Caption form submitted:", values);

    // Set generating state to lock the form
    setIsGenerating(true);

    // Store form values for the CaptionGenerator component
    const formattedValues = {
      productTheme: values.productTheme,
      platform: values.platform,
      description: values.description || "",
    };

    setFormValues(formattedValues);

    // Switch to preview tab and trigger generation
    setActiveTab("preview");

    // Wait for the next render cycle to ensure the component is mounted
    setTimeout(() => {
      console.log("Triggering caption generation");
      if (captionGeneratorRef.current) {
        captionGeneratorRef.current.complete("", {
          body: formattedValues
        });
      } else {
        console.error("Caption generator ref is not available");
        setIsGenerating(false); // Reset if there's an error
      }
    }, 100);
  }

  // Handle saving generated content to the database
  const handleSave = async (captions: string[]) => {
    // Reset generating state when content is saved
    setIsGenerating(false);
    try {
      // Save to the database
      await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "caption",
          inputParams: formValues,
          outputContent: captions.join("\n\n"),
        }),
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error saving captions:", error);
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
      showNotification("info", t("captionGenerator.waitForGeneration"));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{t("captionGenerator.title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("captionGenerator.description")}
      </p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="form" disabled={isGenerating}>{t("common.input")}</TabsTrigger>
          <TabsTrigger value="preview" disabled={!formValues.productTheme}>
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3 w-3 animate-spin" />
                {t("captionGenerator.generating")}
              </div>
            ) : (
              t("captionGenerator.preview")
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
                    name="productTheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("captionGenerator.productTheme")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("captionGenerator.productThemePlaceholder")}
                            {...field}

                          />
                        </FormControl>
                        <FormDescription>
                          {t("captionGenerator.productThemeDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("captionGenerator.platform")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}

                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("captionGenerator.selectPlatform")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="twitter">
                              {t("captionGenerator.platformOptions.twitter")}
                            </SelectItem>
                            <SelectItem value="linkedin">
                              {t("captionGenerator.platformOptions.linkedin")}
                            </SelectItem>
                            <SelectItem value="instagram">
                              {t("captionGenerator.platformOptions.instagram")}
                            </SelectItem>
                            <SelectItem value="facebook">
                              {t("captionGenerator.platformOptions.facebook")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("captionGenerator.platformDescription")}
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
                        <FormLabel>{t("captionGenerator.description")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("captionGenerator.descriptionPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("captionGenerator.descriptionDescription")}
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
                      {t("captionGenerator.surpriseMe")}
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
                        {t("captionGenerator.generating")}
                      </div>
                    ) : (
                      t("captionGenerator.generate")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="animate-fade-in transition-all duration-300">
          {activeTab === "preview" && (
            <CaptionGenerator
              ref={captionGeneratorRef}
              productTheme={formValues.productTheme}
              platform={formValues.platform}
              description={formValues.description}
              onSave={handleSave}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
