import { db } from '@/db';
import { interviewQuestions } from '@/db/schema';

async function main() {
    const sampleQuestions = [
        // Behavioral - Easy (3 questions)
        {
            question: 'Tell me about yourself and your background.',
            category: 'behavioral',
            difficulty: 'easy',
        },
        {
            question: 'Why do you want to work for our company?',
            category: 'behavioral',
            difficulty: 'easy',
        },
        {
            question: 'What are your greatest strengths and weaknesses?',
            category: 'behavioral',
            difficulty: 'easy',
        },
        
        // Behavioral - Medium (5 questions)
        {
            question: 'Describe a time when you faced a conflict with a team member. How did you resolve it?',
            category: 'behavioral',
            difficulty: 'medium',
        },
        {
            question: 'Tell me about a project you are most proud of. What was your role and what challenges did you overcome?',
            category: 'behavioral',
            difficulty: 'medium',
        },
        {
            question: 'Give me an example of a time when you had to work under pressure to meet a tight deadline.',
            category: 'behavioral',
            difficulty: 'medium',
        },
        {
            question: 'Describe a situation where you had to learn a new technology or skill quickly. How did you approach it?',
            category: 'behavioral',
            difficulty: 'medium',
        },
        {
            question: 'Tell me about a time when you received critical feedback. How did you handle it?',
            category: 'behavioral',
            difficulty: 'medium',
        },
        
        // Behavioral - Hard (2 questions)
        {
            question: 'Describe a situation where you had to make a difficult decision that affected your entire team. What was the outcome?',
            category: 'behavioral',
            difficulty: 'hard',
        },
        {
            question: 'Tell me about a time when you failed to meet expectations on a project. What did you learn and how did you improve?',
            category: 'behavioral',
            difficulty: 'hard',
        },
        
        // Technical - Easy (3 questions)
        {
            question: 'What is the difference between let, const, and var in JavaScript?',
            category: 'technical',
            difficulty: 'easy',
        },
        {
            question: 'Explain what SQL is and what it is used for.',
            category: 'technical',
            difficulty: 'easy',
        },
        {
            question: 'What is the difference between == and === in JavaScript?',
            category: 'technical',
            difficulty: 'easy',
        },
        
        // Technical - Medium (5 questions)
        {
            question: 'How would you optimize a slow database query? What steps would you take to identify the bottleneck?',
            category: 'technical',
            difficulty: 'medium',
        },
        {
            question: 'Explain the concept of REST APIs. What are the main HTTP methods and when would you use each?',
            category: 'technical',
            difficulty: 'medium',
        },
        {
            question: 'What is the difference between synchronous and asynchronous programming? Give examples of when you would use each.',
            category: 'technical',
            difficulty: 'medium',
        },
        {
            question: 'Explain the concept of closures in JavaScript. Provide a practical use case.',
            category: 'technical',
            difficulty: 'medium',
        },
        {
            question: 'What are the main differences between SQL and NoSQL databases? When would you choose one over the other?',
            category: 'technical',
            difficulty: 'medium',
        },
        
        // Technical - Hard (2 questions)
        {
            question: 'Design a URL shortening service like bit.ly. Explain your database schema, API endpoints, and how you would handle scaling to millions of users.',
            category: 'technical',
            difficulty: 'hard',
        },
        {
            question: 'How would you implement a rate limiter for an API? Discuss different algorithms and trade-offs.',
            category: 'technical',
            difficulty: 'hard',
        },
        
        // Situational - Easy (2 questions)
        {
            question: 'If you noticed a bug in production that was affecting users, what steps would you take?',
            category: 'situational',
            difficulty: 'easy',
        },
        {
            question: 'How would you prioritize your work when you have multiple urgent tasks from different stakeholders?',
            category: 'situational',
            difficulty: 'easy',
        },
        
        // Situational - Medium (2 questions)
        {
            question: 'How would you handle a situation where a project deadline is impossible to meet with the current resources?',
            category: 'situational',
            difficulty: 'medium',
        },
        {
            question: 'What would you do if you disagreed with your managers technical decision on a critical project?',
            category: 'situational',
            difficulty: 'medium',
        },
        
        // Situational - Hard (1 question)
        {
            question: 'Imagine you discover that a feature you built has a security vulnerability that has been in production for months. How would you handle this situation?',
            category: 'situational',
            difficulty: 'hard',
        },
    ];

    await db.insert(interviewQuestions).values(sampleQuestions);
    
    console.log('✅ Interview questions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});