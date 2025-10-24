import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookmarks } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } } // <-- This is the corrected type
) {
  try {
    const { userId } = context.params; // <-- This is the corrected way to access params

    // Validate userId
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    // Keep userId as a string because bookmarks.userId is a string column
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get('limit') ?? '50'),
      100
    );
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Fetch bookmarks for the user
    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count of bookmarks for this user
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId));

    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json(
      {
        bookmarks: userBookmarks,
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET bookmarks error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

