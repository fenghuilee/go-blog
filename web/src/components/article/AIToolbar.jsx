import { useState } from 'react';
import './AIToolbar.css';

function AIToolbar({ onGenerate, onContinue, onPolish, onExpand, loading }) {
    return (
        <div className="ai-toolbar">
            <div className="ai-toolbar-title">AI 写作助手</div>
            <div className="ai-toolbar-buttons">
                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={loading}
                    className="ai-btn ai-btn-generate"
                >
                    <span className="ai-icon">✨</span>
                    生成初稿
                </button>
                <button
                    type="button"
                    onClick={onContinue}
                    disabled={loading}
                    className="ai-btn ai-btn-continue"
                >
                    <span className="ai-icon">➡️</span>
                    智能续写
                </button>
                <button
                    type="button"
                    onClick={onPolish}
                    disabled={loading}
                    className="ai-btn ai-btn-polish"
                >
                    <span className="ai-icon">✍️</span>
                    文章润色
                </button>
                <button
                    type="button"
                    onClick={onExpand}
                    disabled={loading}
                    className="ai-btn ai-btn-expand"
                >
                    <span className="ai-icon">📝</span>
                    扩展大纲
                </button>
            </div>
            {loading && (
                <div className="ai-loading">
                    <span className="loading-spinner"></span>
                    AI正在处理中，请稍候...
                </div>
            )}
        </div>
    );
}

export default AIToolbar;
