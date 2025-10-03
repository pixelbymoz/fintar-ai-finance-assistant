const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim();
        let value = line.substring(equalIndex + 1).trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

const sql = neon(process.env.DATABASE_URL);

async function enableRLS() {
  try {
    console.log('🔒 Mengaktifkan Row Level Security (RLS)...');

    // Enable RLS on all tables
    await sql`ALTER TABLE public.users ENABLE ROW LEVEL SECURITY`;
    console.log('✅ RLS enabled on users table');

    await sql`ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY`;
    console.log('✅ RLS enabled on expenses table');

    await sql`ALTER TABLE public.income ENABLE ROW LEVEL SECURITY`;
    console.log('✅ RLS enabled on income table');

    await sql`ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY`;
    console.log('✅ RLS enabled on assets table');

    // Create RLS policies for users table
    await sql`
      CREATE POLICY users_policy ON public.users
      FOR ALL
      USING (id = current_setting('app.current_user_id', true))
    `;
    console.log('✅ RLS policy created for users table');

    // Create RLS policies for expenses table
    await sql`
      CREATE POLICY expenses_policy ON public.expenses
      FOR ALL
      USING (user_id = current_setting('app.current_user_id', true))
    `;
    console.log('✅ RLS policy created for expenses table');

    // Create RLS policies for income table
    await sql`
      CREATE POLICY income_policy ON public.income
      FOR ALL
      USING (user_id = current_setting('app.current_user_id', true))
    `;
    console.log('✅ RLS policy created for income table');

    // Create RLS policies for assets table
    await sql`
      CREATE POLICY assets_policy ON public.assets
      FOR ALL
      USING (user_id = current_setting('app.current_user_id', true))
    `;
    console.log('✅ RLS policy created for assets table');

    console.log('🎉 Row Level Security berhasil diaktifkan!');
    console.log('📝 Pastikan untuk mengupdate kode aplikasi untuk menggunakan RLS dengan benar.');

  } catch (error) {
    console.error('❌ Error enabling RLS:', error);
    process.exit(1);
  }
}

enableRLS();