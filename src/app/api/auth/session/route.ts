import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: session.user
    }, { status: 200 });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({
      error: "Failed to get session",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
