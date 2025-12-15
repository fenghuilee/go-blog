import { useState } from 'react';
import { useToast } from '../../utils/ToastContext';
import './CommentForm.css';

function CommentForm({ articleId, onCommentAdded }) {
    const toast = useToast();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname.trim() || !content.trim()) {
            toast.warning('请填写昵称和评论内容');
            return;
        }

        setSubmitting(true);
        try {
            const { createComment } = await import('../../services/api');
            await createComment({
                article_id: articleId,
                nickname: nickname.trim(),
                email: email.trim(),
                content: content.trim(),
            });

            setNickname('');
            setEmail('');
            setContent('');

            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            toast.error('发表评论失败：' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <h3>发表评论</h3>
            <div className="form-row">
                <input
                    type="text"
                    placeholder="昵称 *"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="邮箱（选填）"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <textarea
                placeholder="评论内容 *"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
            />
            <button type="submit" disabled={submitting}>
                {submitting ? '提交中...' : '发表评论'}
            </button>
        </form>
    );
}

export default CommentForm;
