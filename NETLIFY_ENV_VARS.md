# 📝 NETLIFY ENVIRONMENT VARIABLES

Netlify Dashboard'da "Import environment variables" kutusuna aşağıdaki tüm değişkenleri kopyala-yapıştır:

```env
DATABASE_URL=postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=shoe_store_super_secret_jwt_key_2026_production_12345
NEXT_PUBLIC_API_URL=/.netlify/functions/api
NODE_VERSION=18
```

## ✅ Adımlar:

1. **Contents of .env file** kutusuna yukarıdaki 4 satırı yapıştır
2. **All scopes** seçili olsun ✅
3. **All deploy contexts** seçili olsun ✅
4. **Import variables** butonuna tıkla

## 🔒 Güvenlik Notu:
- DATABASE_URL: Neon PostgreSQL bağlantı string'i ✅
- JWT_SECRET: Token şifreleme anahtarı ✅
- NEXT_PUBLIC_API_URL: API endpoint ayarı ✅
- NODE_VERSION: Node.js sürümü ✅

## 📋 Sonraki Adım:
Variables eklendikten sonra "Deploy site" butonuna tıklayın!

Deployment başarılı olduktan sonra siteniz şu adreste canlı olacak:
`https://YOUR-SITE-NAME.netlify.app`
