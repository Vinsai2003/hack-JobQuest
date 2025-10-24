import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
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

    // Get total count for the user with same filters
    const totalApplications = await db
      .select()
      .from(applications)
      .where(and(...conditions));

    if (userApplications.length === 0) {
      return NextResponse.json(
        {
          error: 'No applications found for this user',
          code: 'NO_APPLICATIONS_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        applications: userApplications,
        total: totalApplications.length,
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