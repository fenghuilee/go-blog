import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticle, createArticle, updateArticle, getCategories, getTags, createCategory, createTag, generateArticle, continueWriting, polishArticle, expandOutline } from '../services/api';
import ArticleEditor from '../components/article/ArticleEditor';
import AIFloatingMenu from '../components/article/AIFloatingMenu';
import AIGenerateDialog from '../components/article/AIGenerateDialog';
import AIStatusPanel from '../components/article/AIStatusPanel';
import './ArticleEdit.css';

function ArticleEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [categoryIds, setCategoryIds] = useState([]);  // 改为数组支持多选
    const [tagIds, setTagIds] = useState([]);
    const [status, setStatus] = useState('draft');

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    // 新增分类和标签的状态
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);
    const [addingTag, setAddingTag] = useState(false);

    // AI相关状态
    const [aiLoading, setAILoading] = useState(false);
    const [showGenerateDialog, setShowGenerateDialog] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [aiTask, setAITask] = useState(null); // Tracks current AI operation (e.g., 'generate', 'continue', 'polish', 'expand')

    const handleStopAI = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
            setAILoading(false);
            setAITask(null);
        }
    };

    useEffect(() => {
        loadCategories();
        loadTags();
        if (isEdit) {
            loadArticle();
        }
    }, [id]);

    const loadArticle = async () => {
        try {
            const data = await getArticle(id);
            setTitle(data.title);
            setContent(data.content);
            setSummary(data.summary || '');
            setCategoryIds(data.categories ? data.categories.map(c => c.id) : []);  // 支持多分类
            setTagIds(data.tags ? data.tags.map(t => t.id) : []);
            setStatus(data.status);
        } catch (error) {
            alert('加载文章失败：' + error.message);
            navigate('/');
        }
    };

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error('加载分类失败:', error);
        }
    };

    const loadTags = async () => {
        try {
            const data = await getTags();
            setTags(data || []);
        } catch (error) {
            console.error('加载标签失败:', error);
        }
    };

    const handleCategoryToggle = (categoryId) => {
        if (categoryIds.includes(categoryId)) {
            setCategoryIds(categoryIds.filter(id => id !== categoryId));
        } else {
            setCategoryIds([...categoryIds, categoryId]);
        }
    };

    const handleTagToggle = (tagId) => {
        if (tagIds.includes(tagId)) {
            setTagIds(tagIds.filter(id => id !== tagId));
        } else {
            setTagIds([...tagIds, tagId]);
        }
    };

    // 快速创建分类
    const handleCreateCategory = async () => {
        console.log('创建分类按钮被点击');
        if (!newCategoryName.trim()) {
            alert('请输入分类名称');
            return;
        }

        setAddingCategory(true);
        try {
            console.log('正在创建分类:', newCategoryName);
            const newCategory = await createCategory({ name: newCategoryName.trim() });
            console.log('分类创建成功:', newCategory);
            setCategories([...categories, newCategory]);
            setCategoryIds([...categoryIds, newCategory.id]);  // 添加到多选列表
            setNewCategoryName('');
            alert('分类创建成功');
        } catch (error) {
            console.error('创建分类失败:', error);
            alert('创建分类失败：' + error.message);
        } finally {
            setAddingCategory(false);
        }
    };

    // 快速创建标签
    const handleCreateTag = async () => {
        console.log('创建标签按钮被点击');
        if (!newTagName.trim()) {
            alert('请输入标签名称');
            return;
        }

        setAddingTag(true);
        try {
            console.log('正在创建标签:', newTagName);
            const newTag = await createTag({ name: newTagName.trim() });
            console.log('标签创建成功:', newTag);
            setTags([...tags, newTag]);
            setTagIds([...tagIds, newTag.id]);
            setNewTagName('');
            alert('标签创建成功');
        } catch (error) {
            console.error('创建标签失败:', error);
            alert('创建标签失败：' + error.message);
        } finally {
            setAddingTag(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('请填写标题和内容');
            return;
        }

        setLoading(true);
        try {
            const data = {
                title: title.trim(),
                content: content.trim(),
                summary: summary.trim(),
                category_ids: categoryIds,  // 改为多分类ID数组
                tag_ids: tagIds,
                status,
            };

            if (isEdit) {
                await updateArticle(id, data);
                alert('文章更新成功');
            } else {
                const result = await createArticle(data);
                alert('文章创建成功');
                navigate(`/article/${result.id}`);
                return;
            }

            navigate(`/article/${id}`);
        } catch (error) {
            alert('保存失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // AI生成文章
    const handleAIGenerate = () => {
        if (!title.trim()) {
            alert('请先输入文章标题');
            return;
        }
        setShowGenerateDialog(true);
    };

    // AI续写
    const handleAIContinue = async () => {
        if (!content.trim()) {
            alert('请先输入一些内容');
            return;
        }

        const ac = new AbortController();
        setAbortController(ac);
        setAILoading(true);
        setAITask('continue');

        const initialContent = content; // 保存初始内容
        let newPart = '';
        try {
            await continueWriting({
                existing_content: initialContent.trim(),
                direction: ''
            }, (delta) => {
                newPart += delta;
                setContent(initialContent + '\n\n' + newPart);
            }, null, null, ac.signal);
        } catch (error) {
            if (error.name !== 'AbortError') {
                alert('AI续写失败：' + (error.message || '未知错误'));
            }
        } finally {
            setAILoading(false);
            setAbortController(null);
            setAITask(null);
        }
    };

    // AI润色
    const handleAIPolish = async () => {
        if (!content.trim()) {
            alert('请先输入文章内容');
            return;
        }

        const ac = new AbortController();
        setAbortController(ac);
        setAILoading(true);
        setAITask('polish');

        let generatedText = '';
        try {
            await polishArticle({
                content: content.trim(),
                style: 'professional'
            }, (delta) => {
                generatedText += delta;
                setContent(generatedText);
            }, null, null, ac.signal);
        } catch (error) {
            if (error.name !== 'AbortError') {
                alert('AI润色失败：' + (error.message || '未知错误'));
            }
        } finally {
            setAILoading(false);
            setAbortController(null);
            setAITask(null);
        }
    };

    // AI扩展大纲
    const handleAIExpand = async () => {
        if (!content.trim()) {
            alert('请先输入大纲');
            return;
        }

        const ac = new AbortController();
        setAbortController(ac);
        setAILoading(true);
        setAITask('expand');

        let generatedText = '';
        try {
            await expandOutline({
                outline: content.trim(),
                word_count: 2000
            }, (delta) => {
                generatedText += delta;
                setContent(generatedText);
            }, null, null, ac.signal);
        } catch (error) {
            if (error.name !== 'AbortError') {
                alert('AI扩展失败：' + (error.message || '未知错误'));
            }
        } finally {
            setAILoading(false);
            setAbortController(null);
            setAITask(null);
        }
    };

    const handleGenerateConfirm = async (params) => {
        const ac = new AbortController();
        setAbortController(ac);
        setShowGenerateDialog(false); // 立即关闭对话框，避免遮挡
        setAILoading(true);
        setAITask('generate');

        let generatedText = '';
        try {
            await generateArticle({
                title: title.trim(),
                keywords: params.keywords,
                outline: params.outline,
                word_count: params.wordCount
            }, (delta) => {
                generatedText += delta;
                setContent(generatedText);
            }, null, null, ac.signal);
        } catch (error) {
            if (error.name !== 'AbortError') {
                alert('AI生成失败：' + (error.message || '未知错误'));
            }
        } finally {
            setAILoading(false);
            setAbortController(null);
            setAITask(null);
        }
    };

    return (
        <div className="article-edit-page">
            <div className="container">
                <h2>{isEdit ? '编辑文章' : '写文章'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>标题 *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="请输入文章标题"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>摘要</label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="请输入文章摘要（可选）"
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>分类（按住Ctrl/Cmd可多选）</label>
                        <div className="tag-select-container">
                            <select
                                multiple
                                value={categoryIds.map(String)}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                    setCategoryIds(selected);
                                }}
                                className="tag-select"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="selected-tags">
                                {categoryIds.length > 0 ? (
                                    categories
                                        .filter(cat => categoryIds.includes(cat.id))
                                        .map(cat => (
                                            <span key={cat.id} className="selected-tag">
                                                {cat.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCategoryToggle(cat.id)}
                                                    className="remove-tag"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))
                                ) : (
                                    <span className="no-selection">未选择分类</span>
                                )}
                            </div>
                        </div>
                        <div className="quick-add">
                            <input
                                type="text"
                                placeholder="快速新增分类"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
                            />
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                disabled={addingCategory || !newCategoryName.trim()}
                                className="add-btn"
                            >
                                {addingCategory ? '添加中...' : '+ 添加'}
                            </button>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>状态</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="draft">草稿</option>
                                <option value="published">已发布</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>标签（按住Ctrl/Cmd可多选）</label>
                        <div className="tag-select-container">
                            <select
                                multiple
                                value={tagIds.map(String)}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                    setTagIds(selected);
                                }}
                                className="tag-select"
                            >
                                {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                            <div className="selected-tags">
                                {tagIds.length > 0 ? (
                                    tags
                                        .filter(tag => tagIds.includes(tag.id))
                                        .map(tag => (
                                            <span key={tag.id} className="selected-tag">
                                                {tag.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleTagToggle(tag.id)}
                                                    className="remove-tag"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))
                                ) : (
                                    <span className="no-selection">未选择标签</span>
                                )}
                            </div>
                        </div>
                        <div className="quick-add">
                            <input
                                type="text"
                                placeholder="快速新增标签"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateTag())}
                            />
                            <button
                                type="button"
                                onClick={handleCreateTag}
                                disabled={addingTag || !newTagName.trim()}
                                className="add-btn"
                            >
                                {addingTag ? '添加中...' : '+ 添加'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>内容 *</label>

                        <ArticleEditor value={content} onChange={setContent} />
                    </div>



                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
                            取消
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? '保存中...' : (isEdit ? '更新文章' : '发布文章')}
                        </button>
                    </div>
                </form>

                {showGenerateDialog && (
                    <AIGenerateDialog
                        title={title}
                        onConfirm={handleGenerateConfirm}
                        onCancel={() => setShowGenerateDialog(false)}
                    />
                )}

                <AIFloatingMenu
                    onGenerate={handleAIGenerate}
                    onContinue={handleAIContinue}
                    onPolish={handleAIPolish}
                    onExpand={handleAIExpand}
                    loading={aiLoading}
                />
                <AIStatusPanel loading={aiLoading} onStop={handleStopAI} aiTask={aiTask} />
            </div>
        </div>
    );
}

export default ArticleEdit;
