const db = require('../config/database');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT *, 
        (SELECT COUNT(*) FROM products WHERE category_id = categories.id AND is_active = true) as product_count
       FROM categories 
       WHERE is_active = true
       ORDER BY display_order, name`
    );

    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Get banners
exports.getBanners = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM banners 
       WHERE is_active = true
         AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
         AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)
       ORDER BY display_order`
    );

    res.json({ banners: result.rows });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Failed to get banners' });
  }
};

// Validate coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const result = await db.query(
      `SELECT * FROM coupons 
       WHERE code = $1 
         AND is_active = true 
         AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
         AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)
         AND (usage_limit IS NULL OR used_count < usage_limit)`,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    const coupon = result.rows[0];

    if (subtotal < coupon.min_purchase_amount) {
      return res.status(400).json({ 
        error: `Minimum purchase amount is ${coupon.min_purchase_amount} TL` 
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
};

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM settings');

    const settings = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
};
