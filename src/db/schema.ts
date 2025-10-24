import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users table (This is commented out as it was merged into the 'user' table below)
// export const users = sqliteTable('users', {
//   id: integer('id').primaryKey({ autoIncrement: true }),
//   email: text('email').notNull().unique(),
//   name: text('name').notNull(),
//   bio: text('bio'),
//   experienceLevel: text('experience_level').notNull(), // 'entry', 'mid', 'senior'
//   location: text('location'),
//   resumeUrl: text('resume_url'),
//   createdAt: text('created_at').notNull(),
//   updatedAt: text('updated_at').notNull(),
// });

// Jobs table
export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  company: text('company').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  jobType: text('job_type').notNull(), // 'full-time', 'part-time', 'internship', 'contract'
  experienceLevel: text('experience_level').notNull(), // 'entry', 'mid', 'senior'
  postedDate: text('posted_date').notNull(),
  applicationDeadline: text('application_deadline'),
  status: text('status').notNull().default('active'), // 'active', 'closed'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Skills table
export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  category: text('category').notNull(), // 'technical', 'soft', 'language', 'tool'
});

// User Skills junction table
export const userSkills = sqliteTable('user_skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  proficiencyLevel: text('proficiency_level').notNull(), // 'beginner', 'intermediate', 'advanced', 'expert'
});

// Job Skills junction table
export const jobSkills = sqliteTable('job_skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  skillId: integer('skill_id').notNull().references(() => skills.id),
  required: integer('required', { mode: 'boolean' }).notNull().default(true),
});

// Applications table
export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  status: text('status').notNull().default('draft'), // 'draft', 'submitted', 'under_review', 'interview', 'rejected', 'accepted'
  coverLetter: text('cover_letter'),
  appliedAt: text('applied_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Bookmarks table
export const bookmarks = sqliteTable('bookmarks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  createdAt: text('created_at').notNull(),
});

// Interview Questions table
export const interviewQuestions = sqliteTable('interview_questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  category: text('category').notNull(), // 'behavioral', 'technical', 'situational'
  difficulty: text('difficulty').notNull(), // 'easy', 'medium', 'hard'
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),

  // --- Columns copied from 'users' table ---
  bio: text('bio'),
  experienceLevel: text('experience_level'), // You might want to add .notNull()
  location: text('location'),
  resumeUrl: text('resume_url'),
  // --- End of copied columns ---

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});