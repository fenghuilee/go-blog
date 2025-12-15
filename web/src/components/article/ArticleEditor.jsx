import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './ArticleEditor.css';

function ArticleEditor({ value, onChange }) {
    const [editorKey, setEditorKey] = useState(0);
    const lastExternalValue = useRef(value);

    // 检测外部value变化（非用户输入），强制刷新编辑器
    useEffect(() => {
        if (value !== lastExternalValue.current) {
            // 只有当value变化较大时才强制刷新（比如AI生成的内容）
            const lengthDiff = Math.abs((value?.length || 0) - (lastExternalValue.current?.length || 0));
            if (lengthDiff > 50) {
                setEditorKey(prev => prev + 1);
            }
            lastExternalValue.current = value;
        }
    }, [value]);

    const handleChange = useCallback((newValue) => {
        lastExternalValue.current = newValue;
        onChange(newValue);
    }, [onChange]);

    const options = useMemo(() => {
        return {
            spellChecker: false,
            placeholder: '请输入文章内容（支持 Markdown）...',
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
                enabled: false,  // 禁用自动保存避免冲突
            },
        };
    }, []);

    return (
        <div className="markdown-editor-container">
            <SimpleMDE
                key={editorKey}
                value={value}
                onChange={handleChange}
                options={options}
            />
        </div>
    );
}

export default ArticleEditor;
