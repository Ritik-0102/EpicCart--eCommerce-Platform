const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../config/cloudinary');

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
    const { 
      name, description, price, stock, imageUrl, imagePublicId, categoryId,
      sku, slug, lowStockThreshold, isPublished, isFeatured, isArchived
    } = req.body;

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

    // Check unique SKU if provided
    if (sku) {
      const existingSku = await prisma.product.findUnique({ where: { sku } });
      if (existingSku) {
        return res.status(400).json({ success: false, message: 'SKU already exists' });
      }
    }

    // Check unique slug if provided
    if (slug) {
      const existingSlug = await prisma.product.findUnique({ where: { slug } });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'Slug already exists' });
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        imageUrl,
        imagePublicId,
        categoryId: parseInt(categoryId),
        sku: sku || null,
        slug: slug || null,
        lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold) : 5,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
        isArchived: isArchived !== undefined ? Boolean(isArchived) : false
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

    const { 
      name, description, price, stock, imageUrl, imagePublicId, categoryId,
      sku, slug, lowStockThreshold, isPublished, isFeatured, isArchived
    } = req.body;

    // Check unique SKU if provided and changed
    if (sku && sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({ where: { sku } });
      if (existingSku) {
        return res.status(400).json({ success: false, message: 'SKU already exists' });
      }
    }

    // Check unique slug if provided and changed
    if (slug && slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({ where: { slug } });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'Slug already exists' });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        imagePublicId: imagePublicId !== undefined ? imagePublicId : existingProduct.imagePublicId,
        categoryId: categoryId !== undefined ? parseInt(categoryId) : existingProduct.categoryId,
        sku: sku !== undefined ? sku : existingProduct.sku,
        slug: slug !== undefined ? slug : existingProduct.slug,
        lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold) : existingProduct.lowStockThreshold,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existingProduct.isPublished,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingProduct.isFeatured,
        isArchived: isArchived !== undefined ? Boolean(isArchived) : existingProduct.isArchived
      }
    });

    // If there is an old Cloudinary image and it's being replaced or removed, delete it ONLY AFTER successful DB update
    if (
      existingProduct.imagePublicId && 
      ( (imagePublicId !== undefined && imagePublicId !== existingProduct.imagePublicId) || 
        (imageUrl !== undefined && imageUrl !== existingProduct.imageUrl && imagePublicId === undefined) )
    ) {
      try {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Failed to delete old Cloudinary image:", cloudinaryError);
      }
    }

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

    // If it has a Cloudinary image, destroy it ONLY AFTER successful DB deletion
    if (existingProduct.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Failed to delete Cloudinary image on product deletion:", cloudinaryError);
      }
    }

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
