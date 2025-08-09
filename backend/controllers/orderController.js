import { db } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const {
      product_id,
      qty = 1,
      color = null,
      size = null,
      customer_name,
      phone,
      wilaya,
      commune = null,
      username = null,
      notes = null,
    } = req.body || {};

    if (!product_id || !customer_name || !phone || !wilaya) {
      return res.status(400).json({ error: 'product_id, customer_name, phone, wilaya are required' });
    }

    const product = await db`SELECT id, name, price, image FROM products WHERE id = ${product_id};`;
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const p = product[0];

    const rows = await db`
      INSERT INTO orders
      (product_id, product_name, product_price, product_image, qty, color, size, customer_name, phone, wilaya, commune, username, notes, status)
      VALUES (${p.id}, ${p.name}, ${p.price}, ${p.image}, ${qty}, ${color}, ${size}, ${customer_name}, ${phone}, ${wilaya}, ${commune}, ${username}, ${notes}, 'pending')
      RETURNING *;
    `;

    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOrders = async (_req, res) => {
  try {
    const rows = await db`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;`;
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
