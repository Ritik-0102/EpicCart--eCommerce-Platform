const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all store settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getStoreSettings = async (req, res, next) => {
  try {
    const settings = await prisma.storeSettings.findMany();
    // Convert array to object for easier frontend consumption
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.status(200).json({ success: true, data: settingsObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateStoreSettings = async (req, res, next) => {
  try {
    const settingsUpdates = req.body; // e.g. { storeName: "EpicCart", currency: "INR" }
    
    // We update each key sequentially
    for (const [key, value] of Object.entries(settingsUpdates)) {
      await prisma.storeSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }

    res.status(200).json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStoreSettings,
  updateStoreSettings
};
