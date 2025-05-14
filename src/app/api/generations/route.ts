import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for GET request
const getGenerationsSchema = z.object({
  toolType: z.enum(["blog", "caption"]).optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
  page: z.coerce.number().min(1).default(1),
});

// Schema for POST request
const createGenerationSchema = z.object({
  toolType: z.enum(["blog", "caption"]),
  inputParams: z.record(z.any()),
  outputContent: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedParams = getGenerationsSchema.safeParse({
      toolType: searchParams.get("toolType"),
      limit: searchParams.get("limit"),
      page: searchParams.get("page"),
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: validatedParams.error.message },
        { status: 400 }
      );
    }

    const { toolType, limit, page } = validatedParams.data;
    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(toolType ? { toolType } : {}),
    };

    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.generation.count({ where }),
    ]);

    return NextResponse.json({
      generations,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching generations:", error);
    return NextResponse.json(
      { error: "Failed to fetch generations" },
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
    const validatedBody = createGenerationSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: validatedBody.error.message },
        { status: 400 }
      );
    }

    const { toolType, inputParams, outputContent } = validatedBody.data;

    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        toolType,
        inputParams,
        outputContent,
      },
    });

    return NextResponse.json(generation);
  } catch (error) {
    console.error("Error creating generation:", error);
    return NextResponse.json(
      { error: "Failed to create generation" },
      { status: 500 }
    );
  }
}
