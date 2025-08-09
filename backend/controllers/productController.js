import {db} from '../config/db.js';

//crud lol

const getProducts = async (req, res) => {
  try {
    const { q } = req.query;
    let products;
    if (q && q.trim()) {
      const like = `%${q.trim()}%`;
      products = await db`SELECT * FROM products
        WHERE name ILIKE ${like} OR description ILIKE ${like}
        ORDER BY created_at DESC;`;
    } else {
      products = await db`SELECT * FROM products
        ORDER BY created_at DESC;`;
    }
    console.log("fetched products:",products);
    res.status(200).json({success: true, data: products});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, image, price, description, category, old_price, images, sizes, colors } = req.body;
    const newProduct = await db`INSERT INTO products (name, image, price, description, category, old_price, images, sizes, colors)
    VALUES (${name}, ${image}, ${price}, ${description}, ${category || null}, ${old_price || null}, ${images || null}, ${sizes || null}, ${colors || null})
    RETURNING *;`;
    console.log("new product added:",newProduct);
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db`SELECT * FROM products WHERE id = ${id};`;
    if (product.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, price, description, category, old_price, images, sizes, colors } = req.body;
    const updatedProduct = await db`UPDATE products SET
      name = COALESCE(${name}, name),
      image = COALESCE(${image}, image),
      price = COALESCE(${price}, price),
      description = COALESCE(${description}, description),
      category = COALESCE(${category}, category),
      old_price = COALESCE(${old_price}, old_price),
      images = COALESCE(${images}, images),
      sizes = COALESCE(${sizes}, sizes),
      colors = COALESCE(${colors}, colors),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;`;
    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await db`DELETE FROM products WHERE id = ${id} RETURNING *;`;
    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
