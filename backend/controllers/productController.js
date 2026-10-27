// Product controller handling catalog queries, filtering, and admin product management
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../config/cloudinary');

// @desc    Get all products (with optional search, category, stock, price filtering, sorting, and pagination)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    // Extract query parameters from the request URL
    const { category, search, featured, inStock, minPrice, maxPrice, sort, page, limit } = req.query;

    // Build the Prisma "where" filter object dynamically
    const where = {
      isArchived: false, // Never return soft-deleted or archived products
    };

    // Filter to only featured products if requested
    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Filter to only products currently in stock
    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    // Filter by price range (minimum and/or maximum price)
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && !isNaN(parseFloat(minPrice))) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(parseFloat(maxPrice))) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // Filter by category: handles either numeric category ID or category name string
    if (category) {
      const parsedCatId = parseInt(category);
      if (!isNaN(parsedCatId)) {
        where.categoryId = parsedCatId;
      } else {
        where.category = {
          name: {
            equals: category,
            mode: 'insensitive' // Ignore uppercase/lowercase differences
          }
        };
      }
    }

    // Search query: searches both product name and description case-insensitively
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    // Determine sort ordering based on the "sort" query param
    let orderBy = { id: 'desc' }; // Default to newest first
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'newest') {
      orderBy = { id: 'desc' };
    }

    // Pagination calculations
    const take = limit ? Math.max(1, parseInt(limit)) : undefined; // How many items to fetch
    const skip = page && limit ? Math.max(0, (parseInt(page) - 1) * take) : undefined; // How many to skip

    // Run count and data queries concurrently using Promise.all for faster response times
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { category: true }, // Include related category details
        orderBy,
        take,
        skip
      })
    ]);

    // Return the results along with pagination metadata
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: page ? parseInt(page) : 1,
      totalPages: take ? Math.ceil(total / take) : 1,
      data: products
    });
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

    // Query product by unique ID and join its category
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

// @desc    Create a new product (Admin only)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { 
      name, description, price, stock, imageUrl, imagePublicId, categoryId,
      sku, slug, lowStockThreshold, isPublished, isFeatured, isArchived
    } = req.body;

    // Validate that required fields are present
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

    // Create the product record in the database
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

// @desc    Update an existing product (Admin only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    // Check if the product exists before attempting an update
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

    // Update product fields in PostgreSQL
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

    // If an image was replaced, remove the old image asset from Cloudinary storage
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

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    // Verify product exists before deleting
    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete the product record
    await prisma.product.delete({
      where: { id: productId }
    });

    // Clean up uploaded image from Cloudinary if one exists
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
