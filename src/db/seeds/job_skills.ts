import { db } from '@/db';
import { jobSkills } from '@/db/schema';

async function main() {
    const sampleJobSkills = [
        // Job 1: Senior Full Stack Developer (jobId: 1)
        { jobId: 1, skillId: 2, required: true },  // JavaScript
        { jobId: 1, skillId: 5, required: true },  // TypeScript
        { jobId: 1, skillId: 11, required: true }, // React
        { jobId: 1, skillId: 12, required: true }, // Node.js
        { jobId: 1, skillId: 21, required: true }, // PostgreSQL
        { jobId: 1, skillId: 25, required: true }, // Git
        { jobId: 1, skillId: 26, required: false }, // Docker
        { jobId: 1, skillId: 36, required: true }, // Problem Solving

        // Job 2: Frontend Developer (jobId: 2)
        { jobId: 2, skillId: 2, required: true },  // JavaScript
        { jobId: 2, skillId: 5, required: true },  // TypeScript
        { jobId: 2, skillId: 11, required: true }, // React
        { jobId: 2, skillId: 25, required: true }, // Git
        { jobId: 2, skillId: 33, required: false }, // Communication
        { jobId: 2, skillId: 36, required: true }, // Problem Solving

        // Job 3: Backend Engineer (jobId: 3)
        { jobId: 3, skillId: 1, required: true },  // Python
        { jobId: 3, skillId: 13, required: true }, // Django
        { jobId: 3, skillId: 21, required: true }, // PostgreSQL
        { jobId: 3, skillId: 23, required: true }, // REST APIs
        { jobId: 3, skillId: 25, required: true }, // Git
        { jobId: 3, skillId: 28, required: false }, // AWS
        { jobId: 3, skillId: 36, required: true }, // Problem Solving

        // Job 4: DevOps Engineer (jobId: 4)
        { jobId: 4, skillId: 1, required: true },  // Python
        { jobId: 4, skillId: 26, required: true }, // Docker
        { jobId: 4, skillId: 27, required: true }, // Kubernetes
        { jobId: 4, skillId: 28, required: true }, // AWS
        { jobId: 4, skillId: 30, required: true }, // Jenkins
        { jobId: 4, skillId: 25, required: true }, // Git
        { jobId: 4, skillId: 36, required: true }, // Problem Solving
        { jobId: 4, skillId: 39, required: false }, // Adaptability

        // Job 5: Data Scientist (jobId: 5)
        { jobId: 5, skillId: 1, required: true },  // Python
        { jobId: 5, skillId: 19, required: true }, // SQL
        { jobId: 5, skillId: 21, required: true }, // PostgreSQL
        { jobId: 5, skillId: 36, required: true }, // Problem Solving
        { jobId: 5, skillId: 38, required: true }, // Critical Thinking
        { jobId: 5, skillId: 33, required: false }, // Communication

        // Job 6: Mobile Developer (iOS) (jobId: 6)
        { jobId: 6, skillId: 8, required: true },  // Swift
        { jobId: 6, skillId: 25, required: true }, // Git
        { jobId: 6, skillId: 36, required: true }, // Problem Solving
        { jobId: 6, skillId: 33, required: false }, // Communication
        { jobId: 6, skillId: 35, required: false }, // Teamwork

        // Job 7: Product Manager (jobId: 7)
        { jobId: 7, skillId: 32, required: true }, // Jira
        { jobId: 7, skillId: 33, required: true }, // Communication
        { jobId: 7, skillId: 34, required: true }, // Leadership
        { jobId: 7, skillId: 35, required: true }, // Teamwork
        { jobId: 7, skillId: 38, required: true }, // Critical Thinking
        { jobId: 7, skillId: 37, required: false }, // Time Management

        // Job 8: UX/UI Designer (jobId: 8)
        { jobId: 8, skillId: 31, required: true }, // Figma
        { jobId: 8, skillId: 33, required: true }, // Communication
        { jobId: 8, skillId: 35, required: true }, // Teamwork
        { jobId: 8, skillId: 38, required: false }, // Critical Thinking
        { jobId: 8, skillId: 39, required: false }, // Adaptability

        // Job 9: QA Engineer (jobId: 9)
        { jobId: 9, skillId: 1, required: true },  // Python
        { jobId: 9, skillId: 2, required: true },  // JavaScript
        { jobId: 9, skillId: 25, required: true }, // Git
        { jobId: 9, skillId: 36, required: true }, // Problem Solving
        { jobId: 9, skillId: 38, required: true }, // Critical Thinking
        { jobId: 9, skillId: 33, required: false }, // Communication

        // Job 10: Full Stack JavaScript Developer (jobId: 10)
        { jobId: 10, skillId: 2, required: true },  // JavaScript
        { jobId: 10, skillId: 5, required: true },  // TypeScript
        { jobId: 10, skillId: 11, required: true }, // React
        { jobId: 10, skillId: 12, required: true }, // Node.js
        { jobId: 10, skillId: 18, required: true }, // Express.js
        { jobId: 10, skillId: 20, required: true }, // MongoDB
        { jobId: 10, skillId: 25, required: true }, // Git
        { jobId: 10, skillId: 36, required: false }, // Problem Solving

        // Job 11: Java Backend Developer (jobId: 11)
        { jobId: 11, skillId: 3, required: true },  // Java
        { jobId: 11, skillId: 17, required: true }, // Spring Boot
        { jobId: 11, skillId: 22, required: true }, // MySQL
        { jobId: 11, skillId: 23, required: true }, // REST APIs
        { jobId: 11, skillId: 25, required: true }, // Git
        { jobId: 11, skillId: 26, required: false }, // Docker
        { jobId: 11, skillId: 36, required: true }, // Problem Solving

        // Job 12: React Frontend Developer (jobId: 12)
        { jobId: 12, skillId: 2, required: true },  // JavaScript
        { jobId: 12, skillId: 5, required: true },  // TypeScript
        { jobId: 12, skillId: 11, required: true }, // React
        { jobId: 12, skillId: 25, required: true }, // Git
        { jobId: 12, skillId: 24, required: false }, // GraphQL
        { jobId: 12, skillId: 36, required: true }, // Problem Solving

        // Job 13: Cloud Solutions Architect (jobId: 13)
        { jobId: 13, skillId: 28, required: true }, // AWS
        { jobId: 13, skillId: 29, required: false }, // Azure
        { jobId: 13, skillId: 26, required: true }, // Docker
        { jobId: 13, skillId: 27, required: true }, // Kubernetes
        { jobId: 13, skillId: 33, required: true }, // Communication
        { jobId: 13, skillId: 34, required: false }, // Leadership
        { jobId: 13, skillId: 36, required: true }, // Problem Solving
        { jobId: 13, skillId: 38, required: true }, // Critical Thinking

        // Job 14: Android Developer (jobId: 14)
        { jobId: 14, skillId: 9, required: true },  // Kotlin
        { jobId: 14, skillId: 3, required: false }, // Java
        { jobId: 14, skillId: 25, required: true }, // Git
        { jobId: 14, skillId: 36, required: true }, // Problem Solving
        { jobId: 14, skillId: 35, required: false }, // Teamwork

        // Job 15: Data Engineer (jobId: 15)
        { jobId: 15, skillId: 1, required: true },  // Python
        { jobId: 15, skillId: 19, required: true }, // SQL
        { jobId: 15, skillId: 21, required: true }, // PostgreSQL
        { jobId: 15, skillId: 28, required: true }, // AWS
        { jobId: 15, skillId: 26, required: false }, // Docker
        { jobId: 15, skillId: 36, required: true }, // Problem Solving

        // Job 16: Machine Learning Engineer (jobId: 16)
        { jobId: 16, skillId: 1, required: true },  // Python
        { jobId: 16, skillId: 19, required: true }, // SQL
        { jobId: 16, skillId: 36, required: true }, // Problem Solving
        { jobId: 16, skillId: 38, required: true }, // Critical Thinking
        { jobId: 16, skillId: 28, required: false }, // AWS
        { jobId: 16, skillId: 33, required: false }, // Communication

        // Job 17: Security Engineer (jobId: 17)
        { jobId: 17, skillId: 1, required: true },  // Python
        { jobId: 17, skillId: 7, required: false }, // Go
        { jobId: 17, skillId: 25, required: true }, // Git
        { jobId: 17, skillId: 26, required: true }, // Docker
        { jobId: 17, skillId: 28, required: true }, // AWS
        { jobId: 17, skillId: 36, required: true }, // Problem Solving
        { jobId: 17, skillId: 38, required: true }, // Critical Thinking

        // Job 18: Vue.js Developer (jobId: 18)
        { jobId: 18, skillId: 2, required: true },  // JavaScript
        { jobId: 18, skillId: 5, required: true },  // TypeScript
        { jobId: 18, skillId: 16, required: true }, // Vue.js
        { jobId: 18, skillId: 25, required: true }, // Git
        { jobId: 18, skillId: 23, required: false }, // REST APIs
        { jobId: 18, skillId: 36, required: true }, // Problem Solving

        // Job 19: Angular Developer (jobId: 19)
        { jobId: 19, skillId: 2, required: true },  // JavaScript
        { jobId: 19, skillId: 5, required: true },  // TypeScript
        { jobId: 19, skillId: 15, required: true }, // Angular
        { jobId: 19, skillId: 25, required: true }, // Git
        { jobId: 19, skillId: 23, required: true }, // REST APIs
        { jobId: 19, skillId: 36, required: false }, // Problem Solving

        // Job 20: Python Backend Developer (jobId: 20)
        { jobId: 20, skillId: 1, required: true },  // Python
        { jobId: 20, skillId: 14, required: true }, // Flask
        { jobId: 20, skillId: 21, required: true }, // PostgreSQL
        { jobId: 20, skillId: 23, required: true }, // REST APIs
        { jobId: 20, skillId: 25, required: true }, // Git
        { jobId: 20, skillId: 36, required: true }, // Problem Solving

        // Job 21: Technical Lead (jobId: 21)
        { jobId: 21, skillId: 2, required: true },  // JavaScript
        { jobId: 21, skillId: 5, required: true },  // TypeScript
        { jobId: 21, skillId: 25, required: true }, // Git
        { jobId: 21, skillId: 33, required: true }, // Communication
        { jobId: 21, skillId: 34, required: true }, // Leadership
        { jobId: 21, skillId: 35, required: true }, // Teamwork
        { jobId: 21, skillId: 36, required: true }, // Problem Solving
        { jobId: 21, skillId: 38, required: true }, // Critical Thinking

        // Job 22: Site Reliability Engineer (jobId: 22)
        { jobId: 22, skillId: 1, required: true },  // Python
        { jobId: 22, skillId: 26, required: true }, // Docker
        { jobId: 22, skillId: 27, required: true }, // Kubernetes
        { jobId: 22, skillId: 28, required: true }, // AWS
        { jobId: 22, skillId: 25, required: true }, // Git
        { jobId: 22, skillId: 30, required: false }, // Jenkins
        { jobId: 22, skillId: 36, required: true }, // Problem Solving

        // Job 23: Business Analyst (jobId: 23)
        { jobId: 23, skillId: 19, required: true }, // SQL
        { jobId: 23, skillId: 32, required: true }, // Jira
        { jobId: 23, skillId: 33, required: true }, // Communication
        { jobId: 23, skillId: 38, required: true }, // Critical Thinking
        { jobId: 23, skillId: 35, required: false }, // Teamwork
        { jobId: 23, skillId: 37, required: false }, // Time Management

        // Job 24: Scrum Master (jobId: 24)
        { jobId: 24, skillId: 32, required: true }, // Jira
        { jobId: 24, skillId: 33, required: true }, // Communication
        { jobId: 24, skillId: 34, required: true }, // Leadership
        { jobId: 24, skillId: 35, required: true }, // Teamwork
        { jobId: 24, skillId: 37, required: true }, // Time Management
        { jobId: 24, skillId: 39, required: false }, // Adaptability

        // Job 25: GraphQL Developer (jobId: 25)
        { jobId: 25, skillId: 2, required: true },  // JavaScript
        { jobId: 25, skillId: 5, required: true },  // TypeScript
        { jobId: 25, skillId: 12, required: true }, // Node.js
        { jobId: 25, skillId: 24, required: true }, // GraphQL
        { jobId: 25, skillId: 21, required: true }, // PostgreSQL
        { jobId: 25, skillId: 25, required: true }, // Git
        { jobId: 25, skillId: 36, required: false }, // Problem Solving

        // Job 26: Ruby on Rails Developer (jobId: 26)
        { jobId: 26, skillId: 6, required: true },  // Ruby
        { jobId: 26, skillId: 21, required: true }, // PostgreSQL
        { jobId: 26, skillId: 23, required: true }, // REST APIs
        { jobId: 26, skillId: 25, required: true }, // Git
        { jobId: 26, skillId: 36, required: true }, // Problem Solving
        { jobId: 26, skillId: 35, required: false }, // Teamwork

        // Job 27: Go Backend Developer (jobId: 27)
        { jobId: 27, skillId: 7, required: true },  // Go
        { jobId: 27, skillId: 21, required: true }, // PostgreSQL
        { jobId: 27, skillId: 23, required: true }, // REST APIs
        { jobId: 27, skillId: 26, required: true }, // Docker
        { jobId: 27, skillId: 25, required: true }, // Git
        { jobId: 27, skillId: 36, required: true }, // Problem Solving

        // Job 28: React Native Developer (jobId: 28)
        { jobId: 28, skillId: 2, required: true },  // JavaScript
        { jobId: 28, skillId: 5, required: true },  // TypeScript
        { jobId: 28, skillId: 11, required: true }, // React
        { jobId: 28, skillId: 25, required: true }, // Git
        { jobId: 28, skillId: 23, required: false }, // REST APIs
        { jobId: 28, skillId: 36, required: true }, // Problem Solving

        // Job 29: Database Administrator (jobId: 29)
        { jobId: 29, skillId: 19, required: true }, // SQL
        { jobId: 29, skillId: 21, required: true }, // PostgreSQL
        { jobId: 29, skillId: 22, required: true }, // MySQL
        { jobId: 29, skillId: 1, required: false }, // Python
        { jobId: 29, skillId: 36, required: true }, // Problem Solving
        { jobId: 29, skillId: 38, required: true }, // Critical Thinking

        // Job 30: Engineering Manager (jobId: 30)
        { jobId: 30, skillId: 33, required: true }, // Communication
        { jobId: 30, skillId: 34, required: true }, // Leadership
        { jobId: 30, skillId: 35, required: true }, // Teamwork
        { jobId: 30, skillId: 37, required: true }, // Time Management
        { jobId: 30, skillId: 32, required: true }, // Jira
        { jobId: 30, skillId: 25, required: false }, // Git
        { jobId: 30, skillId: 38, required: true }, // Critical Thinking
        { jobId: 30, skillId: 39, required: false }, // Adaptability
    ];

    await db.insert(jobSkills).values(sampleJobSkills);
    
    console.log('✅ Job skills seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});