const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
require('dotenv').config();

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('🌱 Starting database seeding...');

    // 1. Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, phone, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@example.com', hashedPassword, 'Admin', 'User', '+905551234567', 'admin']);
    console.log('✅ Admin user created');

    // 2. Create test user
    const testPassword = await bcrypt.hash('user123', 10);
    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, phone, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['user@example.com', testPassword, 'Test', 'User', '+905559876543', 'user']);
    console.log('✅ Test user created');

    // 3. Create categories
    const categories = [
      { name: 'Erkek Ayakkabı', slug: 'erkek-ayakkabi', description: 'Erkekler için şık ve rahat ayakkabılar' },
      { name: 'Kadın Ayakkabı', slug: 'kadin-ayakkabi', description: 'Kadınlar için şık ve rahat ayakkabılar' },
      { name: 'Spor Ayakkabı', slug: 'spor-ayakkabi', description: 'Spor ve koşu için özel ayakkabılar' },
      { name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi', description: 'Günlük kullanım için rahat ayakkabılar' },
      { name: 'Klasik Ayakkabı', slug: 'klasik-ayakkabi', description: 'Şık ve klasik ayakkabılar' },
    ];

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      await client.query(`
        INSERT INTO categories (name, slug, description, display_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO NOTHING
      `, [cat.name, cat.slug, cat.description, i + 1]);
    }
    console.log('✅ Categories created');

    // 4. Create sample products
    const products = [
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Günlük kullanım için ideal, rahat ve şık spor ayakkabı. Hava yastığı teknolojisi ile maksimum konfor sağlar.',
        category_id: 3,
        brand: 'Nike',
        price: 2499.99,
        discount_price: 1999.99,
        is_featured: true,
        is_new: true,
        meta_title: 'Nike Air Max 270 - Spor Ayakkabı',
        meta_description: 'Nike Air Max 270 spor ayakkabı en uygun fiyatlarla. Hava yastığı teknolojisi ile maksimum konfor.',
      },
      {
        name: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        description: 'Koşu ve günlük kullanım için mükemmel. Boost teknolojisi ile enerji geri dönüşü sağlar.',
        category_id: 3,
        brand: 'Adidas',
        price: 3299.99,
        discount_price: null,
        is_featured: true,
        is_new: true,
        meta_title: 'Adidas Ultraboost 22 - Koşu Ayakkabısı',
        meta_description: 'Adidas Ultraboost 22 koşu ayakkabısı. Boost teknolojisi ile üstün performans.',
      },
      {
        name: 'Puma RS-X',
        slug: 'puma-rs-x',
        description: 'Retro tasarım ve modern konfor bir arada. Günlük kullanım için ideal.',
        category_id: 4,
        brand: 'Puma',
        price: 1899.99,
        discount_price: 1599.99,
        is_featured: false,
        is_new: false,
        meta_title: 'Puma RS-X - Günlük Ayakkabı',
        meta_description: 'Puma RS-X günlük ayakkabı retro tasarımı ile dikkat çekiyor.',
      },
      {
        name: 'New Balance 574',
        slug: 'new-balance-574',
        description: 'Klasik tasarım, günlük konfor. Her kombine uygun stil.',
        category_id: 4,
        brand: 'New Balance',
        price: 1699.99,
        discount_price: null,
        is_featured: false,
        is_new: false,
        meta_title: 'New Balance 574 - Klasik Spor Ayakkabı',
        meta_description: 'New Balance 574 klasik tasarımı ile her kombine uygun.',
      },
      {
        name: 'Converse Chuck Taylor',
        slug: 'converse-chuck-taylor',
        description: 'Zamansız klasik. Her yaştan insan için ideal günlük ayakkabı.',
        category_id: 4,
        brand: 'Converse',
        price: 999.99,
        discount_price: 799.99,
        is_featured: true,
        is_new: false,
        meta_title: 'Converse Chuck Taylor - Klasik Kanvas Ayakkabı',
        meta_description: 'Converse Chuck Taylor zamansız klasik tasarımı ile her zaman moda.',
      },
      {
        name: 'Reebok Club C 85',
        slug: 'reebok-club-c-85',
        description: 'Minimal ve şık tasarım. Beyaz deri üst yapısı ile zarif görünüm.',
        category_id: 4,
        brand: 'Reebok',
        price: 1499.99,
        discount_price: null,
        is_featured: false,
        is_new: true,
        meta_title: 'Reebok Club C 85 - Minimal Spor Ayakkabı',
        meta_description: 'Reebok Club C 85 minimal tasarımı ile şık ve rahat.',
      },
    ];

    for (const product of products) {
      const result = await client.query(`
        INSERT INTO products (name, slug, description, category_id, brand, price, discount_price, is_featured, is_new, meta_title, meta_description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      `, [
        product.name,
        product.slug,
        product.description,
        product.category_id,
        product.brand,
        product.price,
        product.discount_price,
        product.is_featured,
        product.is_new,
        product.meta_title,
        product.meta_description,
      ]);

      if (result.rows.length > 0) {
        const productId = result.rows[0].id;

        // Add product images (placeholder images)
        await client.query(`
          INSERT INTO product_images (product_id, image_url, is_primary, display_order)
          VALUES 
            ($1, $2, true, 1),
            ($1, $3, false, 2),
            ($1, $4, false, 3)
        `, [
          productId,
          'https://via.placeholder.com/800x600/1a1a2e/ffffff?text=' + encodeURIComponent(product.name),
          'https://via.placeholder.com/800x600/16213e/ffffff?text=' + encodeURIComponent(product.name + ' 2'),
          'https://via.placeholder.com/800x600/0f3460/ffffff?text=' + encodeURIComponent(product.name + ' 3'),
        ]);

        // Add product variants (sizes and colors)
        const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
        const colors = [
          { name: 'Siyah', code: '#000000' },
          { name: 'Beyaz', code: '#FFFFFF' },
          { name: 'Lacivert', code: '#1a1a2e' },
        ];

        for (const color of colors) {
          for (const size of sizes) {
            const sku = `${product.slug}-${color.name.toLowerCase()}-${size}`.replace(/\s+/g, '-');
            const stock = Math.floor(Math.random() * 50) + 5; // Random stock between 5-55

            await client.query(`
              INSERT INTO product_variants (product_id, size, color, color_code, sku, stock_quantity)
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (product_id, size, color) DO NOTHING
            `, [productId, size, color.name, color.code, sku, stock]);
          }
        }
      }
    }
    console.log('✅ Products and variants created');

    // 5. Create sample banners
    const banners = [
      {
        title: 'Yeni Sezon İndirimi',
        subtitle: '%40\'a Varan İndirim',
        description: 'Tüm spor ayakkabılarda kampanya',
        image_url: 'https://via.placeholder.com/1920x600/e94560/ffffff?text=Yeni+Sezon+Indirimi',
        link_url: '/products?category=spor-ayakkabi',
        button_text: 'Alışverişe Başla',
        display_order: 1,
      },
      {
        title: 'Ücretsiz Kargo',
        subtitle: '500 TL ve Üzeri Siparişlerde',
        description: 'Türkiye geneli hızlı teslimat',
        image_url: 'https://via.placeholder.com/1920x600/0f3460/ffffff?text=Ucretsiz+Kargo',
        link_url: '/products',
        button_text: 'Keşfet',
        display_order: 2,
      },
    ];

    for (const banner of banners) {
      await client.query(`
        INSERT INTO banners (title, subtitle, description, image_url, link_url, button_text, display_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [banner.title, banner.subtitle, banner.description, banner.image_url, banner.link_url, banner.button_text, banner.display_order]);
    }
    console.log('✅ Banners created');

    // 6. Create sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Yeni üyeler için %10 indirim',
        discount_type: 'percentage',
        discount_value: 10,
        min_purchase_amount: 500,
        usage_limit: 100,
      },
      {
        code: 'SUMMER2026',
        description: 'Yaz kampanyası %25 indirim',
        discount_type: 'percentage',
        discount_value: 25,
        min_purchase_amount: 1000,
        usage_limit: 50,
      },
      {
        code: 'FREESHIP',
        description: 'Ücretsiz kargo',
        discount_type: 'fixed',
        discount_value: 50,
        min_purchase_amount: 300,
        usage_limit: null,
      },
    ];

    for (const coupon of coupons) {
      await client.query(`
        INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (code) DO NOTHING
      `, [coupon.code, coupon.description, coupon.discount_type, coupon.discount_value, coupon.min_purchase_amount, coupon.usage_limit]);
    }
    console.log('✅ Coupons created');

    // 7. Create settings
    const settings = [
      { key: 'tax_rate', value: '18', description: 'KDV oranı (%)' },
      { key: 'shipping_cost', value: '50', description: 'Kargo ücreti (TL)' },
      { key: 'free_shipping_threshold', value: '500', description: 'Ücretsiz kargo limiti (TL)' },
      { key: 'site_name', value: 'ShoeStore', description: 'Site adı' },
      { key: 'site_description', value: 'Modern ayakkabı alışverişinin yeni adresi', description: 'Site açıklaması' },
      { key: 'contact_email', value: 'info@shoestore.com', description: 'İletişim e-postası' },
      { key: 'contact_phone', value: '+90 555 123 45 67', description: 'İletişim telefonu' },
    ];

    for (const setting of settings) {
      await client.query(`
        INSERT INTO settings (key, value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO NOTHING
      `, [setting.key, setting.value, setting.description]);
    }
    console.log('✅ Settings created');

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
};

seedData();
