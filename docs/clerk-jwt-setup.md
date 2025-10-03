# Setup JWT Template untuk Neon di Clerk Dashboard

## Langkah-langkah Setup JWT Template

### 1. Akses Clerk Dashboard
1. Buka [Clerk Dashboard](https://dashboard.clerk.com/)
2. Login dengan akun Anda
3. Pilih aplikasi Fintar yang sudah dibuat

### 2. Navigasi ke JWT Templates
1. Di sidebar kiri, klik **"JWT Templates"**
2. Klik tombol **"New template"**

### 3. Konfigurasi Template untuk Neon
1. **Template Name**: `neon`
2. **Signing Algorithm**: `RS256` (default)
3. **Token Lifetime**: `60` seconds (default)

### 4. Claims Configuration
Tambahkan claims berikut di bagian **Claims**:

```json
{
  "aud": "authenticated",
  "exp": "{{exp}}",
  "iat": "{{iat}}",
  "iss": "{{iss}}",
  "sub": "{{sub}}",
  "email": "{{user.email_addresses.0.email_address}}",
  "role": "authenticated"
}
```

### 5. Simpan Template
1. Klik **"Save"** untuk menyimpan template
2. Template akan tersedia dengan nama `neon`

### 6. Update Environment Variables
Setelah template dibuat, tambahkan ke file `.env.local`:

```env
# JWT Template untuk Neon
CLERK_JWT_TEMPLATE_NAME=neon
```

### 7. Verifikasi Setup
Template JWT ini akan memungkinkan:
- Integrasi yang lebih baik antara Clerk dan Neon
- Row Level Security (RLS) yang optimal
- Autentikasi yang aman untuk database queries

## Catatan Penting
- Template ini khusus untuk integrasi dengan Neon Database
- Claims `sub` akan berisi Clerk user ID yang digunakan untuk RLS
- Claims `email` akan berisi email address user
- Role `authenticated` menandakan user yang sudah login

## Troubleshooting
Jika mengalami masalah:
1. Pastikan template name adalah `neon`
2. Verifikasi claims configuration sesuai dengan format di atas
3. Restart aplikasi setelah menambahkan environment variable