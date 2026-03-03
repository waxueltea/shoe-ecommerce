# 📸 NEON SQL NASIL ÇALIŞTIRILIR - RESİMLİ ANLATIM

## ADIM 1: Neon Console'a Git
🌐 **https://console.neon.tech/** adresine git ve giriş yap

---

## ADIM 2: SQL Editor'ı Bul

Sol menüde **"SQL Editor"** yazısını gör:
```
┌─────────────────┐
│ 🏠 Dashboard    │
│ 📊 Monitoring   │
│ ⚡ SQL Editor   │ ← BURAYA TIKLA!
│ 🔧 Settings     │
└─────────────────┘
```

---

## ADIM 3: SQL Dosyasını Aç

1. Windows Gezgini'ni aç (Win + E)
2. Bu adrese git:
   ```
   C:\Users\wwaxuel\shoe-ecommerce\NEON_SETUP_MANUAL.sql
   ```
3. Dosyaya **sağ tıkla** → **Düzenle** veya **Notepad ile aç**
4. **Ctrl + A** (hepsini seç)
5. **Ctrl + C** (kopyala)

---

## ADIM 4: Neon SQL Editor'a Yapıştır

SQL Editor ekranında:
```
┌─────────────────────────────────────────┐
│  [New Query]  [Run]  [Format]          │
├─────────────────────────────────────────┤
│                                         │
│  -- Buraya SQL kodunu yapıştır         │  ← CTRL + V
│  -- CREATE TABLE IF NOT EXISTS...      │
│  -- INSERT INTO users...               │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

1. Büyük beyaz alana **tıkla**
2. **Ctrl + V** yapıştır
3. Tüm SQL kodu görünecek (400+ satır)

---

## ADIM 5: Çalıştır!

**"Run"** veya **"Execute"** butonuna tıkla (genellikle sağ üstte yeşil buton)

```
[▶ Run]  ← BURAYA TIKLA!
```

---

## ADIM 6: Sonucu Kontrol Et

Alt kısımda sonuç göreceksin:
```
✅ Query executed successfully
✅ 14 tables created
✅ 2 users inserted
✅ 5 categories inserted
✅ 3 products inserted
✅ ... vb
```

Veya hata varsa kırmızı mesaj göreceksin.

---

## 🎉 TAMAMLANDI!

Artık veritabanın hazır! Şimdi Netlify'ı redeploy etmeliyiz.

---

## ❓ SORUN MU VAR?

### "Table already exists" Hatası:
- Normal! SQL'de `IF NOT EXISTS` var, tekrar çalıştırmak sorun değil

### "Permission denied" Hatası:
- Neon'da doğru veritabanına bağlı mısın kontrol et
- Connection string doğru mu?

### "Syntax error" Hatası:
- SQL dosyasının TAMAMINI kopyaladın mı?
- Bir kısmını mı kopyaladın?

---

**Başarılar! 🚀**
