const db = require('../config/database');
const crypto = require('crypto');

// Create order
exports.createOrder = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    const user_id = req.user.id;
    const { shipping_address_id, billing_address_id, coupon_code, notes } = req.body;

    // Get cart items
    const cartResult = await client.query(
      `SELECT ci.*, pv.size, pv.color, pv.sku, pv.stock_quantity, pv.product_id,
              p.name as product_name, p.price, p.discount_price
       FROM cart_items ci
       JOIN product_variants pv ON ci.variant_id = pv.id
       JOIN products p ON pv.product_id = p.id
       WHERE ci.user_id = $1`,
      [user_id]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartItems = cartResult.rows;

    // Check stock for all items
    for (const item of cartItems) {
      if (item.quantity > item.stock_quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.product_name} (${item.size}, ${item.color})` 
        });
      }
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.discount_price || item.price;
      return sum + (price * item.quantity);
    }, 0);

    // Get settings
    const settingsResult = await client.query(
      "SELECT key, value FROM settings WHERE key IN ('tax_rate', 'shipping_cost', 'free_shipping_threshold')"
    );
    
    const settings = settingsResult.rows.reduce((acc, row) => {
      acc[row.key] = parseFloat(row.value);
      return acc;
    }, {});

    const taxRate = settings.tax_rate || 18;
    const shippingCost = subtotal >= (settings.free_shipping_threshold || 500) ? 0 : (settings.shipping_cost || 50);
    const taxAmount = (subtotal * taxRate) / 100;

    let discountAmount = 0;
    let appliedCouponCode = null;

    // Apply coupon if provided
    if (coupon_code) {
      const couponResult = await client.query(
        `SELECT * FROM coupons 
         WHERE code = $1 
           AND is_active = true 
           AND (valid_from IS NULL OR valid_from <= CURRENT_TIMESTAMP)
           AND (valid_until IS NULL OR valid_until >= CURRENT_TIMESTAMP)
           AND (usage_limit IS NULL OR used_count < usage_limit)`,
        [coupon_code]
      );

      if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0];

        if (subtotal >= coupon.min_purchase_amount) {
          if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount) {
              discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
            }
          } else {
            discountAmount = coupon.discount_value;
          }

          appliedCouponCode = coupon_code;

          // Update coupon usage
          await client.query(
            'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1',
            [coupon.id]
          );
        }
      }
    }

    const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

    // Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, order_number, status, payment_status, 
        subtotal, discount_amount, shipping_cost, tax_amount, total_amount,
        coupon_code, shipping_address_id, billing_address_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        user_id, orderNumber, 'pending', 'pending',
        subtotal, discountAmount, shippingCost, taxAmount, totalAmount,
        appliedCouponCode, shipping_address_id, billing_address_id, notes
      ]
    );

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of cartItems) {
      const price = item.discount_price || item.price;
      const total = price * item.quantity;

      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, size, color, quantity, price, total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [order.id, item.product_id, item.variant_id, item.product_name, item.size, item.color, item.quantity, price, total]
      );

      // Update stock
      await client.query(
        'UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.variant_id]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
};

// Get user orders
exports.getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      `SELECT o.*, 
              COUNT(oi.id) as item_count,
              (SELECT json_agg(json_build_object(
                'id', oi.id,
                'product_name', oi.product_name,
                'size', oi.size,
                'color', oi.color,
                'quantity', oi.quantity,
                'price', oi.price,
                'total', oi.total
              )) FROM order_items oi WHERE oi.order_id = o.id) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    // Get addresses
    const shippingAddress = await db.query(
      'SELECT * FROM addresses WHERE id = $1',
      [order.shipping_address_id]
    );

    const billingAddress = order.billing_address_id 
      ? await db.query('SELECT * FROM addresses WHERE id = $1', [order.billing_address_id])
      : shippingAddress;

    res.json({
      order: {
        ...order,
        items: itemsResult.rows,
        shipping_address: shippingAddress.rows[0],
        billing_address: billingAddress.rows[0],
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const user_id = req.user.id;

    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.status !== 'pending' && order.status !== 'processing') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    // Update order status
    await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['cancelled', id]
    );

    // Restore stock
    const itemsResult = await client.query(
      'SELECT variant_id, quantity FROM order_items WHERE order_id = $1',
      [id]
    );

    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE product_variants SET stock_quantity = stock_quantity + $1 WHERE id = $2',
        [item.quantity, item.variant_id]
      );
    }

    await client.query('COMMIT');

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  } finally {
    client.release();
  }
};
