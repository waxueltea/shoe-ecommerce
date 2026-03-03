-- ====================================
-- SHOESTORE - NEON POSTGRESQL SETUP
-- Manuel kurulum için tek dosya
-- ====================================

-- ==================== TABLOLAR ====================

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

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'Türkiye',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  coupon_code VARCHAR(50),
  shipping_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
  billing_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
  notes TEXT,
  paytr_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  size VARCHAR(10) NOT NULL,
  color VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  button_text VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, variant_id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXLER ====================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- ==================== ÖRNEK VERİLER ====================

-- NOT: Şifreler bcrypt ile hash'lenmiş hali:
-- admin123 -> $2a$10$6XWZZ7KxMUhTADaYm9y2HOXMvVh3ItS8lKWPkn7yq.I9JzMZq7X7G
-- user123  -> $2a$10$YourHashedPasswordHere

-- 1. Kullanıcılar
INSERT INTO users (email, password, first_name, last_name, phone, role)
VALUES 
  ('admin@example.com', '$2a$10$6XWZZ7KxMUhTADaYm9y2HOXMvVh3ItS8lKWPkn7yq.I9JzMZq7X7G', 'Admin', 'User', '+905551234567', 'admin'),
  ('user@example.com', '$2a$10$6XWZZ7KxMUhTADaYm9y2HOXMvVh3ItS8lKWPkn7yq.I9JzMZq7X7G', 'Test', 'User', '+905559876543', 'user')
ON CONFLICT (email) DO NOTHING;

-- 2. Kategoriler
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Erkek Ayakkabı', 'erkek-ayakkabi', 'Erkekler için şık ve rahat ayakkabılar', 1, true),
('Kadın Ayakkabı', 'kadin-ayakkabi', 'Kadınlar için şık ve rahat ayakkabılar', 2, true),
('Spor Ayakkabı', 'spor-ayakkabi', 'Spor ve koşu için özel ayakkabılar', 3, true),
('Günlük Ayakkabı', 'gunluk-ayakkabi', 'Günlük kullanım için rahat ayakkabılar', 4, true),
('Klasik Ayakkabı', 'klasik-ayakkabi', 'Şık ve klasik ayakkabılar', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Bannerlar
INSERT INTO banners (title, subtitle, description, image_url, link_url, button_text, display_order, is_active) VALUES
('Yeni Sezon İndirimi', '%40''a Varan İndirim', 'Tüm spor ayakkabılarda kampanya', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920', '/products?category=spor-ayakkabi', 'Alışverişe Başla', 1, true),
('Ücretsiz Kargo', '500 TL ve Üzeri Siparişlerde', 'Türkiye geneli hızlı teslimat', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920', '/products', 'Keşfet', 2, true);

-- 4. Kuponlar
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit, is_active) VALUES
('WELCOME10', 'Yeni üyeler için %10 indirim', 'percentage', 10, 500, 100, true),
('SUMMER2026', 'Yaz kampanyası %25 indirim', 'percentage', 25, 1000, 50, true),
('FREESHIP', 'Ücretsiz kargo kuponu', 'fixed', 50, 300, NULL, true)
ON CONFLICT (code) DO NOTHING;

-- 5. Sistem ayarları
INSERT INTO settings (key, value, description) VALUES
('tax_rate', '18', 'KDV oranı (%)'),
('shipping_cost', '50', 'Kargo ücreti (TL)'),
('free_shipping_threshold', '500', 'Ücretsiz kargo limiti (TL)'),
('site_name', 'ShoeStore', 'Site adı'),
('site_description', 'Modern ayakkabı alışverişinin yeni adresi', 'Site açıklaması'),
('contact_email', 'info@shoestore.com', 'İletişim e-postası'),
('contact_phone', '+90 555 123 45 67', 'İletişim telefonu')
ON CONFLICT (key) DO NOTHING;

-- 6. Örnek ürünler
WITH sport_cat AS (
  SELECT id FROM categories WHERE slug = 'spor-ayakkabi' LIMIT 1
),
nike_product AS (
  INSERT INTO products (name, slug, description, category_id, brand, price, discount_price, is_featured, is_new, is_active)
  SELECT 'Nike Air Max 270', 'nike-air-max-270', 'Rahat ve şık spor ayakkabı, günlük kullanım için ideal', id, 'Nike', 2499.99, 1999.99, true, true, true
  FROM sport_cat
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),
adidas_product AS (
  INSERT INTO products (name, slug, description, category_id, brand, price, discount_price, is_featured, is_new, is_active)
  SELECT 'Adidas Ultraboost 22', 'adidas-ultraboost-22', 'Koşu için ideal yüksek performanslı ayakkabı', id, 'Adidas', 3299.99, NULL, true, true, true
  FROM sport_cat
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
),
puma_product AS (
  INSERT INTO products (name, slug, description, category_id, brand, price, discount_price, is_featured, is_new, is_active)
  SELECT 'Puma RS-X', 'puma-rs-x', 'Retro tarzda günlük spor ayakkabı', id, 'Puma', 1799.99, 1499.99, false, false, true
  FROM sport_cat
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
-- Ürün resimleri
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', true, 0 FROM nike_product
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', true, 0 FROM adidas_product
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', true, 0 FROM puma_product;

-- Ürün varyantları (Nike için)
WITH nike AS (SELECT id FROM products WHERE slug = 'nike-air-max-270' LIMIT 1)
INSERT INTO product_variants (product_id, size, color, color_code, sku, stock_quantity)
SELECT nike.id, size_val, color_name, color_hex, 
       'nike-air-max-270-' || size_val || '-' || LOWER(color_name),
       (random() * 15 + 5)::int
FROM nike,
  (VALUES ('39'),('40'),('41'),('42'),('43'),('44')) AS sizes(size_val),
  (VALUES ('Siyah','#000000'),('Beyaz','#FFFFFF'),('Mavi','#0000FF')) AS colors(color_name, color_hex)
ON CONFLICT (product_id, size, color) DO NOTHING;

-- Ürün varyantları (Adidas için)
WITH adidas AS (SELECT id FROM products WHERE slug = 'adidas-ultraboost-22' LIMIT 1)
INSERT INTO product_variants (product_id, size, color, color_code, sku, stock_quantity)
SELECT adidas.id, size_val, color_name, color_hex,
       'adidas-ultraboost-22-' || size_val || '-' || LOWER(color_name),
       (random() * 15 + 5)::int
FROM adidas,
  (VALUES ('39'),('40'),('41'),('42'),('43'),('44')) AS sizes(size_val),
  (VALUES ('Siyah','#000000'),('Beyaz','#FFFFFF'),('Kırmızı','#FF0000')) AS colors(color_name, color_hex)
ON CONFLICT (product_id, size, color) DO NOTHING;

-- Ürün varyantları (Puma için)
WITH puma AS (SELECT id FROM products WHERE slug = 'puma-rs-x' LIMIT 1)
INSERT INTO product_variants (product_id, size, color, color_code, sku, stock_quantity)
SELECT puma.id, size_val, color_name, color_hex,
       'puma-rs-x-' || size_val || '-' || LOWER(color_name),
       (random() * 15 + 5)::int
FROM puma,
  (VALUES ('39'),('40'),('41'),('42'),('43'),('44')) AS sizes(size_val),
  (VALUES ('Siyah','#000000'),('Gri','#808080'),('Turuncu','#FF8C00')) AS colors(color_name, color_hex)
ON CONFLICT (product_id, size, color) DO NOTHING;
