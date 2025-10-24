import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

const VALID_CATEGORIES = ['technical', 'soft', 'language', 'tool'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single skill by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const skill = await db
        .select()
        .from(skills)
        .where(eq(skills.id, parseInt(id)))
        .limit(1);

      if (skill.length === 0) {
        return NextResponse.json(
          { error: 'Skill not found', code: 'SKILL_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(skill[0], { status: 200 });
    }

    // List all skills with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

  let query = db.select().from(skills);

  // Build where conditions
  const conditions: any[] = [];

    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          {
            error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
            code: 'INVALID_CATEGORY',
          },
          { status: 400 }
        );
      }
      conditions.push(eq(skills.category, category));
    }

    if (search) {
      conditions.push(like(skills.name, `%${search}%`));
    }

    // Execute depending on whether conditions exist to avoid Drizzle generic issues
    let results;
    if (conditions.length > 0) {
      results = await db.select().from(skills).where(and(...conditions)).limit(limit).offset(offset);
    } else {
      results = await db.select().from(skills).limit(limit).offset(offset);
    }

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
    const { name, category } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required and must be a non-empty string', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Validate category enum
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: 'INVALID_CATEGORY',
        },
        { status: 400 }
      );
    }

    // Trim name
    const trimmedName = name.trim();

    // Check for duplicate name
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.name, trimmedName))
      .limit(1);

    if (existingSkill.length > 0) {
      return NextResponse.json(
        { error: 'A skill with this name already exists', code: 'DUPLICATE_NAME' },
        { status: 400 }
      );
    }

    // Insert new skill
    const newSkill = await db
      .insert(skills)
      .values({
        name: trimmedName,
        category: category,
      })
      .returning();

    return NextResponse.json(newSkill[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, category } = body;

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found', code: 'SKILL_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate at least one field is provided
    if (!name && !category) {
      return NextResponse.json(
        { error: 'At least one field (name or category) must be provided', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    // Build update object
    const updates: { name?: string; category?: string } = {};

    // Validate and add name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }

      const trimmedName = name.trim();

      // Check for duplicate name (excluding current skill)
      const duplicateSkill = await db
        .select()
        .from(skills)
        .where(eq(skills.name, trimmedName))
        .limit(1);

      if (duplicateSkill.length > 0 && duplicateSkill[0].id !== parseInt(id)) {
        return NextResponse.json(
          { error: 'A skill with this name already exists', code: 'DUPLICATE_NAME' },
          { status: 400 }
        );
      }

      updates.name = trimmedName;
    }

    // Validate and add category if provided
    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim() === '') {
        return NextResponse.json(
          { error: 'Category must be a non-empty string', code: 'INVALID_CATEGORY_TYPE' },
          { status: 400 }
        );
      }

      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          {
            error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
            code: 'INVALID_CATEGORY',
          },
          { status: 400 }
        );
      }

      updates.category = category;
    }

    // Update skill
    const updated = await db
      .update(skills)
      .set(updates)
      .where(eq(skills.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found', code: 'SKILL_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete skill
    const deleted = await db
      .delete(skills)
      .where(eq(skills.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Skill deleted successfully',
        skill: deleted[0],
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