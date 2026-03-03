# 🚀 NETLIFY DEPLOYMENT - HIZLI BAŞLANGIÇ

## 📦 ADIM 1: Gerekli Paketleri Yükle

```bash
# Root dizinde (shoe-ecommerce klasöründe)
npm install

# Frontend dizininde
cd frontend
npm install
cd ..

# Backend dizininde  
cd backend
npm install
cd ..
```

---

## 🗄️ ADIM 2: Neon PostgreSQL Kurulumu

### 2.1. Hesap Oluştur
1. https://neon.tech sayfasına git
2. "Sign Up" ile kayıt ol (GitHub ile yapabilirsin)
3. Email doğrulama yap

### 2.2. Yeni Database Projesi Oluştur
1. Dashboard'da "New Project" tıkla
2. Ayarlar:
   - **Name:** shoe-ecommerce
   - **Region:** Europe (Frankfurt) - Türkiye'ye en yakın
   - **PostgreSQL version:** 16
3. "Create Project" butonuna tıkla

### 2.3. Connection String Kopyala
Proje oluştuktan sonra göreceğin connection string'i kopyala:
```
postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 2.4. Tabloları Oluştur

**Seçenek A: Neon SQL Editor Kullan**
1. Neon Dashboard > "SQL Editor" tıkla
2. Aşağıdaki dosyanın içeriğini kopyala:
   - `backend/scripts/initDb.js` içindeki CREATE TABLE komutlarını
3. SQL Editor'a yapıştır ve "Run" tıkla

**Seçenek B: Hazır SQL Script**

SQL Editor'da çalıştır:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  brand VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  color_code VARCHAR(7),
  sku VARCHAR(100) UNIQUE NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, size, color)
);

-- Diğer tablolar için aynı şekilde devam et...
-- (Tam SQL scripti için backend/scripts/initDb.js dosyasına bakın)
```

### 2.5. Örnek Verileri Ekle

Yine SQL Editor'da seed verilerini çalıştır (backend/scripts/seed.js'ten alınacak INSERT komutları).

---

## 🌐 ADIM 3: GitHub'a Yükle

```bash
# Proje dizininde
cd shoe-ecommerce

# Git başlat
git init

# Tüm dosyaları ekle
git add .

# Commit
git commit -m "Initial commit: ShoeStore E-commerce for Netlify"

# GitHub'da yeni repo oluştur: shoe-ecommerce
# Ardından bağla ve push et
git remote add origin https://github.com/KULLANICI_ADINIZ/shoe-ecommerce.git
git branch -M main
git push -u origin main
```

---

## 🚀 ADIM 4: Netlify'da Deploy

### 4.1. Netlify'a Giriş
1. https://app.netlify.com sayfasına git
2. GitHub ile giriş yap

### 4.2. Yeni Site Oluştur
1. "Add new site" > "Import an existing project"
2. "Deploy with GitHub" seç
3. Repository seç: `shoe-ecommerce`
4. Branch: `main`

### 4.3. Build Ayarları
```
Base directory: frontend
Build command: npm run build
Publish directory: .next
Functions directory: netlify/functions
```

### 4.4. Environment Variables Ekle

**Site settings > Environment variables** bölümüne git ve ekle:

```env
# Database (Neon'dan aldığın connection string)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# JWT Secret
JWT_SECRET=super_secret_jwt_key_change_this_production_12345

# API URL
NEXT_PUBLIC_API_URL=/.netlify/functions/api

# Node Version
NODE_VERSION=18
```

### 4.5. Deploy!
- "Deploy site" butonuna tıkla
- İlk deployment 2-3 dakika sürer
- Tamamlandığında URL alırsın: `https://YOUR-SITE-NAME.netlify.app`

---

## ✅ ADIM 5: Test Et!

### 5.1. Siteyi Ziyaret Et
```
https://YOUR-SITE-NAME.netlify.app
```

### 5.2. Test Kullanıcıları ile Giriş Yap
```
Admin:
Email: admin@example.com
Şifre: admin123

User:
Email: user@example.com
Şifre: user123
```

### 5.3. Kontrol Listesi
- [ ] Anasayfa açılıyor mu?
- [ ] Ürünler listeleniyor mu?
- [ ] Giriş yapabiliyor musun?
- [ ] Sepete ekleme çalışıyor mu?
- [ ] API yanıt veriyor mu?

---

## 🔧 Sorun Çözme

### Problem: "Database connection failed"
**Çözüm:**
- Neon connection string doğru mu kontrol et
- `?sslmode=require` parametresi var mı?
- Environment variable eklenmiş mi?

### Problem: "Build failed"
**Çözüm:**
```bash
# Yerel olarak test et
cd frontend
npm install
npm run build
```

### Problem: "Function timeout"
**Çözüm:**
- Netlify Free Plan: 10 saniye timeout
- Database query'leri optimize edilmiş
- Connection pool ayarları düşük tutulmuş

### Problem: API çağrıları 404 veriyor
**Çözüm:**
- `netlify.toml` dosyası root'ta mı?
- Redirects ayarları doğru mu?
- Functions deploy oldu mu? (Netlify Dashboard > Functions)

---

## 📱 Bonus: Custom Domain Ekleme

1. Netlify Dashboard > Domain Settings
2. "Add custom domain"
3. Domain adını gir (örn: `ayakkabim.com`)
4. DNS kayıtlarını güncelle:
   ```
   A Record: 75.2.60.5
   CNAME: your-site.netlify.app
   ```
5. SSL otomatik aktif olur ✅

---

## 💰 Maliyet Özeti

**Tamamen ÜCRETSİZ** 🎉

- ✅ Netlify Free: 100GB/ay bandwidth, 300 dakika build
- ✅ Neon Free: 0.5GB storage, 1 proje
- ✅ GitHub: Sınırsız public repo

**Yeterli mi?**
- Ayda ~5,000-10,000 ziyaretçi
- Küçük-orta e-ticaret siteleri için ideal
- Prototype ve MVP'ler için mükemmel

---

## 🔄 Güncelleme Yapma

```bash
# Kod değiştir
# Commit yap
git add .
git commit -m "Güncelleme mesajı"

# Push et
git push origin main

# Netlify otomatik deploy eder! 🚀
```

---

## 📞 Yardım Kaynakları

- **Netlify Docs:** https://docs.netlify.com
- **Neon Docs:** https://neon.tech/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎉 Tebrikler!

Siteniz artık canlı! 🌍

**Paylaş:**
- https://YOUR-SITE.netlify.app

**İyi alışverişler!** 🛍️👟
