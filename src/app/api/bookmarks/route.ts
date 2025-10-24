import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookmarks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single bookmark by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { 
            error: 'Valid ID is required',
            code: 'INVALID_ID' 
          },
          { status: 400 }
        );
      }

      const bookmark = await db.select()
        .from(bookmarks)
        .where(eq(bookmarks.id, parseInt(id)))
        .limit(1);

      if (bookmark.length === 0) {
        return NextResponse.json(
          { error: 'Bookmark not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(bookmark[0], { status: 200 });
    }

    // List bookmarks with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');

    let query = db.select().from(bookmarks);

    // Build filter conditions
    const conditions = [];
    
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { 
            error: 'Valid userId is required',
            code: 'INVALID_USER_ID' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(bookmarks.userId, parseInt(userId)));
    }

    if (jobId) {
      if (isNaN(parseInt(jobId))) {
        return NextResponse.json(
          { 
            error: 'Valid jobId is required',
            code: 'INVALID_JOB_ID' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(bookmarks.jobId, parseInt(jobId)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, jobId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'userId is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    if (!jobId) {
      return NextResponse.json(
        { 
          error: 'jobId is required',
          code: 'MISSING_JOB_ID' 
        },
        { status: 400 }
      );
    }

    // Validate field types
    if (isNaN(parseInt(userId))) {
      return NextResponse.json(
        { 
          error: 'userId must be a valid integer',
          code: 'INVALID_USER_ID' 
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(jobId))) {
      return NextResponse.json(
        { 
          error: 'jobId must be a valid integer',
          code: 'INVALID_JOB_ID' 
        },
        { status: 400 }
      );
    }

    // Create new bookmark
    const newBookmark = await db.insert(bookmarks)
      .values({
        userId: parseInt(userId),
        jobId: parseInt(jobId),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newBookmark[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if bookmark exists
    const existingBookmark = await db.select()
      .from(bookmarks)
      .where(eq(bookmarks.id, parseInt(id)))
      .limit(1);

    if (existingBookmark.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { userId, jobId } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (userId !== undefined) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { 
            error: 'userId must be a valid integer',
            code: 'INVALID_USER_ID' 
          },
          { status: 400 }
        );
      }
      updates.userId = parseInt(userId);
    }

    if (jobId !== undefined) {
      if (isNaN(parseInt(jobId))) {
        return NextResponse.json(
          { 
            error: 'jobId must be a valid integer',
            code: 'INVALID_JOB_ID' 
          },
          { status: 400 }
        );
      }
      updates.jobId = parseInt(jobId);
    }

    // If no valid updates provided
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid fields to update',
          code: 'NO_UPDATES' 
        },
        { status: 400 }
      );
    }

    // Update bookmark
    const updatedBookmark = await db.update(bookmarks)
      .set(updates)
      .where(eq(bookmarks.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedBookmark[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if bookmark exists
    const existingBookmark = await db.select()
      .from(bookmarks)
      .where(eq(bookmarks.id, parseInt(id)))
      .limit(1);

    if (existingBookmark.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    // Delete bookmark
    const deletedBookmark = await db.delete(bookmarks)
      .where(eq(bookmarks.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Bookmark deleted successfully',
        bookmark: deletedBookmark[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}