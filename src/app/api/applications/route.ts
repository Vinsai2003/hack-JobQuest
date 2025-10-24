import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_STATUSES = ['draft', 'submitted', 'under_review', 'interview', 'rejected', 'accepted'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const application = await db.select()
        .from(applications)
        .where(eq(applications.id, parseInt(id)))
        .limit(1);

      if (application.length === 0) {
        return NextResponse.json({ 
          error: 'Application not found',
          code: 'NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json(application[0], { status: 200 });
    }

    // List with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('userId');
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');

    let query: any = db.select().from(applications);

  // Build filter conditions
  const conditions: any[] = [];
    
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(applications.userId, parseInt(userId)));
    }

    if (jobId) {
      if (isNaN(parseInt(jobId))) {
        return NextResponse.json({ 
          error: "Valid jobId is required",
          code: "INVALID_JOB_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(applications.jobId, parseInt(jobId)));
    }

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ 
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      conditions.push(eq(applications.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, jobId, coverLetter, status } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!jobId) {
      return NextResponse.json({ 
        error: "jobId is required",
        code: "MISSING_JOB_ID" 
      }, { status: 400 });
    }

    // Validate userId is a valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "userId must be a valid integer",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Validate jobId is a valid integer
    if (isNaN(parseInt(jobId))) {
      return NextResponse.json({ 
        error: "jobId must be a valid integer",
        code: "INVALID_JOB_ID" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Prepare insert data
    const insertData: any = {
      userId: parseInt(userId),
      jobId: parseInt(jobId),
      status: status || 'draft',
      appliedAt: now,
      updatedAt: now
    };

    if (coverLetter !== undefined && coverLetter !== null) {
      insertData.coverLetter = coverLetter;
    }

    const newApplication = await db.insert(applications)
      .values(insertData)
      .returning();

    return NextResponse.json(newApplication[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { status, coverLetter } = body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Check if application exists
    const existing = await db.select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Application not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (status !== undefined) {
      updateData.status = status;
    }

    if (coverLetter !== undefined) {
      updateData.coverLetter = coverLetter;
    }

    const updated = await db.update(applications)
      .set(updateData)
      .where(eq(applications.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if application exists
    const existing = await db.select()
      .from(applications)
      .where(eq(applications.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Application not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    const deleted = await db.delete(applications)
      .where(eq(applications.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Application deleted successfully',
      application: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}