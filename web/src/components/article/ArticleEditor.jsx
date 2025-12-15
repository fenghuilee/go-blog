import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './ArticleEditor.css';

function ArticleEditor({ value, onChange, autoScroll }) {
    const cmRef = useRef(null);

    const getInstance = useCallback((instance) => {
        if (instance) {
            cmRef.current = instance.codemirror;
        }
    }, []);

    const handleChange = useCallback((newValue) => {
        onChange(newValue);
    }, [onChange]);

    // 自动滚动到底部
    useEffect(() => {
        if (autoScroll && cmRef.current) {
            const cm = cmRef.current;
            // 滚动到底部
            cm.scrollTo(null, cm.getScrollInfo().height);
        }
    }, [value, autoScroll]);

    const options = useMemo(() => {
        return {
            spellChecker: false,
            placeholder: '请输入文章内容（支持 Markdown）...',
            // minHeight: '500px', // 通过CSS控制
            maxHeight: '500px', // 设置最大高度，超过会出现滚动条
            toolbar: [
                'bold',
                'italic',
                'heading',
                '|',
                'quote',
                'code',
                'unordered-list',
                'ordered-list',
                '|',
                'link',
                'image',
                '|',
                'preview',
                'side-by-side',
                'fullscreen',
                '|',
                'guide',
            ],
            autosave: {
                enabled: false,
            },
            status: false, // 隐藏底部状态栏，节省空间
        };
    }, []);

    return (
        <div className="markdown-editor-container">
            <SimpleMDE
                value={value}
                onChange={handleChange}
                options={options}
                getMdeInstance={getInstance}
            />
        </div>
    );
}

export default ArticleEditor;
