import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma, ensureConnection } from "@/lib/prisma";
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

    // Log the received parameters for debugging
    console.log("Received parameters:", {
      toolType: searchParams.get("toolType"),
      limit: searchParams.get("limit"),
      page: searchParams.get("page"),
    });

    // Use default values if parameters are invalid
    let toolType = searchParams.get("toolType");
    if (toolType && !['blog', 'caption'].includes(toolType)) {
      toolType = null;
    }

    let limit = 10;
    try {
      const limitParam = searchParams.get("limit");
      if (limitParam) {
        const parsedLimit = parseInt(limitParam, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 50) {
          limit = parsedLimit;
        }
      }
    } catch (e) {
      console.warn("Invalid limit parameter");
    }

    let page = 1;
    try {
      const pageParam = searchParams.get("page");
      if (pageParam) {
        const parsedPage = parseInt(pageParam, 10);
        if (!isNaN(parsedPage) && parsedPage > 0) {
          page = parsedPage;
        }
      }
    } catch (e) {
      console.warn("Invalid page parameter");
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build the where clause
    const where = {
      userId: session.user.id,
      ...(toolType ? { toolType } : {}),
    };

    console.log("Using parameters:", { toolType, limit, page, skip });

    try {
      // Ensure database connection is active before querying
      await ensureConnection();

      try {
        const [generations, total] = await Promise.all([
          prisma.generation.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            skip,
          }),
          prisma.generation.count({ where }),
        ]);

        console.log(`Found ${generations.length} generations out of ${total} total`);

        return NextResponse.json({
          generations,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            page,
            limit,
          },
        });
      } catch (dbError) {
        console.error("Database error, attempting reconnection:", dbError);

        // Try to reconnect and retry the query
        await ensureConnection();

        // Execute queries separately after reconnection
        const generations = await prisma.generation.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip,
        });

        const total = await prisma.generation.count({ where });

        console.log(`After reconnection: Found ${generations.length} generations out of ${total} total`);

        return NextResponse.json({
          generations,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            page,
            limit,
          },
        });
      }
    } catch (dbError) {
      console.error("Database error after reconnection attempt:", dbError);
      return NextResponse.json(
        { error: "Database error", message: "Failed to fetch generations from database" },
        { status: 500 }
      );
    }
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

    // Ensure database connection is active before creating
    await ensureConnection();

    try {
      const generation = await prisma.generation.create({
        data: {
          userId: session.user.id,
          toolType,
          inputParams,
          outputContent,
        },
      });

      return NextResponse.json(generation);
    } catch (dbError) {
      console.error("Database error in create, attempting reconnection:", dbError);

      // Try to reconnect and retry
      await ensureConnection();

      const generation = await prisma.generation.create({
        data: {
          userId: session.user.id,
          toolType,
          inputParams,
          outputContent,
        },
      });

      return NextResponse.json(generation);
    }
  } catch (error) {
    console.error("Error creating generation:", error);
    return NextResponse.json(
      { error: "Failed to create generation" },
      { status: 500 }
    );
  }
}
