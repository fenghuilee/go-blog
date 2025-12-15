import ArticleCard from './ArticleCard';
import { ArticleListSkeleton } from '../common/Skeleton';
import './ArticleList.css';

function ArticleList({ articles, loading }) {
    if (loading) {
        return <ArticleListSkeleton count={3} />;
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

