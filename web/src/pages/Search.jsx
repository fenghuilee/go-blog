import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchArticles } from '../services/api';
import ArticleList from '../components/article/ArticleList';
import { useToast } from '../utils/ToastContext';
import { useConfirm } from '../utils/ConfirmContext';
import SEO from '../components/common/SEO';
import './Search.css';

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useConfirm();
    const [keyword, setKeyword] = useState(searchParams.get('q') || '');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [total, setTotal] = useState(0);
    const [searchHistory, setSearchHistory] = useState([]);

    // 从 localStorage 加载搜索历史
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setSearchHistory(history);
    }, []);

    // 如果URL中有搜索参数，自动执行搜索
    useEffect(() => {
        const q = searchParams.get('q');
        if (q && q.trim()) {
            setKeyword(q);
            performSearch(q);
        }
    }, []);

    const performSearch = async (searchKeyword) => {
        if (!searchKeyword || !searchKeyword.trim()) {
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const data = await searchArticles(searchKeyword.trim());
            setArticles(data.list || []);
            setTotal(data.total || 0);

            // 保存到搜索历史
            saveToHistory(searchKeyword.trim());
        } catch (error) {
            console.error('搜索失败:', error);
            toast.error('搜索失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const saveToHistory = (term) => {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        // 移除重复项
        history = history.filter(item => item !== term);
        // 添加到开头
        history.unshift(term);
        // 只保留最近10条
        history = history.slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        setSearchHistory(history);
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!keyword.trim()) {
            toast.warning('请输入搜索关键词');
            return;
        }

        // 更新 URL 参数
        setSearchParams({ q: keyword.trim() });

        await performSearch(keyword);
    };

    const handleClear = () => {
        setKeyword('');
        setArticles([]);
        setSearched(false);
        setSearchParams({});
    };

    const handleHistoryClick = (term) => {
        setKeyword(term);
        setSearchParams({ q: term });
        performSearch(term);
    };

    const clearHistory = async () => {
        if (await confirm('确定要清空搜索历史吗？', {
            title: '清空历史',
            type: 'warning',
            confirmText: '清空'
        })) {
            localStorage.removeItem('searchHistory');
            setSearchHistory([]);
        }
    };

    return (
        <div className="search-page">
            <SEO title={keyword ? `搜索: ${keyword}` : '搜索文章'} />
            <div className="container">
                <div className="search-box">
                    <h2>搜索文章</h2>
                    <form onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="输入关键词搜索..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            {keyword && (
                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={handleClear}
                                    aria-label="清空"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? '搜索中...' : '搜索'}
                        </button>
                    </form>

                    {/* 搜索历史 */}
                    {!searched && searchHistory.length > 0 && (
                        <div className="search-history">
                            <div className="history-header">
                                <span>搜索历史</span>
                                <button onClick={clearHistory} className="clear-history-btn">
                                    清空
                                </button>
                            </div>
                            <div className="history-tags">
                                {searchHistory.map((term, index) => (
                                    <button
                                        key={index}
                                        className="history-tag"
                                        onClick={() => handleHistoryClick(term)}
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {searched && (
                    <div className="search-results">
                        {articles.length > 0 ? (
                            <>
                                <h3>找到 {total} 篇相关文章</h3>
                                <ArticleList articles={articles} loading={loading} />
                            </>
                        ) : (
                            !loading && (
                                <div className="no-results">
                                    <p>未找到与 "{keyword}" 相关的文章</p>
                                    <button onClick={handleClear} className="secondary-btn">
                                        返回搜索
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
