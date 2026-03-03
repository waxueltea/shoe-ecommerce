# 👟 Ayakkabı E-Ticaret Platformu

Modern, kullanıcı dostu ve güvenli bir ayakkabı satış platformu.

## 🚀 Özellikler

### Frontend
- ✅ Modern ve sade tasarım
- ✅ Responsive (mobil, tablet, desktop)
- ✅ React + Next.js + TailwindCSS
- ✅ SEO optimizasyonu
- ✅ Hızlı sayfa yükleme

### Backend
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Role-based authorization
- ✅ PayTR ödeme entegrasyonu
- ✅ Güvenlik önlemleri (SQL injection, XSS koruması)

### Sayfalar
- 🏠 Anasayfa (hero, kampanyalar, kategoriler)
- 📦 Ürün listeleme (filtreleme, sıralama)
- 🔍 Ürün detay (galeri, numara/renk seçimi, yorumlar)
- 🛒 Sepet (adet yönetimi, kupon kodu)
- 💳 Ödeme sayfası (güvenli ödeme)
- 👤 Kullanıcı paneli (siparişler, favoriler)
- 🔐 Giriş / Kayıt
- 🎛️ Admin paneli

## 📋 Kurulum

### Backend Kurulumu

```bash
cd backend
npm install
npm run init-db    # Veritabanı oluştur
npm run dev        # Development mode
```

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Veritabanı

PostgreSQL veritabanı yapısı:
- Users (kullanıcılar)
- Products (ürünler)
- Categories (kategoriler)
- Orders (siparişler)
- Order_Items (sipariş kalemleri)
- Coupons (kuponlar)
- Reviews (yorumlar)
- Favorites (favoriler)

## 🔐 Güvenlik

- JWT token authentication
- Bcrypt şifre hashleme
- SQL injection koruması
- XSS koruması
- Rate limiting
- CORS politikaları

## 💳 Ödeme

PayTR entegrasyonu ile güvenli ödeme altyapısı.

## 📱 Ekran Görüntüleri

Responsive tasarım ile tüm cihazlarda mükemmel görünüm.

## 🛠️ Geliştirme

- Node.js v18+
- PostgreSQL 14+
- React 18+
- Next.js 14+

## 📄 Lisans

MIT License
