import { NextRequest, NextResponse } from 'next/server';
// --- CORRECTED IMPORTS (no 'server' folder) ---
import { db } from '../../../../../db'; // Correct path for DB instance
import { applications } from '../../../../../db/schema'; // Correct path for schema
import { eq, and, desc, count } from 'drizzle-orm'; // Added 'count'

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
    const limitQuery = parseInt(searchParams.get('limit') ?? '20', 10);
    const limit = isNaN(limitQuery) ? 20 : Math.min(limitQuery, 100);

    const offsetQuery = parseInt(searchParams.get('offset') ?? '0', 10);
    const offset = isNaN(offsetQuery) ? 0 : offsetQuery;

    // Build query conditions
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

    // --- EFFICIENT COUNT QUERY ---
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
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

