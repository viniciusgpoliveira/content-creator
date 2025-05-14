"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementMetricsChart } from "@/components/dashboard/engagement-metrics-chart";
import { LatestGenerations } from "@/components/dashboard/latest-generations";
import { useNotification } from "@/context/notification-context";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartData } from "@/types";
import { getRandomColor } from "@/lib/utils";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<Record<string, any>>({});

  // Mock data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // await fetch('/api/metrics')

        // Mock data
        setTimeout(() => {
          const mockReadTimeData: ChartData = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: t("common.readTime"),
                data: [3.2, 2.8, 4.5, 3.9, 5.1, 4.2, 3.7],
                backgroundColor: [getRandomColor()],
                borderColor: [getRandomColor()],
                borderWidth: 1,
              },
            ],
          };

          const mockClickThroughData: ChartData = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: t("common.clickThrough"),
                data: [12, 19, 15, 22, 18, 25, 20],
                backgroundColor: [getRandomColor()],
                borderColor: [getRandomColor()],
                borderWidth: 1,
              },
            ],
          };

          const mockShareCountData: ChartData = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: t("common.shareCount"),
                data: [5, 8, 6, 9, 7, 11, 10],
                backgroundColor: [getRandomColor()],
                borderColor: [getRandomColor()],
                borderWidth: 1,
              },
            ],
          };

          setMetricsData({
            readTime: mockReadTimeData,
            clickThrough: mockClickThroughData,
            shareCount: mockShareCountData,
          });

          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        showNotification("error", t("errors.general"));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t, showNotification]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("common.dashboard")}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("common.readTime")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("common.clickThrough")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("common.shareCount")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("common.readTime")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementMetricsChart data={metricsData.readTime} />
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.weeklyStats")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("common.clickThrough")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementMetricsChart data={metricsData.clickThrough} />
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.weeklyStats")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("common.shareCount")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EngagementMetricsChart data={metricsData.shareCount} />
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.weeklyStats")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("common.latestGenerations")}</CardTitle>
            <CardDescription>
              {t("dashboard.recentlyGeneratedContent")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LatestGenerations />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
