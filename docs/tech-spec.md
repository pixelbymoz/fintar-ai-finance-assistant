Technical Specification: Fintar
Version: 1.3
Date: October 4, 2025

1. Introduction
1.1. Project Overview
This document outlines the technical specification for Fintar, an AI-powered business finance tracker. The application will enable users to track their business's income, expenses, and assets through a conversational AI assistant. A comprehensive dashboard will provide visualizations and insights based on the collected data. The goal is to simplify financial data entry and provide users with an intelligent, at-a-glance overview of their business's financial health.

1.2. Target Audience
This application is designed for small business owners, freelancers, and entrepreneurs who need a simple yet powerful tool to manage their business finances without the steep learning curve of traditional accounting software.

1.3. Technology Stack
Framework: Next.js 15 (React Server Components, App Router)

Authentication: Clerk

Database: Neon (Serverless Postgres)

UI Components: Shadcn/ui

AI/LLM Integration: Vercel AI SDK with OpenAI GPT-4o

Deployment: Vercel

2. Core Features
2.1. AI Chatbot Assistant
Natural Language Input: Users can conversationally input financial data. For example: "I spent $50 on office supplies at Staples today," "Received a payment of $1,200 from Client X for project Y," or "I bought a new work laptop for $2,500."

Data Parsing & Categorization: The AI assistant, powered by GPT-4o, will parse the user's input to identify the type of transaction (income, expense, asset), amount, date, category, and description.

Database Interaction: After parsing and confirming with the user (optional), the assistant will create a structured record and insert it into the appropriate table in the Neon database.

Conversational Feedback: The chatbot will provide confirmation and context-aware responses to user inputs.

2.2. Financial Dashboard
At-a-Glance Metrics: The dashboard will display key financial metrics such as Total Income, Total Expenses, and Net Profit/Loss over selectable time periods (e.g., last 30 days, current quarter, year-to-date).

Visualizations: Interactive charts and graphs (e.g., bar charts for income vs. expenses, pie charts for expense categories) will provide a visual breakdown of financial data.

Recent Transactions: A sortable and filterable table will display the most recent income, expense, and asset entries.

Asset Overview: A dedicated section will list all business assets and their current value.

AI-Generated Insights: The dashboard will feature a section where the AI provides simple, actionable insights, such as "Your spending on 'Software Subscriptions' was 20% higher this month" or "Your highest-earning client this quarter is Client X."

2.3. User Authentication & Security
Secure Sign-up & Sign-in: Clerk will handle user registration, login, and session management via its pre-built modal components, providing a secure and seamless authentication experience.

Multi-tenancy: The database schema and application logic will be designed to ensure that each user's financial data is strictly isolated and accessible only to them. This will be enforced using userId foreign keys in all data tables, linked to the Clerk user ID.

3. User Flow
Onboarding:

A new user lands on the marketing page and clicks a "Sign Up" or "Sign In" button.

This action triggers the corresponding Clerk modal component to open directly on the page. The user completes the authentication process within the modal.

Upon successful registration and first login, a new user record is created in our database, and they are directed to the main application dashboard.

Data Entry via Chatbot:

The user navigates to the Chatbot interface.

They type a financial transaction into the chat input, e.g., "paid $150 for my monthly Adobe subscription."

The Vercel AI SDK sends this prompt to the GPT-4o model with instructions to extract structured JSON data.

The model returns a structured object, e.g., { "type": "expense", "amount": 150, "category": "Software", "description": "Monthly Adobe subscription", "date": "2025-10-04" }.

The application backend receives this object, validates it, and inserts it into the expenses table, associating it with the authenticated user's userId.

The chatbot UI updates with a confirmation message: "Got it! I've logged an expense of $150 for 'Monthly Adobe subscription'."

Viewing the Dashboard:

The user navigates to the Dashboard page.

The Next.js server component fetches all financial data (income, expenses, assets) associated with the logged-in user's userId from the Neon database.

The data is passed to client components, which render the summary metrics, charts, and recent transaction tables.

A separate API call might trigger the AI to generate fresh insights based on the latest data.

4. Database Schema (Neon - PostgreSQL)
All tables will be linked to a user via a user_id field, which corresponds to the ID provided by Clerk Auth.

```sql
-- 01-initial-schema.sql
-- Migration script for setting up the initial database schema and RLS policies.

-- =========
-- TABLE CREATION
-- =========

-- Table to store user-specific profile information (optional, complements Clerk)
CREATE TABLE public.users (
  "id" VARCHAR(255) PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE public.users IS 'Stores public user data that complements Clerk.';

-- Table to track all business expenses
CREATE TABLE public.expenses (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" VARCHAR(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "amount" DECIMAL(10, 2) NOT NULL,
  "description" TEXT NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "expense_date" DATE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE public.expenses IS 'Tracks all business-related expenses for each user.';

-- Table to track all sources of income
CREATE TABLE public.income (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" VARCHAR(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "amount" DECIMAL(10, 2) NOT NULL,
  "description" TEXT NOT NULL,
  "category" VARCHAR(100) NOT NULL,
  "income_date" DATE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE public.income IS 'Tracks all sources of income for each user.';

-- Table to track business assets and investments
CREATE TABLE public.assets (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" VARCHAR(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "purchase_price" DECIMAL(10, 2) NOT NULL,
  "current_value" DECIMAL(10, 2) NOT NULL,
  "purchase_date" DATE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE public.assets IS 'Tracks all tangible and intangible business assets for each user.';


-- =========
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- This assumes you have a function `auth.uid()` that returns the current user's ID from the JWT.
-- You will need to create this helper function in your database.
-- Example function:
--
-- CREATE OR REPLACE FUNCTION auth.uid() RETURNS text AS $$
--   SELECT nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
-- $$ LANGUAGE sql STABLE;
-- =========

-- RLS for 'expenses' table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own expenses"
  ON public.expenses FOR ALL
  USING ( (SELECT auth.uid()) = user_id )
  WITH CHECK ( (SELECT auth.uid()) = user_id );

-- RLS for 'income' table
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own income"
  ON public.income FOR ALL
  USING ( (SELECT auth.uid()) = user_id )
  WITH CHECK ( (SELECT auth.uid()) = user_id );

-- RLS for 'assets' table
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own assets"
  ON public.assets FOR ALL
  USING ( (SELECT auth.uid()) = user_id )
  WITH CHECK ( (SELECT auth.uid()) = user_id );
```

5. AI Integration Details
5.1. Vercel AI SDK and GPT-4o
We will use the generateObject function from the Vercel AI SDK to get structured data back from the LLM.

Prompt Engineering: The system prompt sent to GPT-4o will instruct it to act as a financial assistant. It will be explicitly told to analyze the user's text and extract key information, fitting it into a predefined Zod schema that matches our database structure.

Schema Definition: We will define Zod schemas for income, expense, and asset transactions. These schemas will enforce types and constraints (e.g., amount must be a positive number).

Example API Route Logic (/api/chat):

Receive the user's message from the frontend.

Get the authenticated userId from Clerk's auth() helper.

Construct a prompt for GPT-4o, including the user's message and a system instruction.

Call generateObject with the model, the prompt, and the Zod schema.

The AI SDK handles the API call and returns a validated, typed JavaScript object.

Use the returned object to perform a database INSERT operation into the correct table (income, expenses, or assets), including the userId.

Return a success message to the frontend to be displayed in the chat interface.

6. Frontend Architecture (Next.js)
6.1. UI & Design System
Font: Open Sans (to be imported from Google Fonts).

Color Scheme:

Primary: #010B13 (Very dark blue, for text, headers, and primary UI elements)

Secondary: #eec1a0 (Soft beige/tan, for call-to-action buttons, highlights)

Accent: #a9a9a9 (Medium gray, for borders, disabled states, secondary text)

Background: #FEFEFA (White, for main content background)

6.2. app/ Directory Structure
(dashboard): Route group for protected routes, accessible after authentication.

dashboard/page.tsx: The main dashboard view (Server Component for initial data fetch).

chatbot/page.tsx: The AI assistant interface.

layout.tsx: Main layout for the dashboard area, with sidebar navigation and the Clerk <UserButton />.

A global layout.tsx in the app root will manage the main page structure and include Clerk's <SignInButton> and <SignUpButton> in the header for unauthenticated users.

6.3. Components (components/)
Chat.tsx: Client component managing the chat interface, state, and API calls to the chatbot backend.

IncomeExpenseChart.tsx: Client component for data visualization using a library like Recharts.

RecentTransactions.tsx: Component to display transaction data in a Shadcn DataTable.

6.4. State Management
Primarily managed with React hooks (useState, useEffect). For shared state across the chat and dashboard, React Context or a lightweight state manager like Zustand could be used if necessary.

7. Deployment
The application will be deployed on Vercel. Environment variables for the Neon database connection string, Clerk API keys, and OpenAI API key will be configured in the Vercel project settings. The Neon Vercel integration will be used for seamless database connection management.