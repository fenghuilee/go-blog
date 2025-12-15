import React from 'react';
import './AIStatusPanel.css';

const AIStatusPanel = ({ loading, onStop }) => {
    if (!loading) return null;

    return (
        <div className="ai-status-panel">
            <div className="ai-status-content">
                <span className="ai-spinner"></span>
                <span className="ai-text">AI正在生成中...</span>
            </div>
            <button className="ai-stop-btn" onClick={onStop} title="停止生成">
                停止
            </button>
        </div>
    );
};

export default AIStatusPanel;
