import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureConnection } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection is active before checking session
    await ensureConnection();

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

    // Try to reconnect if there was a database error
    try {
      await ensureConnection();
      const session = await auth();

      if (!session) {
        return NextResponse.json({ authenticated: false }, { status: 200 });
      }

      return NextResponse.json({
        authenticated: true,
        user: session.user
      }, { status: 200 });
    } catch (retryError) {
      console.error("Session retry error:", retryError);
      return NextResponse.json({
        error: "Failed to get session",
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
  }
}
