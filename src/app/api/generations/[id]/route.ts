import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop();
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const generation = await prisma.generation.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    return NextResponse.json(generation);
  } catch (error) {
    console.error("Error fetching generation:", error);
    return NextResponse.json(
      { error: "Failed to fetch generation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split('/').pop();
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if the generation exists and belongs to the user
    const generation = await prisma.generation.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    // Delete the generation
    await prisma.generation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Generation deleted successfully" });
  } catch (error) {
    console.error("Error deleting generation:", error);
    return NextResponse.json(
      { error: "Failed to delete generation" },
      { status: 500 }
    );
  }
}
