import { useEffect, useCallback } from 'react';
import { getArticles } from '../services/api';
import ArticleList from '../components/article/ArticleList';
import { ArticleListSkeleton } from '../components/common/Skeleton';
import { usePagination, useSettings } from '../hooks';
import './Home.css';

function Home() {
    const { getNumberSetting, loading: settingsLoading } = useSettings();
    const pageSize = getNumberSetting('posts_per_page', 10);

    // 创建获取文章的函数
    const fetchArticles = useCallback(async ({ page, pageSize }) => {
        const data = await getArticles({ page, page_size: pageSize, status: 'published' });
        return { list: data.list, total: data.total };
    }, []);

    // 使用分页Hook
    const {
        data: articles,
        loading,
        page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        fetchData,
        setPageSize,
    } = usePagination(fetchArticles, { pageSize });

    // 当设置加载完成后更新pageSize
    useEffect(() => {
        if (!settingsLoading && pageSize > 0) {
            setPageSize(pageSize);
        }
    }, [pageSize, settingsLoading, setPageSize]);

    // 加载文章
    useEffect(() => {
        if (!settingsLoading) {
            fetchData(page);
        }
    }, [page, pageSize, settingsLoading, fetchData]);

    return (
        <div className="home-page">
            <div className="container">
                {loading ? (
                    <ArticleListSkeleton count={3} />
                ) : (
                    <ArticleList articles={articles} loading={false} />
                )}

                {!loading && totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={prevPage}
                            disabled={!hasPrevPage}
                            className="pagination-btn"
                        >
                            ← 上一页
                        </button>
                        <span className="page-info">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={!hasNextPage}
                            className="pagination-btn"
                        >
                            下一页 →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
