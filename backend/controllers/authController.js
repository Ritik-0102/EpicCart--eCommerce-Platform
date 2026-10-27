// Authentication controller handling user registration, login, and profile retrieval
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Helper function to sign a JSON Web Token (JWT) with the user's ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token remains valid for 30 days
  });
};

// @desc    Register a new customer account
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate that required fields were sent
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if an account already exists with this email address
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Generate salt and hash the password securely with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user record in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: req.body.role || 'USER'
      },
    });

    // Respond with user details and signed JWT (password hash is strictly excluded)
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate existing user credentials and return a token
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find the user by their unique email
    const user = await prisma.user.findUnique({ where: { email } });

    // Compare the plaintext password against the stored bcrypt hash
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user.id),
        },
      });
    } else {
      // 401 Unauthorized for incorrect email or password
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile (Protected route)
// @route   GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    // req.user.id is populated by the protect middleware after verifying the JWT
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
        // Password field is omitted from select for security
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile };
