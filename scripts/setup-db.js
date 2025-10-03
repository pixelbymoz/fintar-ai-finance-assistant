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

async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment");
  }

  const sql = neon(connectionString);
  
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, "..", "src", "lib", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    
    // Split schema into individual statements
    const statements = schema
      .split(";")
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log("Setting up database schema...");
    
    // Execute each statement
    for (const statement of statements) {
      try {
        await sql(statement);
        console.log("✓ Executed:", statement.substring(0, 50) + "...");
      } catch (error) {
        console.log("⚠ Warning:", statement.substring(0, 50) + "...", error.message);
      }
    }
    
    console.log("✅ Database setup completed!");
    
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();