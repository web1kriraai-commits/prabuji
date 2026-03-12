const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const {
    getAllSeoConfigs,
    getSeoBySlug,
    upsertSeoConfig,
    deleteSeoConfig,
    generateSitemap,
    getRobotsTxt,
    updateRobotsTxt
} = require('../controllers/seoController');

// Public routes (must be before :slug param routes)
router.get('/generate/sitemap', generateSitemap);
router.get('/config/robots', getRobotsTxt);

// Admin routes
router.get('/', auth, isAdmin, getAllSeoConfigs);
router.put('/config/robots', auth, isAdmin, updateRobotsTxt);
router.put('/:slug', auth, isAdmin, upsertSeoConfig);
router.delete('/:slug', auth, isAdmin, deleteSeoConfig);

// Public route — get SEO for a specific page
router.get('/:slug', getSeoBySlug);

module.exports = router;
