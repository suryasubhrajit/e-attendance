# PostgreSQL Setup Guide for Vercel

## ✅ Project Updated to PostgreSQL

Your schema has been updated to use PostgreSQL. Here's how to set it up:

---

## Step 1: Setup Vercel Postgres Database

### A. Create Database in Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `e-attendance`
3. Click the **Storage** tab at the top
4. Click **Create Database**
5. Select **Postgres**
6. Configure:
   - **Database Name**: `attendance-db` (or any name you prefer)
   - **Region**: Choose closest to your users (e.g., Washington D.C. - iad1)
7. Click **Create**

### B. Connect Database to Project

1. After creation, you'll see your new database
2. Click **Connect Project**
3. Select your project: `e-attendance`
4. Choose environments: ✅ Production, ✅ Preview, ✅ Development
5. Click **Connect**

**Done!** Vercel automatically adds these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` (use this one)
- `POSTGRES_URL_NON_POOLING`
- And others...

### C. Update Environment Variable Name

Vercel creates `POSTGRES_PRISMA_URL` but your app uses `DATABASE_URL`:

1. In Vercel → Settings → Environment Variables
2. Click **Add New**
3. **Key**: `DATABASE_URL`
4. **Value**: Copy the value from `POSTGRES_PRISMA_URL`
5. Select all environments: Production, Preview, Development
6. Click **Save**

---

## Step 2: Add Other Required Environment Variables

In Vercel → Settings → Environment Variables, add:

### NEXTAUTH_SECRET
```
Key: NEXTAUTH_SECRET
Value: [Generate using command below]
Environments: Production, Preview, Development
```

**Generate secret:**
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

### NEXTAUTH_URL
```
Key: NEXTAUTH_URL
Value: https://your-app-name.vercel.app
Environments: Production, Preview
```

For Development:
```
Key: NEXTAUTH_URL
Value: http://localhost:3000
Environment: Development only
```

### NODE_ENV
```
Key: NODE_ENV
Value: production
Environment: Production only
```

---

## Step 3: Initialize Database

After connecting the database, you need to create the tables.

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Pull environment variables:
```bash
vercel env pull .env.local
```

4. Run migration:
```bash
npx prisma db push
```

5. Seed database (optional):
```bash
npx prisma db seed
```

### Option B: Add to Build Command

Update your build command in Vercel:

1. Go to Settings → General → Build & Development Settings
2. **Build Command**: 
```bash
prisma generate && prisma db push --accept-data-loss && next build
```

**Note:** This will run migrations on every deployment.

---

## Step 4: Deploy

### Push Changes to GitHub

```bash
git add .
git commit -m "Update to PostgreSQL for Vercel deployment"
git push origin master
```

Vercel will automatically deploy!

---

## Step 5: Verify Deployment

1. Wait for deployment to complete
2. Visit your site: `https://your-app.vercel.app`
3. Check if the database connection works
4. Try logging in or creating a user

---

## Local Development (Optional)

If you want to use PostgreSQL locally too:

### Option 1: Use Vercel Postgres Locally
```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Use the database
npm run dev
```

### Option 2: Install PostgreSQL Locally
1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create database: `createdb attendance_db`
3. Update `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/attendance_db"
```
4. Run migrations:
```bash
npx prisma db push
npx prisma db seed
```

### Option 3: Keep Using SQLite Locally
Keep your `.env` as is with SQLite for local development.
Only Vercel will use PostgreSQL (from environment variables).

---

## Troubleshooting

### Error: "Can't reach database server"
- Check if DATABASE_URL is set in Vercel
- Verify the connection string is correct
- Make sure database is in the same region as your deployment

### Error: "Table does not exist"
- Run `npx prisma db push` to create tables
- Or add it to your build command

### Error: "Environment variable not found: DATABASE_URL"
- Make sure you added DATABASE_URL in Vercel environment variables
- Redeploy after adding variables

---

## Summary Checklist

- [ ] Create Vercel Postgres database
- [ ] Connect database to project
- [ ] Add DATABASE_URL environment variable
- [ ] Add NEXTAUTH_SECRET environment variable
- [ ] Add NEXTAUTH_URL environment variable
- [ ] Push code to GitHub
- [ ] Wait for deployment
- [ ] Run database migrations (via CLI or build command)
- [ ] Test the deployed site

---

## Need Help?

If you encounter any issues, check:
1. Vercel deployment logs
2. Database connection in Vercel dashboard
3. Environment variables are set correctly

Your project is now ready for PostgreSQL! 🚀
