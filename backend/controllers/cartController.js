const db = require('../config/database');

// Get cart
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      `SELECT ci.*, pv.size, pv.color, pv.color_code, pv.sku, pv.stock_quantity,
              p.name as product_name, p.slug as product_slug, p.price, p.discount_price,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
       FROM cart_items ci
       JOIN product_variants pv ON ci.variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [user_id]
    );

    const items = result.rows;
    const subtotal = items.reduce((sum, item) => {
      const price = item.discount_price || item.price;
      return sum + (price * item.quantity);
    }, 0);

    res.json({
      items,
      summary: {
        subtotal: subtotal.toFixed(2),
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { variant_id, quantity = 1 } = req.body;
    const user_id = req.user.id;

    // Check stock
    const variantResult = await db.query(
      'SELECT stock_quantity FROM product_variants WHERE id = $1',
      [variant_id]
    );

    if (variantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product variant not found' });
    }

    const stock = variantResult.rows[0].stock_quantity;

    // Check if item already in cart
    const existingItem = await db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND variant_id = $2',
      [user_id, variant_id]
    );

    if (existingItem.rows.length > 0) {
      const newQuantity = existingItem.rows[0].quantity + quantity;

      if (newQuantity > stock) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      await db.query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );

      return res.json({ message: 'Cart updated successfully' });
    }

    if (quantity > stock) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await db.query(
      'INSERT INTO cart_items (user_id, variant_id, quantity) VALUES ($1, $2, $3)',
      [user_id, variant_id, quantity]
    );

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    // Get cart item
    const cartItem = await db.query(
      `SELECT ci.*, pv.stock_quantity 
       FROM cart_items ci
       JOIN product_variants pv ON ci.variant_id = pv.id
       WHERE ci.id = $1 AND ci.user_id = $2`,
      [id, user_id]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const stock = cartItem.rows[0].stock_quantity;

    if (quantity > stock) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await db.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [quantity, id]
    );

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await db.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    await db.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
