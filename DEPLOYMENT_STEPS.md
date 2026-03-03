# 🎯 NEON POSTGRESQL + NETLIFY DEPLOYMENT REHBERİ

## 📋 ADIM 1: NEON VERITABANINI HAZIRLA

### 1.1. Neon Console'a Git
- Tarayıcıda: https://console.neon.tech/
- Giriş yap

### 1.2. SQL Editor'ı Aç
- Sol menüden **"SQL Editor"** sekmesine tıkla
- Veya proje sayfasında **"Query your data"** butonuna tıkla

### 1.3. SQL Scriptini Çalıştır
1. `NEON_SETUP_MANUAL.sql` dosyasını aç (C:\Users\wwaxuel\shoe-ecommerce\NEON_SETUP_MANUAL.sql)
2. **TÜM KODU** kopyala (Ctrl+A, Ctrl+C)
3. Neon SQL Editor'a **YAPIŞTIR** (Ctrl+V)
4. **"Run"** veya **"Execute"** butonuna tıkla

✅ **Sonuç:** Tüm tablolar + örnek veriler oluşturulacak!

---

## 📋 ADIM 2: NETLIFY ENVIRONMENT VARIABLES EKLE

### 2.1. Netlify Dashboard'a Git
- https://app.netlify.com/
- Projeye git (ShoeStore)

### 2.2. Environment Variables'ı Ekle
1. **Site settings** → **Environment variables**
2. **"Add a variable"** veya **"Import from a .env file"** butonuna tıkla
3. Aşağıdaki 4 satırı kopyala-yapıştır:

```env
DATABASE_URL=postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=shoe_store_super_secret_jwt_key_2026_production_12345
NEXT_PUBLIC_API_URL=https://SITE-ADI-BURAYA.netlify.app
NODE_VERSION=18
```

**ÖNEMLİ:** `NEXT_PUBLIC_API_URL` değerini kendi Netlify sitenin adıyla değiştir!
Örnek: `https://shoestore-demo.netlify.app`

4. **Scope:** `All scopes` ✅
5. **Deploy contexts:** `All deploy contexts` ✅
6. **Save** / **Import** butonuna tıkla

---

## 📋 ADIM 3: NETLIFY'DA REDEPLOY YAP

### 3.1. Yeni Deployment Başlat
1. Netlify Dashboard'da **"Deploys"** sekmesine git
2. **"Trigger deploy"** → **"Deploy site"** tıkla

### 3.2. Build Loglarını İzle
- Build tamamlanana kadar bekle (~2-5 dakika)
- ✅ Yeşil "Published" görünce hazır!

---

## 🎉 ADIM 4: SİTENİ TEST ET

### Test Kullanıcıları:
- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

### Test Kuponları:
- **WELCOME10** - %10 indirim (min 500 TL)
- **SUMMER2026** - %25 indirim (min 1000 TL)
- **FREESHIP** - 50 TL kargo indirimi (min 300 TL)

### Test Edilecekler:
1. ✅ Anasayfa yükleniyor mu?
2. ✅ Ürünler listeleniyor mu? (/products)
3. ✅ Giriş yapabiliyor musun? (/login)
4. ✅ API çalışıyor mu? (https://SITE-ADI.netlify.app/api/health)

---

## 🔧 SORUN GİDERME

### API Hatası Alıyorsan:
1. **Environment Variables** doğru mu kontrol et
2. **Redeploy** yap
3. **Function logs** kontrol et (Netlify → Functions → Logs)

### Database Hatası Alıyorsan:
1. Neon connection string doğru mu?
2. SQL script tamamen çalıştı mı?
3. Neon Dashboard → Monitoring → Check connections

### Frontend Hatası Alıyorsan:
1. `NEXT_PUBLIC_API_URL` doğru mu?
2. Build log'larında hata var mı?
3. Browser console'da hata var mı? (F12)

---

## 📞 YARDIM

Sorun yaşarsan ekran görüntüsü at ve hata mesajını paylaş!

**Başarılar! 🎉**
