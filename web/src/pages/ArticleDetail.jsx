import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, getComments, deleteComment } from '../services/api';
import { isAuthor } from '../utils/auth';
import { useSettings } from '../hooks';
import MarkdownRender from '../components/markdown/MarkdownRender';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import { ArticleDetailSkeleton } from '../components/common/Skeleton';
import { useToast } from '../utils/ToastContext';
import { useConfirm } from '../utils/ConfirmContext';
import SEO from '../components/common/SEO';
import './ArticleDetail.css';

function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useConfirm();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const author = isAuthor();

    // 使用useSettings Hook获取评论设置
    const { getBoolSetting } = useSettings();
    const enableComments = getBoolSetting('enable_comments', true);

    useEffect(() => {
        loadArticle();
        loadComments();
    }, [id]);

    const loadArticle = async () => {
        try {
            setLoading(true);
            const data = await getArticle(id);
            setArticle(data);
        } catch (error) {
            console.error('加载文章失败:', error);
            toast.error('文章不存在');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            const data = await getComments(id);
            setComments(data || []);
        } catch (error) {
            console.error('加载评论失败:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!await confirm('确定要删除这条评论吗？', {
            title: '删除评论',
            type: 'danger',
            confirmText: '删除'
        })) return;

        try {
            await deleteComment(commentId);
            loadComments();
        } catch (error) {
            toast.error('删除失败：' + error.message);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('zh-CN');
    };

    // 加载时显示骨架屏
    if (loading) {
        return (
            <div className="article-detail-page">
                <div className="container">
                    <ArticleDetailSkeleton />
                </div>
            </div>
        );
    }

    if (!article) {
        return null;
    }

    return (
        <div className="article-detail-page">
            <SEO title={article.title} description={article.summary} />
            <div className="container">
                <article className="article-content">
                    <h1 className="article-title">{article.title}</h1>
                    <div className="article-meta">
                        <span>作者: {article.author?.username}</span>
                        <span>发布时间: {formatDate(article.created_at)}</span>
                        {article.categories && article.categories.length > 0 && (
                            <span>
                                分类: {article.categories.map((cat, index) => (
                                    <span key={cat.id}>
                                        {cat.name}
                                        {index < article.categories.length - 1 && ', '}
                                    </span>
                                ))}
                            </span>
                        )}
                        <span>浏览: {article.view_count}</span>
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
                    {author && (
                        <div className="article-actions">
                            <button onClick={() => navigate(`/admin/edit/${article.id}`)}>
                                编辑文章
                            </button>
                        </div>
                    )}
                    <div className="article-body">
                        <MarkdownRender content={article.content} />
                    </div>
                </article>

                {enableComments && (
                    <>
                        <CommentList comments={comments} onDelete={author ? handleDeleteComment : null} />
                        <CommentForm articleId={parseInt(id)} onCommentAdded={loadComments} />
                    </>
                )}
            </div>
        </div>
    );
}

export default ArticleDetail;
