import { isAuthor } from '../../utils/auth';
import './CommentList.css';

function CommentList({ comments, onDelete }) {
    const author = isAuthor();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('zh-CN');
    };

    if (!comments || comments.length === 0) {
        return <div className="no-comments">暂无评论</div>;
    }

    return (
        <div className="comment-list">
            <h3>评论 ({comments.length})</h3>
            {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                        <span className="comment-author">{comment.nickname}</span>
                        <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                    {author && onDelete && (
                        <button
                            className="delete-btn"
                            onClick={() => onDelete(comment.id)}
                        >
                            删除
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CommentList;
