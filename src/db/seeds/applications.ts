import { db } from '@/db';
import { applications } from '@/db/schema';

async function main() {
    const sampleApplications = [
        // Sarah Chen (1, entry, frontend) - 2 applications
        {
            userId: 1,
            jobId: 3,
            status: 'submitted',
            coverLetter: 'I am excited to apply for this Frontend Developer position. My experience with React and modern web technologies makes me a great fit for your team. I am eager to contribute to building exceptional user experiences.',
            appliedAt: new Date('2024-12-15').toISOString(),
            updatedAt: new Date('2024-12-15').toISOString(),
        },
        {
            userId: 1,
            jobId: 7,
            status: 'under_review',
            coverLetter: 'As a passionate frontend developer, I am thrilled about this opportunity. I have been following your company and admire your commitment to user-centric design. I would love to bring my skills to your team.',
            appliedAt: new Date('2024-12-10').toISOString(),
            updatedAt: new Date('2024-12-12').toISOString(),
        },

        // Marcus Williams (2, mid, full-stack) - 3 applications
        {
            userId: 2,
            jobId: 12,
            status: 'interview',
            coverLetter: 'With 4 years of full-stack development experience, I am confident I can deliver high-quality solutions for your team. My expertise spans both frontend and backend technologies, and I thrive in collaborative environments.',
            appliedAt: new Date('2024-12-05').toISOString(),
            updatedAt: new Date('2024-12-18').toISOString(),
        },
        {
            userId: 2,
            jobId: 18,
            status: 'submitted',
            coverLetter: 'I am excited to apply my full-stack expertise to this role. My experience with Node.js and React aligns perfectly with your tech stack. I am passionate about building scalable and maintainable applications.',
            appliedAt: new Date('2024-12-08').toISOString(),
            updatedAt: new Date('2024-12-08').toISOString(),
        },
        {
            userId: 2,
            jobId: 24,
            status: 'rejected',
            coverLetter: 'I believe my background in full-stack development would be valuable to your organization. I have successfully delivered multiple projects and am eager to take on new challenges.',
            appliedAt: new Date('2024-11-28').toISOString(),
            updatedAt: new Date('2024-12-10').toISOString(),
        },

        // Emily Rodriguez (3, entry, data) - 2 applications
        {
            userId: 3,
            jobId: 5,
            status: 'submitted',
            coverLetter: 'I am passionate about data analysis and excited to apply for this position. My coursework and internship experience have prepared me well for this role. I am eager to contribute to data-driven decision making.',
            appliedAt: new Date('2024-12-12').toISOString(),
            updatedAt: new Date('2024-12-12').toISOString(),
        },
        {
            userId: 3,
            jobId: 11,
            status: 'draft',
            coverLetter: null,
            appliedAt: new Date('2024-12-19').toISOString(),
            updatedAt: new Date('2024-12-19').toISOString(),
        },

        // David Kim (4, mid, backend) - 2 applications
        {
            userId: 4,
            jobId: 16,
            status: 'under_review',
            coverLetter: 'I am excited about this Backend Engineer opportunity. With 5 years of experience in building robust APIs and microservices, I am confident I can contribute significantly to your team.',
            appliedAt: new Date('2024-12-07').toISOString(),
            updatedAt: new Date('2024-12-14').toISOString(),
        },
        {
            userId: 4,
            jobId: 22,
            status: 'submitted',
            coverLetter: 'My expertise in backend development and database optimization makes me a strong candidate for this role. I am passionate about writing clean, efficient code and building scalable systems.',
            appliedAt: new Date('2024-12-13').toISOString(),
            updatedAt: new Date('2024-12-13').toISOString(),
        },

        // Jennifer Patel (5, senior) - 2 applications
        {
            userId: 5,
            jobId: 29,
            status: 'interview',
            coverLetter: 'As a senior engineer with 8 years of experience, I am excited about leading technical initiatives at your company. I have a proven track record of mentoring teams and delivering complex projects successfully.',
            appliedAt: new Date('2024-12-03').toISOString(),
            updatedAt: new Date('2024-12-17').toISOString(),
        },
        {
            userId: 5,
            jobId: 35,
            status: 'accepted',
            coverLetter: 'I am thrilled about this Staff Engineer opportunity. My extensive experience in system architecture and team leadership aligns perfectly with your needs. I look forward to driving technical excellence at your organization.',
            appliedAt: new Date('2024-11-25').toISOString(),
            updatedAt: new Date('2024-12-15').toISOString(),
        },

        // Alex Thompson (6, entry, mobile) - 2 applications
        {
            userId: 6,
            jobId: 9,
            status: 'submitted',
            coverLetter: 'I am passionate about mobile development and excited to apply for this iOS Developer position. My projects demonstrate my ability to create intuitive and performant mobile applications.',
            appliedAt: new Date('2024-12-11').toISOString(),
            updatedAt: new Date('2024-12-11').toISOString(),
        },
        {
            userId: 6,
            jobId: 15,
            status: 'under_review',
            coverLetter: 'As a mobile developer, I am eager to contribute to your team. I have experience with React Native and native iOS development, and I am committed to delivering high-quality mobile experiences.',
            appliedAt: new Date('2024-12-06').toISOString(),
            updatedAt: new Date('2024-12-13').toISOString(),
        },

        // Maria Garcia (7, mid, devops) - 2 applications
        {
            userId: 7,
            jobId: 20,
            status: 'interview',
            coverLetter: 'I am excited about this DevOps Engineer role. My 4 years of experience in CI/CD, cloud infrastructure, and automation make me well-suited for this position. I am passionate about streamlining development workflows.',
            appliedAt: new Date('2024-12-04').toISOString(),
            updatedAt: new Date('2024-12-16').toISOString(),
        },
        {
            userId: 7,
            jobId: 26,
            status: 'submitted',
            coverLetter: 'With extensive experience in AWS and Kubernetes, I am confident I can optimize your infrastructure. I believe in infrastructure as code and have successfully implemented automation solutions in my previous roles.',
            appliedAt: new Date('2024-12-09').toISOString(),
            updatedAt: new Date('2024-12-09').toISOString(),
        },

        // James Anderson (8, entry) - 2 applications
        {
            userId: 8,
            jobId: 1,
            status: 'submitted',
            coverLetter: 'I am excited to start my career as a Software Engineer. My academic background and personal projects have prepared me well for this role. I am eager to learn and grow with your team.',
            appliedAt: new Date('2024-12-14').toISOString(),
            updatedAt: new Date('2024-12-14').toISOString(),
        },
        {
            userId: 8,
            jobId: 8,
            status: 'under_review',
            coverLetter: 'As a recent graduate, I am passionate about software development and eager to apply my skills. I have a strong foundation in computer science fundamentals and am excited about this opportunity.',
            appliedAt: new Date('2024-12-10').toISOString(),
            updatedAt: new Date('2024-12-15').toISOString(),
        },

        // Lisa Nguyen (9, senior) - 2 applications
        {
            userId: 9,
            jobId: 31,
            status: 'under_review',
            coverLetter: 'I am interested in this Engineering Manager position. With 10 years of experience leading technical teams, I have a proven track record of delivering successful projects while developing talent.',
            appliedAt: new Date('2024-12-02').toISOString(),
            updatedAt: new Date('2024-12-11').toISOString(),
        },
        {
            userId: 9,
            jobId: 37,
            status: 'submitted',
            coverLetter: 'As a senior engineering leader, I am excited about driving technical strategy at your organization. My experience in scaling teams and systems aligns well with your company\'s growth trajectory.',
            appliedAt: new Date('2024-12-08').toISOString(),
            updatedAt: new Date('2024-12-08').toISOString(),
        },

        // Robert Martinez (10, mid, frontend) - 2 applications
        {
            userId: 10,
            jobId: 14,
            status: 'draft',
            coverLetter: null,
            appliedAt: new Date('2024-12-18').toISOString(),
            updatedAt: new Date('2024-12-18').toISOString(),
        },
        {
            userId: 10,
            jobId: 19,
            status: 'submitted',
            coverLetter: 'I am excited about this Frontend Engineer role. My 3 years of experience with React and modern web technologies make me a strong candidate. I am passionate about creating beautiful and performant user interfaces.',
            appliedAt: new Date('2024-12-13').toISOString(),
            updatedAt: new Date('2024-12-13').toISOString(),
        },
    ];

    await db.insert(applications).values(sampleApplications);
    
    console.log('✅ Applications seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});