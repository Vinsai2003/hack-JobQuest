import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { interviewQuestions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_CATEGORIES = ['behavioral', 'technical', 'situational'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single question by ID
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

      const question = await db.select()
        .from(interviewQuestions)
        .where(eq(interviewQuestions.id, parseInt(id)))
        .limit(1);

      if (question.length === 0) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(question[0], { status: 200 });
    }

    // List questions with filters
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const random = searchParams.get('random') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Validate filter values
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { 
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: 'INVALID_CATEGORY' 
        },
        { status: 400 }
      );
    }

    if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json(
        { 
          error: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
          code: 'INVALID_DIFFICULTY' 
        },
        { status: 400 }
      );
    }

    // Build dynamic query based on filters
    let query = db.select().from(interviewQuestions);

    const conditions = [];
    if (category) {
      conditions.push(eq(interviewQuestions.category, category));
    }
    if (difficulty) {
      conditions.push(eq(interviewQuestions.difficulty, difficulty));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Execute query
    let results = await query;

    // Handle random selection
    if (random) {
      // Shuffle the results using Fisher-Yates algorithm
      for (let i = results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [results[i], results[j]] = [results[j], results[i]];
      }
      // Apply limit after shuffling
      results = results.slice(0, limit);
    } else {
      // Apply standard pagination
      results = results.slice(offset, offset + limit);
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