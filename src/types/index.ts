import { User, Generation, EngagementMetric } from "@prisma/client";

export type UserWithRelations = User & {
  generations?: Generation[];
  engagementMetrics?: EngagementMetric[];
};

export type GenerationWithUser = Generation & {
  user: User;
};

export type EngagementMetricWithUser = EngagementMetric & {
  user: User;
};

export type BlogPostParams = {
  topic: string;
  tone: "professional" | "casual" | "humorous" | "formal" | "friendly";
  description?: string;
};

export type SocialCaptionParams = {
  productTheme: string;
  platform: "twitter" | "linkedin" | "instagram" | "facebook";
  description?: string;
};

export type MetricType = "readTime" | "clickThrough" | "shareCount";

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};

export type ChartOptions = {
  responsive: boolean;
  plugins: {
    legend: {
      position: "top" | "bottom" | "left" | "right";
    };
    title: {
      display: boolean;
      text: string;
    };
  };
};
