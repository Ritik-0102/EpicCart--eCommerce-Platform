const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true } // Include category details in the response
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    // Basic Validation
    if (!name || !description || price === undefined || !categoryId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: name, description, price, categoryId' 
      });
    }

    // Verify the category exists before creating a product in it
    const categoryExists = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found. Cannot assign product.' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        imageUrl,
        categoryId: parseInt(categoryId)
      }
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    // Check if product exists first
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        categoryId: categoryId !== undefined ? parseInt(categoryId) : existingProduct.categoryId
      }
    });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    res.status(200).json({ success: true, message: 'Product successfully deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
