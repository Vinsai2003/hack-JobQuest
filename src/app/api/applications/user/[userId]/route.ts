import { NextRequest, NextResponse } from 'next/server';

// --- FIXED: Using the correct '@/' alias ---
import { db } from '@/db';
import { applications } from '@/db/schema';
// ------------------------------------------

import { eq, and, desc, count } from 'drizzle-orm';

// This is the GET handler for fetching applications for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);

    // Validate userId (ensure it's digits only)
    if (!/^\d+$/.test(userId)) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId, 10);

    // Get query parameters
    const status = searchParams.get('status');

    // Parse limit, default to 20, max of 100
    const limitQuery = parseInt(searchParams.get('limit') ?? '20', 10);
    const limit = isNaN(limitQuery) ? 20 : Math.min(limitQuery, 100);

    // Parse offset, default to 0
    const offsetQuery = parseInt(searchParams.get('offset') ?? '0', 10);
    const offset = isNaN(offsetQuery) ? 0 : offsetQuery;

    // Build query conditions
    // This correctly uses the 'userId' property from your Drizzle schema
    const conditions = [eq(applications.userId, parsedUserId)];

    if (status) {
      conditions.push(eq(applications.status, status));
    }

    // Fetch applications with filters (paginated)
    const userApplications = await db
      .select()
      .from(applications)
      .where(and(...conditions))
      .orderBy(desc(applications.appliedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for the user with same filters
    const totalResult = await db
      .select({ count: count() }) // Use count() for efficiency
      .from(applications)
      .where(and(...conditions));

    const total = totalResult[0]?.count ?? 0;

    // Return 200 OK
    return NextResponse.json(
      {
        applications: userApplications,
        total: total,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET applications error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

