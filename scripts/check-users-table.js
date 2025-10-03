import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

// Read .env.local file manually
const envContent = readFileSync(".env.local", "utf8");
const envLines = envContent.split("\n");
const envVars = {};

envLines.forEach(line => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    let value = valueParts.join("=").trim();
    // Remove quotes
    value = value.replace(/^["']|["']$/g, '');
    envVars[key.trim()] = value;
  }
});

// Parse DATABASE_URL
let databaseUrl = envVars.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL not found in environment variables");
}

// Remove quotes if present
databaseUrl = databaseUrl.replace(/^["']|["']$/g, '');

console.log("Connecting to database...");
const sql = neon(databaseUrl);

async function checkUsersTable() {
  try {
    console.log("Checking users table structure...");
    
    // Check table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    console.log("Users table columns:");
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Check if there are any users
    const userCount = await sql`SELECT COUNT(*) as count FROM public.users`;
    console.log(`\nTotal users in table: ${userCount[0].count}`);
    
    // Try to select from users table
    const users = await sql`SELECT id, email, first_name, last_name FROM public.users LIMIT 3`;
    console.log("\nSample users:");
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.first_name} ${user.last_name}`);
    });
    
  } catch (error) {
    console.error("Error checking users table:", error);
  }
}

checkUsersTable();