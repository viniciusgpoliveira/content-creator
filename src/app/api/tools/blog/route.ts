import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateBlogPost } from "@/lib/openai";
import { z } from "zod";

// Schema for POST request
const blogPostSchema = z.object({
  topic: z.string().min(3).max(100),
  tone: z.enum(["professional", "casual", "humorous", "formal", "friendly"]),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  console.log("Blog API route called");
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.log("Unauthorized - no user session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);
    const validatedBody = blogPostSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: validatedBody.error.message },
        { status: 400 }
      );
    }

    const { topic, tone, description } = validatedBody.data;

    console.log("Generating blog post with:", { topic, tone, description });
    // Generate blog post content
    const content = await generateBlogPost({ topic, tone, description });
    console.log("Blog post generated successfully");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error generating blog post:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}
