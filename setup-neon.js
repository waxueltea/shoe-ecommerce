const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Neon connection string
const connectionString = "postgresql://neondb_owner:npg_i2cGb7ZjYxfX@ep-long-scene-alrn9whl-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function setupDatabase() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Neon PostgreSQL\'e bağlanılıyor...');
    await client.connect();
    console.log('✅ Bağlantı başarılı!\n');

    // 1. Schema oluştur
    console.log('📋 Veritabanı tabloları oluşturuluyor...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'database-schema.sql'), 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Tablolar oluşturuldu!\n');

    // 2. Admin ve User şifrelerini hash'le
    console.log('🔐 Kullanıcı şifreleri hash\'leniyor...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    console.log('✅ Şifreler hazır!\n');

    // 3. Kullanıcıları ekle
    console.log('👤 Kullanıcılar oluşturuluyor...');
    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, phone, role)
      VALUES 
        ('admin@example.com', $1, 'Admin', 'User', '+905551234567', 'admin'),
        ('user@example.com', $2, 'Test', 'User', '+905559876543', 'user')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword, userPassword]);
    console.log('✅ Kullanıcılar oluşturuldu!\n');

    // 4. Kategorileri ekle
    console.log('📁 Kategoriler ekleniyor...');
    await client.query(`
      INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
      ('Erkek Ayakkabı', 'erkek-ayakkabi', 'Erkekler için şık ve rahat ayakkabılar', 1, true),
      ('Kadın Ayakkabı', 'kadin-ayakkabi', 'Kadınlar için şık ve rahat ayakkabılar', 2, true),
      ('Spor Ayakkabı', 'spor-ayakkabi', 'Spor ve koşu için özel ayakkabılar', 3, true),
      ('Günlük Ayakkabı', 'gunluk-ayakkabi', 'Günlük kullanım için rahat ayakkabılar', 4, true),
      ('Klasik Ayakkabı', 'klasik-ayakkabi', 'Şık ve klasik ayakkabılar', 5, true)
      ON CONFLICT (slug) DO NOTHING
    `);
    console.log('✅ Kategoriler eklendi!\n');

    // 5. Banner'ları ekle
    console.log('🎨 Banner\'lar ekleniyor...');
    await client.query(`
      INSERT INTO banners (title, subtitle, description, image_url, link_url, button_text, display_order, is_active) VALUES
      ('Yeni Sezon İndirimi', '%40''a Varan İndirim', 'Tüm spor ayakkabılarda kampanya', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920', '/products?category=spor-ayakkabi', 'Alışverişe Başla', 1, true),
      ('Ücretsiz Kargo', '500 TL ve Üzeri Siparişlerde', 'Türkiye geneli hızlı teslimat', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920', '/products', 'Keşfet', 2, true)
    `);
    console.log('✅ Banner\'lar eklendi!\n');

    // 6. Kuponları ekle
    console.log('🎫 Kuponlar ekleniyor...');
    await client.query(`
      INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit, is_active) VALUES
      ('WELCOME10', 'Yeni üyeler için %10 indirim', 'percentage', 10, 500, 100, true),
      ('SUMMER2026', 'Yaz kampanyası %25 indirim', 'percentage', 25, 1000, 50, true),
      ('FREESHIP', 'Ücretsiz kargo kuponu', 'fixed', 50, 300, NULL, true)
      ON CONFLICT (code) DO NOTHING
    `);
    console.log('✅ Kuponlar eklendi!\n');

    // 7. Ayarları ekle
    console.log('⚙️ Sistem ayarları ekleniyor...');
    await client.query(`
      INSERT INTO settings (key, value, description) VALUES
      ('tax_rate', '18', 'KDV oranı (%)'),
      ('shipping_cost', '50', 'Kargo ücreti (TL)'),
      ('free_shipping_threshold', '500', 'Ücretsiz kargo limiti (TL)'),
      ('site_name', 'ShoeStore', 'Site adı'),
      ('site_description', 'Modern ayakkabı alışverişinin yeni adresi', 'Site açıklaması'),
      ('contact_email', 'info@shoestore.com', 'İletişim e-postası'),
      ('contact_phone', '+90 555 123 45 67', 'İletişim telefonu')
      ON CONFLICT (key) DO NOTHING
    `);
    console.log('✅ Ayarlar eklendi!\n');

    // 8. Örnek ürünler ekle
    console.log('👟 Örnek ürünler ekleniyor...');
    
    // Spor Ayakkabılar
    const sportCategory = await client.query("SELECT id FROM categories WHERE slug = 'spor-ayakkabi'");
    const sportCatId = sportCategory.rows[0].id;

    const products = [
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Rahat ve şık spor ayakkabı',
        category_id: sportCatId,
        brand: 'Nike',
        price: 2499.99,
        discount_price: 1999.99,
        is_featured: true,
        is_new: true
      },
      {
        name: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        description: 'Koşu için ideal yüksek performanslı ayakkabı',
        category_id: sportCatId,
        brand: 'Adidas',
        price: 3299.99,
        discount_price: null,
        is_featured: true,
        is_new: true
      },
      {
        name: 'Puma RS-X',
        slug: 'puma-rs-x',
        description: 'Retro tarzda günlük spor ayakkabı',
        category_id: sportCatId,
        brand: 'Puma',
        price: 1799.99,
        discount_price: 1499.99,
        is_featured: false,
        is_new: false
      }
    ];

    for (const product of products) {
      const result = await client.query(`
        INSERT INTO products (name, slug, description, category_id, brand, price, discount_price, is_featured, is_new, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      `, [
        product.name, product.slug, product.description, product.category_id,
        product.brand, product.price, product.discount_price, product.is_featured, product.is_new
      ]);

      if (result.rows.length > 0) {
        const productId = result.rows[0].id;

        // Ürün resmi ekle
        await client.query(`
          INSERT INTO product_images (product_id, image_url, is_primary, display_order)
          VALUES ($1, $2, true, 0)
        `, [productId, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']);

        // Varyantlar ekle (numara ve renk kombinasyonları)
        const sizes = ['39', '40', '41', '42', '43', '44'];
        const colors = [
          { name: 'Siyah', code: '#000000' },
          { name: 'Beyaz', code: '#FFFFFF' },
          { name: 'Mavi', code: '#0000FF' }
        ];

        for (const size of sizes) {
          for (const color of colors) {
            await client.query(`
              INSERT INTO product_variants (product_id, size, color, color_code, sku, stock_quantity)
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (product_id, size, color) DO NOTHING
            `, [
              productId,
              size,
              color.name,
              color.code,
              `${product.slug}-${size}-${color.name.toLowerCase()}`,
              Math.floor(Math.random() * 20) + 5 // 5-24 arası random stok
            ]);
          }
        }
      }
    }
    console.log('✅ Örnek ürünler eklendi!\n');

    console.log('🎉 VERİTABANI KURULUMU TAMAMLANDI!\n');
    console.log('📝 Test Kullanıcıları:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User: user@example.com / user123\n');
    console.log('🎫 Kuponlar:');
    console.log('   WELCOME10 - %10 indirim (min 500 TL)');
    console.log('   SUMMER2026 - %25 indirim (min 1000 TL)');
    console.log('   FREESHIP - 50 TL kargo indirimi (min 300 TL)\n');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error(error);
  } finally {
    await client.end();
    console.log('🔌 Bağlantı kapatıldı.');
  }
}

setupDatabase();
