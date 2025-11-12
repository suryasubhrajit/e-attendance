# Quick Fix: Create Database Tables on Vercel

## The Problem
Your Vercel PostgreSQL database exists but has no tables. That's why imports fail with "table does not exist" error.

## Quick Solution (2 Steps)

### Step 1: Get Your Database URL from Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: **e-attendance**
3. Go to **Settings** → **Environment Variables**
4. Find `DATABASE_URL` or `POSTGRES_PRISMA_URL`
5. Click the eye icon to reveal the value
6. Copy the entire URL (it looks like: `postgresql://...`)

### Step 2: Create Tables Using Vercel Postgres Tab

**Option A: Using Vercel Dashboard (Easiest)**

1. In your Vercel project, go to the **Storage** tab
2. Click on your Postgres database
3. Click **Data** → **Query**
4. Run this SQL to create all tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create admins table
CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS "teachers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "employeeId" TEXT NOT NULL UNIQUE,
    "department" TEXT NOT NULL,
    "isHOD" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create students table
CREATE TABLE IF NOT EXISTS "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "rollNo" TEXT NOT NULL UNIQUE,
    "phone" TEXT,
    "semester" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "fatherName" TEXT,
    "motherName" TEXT,
    "bloodGroup" TEXT,
    "category" TEXT,
    "address" TEXT,
    "admissionYear" TEXT,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create classes table
CREATE TABLE IF NOT EXISTS "classes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "semester" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("teacherId") REFERENCES "teachers"("id")
);

-- Create student_classes table
CREATE TABLE IF NOT EXISTS "student_classes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE,
    FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE,
    UNIQUE ("studentId", "classId")
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS "attendance_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("classId") REFERENCES "classes"("id"),
    FOREIGN KEY ("teacherId") REFERENCES "teachers"("id"),
    UNIQUE ("classId", "date")
);

-- Create attendances table
CREATE TABLE IF NOT EXISTS "attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attendanceRecordId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "topic" TEXT,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("attendanceRecordId") REFERENCES "attendance_records"("id") ON DELETE CASCADE,
    FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE,
    UNIQUE ("studentId", "attendanceRecordId")
);
```

5. Click **Run Query**
6. You should see "Success" messages

**Option B: Using Prisma (If you have DATABASE_URL locally)**

If you managed to get the DATABASE_URL:

1. Add it to `.env.local`:
```
DATABASE_URL="postgresql://..."
```

2. Run:
```bash
npx prisma db push
```

---

## Verify Tables Were Created

### Method 1: Check in Vercel Dashboard
1. Go to Storage → Your Postgres DB → Data
2. You should see all 8 tables listed

### Method 2: Test the API
1. Go to your deployed site
2. Visit: `https://your-app.vercel.app/api/test-db`
3. You should see a success message

---

## After Tables Are Created

1. Go back to your site
2. Try importing teachers/students again
3. It should work now!

---

## Alternative: Automatic Setup on Next Deployment

Add this to your `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma db push --accept-data-loss && next build"
  }
}
```

Then in Vercel:
1. Settings → General → Build & Development Settings
2. Build Command: `npm run build`
3. Redeploy

**Warning:** This will reset your database on each deployment!

---

## Need Help?

If you're stuck, the easiest way is:
1. Go to Vercel Dashboard → Storage → Your Postgres → Data → Query
2. Copy and paste the SQL above
3. Click Run Query
4. Done!

Your database will be ready for imports immediately after running the SQL.
