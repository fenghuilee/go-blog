import { useState } from 'react';
import './AIGenerateDialog.css';

function AIGenerateDialog({ title, onConfirm, onCancel }) {
    const [keywords, setKeywords] = useState('');
    const [outline, setOutline] = useState('');
    const [wordCount, setWordCount] = useState(2000);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({
            keywords: keywords ? keywords.split(/[,，、]/).map(k => k.trim()).filter(k => k) : [],
            outline: outline.trim(),
            wordCount: parseInt(wordCount)
        });
    };

    return (
        <div className="ai-dialog-overlay" onClick={onCancel}>
            <div className="ai-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="ai-dialog-header">
                    <h3>✨ AI生成文章</h3>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="ai-dialog-body">
                        <div className="form-field">
                            <label>文章标题</label>
                            <input
                                type="text"
                                value={title}
                                disabled
                                className="title-display"
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                关键词 <span className="field-hint">（用逗号分隔，可选）</span>
                            </label>
                            <input
                                type="text"
                                placeholder="例如：Go语言、并发、性能优化"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                文章大纲 <span className="field-hint">（可选）</span>
                            </label>
                            <textarea
                                placeholder="输入文章大纲..."
                                value={outline}
                                onChange={(e) => setOutline(e.target.value)}
                                rows={6}
                            />
                        </div>

                        <div className="form-field">
                            <label>字数要求</label>
                            <select
                                value={wordCount}
                                onChange={(e) => setWordCount(e.target.value)}
                            >
                                <option value="1000">约1000字</option>
                                <option value="2000">约2000字</option>
                                <option value="3000">约3000字</option>
                                <option value="5000">约5000字</option>
                            </select>
                        </div>
                    </div>

                    <div className="ai-dialog-footer">
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            取消
                        </button>
                        <button type="submit" className="confirm-btn">
                            生成文章
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AIGenerateDialog;
