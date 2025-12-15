import { useState } from 'react';
import './AIFloatingMenu.css';

function AIFloatingMenu({ onGenerate, onContinue, onPolish, onExpand, loading }) {
    const [isOpen, setIsOpen] = useState(false);

    // 当正在生成时，工具栏隐藏，交由 StatusPanel 显示
    if (loading) return null;

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className={`ai-fab-container ${isOpen ? 'open' : ''}`}>
            <div className="ai-fab-menu">
                <button onClick={() => { onGenerate(); setIsOpen(false); }} className="ai-menu-item" title="生成文章初稿">
                    <span className="ai-icon">✨</span> 生成初稿
                </button>
                <button onClick={() => { onContinue(); setIsOpen(false); }} className="ai-menu-item" title="基于当前内容续写">
                    <span className="ai-icon">➡️</span> 智能续写
                </button>
                <button onClick={() => { onPolish(); setIsOpen(false); }} className="ai-menu-item" title="润色文章内容">
                    <span className="ai-icon">✍️</span> 文章润色
                </button>
                <button onClick={() => { onExpand(); setIsOpen(false); }} className="ai-menu-item" title="基于大纲扩写">
                    <span className="ai-icon">📝</span> 扩展大纲
                </button>
            </div>

            <button className="ai-fab-main" onClick={toggleOpen} title="AI 写作助手">
                <span className="ai-fab-icon">{isOpen ? '×' : 'AI'}</span>
            </button>
        </div>
    );
}

export default AIFloatingMenu;
