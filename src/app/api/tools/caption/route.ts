import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateSocialCaptions } from "@/lib/openai";
import { z } from "zod";

// Schema for POST request
const captionSchema = z.object({
  productTheme: z.string().min(3).max(100),
  platform: z.enum(["twitter", "linkedin", "instagram", "facebook"]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedBody = captionSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: validatedBody.error.message },
        { status: 400 }
      );
    }

    const { productTheme, platform } = validatedBody.data;

    // Generate captions
    const captions = await generateSocialCaptions({ productTheme, platform });

    return NextResponse.json({ captions });
  } catch (error) {
    console.error("Error generating captions:", error);
    return NextResponse.json(
      { error: "Failed to generate captions" },
      { status: 500 }
    );
  }
}
