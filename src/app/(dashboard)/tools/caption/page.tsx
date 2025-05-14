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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CaptionItem } from "@/components/tools/caption-item";
import { RefreshCw } from "lucide-react";

const formSchema = z.object({
  productTheme: z.string().min(3, {
    message: "Product/Theme must be at least 3 characters.",
  }),
  platform: z.enum(["twitter", "linkedin", "instagram", "facebook"], {
    required_error: "Please select a platform.",
  }),
});

export default function CaptionGeneratorPage() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productTheme: "",
      platform: "instagram",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsGenerating(true);
      setGeneratedCaptions([]);
      
      // In a real app, this would be an API call
      // const response = await fetch("/api/tools/caption", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     productTheme: values.productTheme,
      //     platform: values.platform,
      //   }),
      // });
      // const data = await response.json();
      
      // Mock API response with a delay
      setTimeout(() => {
        // Generate mock captions based on platform
        let mockCaptions: string[] = [];
        
        if (values.platform === "twitter") {
          mockCaptions = [
            `Just launched our new ${values.productTheme}! 🚀 Check it out and let us know what you think. #Innovation #ProductLaunch`,
            `The wait is over! Our ${values.productTheme} is now available. RT if you're as excited as we are! #NewProduct`,
            `We've been working on this for months, and it's finally here: introducing our ${values.productTheme}! #ExcitingNews`,
            `Game-changer alert! 🔔 Our ${values.productTheme} is revolutionizing the industry. Find out how: [link] #Innovation`,
            `"This ${values.productTheme} has completely transformed how I work." - Happy Customer #Testimonial #ProductLaunch`,
          ];
        } else if (values.platform === "linkedin") {
          mockCaptions = [
            `I'm thrilled to announce the launch of our new ${values.productTheme}. After months of development and testing, we're confident this solution will help professionals across industries improve their workflow and achieve better results. \n\nWhat challenges are you facing that our ${values.productTheme} might help solve? Let's connect and discuss how we can support your business goals.`,
            `Innovation is at the heart of what we do at [Company Name]. Today, we're proud to introduce our latest ${values.productTheme}, designed specifically to address the evolving needs of modern businesses. \n\nLearn more about how this solution can transform your operations: [link] \n\n#ProfessionalDevelopment #Innovation #BusinessSolutions`,
            `The market has been waiting for a solution like our new ${values.productTheme}. Here's why it matters: \n\n✅ Increases productivity by 35% \n✅ Reduces operational costs \n✅ Seamless integration with existing systems \n✅ Enterprise-grade security \n\nInterested in learning more? Comment below or DM me directly.`,
            `We're excited to share that our ${values.productTheme} has been recognized by [Industry Publication] as a "game-changing innovation." This acknowledgment validates our team's hard work and commitment to excellence. \n\nThank you to our amazing clients and partners who have supported us throughout this journey. We couldn't have done it without you!`,
            `Looking for ways to optimize your [relevant process]? Our newly launched ${values.productTheme} might be exactly what you need. \n\nJoin our upcoming webinar to see it in action: [link] \n\n#ProfessionalDevelopment #IndustryTrends #Innovation`,
          ];
        } else if (values.platform === "instagram") {
          mockCaptions = [
            `✨ NEW LAUNCH ALERT! ✨\nSay hello to our ${values.productTheme} 😍\nDouble tap if you're as excited as we are!\n.\n.\n.\n#NewLaunch #ExcitingTimes #Innovation #ProductLaunch #InstaNew`,
            `The perfect addition to your collection 💫\nOur ${values.productTheme} is designed to make your life better in every way!\n.\n.\n.\n#MustHave #NewProduct #Innovation #LifestyleProduct #InstaGood`,
            `Behind every great product is an amazing team ❤️\nProudly introducing our ${values.productTheme} - the result of countless hours of passion and dedication!\n.\n.\n.\n#TeamWork #ProductDevelopment #BehindTheScenes #NewProduct`,
            `GIVEAWAY TIME! 🎁\nWe're celebrating the launch of our ${values.productTheme} by giving away 3 to our lucky followers!\nTo enter:\n1️⃣ Like this post\n2️⃣ Follow our page\n3️⃣ Tag 2 friends who would love this\n.\n.\n.\n#Giveaway #Contest #NewProduct #FreeStuff #EnterToWin`,
            `The wait is finally over! 🙌\nAfter months of development, our ${values.productTheme} is now available! Tap the link in bio to be one of the first to get it!\n.\n.\n.\n#NewRelease #Finally #MustHave #TapLink #ShopNow`,
          ];
        } else if (values.platform === "facebook") {
          mockCaptions = [
            `🎉 BIG ANNOUNCEMENT! 🎉\nWe're thrilled to introduce our brand new ${values.productTheme}! We've been working on this for months and can't wait for you to experience it.\n\nTag someone who needs to see this!`,
            `Have you ever wished for a solution that makes [common problem] easier? Look no further! Our new ${values.productTheme} is designed with you in mind.\n\nLearn more and get yours today: [link]`,
            `CUSTOMER SPOTLIGHT: Meet Sarah, who's been using our ${values.productTheme} for just two weeks and has already seen amazing results! 📣\n\n"I can't believe I waited so long to try this. It's completely changed my daily routine!" - Sarah J.\n\nWant to experience the same benefits? Check out the link below!`,
            `We asked, you answered! Based on your feedback, we've created the perfect ${values.productTheme} that addresses all your needs.\n\nThank you to everyone who participated in our survey and helped make this product even better! ❤️`,
            `Flash Sale Alert! 🚨\nFor the next 48 hours, get 20% off our newly launched ${values.productTheme}! Use code LAUNCH20 at checkout.\n\nDon't miss this limited-time offer to be among the first to experience our latest innovation!`,
          ];
        }
        
        setGeneratedCaptions(mockCaptions);
        setIsGenerating(false);
        showNotification("success", t("captionGenerator.captionsGenerated"));
      }, 2000);
      
    } catch (error) {
      console.error("Error generating captions:", error);
      showNotification("error", t("errors.general"));
      setIsGenerating(false);
    }
  }

  const handleSave = async () => {
    try {
      // In a real app, this would save to the database
      // await fetch("/api/generations", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     toolType: "caption",
      //     inputParams: form.getValues(),
      //     outputContent: generatedCaptions.join("\n\n"),
      //   }),
      // });
      
      // Mock saving
      setTimeout(() => {
        showNotification("success", t("captionGenerator.captionsSaved"));
      }, 500);
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{t("captionGenerator.title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t("captionGenerator.description")}
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("common.input")}</CardTitle>
            </CardHeader>
            <CardContent>
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
                            disabled={isGenerating}
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
                          disabled={isGenerating}
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
                  
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full"
                    aria-busy={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        {t("captionGenerator.generatingCaptions")}
                      </>
                    ) : (
                      t("captionGenerator.generate")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {generatedCaptions.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("common.actions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleSave}
                  >
                    {t("captionGenerator.saveAll")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => form.handleSubmit(onSubmit)()}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t("captionGenerator.regenerate")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("captionGenerator.generatedCaptions")}</CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : generatedCaptions.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {generatedCaptions.map((caption, index) => (
                    <CaptionItem
                      key={index}
                      caption={caption}
                      index={index}
                      platform={form.getValues().platform}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {t("captionGenerator.noCaptions")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
