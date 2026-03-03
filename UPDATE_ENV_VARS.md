# 🔄 NETLIFY'DA ENVIRONMENT VARIABLES GÜNCELLEME

Site zaten deploy edilmişse environment variables'ı şu şekilde güncelleyin:

## 📍 Adım 1: Site Settings'e Git

1. Netlify Dashboard'unuzu açın
2. Deploy ettiğiniz siteyi seçin (shoe-ecommerce)
3. **Site settings** butonuna tıklayın

## 📍 Adım 2: Environment Variables Bölümü

1. Sol menüden **"Build & deploy"** seçin
2. **"Environment"** bölümüne gidin
3. Veya direkt: **Site settings > Environment variables**

## 📍 Adım 3: Variables'ı Düzenle

### Mevcut Variables'ı Kontrol Et:

Şu değişkenler var mı bakın:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NODE_VERSION`

### Değişkenleri Güncelle:

**Seçenek A: Tek tek düzenle**
1. Her bir variable'ın yanındaki **"Options"** (3 nokta) menüsüne tıkla
2. **"Edit"** seç
3. Yeni değeri yapıştır:

```
DATABASE_URL = postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Seçenek B: Hepsini sil ve yeniden ekle**
1. Eski variables'ları sil (Options > Delete)
2. **"Add a variable"** veya **"Add environment variables"** butonuna tıkla
3. Her birini tek tek ekle:

```
Key: DATABASE_URL
Value: postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
Scopes: All scopes
Deploy contexts: All deploy contexts
```

```
Key: JWT_SECRET
Value: shoe_store_super_secret_jwt_key_2026_production_12345
Scopes: All scopes
Deploy contexts: All deploy contexts
```

```
Key: NEXT_PUBLIC_API_URL
Value: /.netlify/functions/api
Scopes: All scopes
Deploy contexts: All deploy contexts
```

```
Key: NODE_VERSION
Value: 18
Scopes: All scopes
Deploy contexts: All deploy contexts
```

## 📍 Adım 4: Redeploy

Environment variables değiştikten sonra:

**Otomatik Yöntem:**
1. Netlify Dashboard > **Deploys** sekmesine git
2. **"Trigger deploy"** dropdown'unu aç
3. **"Clear cache and deploy site"** seç
4. Deploy başlayacak (2-3 dakika sürer)

**Manuel Yöntem:**
```bash
# Local'de proje klasöründe
cd shoe-ecommerce

# Boş bir commit at
git commit --allow-empty -m "Update environment variables"

# Push et
git push origin main

# Netlify otomatik deploy eder
```

## ✅ Doğrulama

Deploy tamamlandıktan sonra:

1. Site URL'nizi açın: `https://YOUR-SITE.netlify.app`
2. Ürünler sayfasına gidin
3. Giriş yapın:
   - Email: `user@example.com`
   - Şifre: `user123`

Eğer giriş çalışıyorsa ve ürünler görünüyorsa ✅ başarılı!

## 🔍 Hata Kontrolü

Eğer hata alıyorsanız:

1. **Netlify Dashboard > Functions** 
   - API fonksiyonu deploy oldu mu?
   - Logları kontrol et

2. **Netlify Dashboard > Deploys**
   - Son deploy başarılı mı?
   - Build loglarını kontrol et

3. **Browser Console (F12)**
   - JavaScript hataları var mı?
   - Network tab'da API istekleri başarılı mı?

## 🎯 Hızlı Güncelleme (Şu An İçin)

1. https://app.netlify.com → Sitenizi seçin
2. Site settings → Environment variables
3. `DATABASE_URL` bulun → Edit
4. Yeni connection string'i yapıştırın
5. Save
6. Deploys → Trigger deploy → Clear cache and deploy site
7. 2-3 dakika bekleyin
8. Sitenizi test edin!

---

**Önemli:** Environment variables güncellendikten sonra mutlaka **redeploy** yapmalısınız, yoksa değişiklikler aktif olmaz!
