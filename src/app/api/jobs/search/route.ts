import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { eq, like, and, or, gte, lte, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Filter parameters
    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType');
    const experienceLevel = searchParams.get('experienceLevel');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');
    const status = searchParams.get('status') ?? 'active';
    const search = searchParams.get('search');

    // Sort parameters
    const sortField = searchParams.get('sort') ?? 'postedDate';
    const sortOrder = searchParams.get('order') ?? 'desc';

    // Validate jobType enum
    const validJobTypes = ['full-time', 'part-time', 'internship', 'contract'];
    if (jobType && !validJobTypes.includes(jobType)) {
      return NextResponse.json({
        error: 'Invalid jobType. Must be one of: full-time, part-time, internship, contract',
        code: 'INVALID_JOB_TYPE'
      }, { status: 400 });
    }

    // Validate experienceLevel enum
    const validExperienceLevels = ['entry', 'mid', 'senior'];
    if (experienceLevel && !validExperienceLevels.includes(experienceLevel)) {
      return NextResponse.json({
        error: 'Invalid experienceLevel. Must be one of: entry, mid, senior',
        code: 'INVALID_EXPERIENCE_LEVEL'
      }, { status: 400 });
    }

    // Validate status enum
    const validStatuses = ['active', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({
        error: 'Invalid status. Must be one of: active, closed',
        code: 'INVALID_STATUS'
      }, { status: 400 });
    }

    // Validate sort field
    const validSortFields = ['postedDate', 'salaryMin', 'salaryMax', 'title'];
    if (!validSortFields.includes(sortField)) {
      return NextResponse.json({
        error: 'Invalid sort field. Must be one of: postedDate, salaryMin, salaryMax, title',
        code: 'INVALID_SORT_FIELD'
      }, { status: 400 });
    }

    // Validate sort order
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return NextResponse.json({
        error: 'Invalid sort order. Must be either asc or desc',
        code: 'INVALID_SORT_ORDER'
      }, { status: 400 });
    }

    // Build WHERE conditions dynamically
    const conditions = [];

    // Always filter by status (default to 'active')
    conditions.push(eq(jobs.status, status));

    // Location filter (partial match with LIKE)
    if (location) {
      conditions.push(like(jobs.location, `%${location}%`));
    }

    // Job type filter (exact match)
    if (jobType) {
      conditions.push(eq(jobs.jobType, jobType));
    }

    // Experience level filter (exact match)
    if (experienceLevel) {
      conditions.push(eq(jobs.experienceLevel, experienceLevel));
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      const salaryConditions = [];

      if (minSalary && maxSalary) {
        // Jobs where salary range overlaps with filter range
        salaryConditions.push(
          or(
            and(
              gte(jobs.salaryMin, parseInt(minSalary)),
              lte(jobs.salaryMin, parseInt(maxSalary))
            ),
            and(
              gte(jobs.salaryMax, parseInt(minSalary)),
              lte(jobs.salaryMax, parseInt(maxSalary))
            ),
            and(
              lte(jobs.salaryMin, parseInt(minSalary)),
              gte(jobs.salaryMax, parseInt(maxSalary))
            )
          )
        );
      } else if (minSalary) {
        // Filter jobs where salaryMax is at least minSalary
        salaryConditions.push(gte(jobs.salaryMax, parseInt(minSalary)));
      } else if (maxSalary) {
        // Filter jobs where salaryMin is at most maxSalary
        salaryConditions.push(lte(jobs.salaryMin, parseInt(maxSalary)));
      }

      if (salaryConditions.length > 0) {
        conditions.push(...salaryConditions);
      }
    }

    // Search filter (case-insensitive LIKE on title and company)
    if (search) {
      conditions.push(
        or(
          like(jobs.title, `%${search}%`),
          like(jobs.company, `%${search}%`)
        )
      );
    }

    // Build the query
    let query = db.select().from(jobs);

    // Apply WHERE conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = {
      postedDate: jobs.postedDate,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      title: jobs.title
    }[sortField];

    if (sortOrder === 'desc') {
      query = query.orderBy(desc(sortColumn));
    } else {
      query = query.orderBy(asc(sortColumn));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}