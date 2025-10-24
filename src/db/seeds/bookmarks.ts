import { db } from '@/db';
import { bookmarks } from '@/db/schema';

async function main() {
    const sampleBookmarks = [
        // Sarah Chen (1, entry, frontend) - 3 bookmarks
        {
            userId: 1,
            jobId: 1, // Junior Frontend Developer at TechStart
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            userId: 1,
            jobId: 3, // Frontend Developer at WebFlow
            createdAt: new Date('2024-12-20').toISOString(),
        },
        {
            userId: 1,
            jobId: 7, // UI Developer at DesignHub
            createdAt: new Date('2024-12-28').toISOString(),
        },

        // Marcus Williams (2, mid, full-stack) - 3 bookmarks
        {
            userId: 2,
            jobId: 11, // Full Stack Developer at CloudTech
            createdAt: new Date('2024-12-10').toISOString(),
        },
        {
            userId: 2,
            jobId: 13, // Senior Full Stack Engineer at DataFlow
            createdAt: new Date('2024-12-18').toISOString(),
        },
        {
            userId: 2,
            jobId: 25, // Full Stack Developer at FinanceApp
            createdAt: new Date('2024-12-27').toISOString(),
        },

        // Emily Rodriguez (3, entry, data) - 2 bookmarks
        {
            userId: 3,
            jobId: 21, // Junior Data Analyst at Analytics Inc
            createdAt: new Date('2024-12-12').toISOString(),
        },
        {
            userId: 3,
            jobId: 23, // Data Science Intern at Research Labs
            createdAt: new Date('2024-12-22').toISOString(),
        },

        // David Kim (4, mid, backend) - 3 bookmarks
        {
            userId: 4,
            jobId: 15, // Backend Engineer at CloudServices
            createdAt: new Date('2024-12-08').toISOString(),
        },
        {
            userId: 4,
            jobId: 17, // API Developer at Integration Co
            createdAt: new Date('2024-12-16').toISOString(),
        },
        {
            userId: 4,
            jobId: 35, // Cloud Engineer at ServerPro
            createdAt: new Date('2024-12-25').toISOString(),
        },

        // Jennifer Patel (5, senior) - 3 bookmarks
        {
            userId: 5,
            jobId: 31, // Principal Engineer at Enterprise Solutions
            createdAt: new Date('2024-12-05').toISOString(),
        },
        {
            userId: 5,
            jobId: 33, // Senior Software Architect at SystemDesign
            createdAt: new Date('2024-12-14').toISOString(),
        },
        {
            userId: 5,
            jobId: 43, // Tech Lead at Innovation Labs
            createdAt: new Date('2024-12-23').toISOString(),
        },

        // Alex Thompson (6, entry, mobile) - 2 bookmarks
        {
            userId: 6,
            jobId: 5, // Mobile Developer at AppStart
            createdAt: new Date('2024-12-11').toISOString(),
        },
        {
            userId: 6,
            jobId: 9, // iOS Developer at MobileFirst
            createdAt: new Date('2024-12-19').toISOString(),
        },

        // Maria Garcia (7, mid, devops) - 3 bookmarks
        {
            userId: 7,
            jobId: 27, // DevOps Engineer at Automation Co
            createdAt: new Date('2024-12-07').toISOString(),
        },
        {
            userId: 7,
            jobId: 29, // Site Reliability Engineer at Scale Systems
            createdAt: new Date('2024-12-17').toISOString(),
        },
        {
            userId: 7,
            jobId: 37, // Infrastructure Engineer at CloudOps
            createdAt: new Date('2024-12-26').toISOString(),
        },

        // James Anderson (8, entry) - 2 bookmarks
        {
            userId: 8,
            jobId: 2, // Software Engineer Intern at StartupHub
            createdAt: new Date('2024-12-13').toISOString(),
        },
        {
            userId: 8,
            jobId: 4, // Junior Developer at CodeFactory
            createdAt: new Date('2024-12-21').toISOString(),
        },

        // Lisa Nguyen (9, senior) - 3 bookmarks
        {
            userId: 9,
            jobId: 41, // Engineering Manager at TechCorp
            createdAt: new Date('2024-12-06').toISOString(),
        },
        {
            userId: 9,
            jobId: 45, // Director of Engineering at ScaleUp
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            userId: 9,
            jobId: 47, // VP of Engineering at Growth Company
            createdAt: new Date('2024-12-24').toISOString(),
        },

        // Robert Martinez (10, mid, frontend) - 3 bookmarks
        {
            userId: 10,
            jobId: 19, // Senior Frontend Developer at UIWorks
            createdAt: new Date('2024-12-09').toISOString(),
        },
        {
            userId: 10,
            jobId: 39, // React Developer at Component Labs
            createdAt: new Date('2024-12-18').toISOString(),
        },
        {
            userId: 10,
            jobId: 49, // UI Engineer at Design Systems Inc
            createdAt: new Date('2024-12-29').toISOString(),
        },
    ];

    await db.insert(bookmarks).values(sampleBookmarks);
    
    console.log('✅ Bookmarks seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});