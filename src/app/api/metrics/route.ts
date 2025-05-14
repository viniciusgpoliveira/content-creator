import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for GET request
const getMetricsSchema = z.object({
  metricType: z.enum(["readTime", "clickThrough", "shareCount"]).optional(),
  period: z.enum(["day", "week", "month"]).default("week"),
});

// Schema for POST request
const createMetricSchema = z.object({
  metricType: z.enum(["readTime", "clickThrough", "shareCount"]),
  value: z.number().min(0),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedParams = getMetricsSchema.safeParse({
      metricType: searchParams.get("metricType"),
      period: searchParams.get("period"),
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: validatedParams.error.message },
        { status: 400 }
      );
    }

    const { metricType, period } = validatedParams.data;

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    if (period === "day") {
      startDate.setDate(now.getDate() - 1);
    } else if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
    }

    const where = {
      userId: session.user.id,
      timestamp: {
        gte: startDate,
      },
      ...(metricType ? { metricType } : {}),
    };

    const metrics = await prisma.engagementMetric.findMany({
      where,
      orderBy: { timestamp: "asc" },
    });

    // If no specific metric type was requested, group by metric type
    if (!metricType) {
      const groupedMetrics = metrics.reduce((acc, metric) => {
        if (!acc[metric.metricType]) {
          acc[metric.metricType] = [];
        }
        acc[metric.metricType].push(metric);
        return acc;
      }, {} as Record<string, typeof metrics>);

      return NextResponse.json(groupedMetrics);
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedBody = createMetricSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: validatedBody.error.message },
        { status: 400 }
      );
    }

    const { metricType, value } = validatedBody.data;

    const metric = await prisma.engagementMetric.create({
      data: {
        userId: session.user.id,
        metricType,
        value,
      },
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error("Error creating metric:", error);
    return NextResponse.json(
      { error: "Failed to create metric" },
      { status: 500 }
    );
  }
}
