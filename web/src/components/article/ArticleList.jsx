import ArticleCard from './ArticleCard';
import './ArticleList.css';

function ArticleList({ articles, loading }) {
    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    if (!articles || articles.length === 0) {
        return <div className="empty">暂无文章</div>;
    }

    return (
        <div className="article-list">
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
    );
}

export default ArticleList;
