import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

const JOB_TYPES = ['full-time', 'part-time', 'internship', 'contract'] as const;
const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior'] as const;
const JOB_STATUSES = ['active', 'closed'] as const;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single job by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const job = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, parseInt(id)))
        .limit(1);

      if (job.length === 0) {
        return NextResponse.json(
          { error: 'Job not found', code: 'JOB_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(job[0], { status: 200 });
    }

    // List jobs with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const status = searchParams.get('status');

    let query = db.select().from(jobs).orderBy(desc(jobs.postedDate));

    // Apply status filter if provided
    if (status) {
      if (!JOB_STATUSES.includes(status as any)) {
        return NextResponse.json(
          { error: 'Invalid status value', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      query = query.where(eq(jobs.status, status));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      company,
      description,
      location,
      salaryMin,
      salaryMax,
      jobType,
      experienceLevel,
      applicationDeadline,
    } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!company || !company.trim()) {
      return NextResponse.json(
        { error: 'Company is required', code: 'MISSING_COMPANY' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!location || !location.trim()) {
      return NextResponse.json(
        { error: 'Location is required', code: 'MISSING_LOCATION' },
        { status: 400 }
      );
    }

    if (!jobType || !jobType.trim()) {
      return NextResponse.json(
        { error: 'Job type is required', code: 'MISSING_JOB_TYPE' },
        { status: 400 }
      );
    }

    if (!experienceLevel || !experienceLevel.trim()) {
      return NextResponse.json(
        { error: 'Experience level is required', code: 'MISSING_EXPERIENCE_LEVEL' },
        { status: 400 }
      );
    }

    // Validate jobType enum
    if (!JOB_TYPES.includes(jobType)) {
      return NextResponse.json(
        {
          error: `Job type must be one of: ${JOB_TYPES.join(', ')}`,
          code: 'INVALID_JOB_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate experienceLevel enum
    if (!EXPERIENCE_LEVELS.includes(experienceLevel)) {
      return NextResponse.json(
        {
          error: `Experience level must be one of: ${EXPERIENCE_LEVELS.join(', ')}`,
          code: 'INVALID_EXPERIENCE_LEVEL',
        },
        { status: 400 }
      );
    }

    const currentTimestamp = new Date().toISOString();

    // Prepare insert data
    const insertData: any = {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      location: location.trim(),
      jobType,
      experienceLevel,
      status: 'active',
      postedDate: currentTimestamp,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    // Add optional fields if provided
    if (salaryMin !== undefined && salaryMin !== null) {
      insertData.salaryMin = parseInt(salaryMin);
    }

    if (salaryMax !== undefined && salaryMax !== null) {
      insertData.salaryMax = parseInt(salaryMax);
    }

    if (applicationDeadline) {
      insertData.applicationDeadline = applicationDeadline;
    }

    const newJob = await db.insert(jobs).values(insertData).returning();

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, parseInt(id)))
      .limit(1);

    if (existingJob.length === 0) {
      return NextResponse.json(
        { error: 'Job not found', code: 'JOB_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and add fields to update
    if (body.title !== undefined) {
      if (!body.title.trim()) {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = body.title.trim();
    }

    if (body.company !== undefined) {
      if (!body.company.trim()) {
        return NextResponse.json(
          { error: 'Company cannot be empty', code: 'INVALID_COMPANY' },
          { status: 400 }
        );
      }
      updates.company = body.company.trim();
    }

    if (body.description !== undefined) {
      if (!body.description.trim()) {
        return NextResponse.json(
          { error: 'Description cannot be empty', code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updates.description = body.description.trim();
    }

    if (body.location !== undefined) {
      if (!body.location.trim()) {
        return NextResponse.json(
          { error: 'Location cannot be empty', code: 'INVALID_LOCATION' },
          { status: 400 }
        );
      }
      updates.location = body.location.trim();
    }

    if (body.jobType !== undefined) {
      if (!JOB_TYPES.includes(body.jobType)) {
        return NextResponse.json(
          {
            error: `Job type must be one of: ${JOB_TYPES.join(', ')}`,
            code: 'INVALID_JOB_TYPE',
          },
          { status: 400 }
        );
      }
      updates.jobType = body.jobType;
    }

    if (body.experienceLevel !== undefined) {
      if (!EXPERIENCE_LEVELS.includes(body.experienceLevel)) {
        return NextResponse.json(
          {
            error: `Experience level must be one of: ${EXPERIENCE_LEVELS.join(', ')}`,
            code: 'INVALID_EXPERIENCE_LEVEL',
          },
          { status: 400 }
        );
      }
      updates.experienceLevel = body.experienceLevel;
    }

    if (body.status !== undefined) {
      if (!JOB_STATUSES.includes(body.status)) {
        return NextResponse.json(
          {
            error: `Status must be one of: ${JOB_STATUSES.join(', ')}`,
            code: 'INVALID_STATUS',
          },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }

    if (body.salaryMin !== undefined) {
      updates.salaryMin = body.salaryMin !== null ? parseInt(body.salaryMin) : null;
    }

    if (body.salaryMax !== undefined) {
      updates.salaryMax = body.salaryMax !== null ? parseInt(body.salaryMax) : null;
    }

    if (body.applicationDeadline !== undefined) {
      updates.applicationDeadline = body.applicationDeadline;
    }

    if (body.postedDate !== undefined) {
      updates.postedDate = body.postedDate;
    }

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    const updatedJob = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedJob[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if job exists before deleting
    const existingJob = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, parseInt(id)))
      .limit(1);

    if (existingJob.length === 0) {
      return NextResponse.json(
        { error: 'Job not found', code: 'JOB_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedJob = await db
      .delete(jobs)
      .where(eq(jobs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Job deleted successfully',
        job: deletedJob[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}