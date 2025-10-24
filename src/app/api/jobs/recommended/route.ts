import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs, userSkills, jobSkills, skills } from '@/db/schema';
import { eq, inArray, and } from 'drizzle-orm';

interface MatchingSkill {
  skillId: number;
  skillName: string;
  required: boolean;
  userProficiency: string;
}

interface JobRecommendation {
  job: any;
  matchScore: number;
  matchingSkills: MatchingSkill[];
  totalRequiredSkills: number;
  matchedRequiredSkills: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const experienceLevel = searchParams.get('experienceLevel');
    const jobType = searchParams.get('jobType');

    // Validate userId
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { 
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID' 
        },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);

    // Step 1: Get all skills for the user
    const userSkillsData = await db
      .select({
        skillId: userSkills.skillId,
        proficiencyLevel: userSkills.proficiencyLevel,
        skillName: skills.name,
      })
      .from(userSkills)
      .innerJoin(skills, eq(userSkills.skillId, skills.id))
      .where(eq(userSkills.userId, userIdNum));

    // If user has no skills, return empty array
    if (userSkillsData.length === 0) {
      return NextResponse.json({
        message: 'No skills found for this user. Please add skills to get job recommendations.',
        recommendations: []
      });
    }

    // Get user skill IDs for filtering
    const userSkillIds = userSkillsData.map(us => us.skillId);

    // Create a map for quick lookup of user skills
    const userSkillMap = new Map(
      userSkillsData.map(us => [us.skillId, { proficiency: us.proficiencyLevel, name: us.skillName }])
    );

    // Step 2: Get all active jobs with their required skills
    let jobsQuery = db
      .select()
      .from(jobs)
      .where(eq(jobs.status, 'active'));

    // Apply optional filters
    if (experienceLevel) {
      jobsQuery = db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.status, 'active'),
            eq(jobs.experienceLevel, experienceLevel)
          )
        );
    }

    if (jobType && experienceLevel) {
      jobsQuery = db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.status, 'active'),
            eq(jobs.experienceLevel, experienceLevel),
            eq(jobs.jobType, jobType)
          )
        );
    } else if (jobType) {
      jobsQuery = db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.status, 'active'),
            eq(jobs.jobType, jobType)
          )
        );
    }

    const activeJobs = await jobsQuery;

    if (activeJobs.length === 0) {
      return NextResponse.json([]);
    }

    // Get job IDs
    const jobIds = activeJobs.map(j => j.id);

    // Step 3: Get all job skills for these jobs
    const jobSkillsData = await db
      .select({
        jobId: jobSkills.jobId,
        skillId: jobSkills.skillId,
        required: jobSkills.required,
        skillName: skills.name,
      })
      .from(jobSkills)
      .innerJoin(skills, eq(jobSkills.skillId, skills.id))
      .where(inArray(jobSkills.jobId, jobIds));

    // Create a map of job skills grouped by jobId
    const jobSkillsMap = new Map<number, Array<{
      skillId: number;
      skillName: string;
      required: boolean;
    }>>();

    jobSkillsData.forEach(js => {
      if (!jobSkillsMap.has(js.jobId)) {
        jobSkillsMap.set(js.jobId, []);
      }
      jobSkillsMap.get(js.jobId)!.push({
        skillId: js.skillId,
        skillName: js.skillName,
        required: js.required,
      });
    });

    // Step 4: Calculate match scores for each job
    const recommendations: JobRecommendation[] = [];

    for (const job of activeJobs) {
      const jobSkillsList = jobSkillsMap.get(job.id) || [];
      
      // Skip jobs with no skills
      if (jobSkillsList.length === 0) continue;

      // Find matching skills
      const matchingSkills: MatchingSkill[] = [];
      let totalRequiredSkills = 0;
      let matchedRequiredSkills = 0;

      for (const jobSkill of jobSkillsList) {
        if (jobSkill.required) {
          totalRequiredSkills++;
        }

        if (userSkillIds.includes(jobSkill.skillId)) {
          const userSkillInfo = userSkillMap.get(jobSkill.skillId)!;
          
          matchingSkills.push({
            skillId: jobSkill.skillId,
            skillName: jobSkill.skillName,
            required: jobSkill.required,
            userProficiency: userSkillInfo.proficiency,
          });

          if (jobSkill.required) {
            matchedRequiredSkills++;
          }
        }
      }

      // Only include jobs with at least one matching skill
      if (matchingSkills.length === 0) continue;

      // Calculate match score
      // Base score: percentage of job skills matched
      const baseScore = (matchingSkills.length / jobSkillsList.length) * 100;
      
      // Bonus for required skills (up to 20 points)
      let requiredBonus = 0;
      if (totalRequiredSkills > 0) {
        requiredBonus = (matchedRequiredSkills / totalRequiredSkills) * 20;
      }

      // Proficiency bonus (up to 10 points based on average proficiency)
      const proficiencyScores: { [key: string]: number } = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3,
        'expert': 4,
      };
      
      const avgProficiency = matchingSkills.reduce((sum, skill) => {
        const score = proficiencyScores[skill.userProficiency.toLowerCase()] || 1;
        return sum + score;
      }, 0) / matchingSkills.length;
      
      const proficiencyBonus = (avgProficiency / 4) * 10;

      // Final score (capped at 100)
      const matchScore = Math.min(baseScore + requiredBonus + proficiencyBonus, 100);

      recommendations.push({
        job,
        matchScore: Math.round(matchScore * 100) / 100, // Round to 2 decimal places
        matchingSkills,
        totalRequiredSkills,
        matchedRequiredSkills,
      });
    }

    // Step 5: Sort by match score (highest first) and apply pagination
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    const paginatedRecommendations = recommendations.slice(offset, offset + limit);

    return NextResponse.json(paginatedRecommendations);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}