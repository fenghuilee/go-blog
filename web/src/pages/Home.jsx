import { useState, useEffect } from 'react';
import { getArticles, getSettings } from '../services/api';
import ArticleList from '../components/article/ArticleList';
import './Home.css';

function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // 加载系统设置
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings.posts_per_page) {
                    setPageSize(parseInt(settings.posts_per_page) || 10);
                }
            } catch (error) {
                console.error('获取设置失败:', error);
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        if (pageSize > 0) {
            loadArticles();
        }
    }, [page, pageSize]);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await getArticles({ page, page_size: pageSize, status: 'published' });
            setArticles(data.list || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('加载文章失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="home-page">
            <div className="container">
                <ArticleList articles={articles} loading={loading} />

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            上一页
                        </button>
                        <span className="page-info">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages}
                        >
                            下一页
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
