const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: true });

const internalLinkSchema = new mongoose.Schema({
    anchorText: { type: String, required: true },
    targetUrl: { type: String, required: true }
}, { _id: true });

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' }
}, { _id: true });

const seoConfigSchema = new mongoose.Schema({
    pageSlug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    pageName: {
        type: String,
        required: true,
        trim: true
    },
    // Meta Tags
    title: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: [{ type: String }],
    canonicalUrl: { type: String, default: '' },
    // Open Graph
    ogTitle: { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    ogType: { type: String, default: 'website' },
    // Headings
    headings: {
        h1: { type: String, default: '' },
        h2: { type: String, default: '' },
        h3: { type: String, default: '' },
        h4: { type: String, default: '' },
        h5: { type: String, default: '' },
        h6: { type: String, default: '' }
    },
    // Rich HTML Content
    htmlContent: { type: String, default: '' },
    // FAQs
    faqs: [faqSchema],
    // Internal Links
    internalLinks: [internalLinkSchema],
    // Images with Alt Text
    images: [imageSchema],
    // Schema Markup
    schemaMarkup: {
        article: { type: Boolean, default: false },
        organization: { type: Boolean, default: false },
        faq: { type: Boolean, default: false },
        breadcrumb: { type: Boolean, default: false },
        customJson: { type: String, default: '' }
    },
    // Code Injection
    codeInjection: {
        headerScripts: { type: String, default: '' },
        footerScripts: { type: String, default: '' }
    },
    // Robots
    robotsTxt: { type: String, default: '' },
    // Sitemap
    sitemapEnabled: { type: Boolean, default: true },
    sitemapPriority: { type: Number, default: 0.5, min: 0, max: 1 },
    sitemapChangeFreq: {
        type: String,
        enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
        default: 'weekly'
    }
}, { timestamps: true });

module.exports = mongoose.model('SeoConfig', seoConfigSchema);
