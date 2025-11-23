# 🔐 Environment Variables Checklist - HERO App

## Vercel Deployment Configuration

This document lists all environment variables that need to be configured in the Vercel project settings before deployment.

---

## 📋 Current Status: No Environment Variables Required

✅ **Good News!** The current build does not require any environment variables to deploy successfully.

The application is currently frontend-only and does not integrate with any external services yet.

---

## 🔮 Future Environment Variables (When Supabase Integration is Added)

According to the README.md, when Supabase integration is implemented, you will need to add the following variables:

### Required Variables:

#### **Supabase Configuration**
```bash
# Public Supabase URL (Safe to expose to client)
NEXT_PUBLIC_SUPABASE_URL=

# Public Supabase Anonymous Key (Safe to expose to client)
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### **Optional: Server-Side Supabase Configuration**
```bash
# Supabase Service Role Key (NEVER expose to client - server-side only)
SUPABASE_SERVICE_ROLE_KEY=
```

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

When you set up Supabase integration:

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon)
3. Navigate to **API** section
4. Copy the values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys** → `service_role` `secret` → `SUPABASE_SERVICE_ROLE_KEY` (if needed)

---

## ⚠️ Security Best Practices

### ✅ Safe to Expose (NEXT_PUBLIC_* prefix)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are designed to be exposed to the client-side and are protected by Supabase Row Level Security (RLS) policies.

### 🔒 NEVER Expose to Client
- `SUPABASE_SERVICE_ROLE_KEY`

This key bypasses all RLS policies. Only use in server-side code (API routes, server components, edge functions).

---

## 🧪 Testing Environment Variables Locally

Create a `.env.local` file in the root of your project (this file is gitignored):

```bash
# .env.local (DO NOT COMMIT THIS FILE)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Next.js will automatically load these variables during development.

---

## 📊 Current Build Status

- ✅ **TypeScript**: Strict mode enabled, no errors
- ✅ **ESLint**: No linting errors
- ✅ **Build**: Production build successful
- ✅ **Environment Variables**: None required for current version
- ✅ **PWA**: Manifest configured correctly

---

## 🚀 Ready for Deployment

Your application is **ready to deploy to Vercel** as-is. No environment variables are needed for the current version.

When you add Supabase integration later, return to this document and configure the environment variables listed in the "Future" section above.

---

**Last Updated**: November 2024  
**Project**: HERO - Plataforma de Otimização Masculina  
**Stack**: Next.js 16 + TypeScript + Tailwind CSS
