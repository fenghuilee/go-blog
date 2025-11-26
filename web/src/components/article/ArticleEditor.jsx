import { useRef, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './ArticleEditor.css';

function ArticleEditor({ value, onChange }) {
    const editorRef = useRef(null);

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
                enabled: true,
                uniqueId: 'article-editor',
                delay: 1000,
            },
        };
    }, []);

    return (
        <div className="markdown-editor-container">
            <SimpleMDE value={value} onChange={onChange} options={options} ref={editorRef} />
        </div>
    );
}

export default ArticleEditor;
