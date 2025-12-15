import { useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';

/**
 * SEO组件
 * @param {Object} props
 * @param {string} props.title - 页面标题 (不含站点名称)
 * @param {string} props.description - 页面描述 (meta description)
 * @param {string} props.keywords - 关键词 (meta keywords)
 */
function SEO({ title, description, keywords }) {
    const { settings } = useSettings();

    useEffect(() => {
        // 1. 设置 Title
        const siteName = settings.site_name || 'Go Blog';
        const finalTitle = title ? `${title} - ${siteName}` : siteName;
        document.title = finalTitle;

        // 2. 设置 Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        // 优先使用传入的 description，其次使用站点全局 description
        metaDesc.content = description || settings.site_description || settings.seo_description || '';

        // 3. 设置 Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        // 优先使用传入的 keywords，其次使用站点全局 keywords
        metaKeywords.content = keywords || settings.seo_keywords || '';

    }, [title, description, keywords, settings]);

    return null;
}

export default SEO;
