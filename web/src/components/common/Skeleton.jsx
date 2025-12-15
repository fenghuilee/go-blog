import './Skeleton.css';

/**
 * 骨架屏组件
 * @param {string} type - 类型：text, title, card, avatar, button
 * @param {number} count - 重复次数
 * @param {string} width - 自定义宽度
 * @param {string} height - 自定义高度
 */
function Skeleton({ type = 'text', count = 1, width, height, className = '' }) {
    const items = Array.from({ length: count }, (_, i) => i);

    const getClassName = () => {
        const base = 'skeleton';
        const typeClass = `skeleton-${type}`;
        return `${base} ${typeClass} ${className}`.trim();
    };

    const getStyle = () => {
        const style = {};
        if (width) style.width = width;
        if (height) style.height = height;
        return style;
    };

    if (type === 'card') {
        return (
            <div className="skeleton-card-wrapper">
                {items.map(i => (
                    <div key={i} className="skeleton-card">
                        <div className="skeleton skeleton-image"></div>
                        <div className="skeleton-card-content">
                            <div className="skeleton skeleton-title"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {items.map(i => (
                <div key={i} className={getClassName()} style={getStyle()}></div>
            ))}
        </>
    );
}

/**
 * 文章列表骨架屏
 */
export function ArticleListSkeleton({ count = 3 }) {
    return (
        <div className="article-list-skeleton">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="article-skeleton">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-meta"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text" style={{ width: '75%' }}></div>
                </div>
            ))}
        </div>
    );
}

/**
 * 文章详情骨架屏
 */
export function ArticleDetailSkeleton() {
    return (
        <div className="article-detail-skeleton">
            <div className="skeleton skeleton-title-large"></div>
            <div className="skeleton skeleton-meta" style={{ width: '200px' }}></div>
            <div className="skeleton-content">
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            </div>
        </div>
    );
}

/**
 * 表格骨架屏 - 用于文章管理等列表页
 */
export function TableSkeleton({ rows = 5, cols = 5 }) {
    return (
        <div className="table-skeleton">
            <div className="skeleton-table-header">
                {Array.from({ length: cols }, (_, i) => (
                    <div key={i} className="skeleton skeleton-cell-header"></div>
                ))}
            </div>
            {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="skeleton-table-row">
                    {Array.from({ length: cols }, (_, colIndex) => (
                        <div key={colIndex} className="skeleton skeleton-cell"></div>
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * 设置页骨架屏
 */
export function SettingsSkeleton() {
    return (
        <div className="settings-skeleton">
            <div className="skeleton skeleton-title" style={{ width: '150px', marginBottom: '2rem' }}></div>
            {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="settings-skeleton-group">
                    <div className="skeleton skeleton-text" style={{ width: '100px', height: '1rem' }}></div>
                    <div className="skeleton skeleton-input"></div>
                </div>
            ))}
            <div className="skeleton skeleton-button" style={{ marginTop: '1.5rem' }}></div>
        </div>
    );
}

export default Skeleton;
