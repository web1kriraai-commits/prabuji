const SeoConfig = require('../models/SeoConfig');

// Get all SEO configs (admin)
const getAllSeoConfigs = async (req, res) => {
    try {
        const configs = await SeoConfig.find().sort({ pageName: 1 });
        res.json(configs);
    } catch (error) {
        console.error('Error fetching SEO configs:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// Get SEO config by page slug (public)
const getSeoBySlug = async (req, res) => {
    try {
        const config = await SeoConfig.findOne({ pageSlug: req.params.slug.toLowerCase() });
        if (!config) {
            return res.status(404).json({ msg: 'SEO config not found for this page' });
        }
        res.json(config);
    } catch (error) {
        console.error('Error fetching SEO config:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// Create or update SEO config (admin)
const upsertSeoConfig = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
        let updateData = { ...req.body, pageSlug: slug };

        // Clean up empty objects in arrays to prevent Mongoose validation errors
        if (updateData.images && Array.isArray(updateData.images)) {
            updateData.images = updateData.images.filter(img => img && img.url && img.url.trim() !== '');
        }
        
        if (updateData.faqs && Array.isArray(updateData.faqs)) {
            updateData.faqs = updateData.faqs.filter(faq => faq && faq.question && faq.question.trim() !== '' && faq.answer && faq.answer.trim() !== '');
        }

        if (updateData.internalLinks && Array.isArray(updateData.internalLinks)) {
            updateData.internalLinks = updateData.internalLinks.filter(link => link && link.anchorText && link.anchorText.trim() !== '' && link.targetUrl && link.targetUrl.trim() !== '');
        }

        const config = await SeoConfig.findOneAndUpdate(
            { pageSlug: slug },
            updateData,
            { new: true, upsert: true, runValidators: true }
        );

        res.json({ msg: 'SEO config saved successfully', config });
    } catch (error) {
        console.error('Error saving SEO config:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// Delete SEO config (admin)
const deleteSeoConfig = async (req, res) => {
    try {
        const config = await SeoConfig.findOneAndDelete({ pageSlug: req.params.slug.toLowerCase() });
        if (!config) {
            return res.status(404).json({ msg: 'SEO config not found' });
        }
        res.json({ msg: 'SEO config deleted successfully' });
    } catch (error) {
        console.error('Error deleting SEO config:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// Generate sitemap XML (public)
const generateSitemap = async (req, res) => {
    try {
        const configs = await SeoConfig.find({ sitemapEnabled: true });
        const baseUrl = req.protocol + '://' + req.get('host');

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        configs.forEach(config => {
            const loc = config.canonicalUrl || `${baseUrl}/${config.pageSlug === 'home' ? '' : config.pageSlug}`;
            xml += '  <url>\n';
            xml += `    <loc>${loc}</loc>\n`;
            xml += `    <lastmod>${config.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>${config.sitemapChangeFreq || 'weekly'}</changefreq>\n`;
            xml += `    <priority>${config.sitemapPriority || 0.5}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        res.set('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// Get robots.txt (public)
const getRobotsTxt = async (req, res) => {
    try {
        // Use a special "global" config for robots.txt
        const config = await SeoConfig.findOne({ pageSlug: '_global' });
        const defaultRobots = `User-agent: *\nAllow: /\n\nSitemap: ${req.protocol}://${req.get('host')}/api/seo/generate/sitemap`;

        res.set('Content-Type', 'text/plain');
        res.send(config?.robotsTxt || defaultRobots);
    } catch (error) {
        console.error('Error fetching robots.txt:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

// Update robots.txt (admin)
const updateRobotsTxt = async (req, res) => {
    try {
        const { robotsTxt } = req.body;
        const config = await SeoConfig.findOneAndUpdate(
            { pageSlug: '_global' },
            { pageSlug: '_global', pageName: 'Global Settings', robotsTxt },
            { new: true, upsert: true }
        );
        res.json({ msg: 'Robots.txt updated successfully', config });
    } catch (error) {
        console.error('Error updating robots.txt:', error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllSeoConfigs,
    getSeoBySlug,
    upsertSeoConfig,
    deleteSeoConfig,
    generateSitemap,
    getRobotsTxt,
    updateRobotsTxt
};
