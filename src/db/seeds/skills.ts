import { db } from '@/db';
import { skills } from '@/db/schema';

async function main() {
    const sampleSkills = [
        // Programming Languages (10)
        { name: 'Python', category: 'technical' },
        { name: 'JavaScript', category: 'technical' },
        { name: 'Java', category: 'technical' },
        { name: 'C++', category: 'technical' },
        { name: 'TypeScript', category: 'technical' },
        { name: 'Ruby', category: 'technical' },
        { name: 'Go', category: 'technical' },
        { name: 'Swift', category: 'technical' },
        { name: 'Kotlin', category: 'technical' },
        { name: 'PHP', category: 'technical' },
        
        // Frameworks (8)
        { name: 'React', category: 'technical' },
        { name: 'Node.js', category: 'technical' },
        { name: 'Django', category: 'technical' },
        { name: 'Flask', category: 'technical' },
        { name: 'Angular', category: 'technical' },
        { name: 'Vue.js', category: 'technical' },
        { name: 'Spring Boot', category: 'technical' },
        { name: 'Express.js', category: 'technical' },
        
        // Databases & Concepts (6)
        { name: 'SQL', category: 'technical' },
        { name: 'MongoDB', category: 'technical' },
        { name: 'PostgreSQL', category: 'technical' },
        { name: 'MySQL', category: 'technical' },
        { name: 'REST APIs', category: 'technical' },
        { name: 'GraphQL', category: 'technical' },
        
        // Development Tools (10)
        { name: 'Git', category: 'tool' },
        { name: 'Docker', category: 'tool' },
        { name: 'Kubernetes', category: 'tool' },
        { name: 'AWS', category: 'tool' },
        { name: 'Azure', category: 'tool' },
        { name: 'GCP', category: 'tool' },
        { name: 'Jenkins', category: 'tool' },
        { name: 'CI/CD', category: 'tool' },
        { name: 'Jira', category: 'tool' },
        { name: 'Figma', category: 'tool' },
        
        // Soft Skills (7)
        { name: 'Communication', category: 'soft' },
        { name: 'Leadership', category: 'soft' },
        { name: 'Teamwork', category: 'soft' },
        { name: 'Problem Solving', category: 'soft' },
        { name: 'Time Management', category: 'soft' },
        { name: 'Critical Thinking', category: 'soft' },
        { name: 'Adaptability', category: 'soft' },
        
        // Languages (3)
        { name: 'English', category: 'language' },
        { name: 'Spanish', category: 'language' },
        { name: 'Mandarin', category: 'language' },
    ];

    await db.insert(skills).values(sampleSkills);
    
    console.log('✅ Skills seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});