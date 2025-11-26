import { Link } from 'react-router-dom';
import './ArticleCard.css';

function ArticleCard({ article }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('zh-CN');
    };

    return (
        <div className="article-card">
            <Link to={`/article/${article.id}`} className="article-link">
                <h2 className="article-title">{article.title}</h2>
                <p className="article-summary">
                    {article.summary || article.content.substring(0, 150) + '...'}
                </p>
                <div className="article-meta">
                    <span className="article-date">{formatDate(article.created_at)}</span>
                    {article.categories && article.categories.length > 0 && (
                        <span className="article-categories">
                            {article.categories.map((cat, index) => (
                                <span key={cat.id}>
                                    {cat.name}
                                    {index < article.categories.length - 1 && ', '}
                                </span>
                            ))}
                        </span>
                    )}
                    <span className="article-views">浏览 {article.view_count}</span>
                </div>
                {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                        {article.tags.map((tag) => (
                            <span key={tag.id} className="tag">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </Link>
        </div>
    );
}

export default ArticleCard;
