const db = require('../config/database');

// Get all products with filters
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      min_price,
      max_price,
      size,
      color,
      search,
      sort = 'created_at',
      order = 'DESC',
      page = 1,
      limit = 12,
      is_featured,
      is_new,
    } = req.query;

    let query = `
      SELECT DISTINCT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image,
        (SELECT json_agg(DISTINCT pv.size ORDER BY pv.size) FROM product_variants pv WHERE pv.product_id = p.id) as available_sizes,
        (SELECT json_agg(DISTINCT jsonb_build_object('name', pv.color, 'code', pv.color_code) ORDER BY pv.color) FROM product_variants pv WHERE pv.product_id = p.id) as available_colors
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;

    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (brand) {
      query += ` AND LOWER(p.brand) = LOWER($${paramIndex})`;
      params.push(brand);
      paramIndex++;
    }

    if (min_price) {
      query += ` AND p.price >= $${paramIndex}`;
      params.push(min_price);
      paramIndex++;
    }

    if (max_price) {
      query += ` AND p.price <= $${paramIndex}`;
      params.push(max_price);
      paramIndex++;
    }

    if (search) {
      query += ` AND (LOWER(p.name) LIKE LOWER($${paramIndex}) OR LOWER(p.description) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (is_featured === 'true') {
      query += ` AND p.is_featured = true`;
    }

    if (is_new === 'true') {
      query += ` AND p.is_new = true`;
    }

    if (size || color) {
      query += ` AND EXISTS (
        SELECT 1 FROM product_variants pv 
        WHERE pv.product_id = p.id 
        ${size ? `AND pv.size = $${paramIndex}` : ''}
        ${color ? `AND LOWER(pv.color) = LOWER($${paramIndex + (size ? 1 : 0)})` : ''}
      )`;
      if (size) {
        params.push(size);
        paramIndex++;
      }
      if (color) {
        params.push(color);
        paramIndex++;
      }
    }

    // Count total
    const countResult = await db.query(query.replace(/SELECT DISTINCT.*FROM/, 'SELECT COUNT(DISTINCT p.id) FROM'));
    const total = parseInt(countResult.rows[0].count);

    // Add sorting
    const allowedSorts = ['created_at', 'price', 'name', 'view_count'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY p.${sortField} ${sortOrder}`;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    res.json({
      products: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    const productResult = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.is_active = true`,
      [slug]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Get images
    const imagesResult = await db.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order',
      [product.id]
    );

    // Get variants
    const variantsResult = await db.query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY size, color',
      [product.id]
    );

    // Get reviews
    const reviewsResult = await db.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 AND r.is_approved = true
       ORDER BY r.created_at DESC`,
      [product.id]
    );

    // Calculate average rating
    const avgRating = reviewsResult.rows.length > 0
      ? reviewsResult.rows.reduce((sum, r) => sum + r.rating, 0) / reviewsResult.rows.length
      : 0;

    // Update view count
    await db.query(
      'UPDATE products SET view_count = view_count + 1 WHERE id = $1',
      [product.id]
    );

    res.json({
      product: {
        ...product,
        images: imagesResult.rows,
        variants: variantsResult.rows,
        reviews: reviewsResult.rows,
        average_rating: avgRating.toFixed(1),
        review_count: reviewsResult.rows.length,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};

// Get related products
exports.getRelatedProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    // First get the product
    const productResult = await db.query(
      'SELECT id, category_id, brand FROM products WHERE slug = $1',
      [slug]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { id, category_id, brand } = productResult.rows[0];

    // Get related products
    const result = await db.query(
      `SELECT p.*, 
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
       FROM products p
       WHERE p.id != $1 
         AND p.is_active = true
         AND (p.category_id = $2 OR p.brand = $3)
       ORDER BY 
         CASE WHEN p.category_id = $2 THEN 1 ELSE 2 END,
         p.created_at DESC
       LIMIT 8`,
      [id, category_id, brand]
    );

    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ error: 'Failed to get related products' });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;
    const user_id = req.user.id;

    // Check if user has purchased this product
    const orderCheck = await db.query(
      `SELECT 1 FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = $1 AND oi.product_id = $2 AND o.payment_status = 'paid'
       LIMIT 1`,
      [user_id, product_id]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(400).json({ error: 'You must purchase this product before reviewing' });
    }

    // Check if user already reviewed
    const existingReview = await db.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const result = await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, title, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [product_id, user_id, rating, title, comment]
    );

    res.status(201).json({
      message: 'Review submitted successfully. It will be visible after approval.',
      review: result.rows[0],
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};
