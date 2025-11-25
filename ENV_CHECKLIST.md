# 🔐 Environment Variables Checklist - HERO App

## Vercel Deployment Configuration

This document lists all environment variables that need to be configured in the Vercel project settings before deployment.

---

## 📋 Current Status: Supabase Integration Active

⚠️ **Important!** Supabase authentication is now integrated. You need to configure the following environment variables for the app to work properly.

---

## 🔑 Required Environment Variables

### Required Variables (Supabase):

#### **Supabase Configuration**
```bash
# Public Supabase URL (Safe to expose to client)
NEXT_PUBLIC_SUPABASE_URL=

# Public Supabase Anonymous Key (Safe to expose to client)
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

These variables are **required** for authentication to work. Without them:
- Login and Signup forms will show errors
- Middleware will allow all requests (no auth protection)
- Auth callback will redirect to login with error

---

## 📝 How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select which environments need the variable:
   - **Production** (required for live site)
   - **Preview** (recommended for PR previews)
   - **Development** (optional for local development)
5. Click **Save**
6. Redeploy your application for changes to take effect

---

## 🔍 How to Find Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click on **Settings** (gear icon)
3. Navigate to **API** section
4. Copy the values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ⚠️ Security Best Practices

### ✅ Safe to Expose (NEXT_PUBLIC_* prefix)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are designed to be exposed to the client-side and are protected by Supabase Row Level Security (RLS) policies.

### 🔒 NEVER Expose to Client
- `SUPABASE_SERVICE_ROLE_KEY` (only add if needed for server-side operations)

This key bypasses all RLS policies. Only use in server-side code (API routes, server components, edge functions).

---

## 🧪 Testing Environment Variables Locally

Create a `.env.local` file in the root of your project (this file is gitignored):

```bash
# .env.local (DO NOT COMMIT THIS FILE)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Next.js will automatically load these variables during development.

---

## 🔄 Authentication Flow

After setting up the environment variables, the authentication flow will work as follows:

1. **Signup**: User creates account → Email verification sent → User clicks link → Callback route sets session cookie → User redirected to `/quiz`
2. **Login**: User enters credentials → Session established → Router refreshed → User redirected to `/homepage`
3. **Protected Routes**: Middleware checks session cookies → Redirects unauthenticated users to `/login`
4. **Auth Routes**: Middleware checks session cookies → Redirects authenticated users to `/homepage`

Protected routes: `/dashboard`, `/quiz`, `/homepage`
Auth routes: `/login`, `/signup`

---

## 📊 Current Build Status

- ✅ **TypeScript**: Strict mode enabled, no errors
- ✅ **ESLint**: No linting errors
- ✅ **Build**: Production build successful
- ⚠️ **Environment Variables**: Required for authentication
- ✅ **PWA**: Manifest configured correctly

---

## 🚀 Deployment Steps

1. Configure environment variables in Vercel (see above)
2. Deploy application
3. Configure Supabase redirect URLs in Supabase dashboard:
   - Add `https://your-domain.vercel.app/auth/callback` to allowed redirect URLs
   - Add your custom domain if applicable

---

**Last Updated**: November 2024  
**Project**: HERO - Plataforma de Otimização Masculina  
**Stack**: Next.js 16 + TypeScript + Tailwind CSS + Supabase SSR Auth
