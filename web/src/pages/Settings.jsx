import { useState, useEffect } from 'react';
import { getSettings, updateSettings, changePassword } from '../services/api';
import { SettingsSkeleton } from '../components/common/Skeleton';
import { useToast } from '../utils/ToastContext';
import { useConfirm } from '../utils/ConfirmContext';
import SEO from '../components/common/SEO';
import './Settings.css';

function Settings() {
    const toast = useToast();
    const confirm = useConfirm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 网站设置
    const [siteName, setSiteName] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [siteSubtitle, setSiteSubtitle] = useState('');
    const [seoKeywords, setSeoKeywords] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [postsPerPage, setPostsPerPage] = useState('10');
    const [enableComments, setEnableComments] = useState(true);
    const [icpBeian, setIcpBeian] = useState('');

    // 密码设置
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await getSettings();
            setSiteName(data.site_name || '');
            setSiteDescription(data.site_description || '');
            setSiteSubtitle(data.site_subtitle || '');
            setSeoKeywords(data.seo_keywords || '');
            setSeoDescription(data.seo_description || '');
            setPostsPerPage(data.posts_per_page || '10');
            setEnableComments(data.enable_comments === 'true');
            setIcpBeian(data.icp_beian || '');
        } catch (error) {
            console.error('加载设置失败:', error);
            toast.error('加载设置失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();

        if (!siteName.trim()) {
            toast.warning('站点名称不能为空');
            return;
        }

        setSaving(true);
        try {
            const settings = {
                site_name: siteName.trim(),
                site_description: siteDescription.trim(),
                site_subtitle: siteSubtitle.trim(),
                seo_keywords: seoKeywords.trim(),
                seo_description: seoDescription.trim(),
                posts_per_page: postsPerPage,
                enable_comments: enableComments.toString(),
                icp_beian: icpBeian.trim(),
            };

            await updateSettings(settings);
            toast.success('设置保存成功');
        } catch (error) {
            console.error('保存设置失败:', error);
            toast.error('保存设置失败：' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.warning('请填写所有密码字段');
            return;
        }

        if (newPassword.length < 6) {
            toast.warning('新密码长度至少为6个字符');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warning('两次输入的新密码不一致');
            return;
        }

        setChangingPassword(true);
        try {
            await changePassword(oldPassword, newPassword);
            toast.success('密码修改成功');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('修改密码失败:', error);
            toast.error('修改密码失败：' + error.message);
        } finally {
            setChangingPassword(false);
        }
    };

    const handleReset = async () => {
        if (await confirm('确定要重置所有设置吗？', {
            title: '重置设置',
            type: 'warning',
            confirmText: '重置'
        })) {
            loadSettings();
        }
    };

    if (loading) {
        return (
            <div className="settings-page">
                <div className="container">
                    <h2>系统设置</h2>
                    <SettingsSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="settings-page">
            <SEO title="系统设置" />
            <div className="container">
                <h2>系统设置</h2>

                <form onSubmit={handleSaveSettings} className="settings-form">
                    {/* 网站基本信息 */}
                    <section className="setting-section">
                        <h3>网站基本信息</h3>
                        <div className="form-group">
                            <label>站点名称 *</label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="请输入站点名称"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>站点描述</label>
                            <input
                                type="text"
                                value={siteDescription}
                                onChange={(e) => setSiteDescription(e.target.value)}
                                placeholder="请输入站点描述"
                            />
                        </div>
                        <div className="form-group">
                            <label>站点副标题</label>
                            <input
                                type="text"
                                value={siteSubtitle}
                                onChange={(e) => setSiteSubtitle(e.target.value)}
                                placeholder="请输入站点副标题"
                            />
                        </div>
                        <div className="form-group">
                            <label>ICP备案号</label>
                            <input
                                type="text"
                                value={icpBeian}
                                onChange={(e) => setIcpBeian(e.target.value)}
                                placeholder="请输入ICP备案号，如：京ICP备12345678号"
                            />
                        </div>
                    </section>

                    {/* SEO设置 */}
                    <section className="setting-section">
                        <h3>SEO设置</h3>
                        <div className="form-group">
                            <label>SEO关键词</label>
                            <input
                                type="text"
                                value={seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                                placeholder="多个关键词用逗号分隔"
                            />
                        </div>
                        <div className="form-group">
                            <label>SEO描述</label>
                            <textarea
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                placeholder="请输入SEO描述"
                                rows="3"
                            />
                        </div>
                    </section>

                    {/* 文章设置 */}
                    <section className="setting-section">
                        <h3>文章设置</h3>
                        <div className="form-group">
                            <label>每页显示文章数</label>
                            <input
                                type="number"
                                value={postsPerPage}
                                onChange={(e) => setPostsPerPage(e.target.value)}
                                min="1"
                                max="100"
                            />
                        </div>
                    </section>

                    {/* 评论设置 */}
                    <section className="setting-section">
                        <h3>评论设置</h3>
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={enableComments}
                                    onChange={(e) => setEnableComments(e.target.checked)}
                                />
                                开启评论功能
                            </label>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? '保存中...' : '保存设置'}
                        </button>
                        <button type="button" className="secondary" onClick={handleReset}>
                            重置
                        </button>
                    </div>
                </form>

                {/* 修改密码 */}
                <form onSubmit={handleChangePassword} className="password-form">
                    <section className="setting-section">
                        <h3>修改密码</h3>
                        <div className="form-group">
                            <label>旧密码 *</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="请输入旧密码"
                            />
                        </div>
                        <div className="form-group">
                            <label>新密码 * (至少6个字符)</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="请输入新密码"
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label>确认新密码 *</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="请再次输入新密码"
                            />
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="submit" disabled={changingPassword}>
                            {changingPassword ? '修改中...' : '修改密码'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;
