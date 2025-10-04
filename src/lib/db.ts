import { neon } from "@neondatabase/serverless";
import { currentUser } from "@clerk/nextjs/server";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

export const sql = neon(connectionString);

// Helper function untuk set RLS context
async function setUserContext(userId: string) {
  // Escape userId untuk keamanan
  const escapedUserId = userId.replace(/'/g, "''");
  // Gunakan sql.query untuk perintah utility (SET LOCAL tidak mendukung parameter binding)
  await sql.query(`SET LOCAL app.current_user_id = '${escapedUserId}'`);
}

// Helper function untuk create atau update user dari Clerk
export async function syncUserWithClerk() {
  const user = await currentUser();
  if (!user) return null;

  // Sync user data dengan database
  await sql`
    INSERT INTO public.users (id, email, first_name, last_name, image_url, updated_at)
    VALUES (
      ${user.id}, 
      ${user.emailAddresses[0]?.emailAddress || ''}, 
      ${user.firstName || ''}, 
      ${user.lastName || ''}, 
      ${user.imageUrl || ''}, 
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      image_url = EXCLUDED.image_url,
      updated_at = NOW()
  `;

  return user.id;
}

export async function getTotals() {
  // Sync user dengan Clerk dan set RLS context
  const userId = await syncUserWithClerk();
  if (!userId) throw new Error("User not authenticated");
  
  await setUserContext(userId);

  const incomeRows = await sql`
    SELECT COALESCE(SUM(amount::float8), 0)::float8 as sum 
    FROM public.income
    WHERE user_id = ${userId}
  `;

  const expensesRows = await sql`
    SELECT COALESCE(SUM(amount::float8), 0)::float8 as sum 
    FROM public.expenses
    WHERE user_id = ${userId}
  `;

  const assetsRows = await sql`
    SELECT COALESCE(SUM(current_value::float8), 0)::float8 as sum 
    FROM public.assets
    WHERE user_id = ${userId}
  `;

  const income = Number(incomeRows[0]?.sum ?? 0);
  const expenses = Number(expensesRows[0]?.sum ?? 0);
  const assets = Number(assetsRows[0]?.sum ?? 0);

  return {
    income,
    expenses,
    assets,
    netWorth: income - expenses + assets,
  };
}

export async function getRecent() {
  // Sync user dengan Clerk dan set RLS context
  const userId = await syncUserWithClerk();
  if (!userId) throw new Error("User not authenticated");
  
  await setUserContext(userId);

  const transactions = await sql`
    SELECT id::text as id, amount::float8 as amount, description, category, expense_date::text as date, 'expense' as type
    FROM public.expenses
    WHERE user_id = ${userId}
    UNION ALL
    SELECT id::text as id, amount::float8 as amount, description, category, income_date::text as date, 'income' as type
    FROM public.income
    WHERE user_id = ${userId}
    UNION ALL
    SELECT id::text as id, purchase_price::float8 as amount, name as description, 'Investment' as category, purchase_date::text as date, 'asset' as type
    FROM public.assets
    WHERE user_id = ${userId}
    ORDER BY date DESC
    LIMIT 10
  `;

  return transactions;
}

export async function getAllTransactions() {
  // Sync user dengan Clerk dan set RLS context
  const userId = await syncUserWithClerk();
  if (!userId) throw new Error("User not authenticated");
  
  await setUserContext(userId);

  const transactions = await sql`
    SELECT id::text as id, amount::float8 as amount, description, category, expense_date::text as date, 'expense' as type
    FROM public.expenses
    WHERE user_id = ${userId}
    UNION ALL
    SELECT id::text as id, amount::float8 as amount, description, category, income_date::text as date, 'income' as type
    FROM public.income
    WHERE user_id = ${userId}
    UNION ALL
    SELECT id::text as id, purchase_price::float8 as amount, name as description, 'Investment' as category, purchase_date::text as date, 'asset' as type
    FROM public.assets
    WHERE user_id = ${userId}
    ORDER BY date DESC
  `;

  return transactions;
}

type ExpenseInput = { type: "expense"; amount: number; category: string; description: string; date: string };
type IncomeInput = { type: "income"; amount: number; category: string; description: string; date: string };
type AssetInput = { type: "asset"; name: string; description?: string; purchasePrice: number; currentValue: number; date: string };
type InsertInput = ExpenseInput | IncomeInput | AssetInput;

export async function insertTransaction(input: InsertInput) {
  // Sync user dengan Clerk dan set RLS context
  const userId = await syncUserWithClerk();
  if (!userId) throw new Error("User not authenticated");
  
  await setUserContext(userId);

  try {
    if (input.type === "expense") {
      const result = await sql`
        INSERT INTO public.expenses (user_id, amount, description, category, expense_date)
        VALUES (${userId}, ${input.amount}, ${input.description}, ${input.category}, ${input.date})
        RETURNING *
      `;
      return result[0];
    } else if (input.type === "income") {
      const result = await sql`
        INSERT INTO public.income (user_id, amount, description, category, income_date)
        VALUES (${userId}, ${input.amount}, ${input.description}, ${input.category}, ${input.date})
        RETURNING *
      `;
      return result[0];
    } else if (input.type === "asset") {
      const result = await sql`
        INSERT INTO public.assets (user_id, name, description, purchase_price, current_value, purchase_date)
        VALUES (
          ${userId},
          ${input.name},
          ${input.description || ''},
          ${input.purchasePrice},
          ${input.currentValue},
          ${input.date}
        )
        RETURNING *
      `;
      return result[0];
    }
  } catch (error) {
    console.error(`Error inserting ${input.type}:`, error);
    throw error;
  }
}