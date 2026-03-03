# 🚀 NETLIFY BACKEND DEPLOYMENT KONTROL LİSTESİ

## ✅ YAPILMASI GEREKENLER

### 1️⃣ NEON POSTGRESQL KURULUMU
- [ ] Neon Console'a git: https://console.neon.tech/
- [ ] SQL Editor'ı aç
- [ ] `NEON_SETUP_MANUAL.sql` dosyasını kopyala
- [ ] SQL Editor'a yapıştır ve çalıştır (Run)
- [ ] Tablolar ve veriler oluşturuldu mu kontrol et

### 2️⃣ NETLIFY ENVIRONMENT VARIABLES
- [ ] Netlify Dashboard'a git
- [ ] Site Settings → Environment Variables
- [ ] Şu 4 değişkeni ekle:

```
DATABASE_URL=postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=shoe_store_super_secret_jwt_key_2026_production_12345

NEXT_PUBLIC_API_URL=https://BURAYA-NETLIFY-SITE-ADI.netlify.app

NODE_VERSION=18
```

**ÖNEMLİ:** `NEXT_PUBLIC_API_URL` kısmını kendi site adınla değiştir!

### 3️⃣ NETLIFY REDEPLOY
- [ ] Netlify → Deploys
- [ ] Trigger deploy → Deploy site
- [ ] Build tamamlanmasını bekle

### 4️⃣ TEST
- [ ] Siteyi aç: https://SITE-ADI.netlify.app
- [ ] API health check: https://SITE-ADI.netlify.app/api/health
- [ ] Ürünler sayfası: https://SITE-ADI.netlify.app/products
- [ ] Giriş yap: admin@example.com / admin123

---

## 📁 DOSYALAR

✅ **NEON_SETUP_MANUAL.sql** - Neon SQL Editor'da çalıştırılacak tek dosya
✅ **DEPLOYMENT_STEPS.md** - Detaylı adım adım rehber
✅ **database-schema.sql** - Sadece tablolar (referans için)
✅ **database-seed.sql** - Sadece veriler (referans için)

---

## 🔍 BACKEND DOSYA YAPISI

```
shoe-ecommerce/
├── backend/
│   ├── config/
│   │   └── database.js          ← Neon bağlantısı
│   ├── controllers/             ← API işlemleri
│   ├── middleware/              ← Auth, validation
│   ├── routes/                  ← API endpoints
│   └── server.js
├── netlify/
│   └── functions/
│       └── api.js               ← Netlify serverless function
├── netlify.toml                 ← Netlify yapılandırması
└── NEON_SETUP_MANUAL.sql        ← VERİTABANI KURULUM!
```

---

## 🎯 SONRAKİ ADIMLAR

1. ✅ Neon veritabanını kur
2. ✅ Netlify environment variables ekle
3. ✅ Redeploy yap
4. ✅ Siteyi test et
5. 🎉 Canlıda!

---

## 💡 İPUÇLARI

- **Neon SQL Editor:** Tüm SQL komutlarını bir seferde çalıştırabilirsin
- **Netlify Functions:** Otomatik scale olur, sunucu yönetimine gerek yok
- **Environment Variables:** Değişiklikten sonra mutlaka redeploy yap
- **API URL:** Frontend'de `/api/...` şeklinde çağırabilirsin (netlify.toml proxy ayarı sayesinde)

---

## ❓ SORULAR

**S: Neon'da SQL script hata verirse?**
A: Önce tabloları sil (DROP TABLE IF EXISTS ...) sonra tekrar çalıştır

**S: Netlify build hata verirse?**
A: Build logs kontrol et, eksik environment variable olabilir

**S: API 404 hatası verirse?**
A: `netlify.toml` dosyası doğru mu kontrol et, `/api/*` redirecti olmalı

**S: Database connection hatası?**
A: `DATABASE_URL` environment variable'ı doğru kopyalandı mı kontrol et

---

**Başarılar! 🚀**
