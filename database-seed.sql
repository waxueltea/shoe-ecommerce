-- ====================================
-- SAMPLE DATA FOR SHOESTORE E-COMMERCE
-- Neon PostgreSQL için örnek veriler
-- ====================================

-- 1. Create admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, phone, role)
VALUES ('admin@example.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User', '+905551234567', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Create test user (password: user123)
INSERT INTO users (email, password, first_name, last_name, phone, role)
VALUES ('user@example.com', '$2a$10$YourHashedPasswordHere', 'Test', 'User', '+905559876543', 'user')
ON CONFLICT (email) DO NOTHING;

-- 3. Create categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Erkek Ayakkabı', 'erkek-ayakkabi', 'Erkekler için şık ve rahat ayakkabılar', 1),
('Kadın Ayakkabı', 'kadin-ayakkabi', 'Kadınlar için şık ve rahat ayakkabılar', 2),
('Spor Ayakkabı', 'spor-ayakkabi', 'Spor ve koşu için özel ayakkabılar', 3),
('Günlük Ayakkabı', 'gunluk-ayakkabi', 'Günlük kullanım için rahat ayakkabılar', 4),
('Klasik Ayakkabı', 'klasik-ayakkabi', 'Şık ve klasik ayakkabılar', 5)
ON CONFLICT (slug) DO NOTHING;

-- 4. Create sample banners
INSERT INTO banners (title, subtitle, description, image_url, link_url, button_text, display_order) VALUES
('Yeni Sezon İndirimi', '%40''a Varan İndirim', 'Tüm spor ayakkabılarda kampanya', 'https://via.placeholder.com/1920x600/e94560/ffffff?text=Yeni+Sezon+Indirimi', '/products?category=spor-ayakkabi', 'Alışverişe Başla', 1),
('Ücretsiz Kargo', '500 TL ve Üzeri Siparişlerde', 'Türkiye geneli hızlı teslimat', 'https://via.placeholder.com/1920x600/0f3460/ffffff?text=Ucretsiz+Kargo', '/products', 'Keşfet', 2);

-- 5. Create sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, usage_limit) VALUES
('WELCOME10', 'Yeni üyeler için %10 indirim', 'percentage', 10, 500, 100),
('SUMMER2026', 'Yaz kampanyası %25 indirim', 'percentage', 25, 1000, 50),
('FREESHIP', 'Ücretsiz kargo', 'fixed', 50, 300, NULL)
ON CONFLICT (code) DO NOTHING;

-- 6. Create settings
INSERT INTO settings (key, value, description) VALUES
('tax_rate', '18', 'KDV oranı (%)'),
('shipping_cost', '50', 'Kargo ücreti (TL)'),
('free_shipping_threshold', '500', 'Ücretsiz kargo limiti (TL)'),
('site_name', 'ShoeStore', 'Site adı'),
('site_description', 'Modern ayakkabı alışverişinin yeni adresi', 'Site açıklaması'),
('contact_email', 'info@shoestore.com', 'İletişim e-postası'),
('contact_phone', '+90 555 123 45 67', 'İletişim telefonu')
ON CONFLICT (key) DO NOTHING;

-- Not: Şifrelerin hash'lenmesi için backend'de bcrypt kullanılmalı
-- Admin ve User şifreleri: admin123 ve user123
-- Hash'lenmiş versiyonları seed.js scriptinde oluşturulur
