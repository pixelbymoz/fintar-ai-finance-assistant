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

async function updateUsersTable() {
  try {
    console.log('🔧 Mengupdate struktur tabel users...');

    // Check if columns exist first
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
    `;
    
    const columnNames = columns.map(col => col.column_name);
    console.log('📋 Kolom yang ada:', columnNames);

    // Add missing columns if they don't exist
    if (!columnNames.includes('first_name')) {
      await sql`ALTER TABLE public.users ADD COLUMN first_name TEXT`;
      console.log('✅ Kolom first_name ditambahkan');
    }

    if (!columnNames.includes('last_name')) {
      await sql`ALTER TABLE public.users ADD COLUMN last_name TEXT`;
      console.log('✅ Kolom last_name ditambahkan');
    }

    if (!columnNames.includes('image_url')) {
      await sql`ALTER TABLE public.users ADD COLUMN image_url TEXT`;
      console.log('✅ Kolom image_url ditambahkan');
    }

    if (!columnNames.includes('created_at')) {
      await sql`ALTER TABLE public.users ADD COLUMN created_at TIMESTAMP DEFAULT NOW()`;
      console.log('✅ Kolom created_at ditambahkan');
    }

    if (!columnNames.includes('updated_at')) {
      await sql`ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW()`;
      console.log('✅ Kolom updated_at ditambahkan');
    }

    console.log('🎉 Struktur tabel users berhasil diupdate!');

  } catch (error) {
    console.error('❌ Error updating users table:', error);
    process.exit(1);
  }
}

updateUsersTable();