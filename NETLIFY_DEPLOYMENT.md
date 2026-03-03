# Netlify Deployment Guide

## 🌐 Netlify'da Tam Stack Uygulama Kurulumu

Bu proje Netlify'da çalışacak şekilde yapılandırılmıştır:
- Frontend: Next.js (Static Site Generation)
- Backend: Netlify Functions (Serverless)
- Database: Neon PostgreSQL (Serverless)

---

## 📋 Gereksinimler

1. Netlify hesabı (ücretsiz)
2. Neon PostgreSQL hesabı (ücretsiz) - https://neon.tech
3. GitHub hesabı
4. Git yüklü bilgisayar

---

## 🗄️ Adım 1: Neon PostgreSQL Kurulumu

### 1.1. Neon Hesabı Oluştur
1. https://neon.tech adresine git
2. "Sign Up" ile ücretsiz hesap oluştur
3. GitHub ile giriş yapabilirsin

### 1.2. Yeni Proje Oluştur
1. Dashboard'dan "New Project" tıkla
2. Proje adı: `shoe-ecommerce`
3. Region: `Europe (Frankfurt)` (Türkiye'ye en yakın)
4. PostgreSQL version: `16` (son sürüm)
5. "Create Project" tıkla

### 1.3. Connection String Al
- Proje oluştuktan sonra **Connection String** görünecek
- Formatı: `postgresql://username:password@host/database?sslmode=require`
- Bunu kaydet, .env dosyasında kullanacağız

### 1.4. Veritabanı Tablolarını Oluştur
1. Neon Dashboard'da "SQL Editor" açın
2. `backend/scripts/initDb.js` dosyasındaki CREATE TABLE komutlarını kopyala
3. SQL Editor'a yapıştır ve çalıştır
4. Seed verilerini de aynı şekilde çalıştır

---

## 🚀 Adım 2: GitHub'a Projeyi Yükle

```bash
# Proje klasörüne git
cd shoe-ecommerce

# Git repository başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit - ShoeStore E-commerce"

# GitHub'da yeni repository oluştur (adı: shoe-ecommerce)
# Ardından GitHub'a push et
git remote add origin https://github.com/KULLANICI_ADIN/shoe-ecommerce.git
git branch -M main
git push -u origin main
```

---

## 🌐 Adım 3: Netlify'da Site Oluştur

### 3.1. Netlify'a Giriş
1. https://app.netlify.com adresine git
2. GitHub ile giriş yap

### 3.2. Yeni Site Ekle
1. "Add new site" > "Import an existing project"
2. "GitHub" seç
3. Repository'nizi seçin: `shoe-ecommerce`

### 3.3. Build Ayarları
```
Base directory: frontend
Build command: npm run build
Publish directory: .next
```

### 3.4. Environment Variables Ekle

**Site Settings** > **Environment Variables** bölümüne şunları ekle:

```env
# Database (Neon'dan aldığın connection string)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456789

# Site URL (deploy sonrası netlify verecek)
NEXT_PUBLIC_API_URL=/.netlify/functions

# Deployment
NODE_VERSION=18
```

### 3.5. Deploy Et
- "Deploy site" butonuna tıkla
- İlk deployment 2-3 dakika sürebilir
- Deployment tamamlandığında site URL'i verilir (örn: `https://your-site.netlify.app`)

---

## 📦 Adım 4: Netlify Functions için Backend Yapılandırması

Netlify Functions kullanmak için backend'i serverless fonksiyonlara dönüştürmemiz gerekiyor.

### 4.1. netlify.toml Dosyası

Proje root'unda `netlify.toml` dosyası:

```toml
[build]
  base = "frontend"
  publish = ".next"
  command = "npm run build"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🔄 Adım 5: Database Migration (Neon SQL Editor'da)

Neon Dashboard > SQL Editor'da aşağıdaki SQL'i çalıştır:

```sql
-- Tables oluşturma scripti (initDb.js'ten alınmış hali)
-- Buraya backend/scripts/initDb.js içindeki CREATE TABLE komutlarını kopyala

-- Seed data (örnek veriler)
-- Buraya backend/scripts/seed.js içindeki INSERT komutlarını kopyala
```

---

## ✅ Adım 6: Test Et

### 6.1. Site Kontrolü
1. Netlify'ın verdiği URL'e git: `https://your-site.netlify.app`
2. Anasayfa açılıyor mu kontrol et
3. Ürünler sayfasına git
4. Giriş/Kayıt yap

### 6.2. Test Kullanıcıları
```
Admin:
- Email: admin@example.com
- Şifre: admin123

User:
- Email: user@example.com
- Şifre: user123
```

---

## 🔧 Sorun Giderme

### 1. Database Bağlantı Hatası
- Neon connection string'i doğru mu?
- `?sslmode=require` parametresi var mı?
- Neon projesi aktif mi?

### 2. Build Hatası
- `frontend` klasöründe `npm install` çalıştırıldı mı?
- Node version 18+ kullanılıyor mu?
- Environment variables doğru girildi mi?

### 3. API Çalışmıyor
- Netlify Functions deploy edildi mi?
- `/api/*` route'ları `/.netlify/functions/*`'a redirect ediliyor mu?
- Function loglarını kontrol et: Netlify Dashboard > Functions > Logs

### 4. Veriler Gelmiyor
- Database tablolar oluşturuldu mu?
- Seed data eklendi mi?
- Database connection string doğru mu?

---

## 📱 Custom Domain Ekleme (İsteğe Bağlı)

1. Netlify Dashboard > Domain Settings
2. "Add custom domain" tıkla
3. Domain adını gir (örn: shoestore.com)
4. DNS kayıtlarını ayarla (Netlify rehberi takip et)
5. SSL otomatik aktif olur (Let's Encrypt)

---

## 🎯 Production Checklist

- [ ] Neon PostgreSQL kuruldu ve çalışıyor
- [ ] Tablolar oluşturuldu
- [ ] Seed data eklendi
- [ ] Environment variables ayarlandı
- [ ] GitHub'a kod yüklendi
- [ ] Netlify'da site oluşturuldu
- [ ] Build başarılı
- [ ] Site açılıyor
- [ ] API çalışıyor
- [ ] Giriş/kayıt çalışıyor
- [ ] Ürünler listeleniyor
- [ ] Sepet çalışıyor
- [ ] SSL aktif (HTTPS)

---

## 💰 Maliyet

**Tamamen Ücretsiz:**
- Netlify Free Plan: 100GB bandwidth/ay, 300 build dakika/ay
- Neon Free Plan: 0.5GB storage, 1 proje
- GitHub: Sınırsız public repo

**Yeterli mi?**
- Aylık ~10,000 ziyaretçi için yeterli
- Geliştirme ve test için mükemmel
- Production için başlangıç aşaması için ideal

---

## 🔄 Güncelleme Nasıl Yapılır?

```bash
# Değişiklik yap
# Git commit
git add .
git commit -m "Güncelleme mesajı"

# GitHub'a push et
git push origin main

# Netlify otomatik deploy eder (1-2 dakika)
```

---

## 📞 Destek

- Netlify Docs: https://docs.netlify.com
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs

---

**Hazır!** 🎉 

Siteniz artık canlı ve dünya çapında erişilebilir durumda!
