import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } } // <-- This line is changed
) {
  try {
    const { userId } = context.params; // <-- This line is changed
    const { searchParams } = new URL(request.url);

    // Validate userId
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    const parsedUserId = parseInt(userId);

    // Get query parameters
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Build query conditions
    const conditions = [eq(applications.userId, parsedUserId)];

    if (status) {
      conditions.push(eq(applications.status, status));
    }

    // Fetch applications with filters
    const userApplications = await db
      .select()
      .from(applications)
      .where(and(...conditions))
      .orderBy(desc(applications.appliedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for the user with same filters (simple count)
    const totalRows = await db
      .select()
      .from(applications)
      .where(and(...conditions));

    const total = totalRows.length;

    // Return 200 OK with an empty array if no applications are found
    // (This replaces the 404 error, which is better practice)
    return NextResponse.json(
      {
        applications: userApplications,
        total: total,
        limit,
        offset
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET applications error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message
      },
      { status: 500 }
    );
  }
}

