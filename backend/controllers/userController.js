const db = require('../config/database');

// Get user addresses
exports.getAddresses = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [user_id]
    );

    res.json({ addresses: result.rows });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to get addresses' });
  }
};

// Create address
exports.createAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { 
      title, first_name, last_name, phone, 
      address_line1, address_line2, city, state, postal_code, country, is_default 
    } = req.body;

    // If this is default, unset other defaults
    if (is_default) {
      await db.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [user_id]
      );
    }

    const result = await db.query(
      `INSERT INTO addresses (
        user_id, title, first_name, last_name, phone,
        address_line1, address_line2, city, state, postal_code, country, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        user_id, title, first_name, last_name, phone,
        address_line1, address_line2, city, state, postal_code, country, is_default
      ]
    );

    res.status(201).json({
      message: 'Address created successfully',
      address: result.rows[0],
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { 
      title, first_name, last_name, phone, 
      address_line1, address_line2, city, state, postal_code, country, is_default 
    } = req.body;

    // Check ownership
    const checkResult = await db.query(
      'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If this is default, unset other defaults
    if (is_default) {
      await db.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1 AND id != $2',
        [user_id, id]
      );
    }

    const result = await db.query(
      `UPDATE addresses SET
        title = $1, first_name = $2, last_name = $3, phone = $4,
        address_line1 = $5, address_line2 = $6, city = $7, state = $8, 
        postal_code = $9, country = $10, is_default = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *`,
      [
        title, first_name, last_name, phone,
        address_line1, address_line2, city, state, postal_code, country, is_default, id
      ]
    );

    res.json({
      message: 'Address updated successfully',
      address: result.rows[0],
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await db.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

// Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      `SELECT f.*, p.*,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [user_id]
    );

    res.json({ favorites: result.rows });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};

// Add to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;

    await db.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [user_id, product_id]
    );

    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
};

// Remove from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.params;

    await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
};
