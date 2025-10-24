import { db } from '@/db';
import { userSkills } from '@/db/schema';

async function main() {
    const sampleUserSkills = [
        // Sarah Chen (Entry Level - Frontend/React/TypeScript)
        { userId: 1, skillId: 2, proficiencyLevel: 'intermediate' },  // JavaScript
        { userId: 1, skillId: 5, proficiencyLevel: 'intermediate' },  // TypeScript
        { userId: 1, skillId: 11, proficiencyLevel: 'beginner' },     // React
        { userId: 1, skillId: 19, proficiencyLevel: 'beginner' },     // SQL
        { userId: 1, skillId: 25, proficiencyLevel: 'intermediate' }, // Git
        { userId: 1, skillId: 31, proficiencyLevel: 'beginner' },     // Figma
        { userId: 1, skillId: 33, proficiencyLevel: 'intermediate' }, // Communication
        { userId: 1, skillId: 35, proficiencyLevel: 'intermediate' }, // Teamwork
        { userId: 1, skillId: 40, proficiencyLevel: 'advanced' },     // English

        // Marcus Williams (Mid Level - Full-stack/Node.js/React/Cloud)
        { userId: 2, skillId: 2, proficiencyLevel: 'advanced' },      // JavaScript
        { userId: 2, skillId: 5, proficiencyLevel: 'advanced' },      // TypeScript
        { userId: 2, skillId: 11, proficiencyLevel: 'advanced' },     // React
        { userId: 2, skillId: 12, proficiencyLevel: 'advanced' },     // Node.js
        { userId: 2, skillId: 18, proficiencyLevel: 'advanced' },     // Express.js
        { userId: 2, skillId: 21, proficiencyLevel: 'intermediate' }, // PostgreSQL
        { userId: 2, skillId: 23, proficiencyLevel: 'advanced' },     // REST APIs
        { userId: 2, skillId: 26, proficiencyLevel: 'intermediate' }, // Docker
        { userId: 2, skillId: 28, proficiencyLevel: 'intermediate' }, // AWS
        { userId: 2, skillId: 36, proficiencyLevel: 'advanced' },     // Problem Solving

        // Emily Rodriguez (Entry Level - Data Science/Python/SQL/ML)
        { userId: 3, skillId: 1, proficiencyLevel: 'intermediate' },  // Python
        { userId: 3, skillId: 13, proficiencyLevel: 'beginner' },     // Django
        { userId: 3, skillId: 14, proficiencyLevel: 'beginner' },     // Flask
        { userId: 3, skillId: 19, proficiencyLevel: 'intermediate' }, // SQL
        { userId: 3, skillId: 21, proficiencyLevel: 'beginner' },     // PostgreSQL
        { userId: 3, skillId: 25, proficiencyLevel: 'beginner' },     // Git
        { userId: 3, skillId: 35, proficiencyLevel: 'intermediate' }, // Teamwork
        { userId: 3, skillId: 38, proficiencyLevel: 'intermediate' }, // Critical Thinking
        { userId: 3, skillId: 40, proficiencyLevel: 'advanced' },     // English
        { userId: 3, skillId: 41, proficiencyLevel: 'expert' },       // Spanish

        // David Kim (Mid Level - Backend/Java/Spring Boot/AWS)
        { userId: 4, skillId: 3, proficiencyLevel: 'advanced' },      // Java
        { userId: 4, skillId: 17, proficiencyLevel: 'advanced' },     // Spring Boot
        { userId: 4, skillId: 19, proficiencyLevel: 'advanced' },     // SQL
        { userId: 4, skillId: 21, proficiencyLevel: 'intermediate' }, // PostgreSQL
        { userId: 4, skillId: 22, proficiencyLevel: 'advanced' },     // MySQL
        { userId: 4, skillId: 23, proficiencyLevel: 'advanced' },     // REST APIs
        { userId: 4, skillId: 26, proficiencyLevel: 'intermediate' }, // Docker
        { userId: 4, skillId: 28, proficiencyLevel: 'advanced' },     // AWS
        { userId: 4, skillId: 32, proficiencyLevel: 'intermediate' }, // Jira
        { userId: 4, skillId: 36, proficiencyLevel: 'advanced' },     // Problem Solving

        // Jennifer Patel (Senior - Software architect/System design)
        { userId: 5, skillId: 2, proficiencyLevel: 'expert' },        // JavaScript
        { userId: 5, skillId: 3, proficiencyLevel: 'expert' },        // Java
        { userId: 5, skillId: 5, proficiencyLevel: 'expert' },        // TypeScript
        { userId: 5, skillId: 11, proficiencyLevel: 'expert' },       // React
        { userId: 5, skillId: 12, proficiencyLevel: 'expert' },       // Node.js
        { userId: 5, skillId: 19, proficiencyLevel: 'expert' },       // SQL
        { userId: 5, skillId: 23, proficiencyLevel: 'expert' },       // REST APIs
        { userId: 5, skillId: 26, proficiencyLevel: 'advanced' },     // Docker
        { userId: 5, skillId: 28, proficiencyLevel: 'expert' },       // AWS
        { userId: 5, skillId: 34, proficiencyLevel: 'expert' },       // Leadership

        // Alex Thompson (Entry Level - Mobile/React Native/Flutter)
        { userId: 6, skillId: 2, proficiencyLevel: 'intermediate' },  // JavaScript
        { userId: 6, skillId: 5, proficiencyLevel: 'beginner' },      // TypeScript
        { userId: 6, skillId: 8, proficiencyLevel: 'beginner' },      // Swift
        { userId: 6, skillId: 9, proficiencyLevel: 'beginner' },      // Kotlin
        { userId: 6, skillId: 11, proficiencyLevel: 'intermediate' }, // React
        { userId: 6, skillId: 25, proficiencyLevel: 'intermediate' }, // Git
        { userId: 6, skillId: 31, proficiencyLevel: 'intermediate' }, // Figma
        { userId: 6, skillId: 35, proficiencyLevel: 'intermediate' }, // Teamwork
        { userId: 6, skillId: 39, proficiencyLevel: 'intermediate' }, // Adaptability

        // Maria Garcia (Mid Level - DevOps/Docker/Kubernetes/Jenkins)
        { userId: 7, skillId: 1, proficiencyLevel: 'intermediate' },  // Python
        { userId: 7, skillId: 7, proficiencyLevel: 'intermediate' },  // Go
        { userId: 7, skillId: 25, proficiencyLevel: 'advanced' },     // Git
        { userId: 7, skillId: 26, proficiencyLevel: 'expert' },       // Docker
        { userId: 7, skillId: 27, proficiencyLevel: 'advanced' },     // Kubernetes
        { userId: 7, skillId: 28, proficiencyLevel: 'advanced' },     // AWS
        { userId: 7, skillId: 29, proficiencyLevel: 'intermediate' }, // Azure
        { userId: 7, skillId: 30, proficiencyLevel: 'advanced' },     // Jenkins
        { userId: 7, skillId: 36, proficiencyLevel: 'advanced' },     // Problem Solving
        { userId: 7, skillId: 41, proficiencyLevel: 'expert' },       // Spanish

        // James Anderson (Entry Level - Embedded systems/IoT)
        { userId: 8, skillId: 4, proficiencyLevel: 'intermediate' },  // C++
        { userId: 8, skillId: 1, proficiencyLevel: 'beginner' },      // Python
        { userId: 8, skillId: 19, proficiencyLevel: 'beginner' },     // SQL
        { userId: 8, skillId: 25, proficiencyLevel: 'intermediate' }, // Git
        { userId: 8, skillId: 33, proficiencyLevel: 'intermediate' }, // Communication
        { userId: 8, skillId: 35, proficiencyLevel: 'intermediate' }, // Teamwork
        { userId: 8, skillId: 36, proficiencyLevel: 'intermediate' }, // Problem Solving
        { userId: 8, skillId: 38, proficiencyLevel: 'intermediate' }, // Critical Thinking

        // Lisa Nguyen (Senior - Engineering manager/Agile)
        { userId: 9, skillId: 2, proficiencyLevel: 'advanced' },      // JavaScript
        { userId: 9, skillId: 3, proficiencyLevel: 'advanced' },      // Java
        { userId: 9, skillId: 11, proficiencyLevel: 'advanced' },     // React
        { userId: 9, skillId: 12, proficiencyLevel: 'advanced' },     // Node.js
        { userId: 9, skillId: 32, proficiencyLevel: 'expert' },       // Jira
        { userId: 9, skillId: 33, proficiencyLevel: 'expert' },       // Communication
        { userId: 9, skillId: 34, proficiencyLevel: 'expert' },       // Leadership
        { userId: 9, skillId: 35, proficiencyLevel: 'expert' },       // Teamwork
        { userId: 9, skillId: 37, proficiencyLevel: 'expert' },       // Time Management
        { userId: 9, skillId: 40, proficiencyLevel: 'expert' },       // English

        // Robert Martinez (Mid Level - Frontend/JavaScript/Performance)
        { userId: 10, skillId: 2, proficiencyLevel: 'expert' },       // JavaScript
        { userId: 10, skillId: 5, proficiencyLevel: 'advanced' },     // TypeScript
        { userId: 10, skillId: 11, proficiencyLevel: 'advanced' },    // React
        { userId: 10, skillId: 15, proficiencyLevel: 'intermediate' },// Angular
        { userId: 10, skillId: 16, proficiencyLevel: 'advanced' },    // Vue.js
        { userId: 10, skillId: 23, proficiencyLevel: 'advanced' },    // REST APIs
        { userId: 10, skillId: 25, proficiencyLevel: 'advanced' },    // Git
        { userId: 10, skillId: 31, proficiencyLevel: 'intermediate' },// Figma
        { userId: 10, skillId: 36, proficiencyLevel: 'advanced' },    // Problem Solving
        { userId: 10, skillId: 41, proficiencyLevel: 'expert' },      // Spanish
    ];

    await db.insert(userSkills).values(sampleUserSkills);
    
    console.log('✅ User skills seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});