import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            email: 'sarah.chen@email.com',
            name: 'Sarah Chen',
            bio: 'Recent Computer Science graduate from Stanford University with a passion for web development and user experience design. Seeking entry-level frontend developer position to apply my React and TypeScript skills.',
            experienceLevel: 'entry',
            location: 'San Francisco',
            resumeUrl: 'https://example.com/resumes/sarah-chen.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'marcus.williams@email.com',
            name: 'Marcus Williams',
            bio: 'Full-stack developer with 3 years of experience building scalable web applications. Proficient in Node.js, React, and cloud technologies. Looking to join a innovative startup where I can contribute to meaningful products.',
            experienceLevel: 'mid',
            location: 'New York',
            resumeUrl: 'https://example.com/resumes/marcus-williams.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'emily.rodriguez@email.com',
            name: 'Emily Rodriguez',
            bio: 'Recent graduate with a degree in Data Science and Analytics. Strong foundation in Python, SQL, and machine learning algorithms. Eager to start my career in data analysis and contribute to data-driven decision making.',
            experienceLevel: 'entry',
            location: 'Austin',
            resumeUrl: 'https://example.com/resumes/emily-rodriguez.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'david.kim@email.com',
            name: 'David Kim',
            bio: 'Software engineer with 4 years of experience in backend development and microservices architecture. Specialized in Java, Spring Boot, and AWS. Seeking opportunities to work on distributed systems and cloud infrastructure.',
            experienceLevel: 'mid',
            location: 'Seattle',
            resumeUrl: 'https://example.com/resumes/david-kim.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'jennifer.patel@email.com',
            name: 'Jennifer Patel',
            bio: 'Senior software architect with 8 years of experience leading engineering teams and designing enterprise-level solutions. Expert in system design, performance optimization, and technical leadership. Passionate about mentoring junior developers.',
            experienceLevel: 'senior',
            location: 'San Francisco',
            resumeUrl: 'https://example.com/resumes/jennifer-patel.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'alex.thompson@email.com',
            name: 'Alex Thompson',
            bio: 'Fresh graduate with internship experience in mobile app development. Skilled in React Native and Flutter with a keen interest in creating intuitive mobile experiences. Ready to launch my career in mobile development.',
            experienceLevel: 'entry',
            location: 'Boston',
            resumeUrl: 'https://example.com/resumes/alex-thompson.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'maria.garcia@email.com',
            name: 'Maria Garcia',
            bio: 'Mid-level DevOps engineer with 3 years of experience in CI/CD pipelines, containerization, and infrastructure automation. Proficient in Docker, Kubernetes, and Jenkins. Looking to join a team that values automation and efficiency.',
            experienceLevel: 'mid',
            location: 'Remote',
            resumeUrl: 'https://example.com/resumes/maria-garcia.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'james.anderson@email.com',
            name: 'James Anderson',
            bio: 'Computer Engineering graduate with strong problem-solving skills and academic projects in embedded systems and IoT. Eager to apply my knowledge in a challenging entry-level position focused on hardware-software integration.',
            experienceLevel: 'entry',
            location: 'Austin',
            resumeUrl: 'https://example.com/resumes/james-anderson.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'lisa.nguyen@email.com',
            name: 'Lisa Nguyen',
            bio: 'Software development manager with 10 years of experience leading cross-functional teams and delivering complex projects. Expertise in agile methodologies, stakeholder management, and technical strategy. Seeking director-level role in innovative tech company.',
            experienceLevel: 'senior',
            location: 'New York',
            resumeUrl: 'https://example.com/resumes/lisa-nguyen.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            email: 'robert.martinez@email.com',
            name: 'Robert Martinez',
            bio: 'Frontend developer with 4 years of experience creating responsive web applications. Specialized in modern JavaScript frameworks, accessibility, and performance optimization. Passionate about creating delightful user experiences and clean, maintainable code.',
            experienceLevel: 'mid',
            location: 'Remote',
            resumeUrl: 'https://example.com/resumes/robert-martinez.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});