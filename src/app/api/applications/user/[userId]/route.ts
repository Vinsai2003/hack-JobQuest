import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);

    // ✅ Validate userId (ensure it's digits only)
    if (!/^\d+$/.test(userId)) {
      return NextResponse.json(
        {
          error: "Valid user ID is required",
          code: "INVALID_USER_ID",
        },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId, 10);

    // ✅ Get query parameters
    const status = searchParams.get("status");

    // ✅ Parse limit (default 20, max 100)
    const limitQuery = parseInt(searchParams.get("limit") ?? "20", 10);
    const limit = isNaN(limitQuery) ? 20 : Math.min(limitQuery, 100);

    // ✅ Parse offset (default 0)
    const offsetQuery = parseInt(searchParams.get("offset") ?? "0", 10);
    const offset = isNaN(offsetQuery) ? 0 : offsetQuery;

    // ✅ Build query conditions
    const conditions = [eq(applications.userId, parsedUserId)];
    if (status) {
      conditions.push(eq(applications.status, status));
    }

    // ✅ Fetch applications with filters (paginated)
    const userApplications = await db
      .select()
      .from(applications)
      .where(and(...conditions))
      .orderBy(desc(applications.appliedAt))
      .limit(limit)
      .offset(offset);

    // ✅ Get total count for same filters
    const totalResult = await db
      .select({ count: count() })
      .from(applications)
      .where(and(...conditions));

    const total = totalResult[0]?.count ?? 0;

    // ✅ Return response
    return NextResponse.json(
      {
        applications: userApplications,
        total,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET applications error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
