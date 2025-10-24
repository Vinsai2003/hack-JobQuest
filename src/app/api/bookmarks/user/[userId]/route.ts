import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookmarks } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

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

    const userIdInt = parseInt(userId);

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
      .where(eq(bookmarks.userId, userIdInt))
      .orderBy(desc(bookmarks.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count of bookmarks for this user
    const totalResult = await db
      .select({ count: count() })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userIdInt));

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