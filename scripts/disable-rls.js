const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

// Load environment variables manually
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const envContent = fs.readFileSync(envPath, "utf8");
  
  envContent.split("\n").forEach(line => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/"/g, "");
    }
  });
}

loadEnv();

async function disableRLS() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment");
  }

  const sql = neon(connectionString);
  
  try {
    console.log("Disabling RLS for simpler integration...");
    
    // Disable RLS on all tables
    await sql`ALTER TABLE public.users DISABLE ROW LEVEL SECURITY`;
    await sql`ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY`;
    await sql`ALTER TABLE public.income DISABLE ROW LEVEL SECURITY`;
    await sql`ALTER TABLE public.assets DISABLE ROW LEVEL SECURITY`;
    
    // Drop existing policies
    await sql`DROP POLICY IF EXISTS users_policy ON public.users`;
    await sql`DROP POLICY IF EXISTS expenses_policy ON public.expenses`;
    await sql`DROP POLICY IF EXISTS income_policy ON public.income`;
    await sql`DROP POLICY IF EXISTS assets_policy ON public.assets`;
    
    console.log("✅ RLS disabled successfully!");
    
  } catch (error) {
    console.error("❌ Failed to disable RLS:", error);
    process.exit(1);
  }
}

disableRLS();