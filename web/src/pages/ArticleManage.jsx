import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, deleteArticle } from '../services/api';
import './ArticleManage.css';

function ArticleManage() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, published, draft

    useEffect(() => {
        loadArticles();
    }, [filter]);

    const loadArticles = async () => {
        setLoading(true);
        try {
            const params = {
                page: 1,
                page_size: 100,
            };

            if (filter === 'all') {
                // 查看全部：显示所有状态的文章
                params.show_all = true;
            } else {
                // 按状态筛选
                params.status = filter;
            }

            const data = await getArticles(params);
            setArticles(data.list || []);
        } catch (error) {
            console.error('加载文章失败:', error);
            alert('加载文章失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`确定要删除文章"${title}"吗？`)) {
            return;
        }

        try {
            await deleteArticle(id);
            alert('删除成功');
            loadArticles();
        } catch (error) {
            alert('删除失败：' + error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('zh-CN');
    };

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="article-manage-page">
            <div className="container">
                <div className="page-header">
                    <h2>文章管理</h2>
                    <Link to="/admin/new" className="new-article-btn">
                        写新文章
                    </Link>
                </div>

                <div className="filter-buttons">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        全部 ({articles.length})
                    </button>
                    <button
                        className={filter === 'published' ? 'active' : ''}
                        onClick={() => setFilter('published')}
                    >
                        已发布
                    </button>
                    <button
                        className={filter === 'draft' ? 'active' : ''}
                        onClick={() => setFilter('draft')}
                    >
                        草稿
                    </button>
                </div>

                {articles.length === 0 ? (
                    <div className="no-articles">
                        暂无文章
                    </div>
                ) : (
                    <div className="article-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>标题</th>
                                    <th>分类</th>
                                    <th>状态</th>
                                    <th>浏览量</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article) => (
                                    <tr key={article.id}>
                                        <td className="title-cell">
                                            <Link to={`/article/${article.id}`}>
                                                {article.title}
                                            </Link>
                                        </td>
                                        <td>
                                            {article.categories && article.categories.length > 0
                                                ? article.categories.map(c => c.name).join(', ')
                                                : '-'}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${article.status}`}>
                                                {article.status === 'published' ? '已发布' : '草稿'}
                                            </span>
                                        </td>
                                        <td>{article.view_count}</td>
                                        <td>{formatDate(article.created_at)}</td>
                                        <td className="actions-cell">
                                            <button
                                                onClick={() => navigate(`/admin/edit/${article.id}`)}
                                                className="edit-btn"
                                            >
                                                编辑
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id, article.title)}
                                                className="delete-btn"
                                            >
                                                删除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ArticleManage;
