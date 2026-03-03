# ✅ DOĞRU ENVIRONMENT VARIABLES

## Netlify'a eklemen gereken değişkenler:

```env
DATABASE_URL=postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=shoe_store_super_secret_jwt_key_2026_production_12345
NEXT_PUBLIC_API_URL=/api
NODE_VERSION=18
```

## ⚠️ ÖNEMLİ DEĞİŞİKLİK:

**`NEXT_PUBLIC_API_URL`** değerini değiştirdim:
- ❌ Yanlış: `https://akkanstore.netlify.app` 
- ✅ Doğru: `/api`

**Neden `/api`?**
- Netlify'da `netlify.toml` dosyası `/api/*` isteklerini otomatik olarak serverless function'a yönlendiriyor
- Frontend ve backend aynı domain'de olduğu için sadece `/api` yeterli
- CORS sorunu yaşanmaz
- Daha hızlı ve güvenli

---

## 🔧 ŞİMDİ NE YAPMALI?

### Seçenek 1: Environment Variables'ı Güncelle (Önerilen)
1. Netlify → Site Settings → Environment Variables
2. `NEXT_PUBLIC_API_URL` değişkenini bul
3. Değerini `https://akkanstore.netlify.app` yerine `/api` yap
4. Save
5. Deploys → Trigger deploy → Deploy site

### Seçenek 2: Tekrar Import Et
1. Şu anki import penceresini iptal et
2. Yukarıdaki 4 satırı tekrar kopyala (doğru olanları)
3. Environment Variables → Import from .env file
4. Yapıştır ve import et

---

## 📝 ÖZET

```
DATABASE_URL = Neon bağlantı string'i (DOĞRU ✅)
JWT_SECRET = Token şifreleme anahtarı (DOĞRU ✅)
NEXT_PUBLIC_API_URL = /api (DÜZELTİLMELİ ⚠️)
NODE_VERSION = 18 (DOĞRU ✅)
```

---

## 🎯 SONRAKİ ADIM

Environment variables'ı düzelttikten sonra:
1. ✅ Redeploy yap
2. ✅ Neon SQL'i çalıştır (NEON_SETUP_MANUAL.sql)
3. ✅ Test et!
