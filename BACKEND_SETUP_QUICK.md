# 🎯 NETLIFY BACKEND KURULUM - HIZLI BAŞLANGIÇ

## 📌 ÖNEMLİ: Backend'i unutmuşsun! İşte çözüm:

### 🚀 3 ADIMDA BACKEND KURULUMU

---

## 1️⃣ NEON VERITABANINI KUR (2 dakika)

1. **Neon Console'a git:** https://console.neon.tech/
2. **SQL Editor'ı aç** (sol menüden)
3. **Bu dosyayı aç:** `NEON_SETUP_MANUAL.sql`
4. **Tüm kodu kopyala** (Ctrl+A, Ctrl+C)
5. **Neon SQL Editor'a yapıştır** (Ctrl+V)
6. **Run butonuna tıkla** ✅

✅ **Tamamlandı!** Tüm tablolar + örnek veriler oluşturuldu.

---

## 2️⃣ NETLIFY VARIABLES EKLE (1 dakika)

1. **Netlify Dashboard:** https://app.netlify.com/
2. **Site Settings → Environment Variables**
3. **Bu 4 satırı kopyala-yapıştır:**

```env
DATABASE_URL=postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=shoe_store_super_secret_jwt_key_2026_production_12345
NEXT_PUBLIC_API_URL=https://SITE-ADINIZ.netlify.app
NODE_VERSION=18
```

**ÖNEMLİ:** `NEXT_PUBLIC_API_URL` kısmını kendi Netlify site adınla değiştir!

4. **Save/Import** ✅

---

## 3️⃣ REDEPLOY YAP (3 dakika)

1. **Netlify → Deploys**
2. **Trigger deploy → Deploy site**
3. **Bekle... (~2-5 dakika)**
4. ✅ **Published!**

---

## 🎉 TAMAMLANDI!

### 🧪 Test Et:

**API Health Check:**
```
https://SITE-ADINIZ.netlify.app/api/health
```

**Giriş Yap:**
- Email: `admin@example.com`
- Şifre: `admin123`

**Ürünler Sayfası:**
```
https://SITE-ADINIZ.netlify.app/products
```

---

## 📁 DOSYALAR

| Dosya | Açıklama |
|-------|----------|
| `NEON_SETUP_MANUAL.sql` | ⭐ Neon'da çalıştırılacak TEK dosya |
| `DEPLOYMENT_STEPS.md` | Detaylı adım adım rehber |
| `CHECKLIST.md` | Kontrol listesi |
| `netlify.toml` | Netlify yapılandırması (zaten hazır) |
| `netlify/functions/api.js` | Backend serverless function (zaten hazır) |

---

## ❓ SORUN MU YAŞIYORSUN?

### API 404 Hatası:
- Environment variables eklenmiş mi?
- Redeploy yapıldı mı?

### Database Hatası:
- `DATABASE_URL` doğru kopyalandı mı?
- Neon SQL script tamamen çalıştı mı?

### Build Hatası:
- Netlify build logs kontrol et
- `NODE_VERSION=18` eklenmiş mi?

---

## 🎁 BONUS: Test Kuponları

- `WELCOME10` - %10 indirim (min 500 TL)
- `SUMMER2026` - %25 indirim (min 1000 TL)  
- `FREESHIP` - 50 TL kargo indirimi (min 300 TL)

---

## 📞 İLETİŞİM

Sorun yaşarsan ekran görüntüsü + hata mesajını paylaş!

**İyi çalışmalar! 🚀**
