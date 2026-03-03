# 🎯 NETLIFY DEPLOYMENT - ÖZET KILAVUZ

## 🚀 5 Adımda Canlıya Alma

### ADIM 1: Neon PostgreSQL Kurulumu (5 dakika)

1. https://neon.tech → Sign Up
2. New Project → `shoe-ecommerce` 
3. Region: `Europe (Frankfurt)`
4. Connection string kopyala
5. SQL Editor'da `database-schema.sql` dosyasını çalıştır
6. `database-seed.sql` dosyasını çalıştır (ama önce şifreleri hashle)

**Şifreleri Hashlemek İçin:**
```bash
# Node.js REPL'de
node
> const bcrypt = require('bcryptjs');
> bcrypt.hashSync('admin123', 10);
# Çıktıyı kopyala ve seed.sql'de kullan
> bcrypt.hashSync('user123', 10);
# Çıktıyı kopyala ve seed.sql'de kullan
```

---

### ADIM 2: GitHub'a Yükle (2 dakika)

```bash
cd shoe-ecommerce
git init
git add .
git commit -m "ShoeStore E-commerce for Netlify"
git remote add origin https://github.com/USERNAME/shoe-ecommerce.git
git push -u origin main
```

---

### ADIM 3: Netlify Deployment (3 dakika)

1. https://app.netlify.com → GitHub ile giriş
2. Add new site → Import from GitHub
3. Repository seç: `shoe-ecommerce`

**Build Settings:**
```
Base directory: frontend
Build command: npm run build
Publish directory: .next
Functions directory: netlify/functions
```

**Environment Variables:**
```
DATABASE_URL = postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET = your_super_secret_key_12345
NEXT_PUBLIC_API_URL = /.netlify/functions/api
NODE_VERSION = 18
```

4. Deploy site!

---

### ADIM 4: Test Et (2 dakika)

1. Sitenizi aç: `https://YOUR-SITE.netlify.app`
2. Giriş yap:
   - Email: `user@example.com`
   - Şifre: `user123`
3. Ürünleri görüntüle
4. Sepete ekle

---

### ADIM 5: Domain Bağla (İsteğe Bağlı)

1. Netlify → Domain Settings
2. Add custom domain → `yourdomain.com`
3. DNS ayarlarını yap
4. SSL otomatik aktif olur ✅

---

## 📁 Önemli Dosyalar

- `netlify.toml` - Netlify yapılandırması ✅
- `netlify/functions/api.js` - Serverless backend ✅
- `database-schema.sql` - Tablo yapısı ✅
- `database-seed.sql` - Örnek veriler ✅

---

## 🔧 Sorun Giderme

**Database hatası:**
- Connection string doğru mu?
- `?sslmode=require` var mı?

**Build hatası:**
- Environment variables eklenmiş mi?
- Node version 18 mi?

**API çalışmıyor:**
- Functions deploy oldu mu?
- Netlify Dashboard → Functions kontrol et

---

## 💡 Faydalı Komutlar

```bash
# Yerel test
cd frontend
npm run dev

# Build test
npm run build

# Netlify CLI (opsiyonel)
npm install -g netlify-cli
netlify dev
netlify deploy --prod
```

---

## ✅ Checklist

- [ ] Neon PostgreSQL kuruldu
- [ ] Tablolar oluşturuldu
- [ ] Seed data eklendi
- [ ] GitHub'a yüklendi
- [ ] Netlify'da site oluşturuldu
- [ ] Environment variables eklendi
- [ ] Deploy başarılı
- [ ] Site çalışıyor
- [ ] Giriş/çıkış çalışıyor

---

## 🎉 Başarılı!

Siteniz canlı: `https://YOUR-SITE.netlify.app`

**Tamamen ücretsiz!** 💰
- Netlify: 100GB/ay
- Neon: 0.5GB storage
- ~10,000 ziyaretçi/ay kapasiteli

**Güncelleme:**
```bash
git push origin main
# Netlify otomatik deploy eder! 🚀
```

---

📚 **Detaylı Dokümanlar:**
- `DEPLOY_GUIDE.md` - Adım adım kılavuz
- `NETLIFY_DEPLOYMENT.md` - Teknik detaylar
- `PROJECT_SUMMARY.md` - Proje özeti
