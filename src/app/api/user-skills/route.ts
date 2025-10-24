import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSkills } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single record by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(userSkills)
        .where(eq(userSkills.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'User skill not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with optional filtering
    let query = db.select().from(userSkills);

    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID' 
        }, { status: 400 });
      }
      query = query.where(eq(userSkills.userId, parseInt(userId)));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skillId, proficiencyLevel } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: 'userId is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    if (!skillId) {
      return NextResponse.json({ 
        error: 'skillId is required',
        code: 'MISSING_SKILL_ID' 
      }, { status: 400 });
    }

    if (!proficiencyLevel) {
      return NextResponse.json({ 
        error: 'proficiencyLevel is required',
        code: 'MISSING_PROFICIENCY_LEVEL' 
      }, { status: 400 });
    }

    // Validate userId is valid integer
    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: 'userId must be a valid integer',
        code: 'INVALID_USER_ID' 
      }, { status: 400 });
    }

    // Validate skillId is valid integer
    if (isNaN(parseInt(skillId))) {
      return NextResponse.json({ 
        error: 'skillId must be a valid integer',
        code: 'INVALID_SKILL_ID' 
      }, { status: 400 });
    }

    // Validate proficiencyLevel enum
    if (!VALID_PROFICIENCY_LEVELS.includes(proficiencyLevel)) {
      return NextResponse.json({ 
        error: `proficiencyLevel must be one of: ${VALID_PROFICIENCY_LEVELS.join(', ')}`,
        code: 'INVALID_PROFICIENCY_LEVEL' 
      }, { status: 400 });
    }

    // Create new user skill
    const newUserSkill = await db.insert(userSkills)
      .values({
        userId: parseInt(userId),
        skillId: parseInt(skillId),
        proficiencyLevel: proficiencyLevel
      })
      .returning();

    return NextResponse.json(newUserSkill[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(userSkills)
      .where(eq(userSkills.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'User skill not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { userId, skillId, proficiencyLevel } = body;

    // Build update object
    const updates: Partial<typeof userSkills.$inferInsert> = {};

    // Validate and add userId if provided
    if (userId !== undefined) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: 'userId must be a valid integer',
          code: 'INVALID_USER_ID' 
        }, { status: 400 });
      }
      updates.userId = parseInt(userId);
    }

    // Validate and add skillId if provided
    if (skillId !== undefined) {
      if (isNaN(parseInt(skillId))) {
        return NextResponse.json({ 
          error: 'skillId must be a valid integer',
          code: 'INVALID_SKILL_ID' 
        }, { status: 400 });
      }
      updates.skillId = parseInt(skillId);
    }

    // Validate and add proficiencyLevel if provided
    if (proficiencyLevel !== undefined) {
      if (!VALID_PROFICIENCY_LEVELS.includes(proficiencyLevel)) {
        return NextResponse.json({ 
          error: `proficiencyLevel must be one of: ${VALID_PROFICIENCY_LEVELS.join(', ')}`,
          code: 'INVALID_PROFICIENCY_LEVEL' 
        }, { status: 400 });
      }
      updates.proficiencyLevel = proficiencyLevel;
    }

    // Update the record
    const updated = await db.update(userSkills)
      .set(updates)
      .where(eq(userSkills.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(userSkills)
      .where(eq(userSkills.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'User skill not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete the record
    const deleted = await db.delete(userSkills)
      .where(eq(userSkills.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'User skill deleted successfully',
      deletedUserSkill: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}