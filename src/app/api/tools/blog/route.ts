import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateBlogPost } from "@/lib/openai";
import { z } from "zod";

// Schema for POST request
const blogPostSchema = z.object({
  topic: z.string().min(3).max(100),
  tone: z.enum(["professional", "casual", "humorous", "formal", "friendly"]),
  keywords: z.array(z.string()).min(1).max(10),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedBody = blogPostSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: validatedBody.error.message },
        { status: 400 }
      );
    }

    const { topic, tone, keywords } = validatedBody.data;

    // Generate blog post content
    const content = await generateBlogPost({ topic, tone, keywords });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error generating blog post:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}
