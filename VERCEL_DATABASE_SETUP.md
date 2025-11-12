# Fix: Database Tables Not Created on Vercel

## The Problem

You're getting this error:
```
table public.users does not exist in the current database
```

This means your PostgreSQL database on Vercel is empty - the tables haven't been created yet.

## Solution: Create Database Tables

### Step 1: Add DATABASE_URL to Development Environment

The DATABASE_URL is only set for Production/Preview, not Development. You need to either:

**Option A: Pull from Production**
```bash
vercel env pull .env.local --environment=production
```

**Option B: Manually copy from Vercel Dashboard**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `DATABASE_URL` or `POSTGRES_PRISMA_URL`
3. Copy the value
4. Create/update `.env.local`:
```
DATABASE_URL="your-postgres-url-here"
```

### Step 2: Create Tables Using Prisma

Once you have the DATABASE_URL in `.env.local`, run:

```bash
npx prisma db push
```

This will create all the tables in your Vercel PostgreSQL database.

### Step 3: (Optional) Seed Initial Data

If you have a seed script, run:
```bash
npx prisma db seed
```

---

## Alternative: Automatic Migration on Vercel

You can configure Vercel to automatically create tables on deployment:

### Update Build Command

1. Go to Vercel Dashboard → Your Project → Settings → General
2. Find "Build & Development Settings"
3. Update **Build Command** to:
```bash
prisma generate && prisma db push --accept-data-loss && next build
```

**Warning:** `--accept-data-loss` will reset your database on each deployment. For production, use migrations instead.

### Better Approach: Use Migrations

1. Create a migration locally:
```bash
npx prisma migrate dev --name init
```

2. Update Build Command to:
```bash
prisma generate && prisma migrate deploy && next build
```

3. Commit the migration files:
```bash
git add prisma/migrations
git commit -m "Add database migrations"
git push origin master
```

---

## Quick Fix (Recommended)

Run these commands in order:

```bash
# 1. Pull production environment variables
vercel env pull .env.local --environment=production

# 2. Create database tables
npx prisma db push

# 3. Verify tables were created
npx prisma studio
```

After this, your import should work!

---

## Verify Database Connection

To check if your database is properly connected:

1. Go to your Vercel deployment URL
2. Try to access: `https://your-app.vercel.app/api/health`
3. Or check: `https://your-app.vercel.app/api/test-db`

If you see a success message, the database is connected and tables exist.

---

## Common Issues

### Issue: "Can't reach database server"
**Solution:** Check if DATABASE_URL is correctly set in Vercel environment variables.

### Issue: "SSL connection required"
**Solution:** Your DATABASE_URL should include `?sslmode=require` at the end.

### Issue: "Tables still don't exist after db push"
**Solution:** Make sure you're using the correct DATABASE_URL (use POSTGRES_PRISMA_URL, not POSTGRES_URL).

---

## Need to Reset Database?

If you want to start fresh:

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or just push schema again
npx prisma db push --force-reset
```

---

## Summary

1. ✅ Pull DATABASE_URL from Vercel
2. ✅ Run `npx prisma db push` to create tables
3. ✅ Try importing again
4. ✅ (Optional) Update build command for automatic migrations

Your database should now be ready for imports!
