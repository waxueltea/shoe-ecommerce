# 👟 ShoeStore - E-Ticaret Projesi Kurulum Kılavuzu

## 📋 Gereksinimler

- Node.js v18 veya üzeri
- PostgreSQL 14 veya üzeri
- npm veya yarn

## 🚀 Kurulum Adımları

### 1. Backend Kurulumu

```bash
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
copy .env.example .env

# .env dosyasını düzenle ve veritabanı bilgilerini gir

# Veritabanını oluştur ve tabloları kur
npm run init-db

# Örnek verileri ekle
npm run seed

# Sunucuyu başlat
npm run dev
```

Backend http://localhost:5000 adresinde çalışacaktır.

### 2. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Development sunucusunu başlat
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacaktır.

## 🔑 Test Kullanıcıları

Seed işlemi sonrasında aşağıdaki kullanıcılar oluşturulur:

**Admin:**
- Email: admin@example.com
- Şifre: admin123

**Kullanıcı:**
- Email: user@example.com
- Şifre: user123

## 📦 Proje Yapısı

```
shoe-ecommerce/
├── backend/
│   ├── config/         # Veritabanı konfigürasyonu
│   ├── controllers/    # İş mantığı
│   ├── middleware/     # Middleware'ler
│   ├── routes/         # API rotaları
│   ├── scripts/        # Yardımcı scriptler
│   └── server.js       # Ana sunucu dosyası
│
└── frontend/
    ├── src/
    │   ├── app/          # Next.js sayfaları
    │   ├── components/   # React bileşenleri
    │   ├── lib/          # Yardımcı fonksiyonlar
    │   └── styles/       # CSS dosyaları
    └── public/           # Statik dosyalar
```

## 🎯 Özellikler

### Kullanıcı Özellikleri
- ✅ Kayıt olma ve giriş yapma
- ✅ Ürün arama ve filtreleme
- ✅ Sepete ekleme
- ✅ Sipariş oluşturma
- ✅ Favorilere ekleme
- ✅ Sipariş takibi
- ✅ Adres yönetimi
- ✅ Profil düzenleme

### Admin Özellikleri
- ✅ Ürün yönetimi
- ✅ Kategori yönetimi
- ✅ Sipariş yönetimi
- ✅ Kullanıcı yönetimi
- ✅ Kupon yönetimi
- ✅ Banner yönetimi

### Teknik Özellikler
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ PostgreSQL veritabanı
- ✅ Responsive tasarım
- ✅ SEO optimizasyonu
- ✅ Güvenlik (SQL injection, XSS koruması)
- ✅ Rate limiting
- ✅ Error handling

## 🔒 Güvenlik

- Şifreler bcrypt ile hashlenmiştir
- JWT token ile kimlik doğrulama
- SQL injection koruması
- XSS koruması
- CORS politikaları
- Rate limiting

## 💳 Ödeme Entegrasyonu

PayTR ödeme altyapısı için .env dosyasına aşağıdaki bilgileri ekleyin:

```env
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
```

## 📱 API Endpoints

### Auth
- POST `/api/auth/register` - Kayıt ol
- POST `/api/auth/login` - Giriş yap
- GET `/api/auth/me` - Profil bilgilerini getir

### Products
- GET `/api/products` - Ürünleri listele
- GET `/api/products/:slug` - Ürün detayı

### Cart
- GET `/api/cart` - Sepeti getir
- POST `/api/cart` - Sepete ekle
- PUT `/api/cart/:id` - Sepeti güncelle
- DELETE `/api/cart/:id` - Sepetten sil

### Orders
- GET `/api/orders` - Siparişleri listele
- POST `/api/orders` - Sipariş oluştur
- GET `/api/orders/:id` - Sipariş detayı

## 🎨 Tasarım

- **Ana Renk:** Koyu lacivert (#1a1a2e)
- **Vurgu Renk:** Turuncu (#f97316)
- **Font:** Inter
- **UI Framework:** TailwindCSS

## 🐛 Hata Ayıklama

Sorun yaşarsanız:

1. Veritabanı bağlantısını kontrol edin
2. .env dosyasının doğru yapılandırıldığından emin olun
3. Port çakışması olmadığından emin olun
4. Console loglarını kontrol edin

## 📞 Destek

Sorularınız için: info@shoestore.com

## 📄 Lisans

MIT License
