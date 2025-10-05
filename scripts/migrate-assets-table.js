const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local not found');
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim();
        let value = line.substring(equalIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

loadEnv();

async function migrateAssetsTable() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  const sql = neon(connectionString);

  try {
    console.log('🔧 Migrasi tabel assets: memastikan kolom dan tipe data sesuai...');

    // Tambahkan kolom purchase_date bila belum ada
    const cols = await sql`
      SELECT column_name, data_type, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_name = 'assets' AND table_schema = 'public'
    `;
    const colNames = cols.map(c => c.column_name);

    if (!colNames.includes('purchase_date')) {
      await sql`ALTER TABLE public.assets ADD COLUMN purchase_date DATE NOT NULL DEFAULT CURRENT_DATE`;
      console.log('✅ Kolom purchase_date ditambahkan');
      await sql`CREATE INDEX IF NOT EXISTS idx_assets_date ON public.assets(purchase_date)`;
      console.log('✅ Index idx_assets_date dibuat');
    } else {
      console.log('ℹ️ Kolom purchase_date sudah ada');
    }

    // Pastikan purchase_price dan current_value memiliki presisi cukup
    const getCol = (name) => cols.find(c => c.column_name === name) || {};
    const priceCol = getCol('purchase_price');
    const valueCol = getCol('current_value');

    const alterPurchasePrice = async () => {
      try {
        await sql`ALTER TABLE public.assets ALTER COLUMN purchase_price TYPE NUMERIC(14,2) USING purchase_price::NUMERIC(14,2)`;
        console.log('✅ Kolom purchase_price diubah ke NUMERIC(14,2)');
      } catch (err) {
        console.log('⚠️ Gagal mengubah tipe kolom purchase_price:', err.message);
      }
    };
    const alterCurrentValue = async () => {
      try {
        await sql`ALTER TABLE public.assets ALTER COLUMN current_value TYPE NUMERIC(14,2) USING current_value::NUMERIC(14,2)`;
        console.log('✅ Kolom current_value diubah ke NUMERIC(14,2)');
      } catch (err) {
        console.log('⚠️ Gagal mengubah tipe kolom current_value:', err.message);
      }
    };

    const needsUpgrade = (col) => {
      if (!col || col.data_type !== 'numeric') return true;
      const precision = Number(col.numeric_precision || 0);
      const scale = Number(col.numeric_scale || 0);
      return precision < 12 || scale !== 2; // upgrade bila presisi kecil atau skala bukan 2
    };

    if (needsUpgrade(priceCol)) {
      await alterPurchasePrice();
    } else {
      console.log('ℹ️ purchase_price sudah bertipe numeric dengan presisi memadai');
    }

    if (needsUpgrade(valueCol)) {
      await alterCurrentValue();
    } else {
      console.log('ℹ️ current_value sudah bertipe numeric dengan presisi memadai');
    }

    console.log('🎉 Migrasi assets selesai');
  } catch (error) {
    console.error('❌ Migrasi assets gagal:', error);
    process.exit(1);
  }
}

migrateAssetsTable();