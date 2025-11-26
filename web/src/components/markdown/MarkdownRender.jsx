import ReactMarkdown from 'react-markdown';
import './MarkdownRender.css';

function MarkdownRender({ content }) {
    return (
        <div className="markdown-body">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}

export default MarkdownRender;
