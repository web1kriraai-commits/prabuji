import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SLUG_MAP = {
    '/': 'home',
    '/about': 'about',
    '/contact': 'contact',
    '/blog': 'blog',
    '/chalo-tirthyatra': 'chalo-tirthyatra',
    '/gauranga-vidhyapitha': 'gauranga-vidhyapitha',
    '/accountability': 'accountability',
    '/login': 'login',
};

const SeoHead = () => {
    const location = useLocation();
    const [config, setConfig] = useState(null);

    useEffect(() => {
        const slug = SLUG_MAP[location.pathname] || location.pathname.replace(/^\//, '').replace(/\//g, '-') || 'home';

        const baseURL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

        fetch(`${baseURL}/seo/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                setConfig(data);
                applyMeta(data);
            })
            .catch(() => {
                setConfig(null);
                // Clean up previously set tags
                cleanupMeta();
            });

        return () => cleanupMeta();
    }, [location.pathname]);

    const applyMeta = (data) => {
        // Title
        if (data.title) document.title = data.title;

        // Meta tags
        setMetaTag('description', data.metaDescription);
        setMetaTag('keywords', (data.keywords || []).join(', '));

        // Canonical
        if (data.canonicalUrl) {
            let link = document.querySelector('link[rel="canonical"][data-seo]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'canonical';
                link.setAttribute('data-seo', 'true');
                document.head.appendChild(link);
            }
            link.href = data.canonicalUrl;
        }

        // Open Graph
        setMetaProperty('og:title', data.ogTitle);
        setMetaProperty('og:description', data.ogDescription);
        setMetaProperty('og:image', data.ogImage);
        setMetaProperty('og:type', data.ogType);

        // Schema markup
        removeElements('script[data-seo-schema]');

        if (data.schemaMarkup?.faq && data.faqs?.length > 0) {
            injectJsonLd({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: data.faqs.map(f => ({
                    '@type': 'Question',
                    name: f.question,
                    acceptedAnswer: { '@type': 'Answer', text: f.answer }
                }))
            });
        }

        if (data.schemaMarkup?.organization) {
            injectJsonLd({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Prabuji',
                url: window.location.origin
            });
        }

        if (data.schemaMarkup?.article && data.title) {
            injectJsonLd({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: data.title,
                description: data.metaDescription
            });
        }

        if (data.schemaMarkup?.breadcrumb) {
            injectJsonLd({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
                    { '@type': 'ListItem', position: 2, name: data.pageName, item: window.location.href }
                ]
            });
        }

        if (data.schemaMarkup?.customJson) {
            try {
                const custom = JSON.parse(data.schemaMarkup.customJson);
                injectJsonLd(custom);
            } catch { /* invalid JSON, skip */ }
        }

        // Code injection — header scripts
        removeElements('div[data-seo-header]');
        if (data.codeInjection?.headerScripts) {
            const container = document.createElement('div');
            container.setAttribute('data-seo-header', 'true');
            container.innerHTML = data.codeInjection.headerScripts;
            // Execute scripts
            container.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                document.head.appendChild(newScript);
            });
        }

        // Footer scripts
        removeElements('div[data-seo-footer]');
        if (data.codeInjection?.footerScripts) {
            const container = document.createElement('div');
            container.setAttribute('data-seo-footer', 'true');
            container.innerHTML = data.codeInjection.footerScripts;
            container.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
            });
        }
    };

    const cleanupMeta = () => {
        removeElements('meta[data-seo]');
        removeElements('link[data-seo]');
        removeElements('script[data-seo-schema]');
        removeElements('div[data-seo-header]');
        removeElements('div[data-seo-footer]');
    };

    const setMetaTag = (name, content) => {
        if (!content) return;
        let tag = document.querySelector(`meta[name="${name}"][data-seo]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            tag.setAttribute('data-seo', 'true');
            document.head.appendChild(tag);
        }
        tag.content = content;
    };

    const setMetaProperty = (property, content) => {
        if (!content) return;
        let tag = document.querySelector(`meta[property="${property}"][data-seo]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            tag.setAttribute('data-seo', 'true');
            document.head.appendChild(tag);
        }
        tag.content = content;
    };

    const injectJsonLd = (data) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-schema', 'true');
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    };

    const removeElements = (selector) => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    };

    return null; // This component doesn't render anything visible
};

export default SeoHead;
