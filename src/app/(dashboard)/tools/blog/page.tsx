"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
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
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPostPreview } from "@/components/tools/blog-post-preview";
import { Copy, Save, RefreshCw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const formSchema = z.object({
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
  tone: z.enum(["professional", "casual", "humorous", "formal", "friendly"], {
    required_error: "Please select a tone.",
  }),
  keywords: z.string().min(3, {
    message: "Please enter at least one keyword.",
  }),
});

export default function BlogGeneratorPage() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("form");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "professional",
      keywords: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsGenerating(true);
      setGeneratedContent("");
      
      // In a real app, this would be an API call
      // const response = await fetch("/api/tools/blog", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     topic: values.topic,
      //     tone: values.tone,
      //     keywords: values.keywords.split(",").map(k => k.trim()),
      //   }),
      // });
      // const data = await response.json();
      
      // Mock API response with a delay to simulate streaming
      const mockContent = `# ${values.topic}

## Introduction

In today's fast-paced digital world, understanding ${values.topic} has become increasingly important for businesses and individuals alike. This comprehensive guide will explore the key aspects of ${values.topic} and provide actionable insights that you can implement immediately.

## Why ${values.topic} Matters

The landscape of ${values.topic} has evolved significantly over the past decade. With technological advancements and changing consumer behaviors, staying ahead of the curve is essential for success. Here are some reasons why ${values.topic} should be a priority:

1. Increased engagement with your target audience
2. Better conversion rates and ROI
3. Competitive advantage in a crowded marketplace
4. Long-term sustainability and growth potential

## Key Strategies for ${values.topic}

### 1. Research and Planning

Before diving into ${values.topic}, thorough research and strategic planning are crucial. This involves:

- Analyzing market trends and competitor strategies
- Identifying your target audience and their preferences
- Setting clear, measurable goals
- Developing a comprehensive implementation roadmap

### 2. Implementation Best Practices

When implementing ${values.topic} strategies, consider these best practices:

- Start with small, manageable initiatives
- Regularly measure and analyze performance
- Be willing to pivot based on results
- Continuously optimize for better outcomes

### 3. Leveraging Technology

Technology plays a vital role in maximizing the effectiveness of ${values.topic}. Consider these technological solutions:

- Automation tools to streamline processes
- Analytics platforms for data-driven decisions
- AI and machine learning for personalization
- Integration with existing systems for seamless operations

## Common Challenges and Solutions

While implementing ${values.topic} strategies, you may encounter these challenges:

1. **Resource constraints**: Prioritize initiatives based on potential impact and allocate resources accordingly.
2. **Resistance to change**: Communicate benefits clearly and involve stakeholders early in the process.
3. **Measuring ROI**: Establish clear KPIs and tracking mechanisms from the outset.
4. **Staying current**: Commit to continuous learning and adaptation as the landscape evolves.

## Conclusion

${values.topic} represents a significant opportunity for growth and innovation. By understanding its importance, implementing strategic approaches, leveraging technology, and addressing common challenges, you can harness its full potential for your business or personal brand.

Remember that success with ${values.topic} is not instantaneous—it requires consistent effort, adaptation, and optimization. Start with the strategies outlined in this guide, and you'll be well on your way to achieving your goals.`;

      // Simulate streaming by revealing content gradually
      let displayedContent = "";
      const contentArray = mockContent.split("");
      
      const streamInterval = setInterval(() => {
        if (contentArray.length > 0) {
          displayedContent += contentArray.shift();
          setGeneratedContent(displayedContent);
        } else {
          clearInterval(streamInterval);
          setIsGenerating(false);
          setActiveTab("preview");
          showNotification("success", t("blogGenerator.contentGenerated"));
        }
      }, 10);
      
    } catch (error) {
      console.error("Error generating blog post:", error);
      showNotification("error", t("errors.general"));
      setIsGenerating(false);
    }
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(generatedContent);
      showNotification("success", t("blogGenerator.contentCopied"));
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  const handleSave = async () => {
    try {
      // In a real app, this would save to the database
      // await fetch("/api/generations", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     toolType: "blog",
      //     inputParams: form.getValues(),
      //     outputContent: generatedContent,
      //   }),
      // });
      
      // Mock saving
      setTimeout(() => {
        showNotification("success", t("blogGenerator.contentSaved"));
      }, 500);
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{t("blogGenerator.title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("blogGenerator.description")}
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="form">{t("common.input")}</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedContent}>
            {t("blogGenerator.preview")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
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
                            disabled={isGenerating}
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
                          disabled={isGenerating}
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
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("blogGenerator.keywords")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t("blogGenerator.keywordsPlaceholder")}
                            {...field}
                            disabled={isGenerating}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("blogGenerator.keywordsDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full"
                    aria-busy={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t("blogGenerator.generatingContent")}
                      </>
                    ) : (
                      t("blogGenerator.generate")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6">
            <Card>
              <CardContent className="pt-6">
                {isGenerating ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-8 w-1/2 mt-8" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <BlogPostPreview content={generatedContent} />
                )}
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    {t("common.actions")}
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleCopy}
                      disabled={isGenerating || !generatedContent}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {t("blogGenerator.copy")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSave}
                      disabled={isGenerating || !generatedContent}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {t("blogGenerator.save")}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => form.handleSubmit(onSubmit)()}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t("blogGenerator.regenerate")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    {t("common.tips")}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t("blogGenerator.tip1")}</li>
                    <li>• {t("blogGenerator.tip2")}</li>
                    <li>• {t("blogGenerator.tip3")}</li>
                    <li>• {t("blogGenerator.tip4")}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
