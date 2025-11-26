import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { getSettings } from '../../services/api';
import './Header.css';

function Header() {
    const { isLoggedIn, logout } = useAuth();
    const [siteName, setSiteName] = useState('我的博客');

    useEffect(() => {
        // 获取站点名称
        const loadSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings.site_name) {
                    setSiteName(settings.site_name);
                }
            } catch (error) {
                console.error('获取设置失败:', error);
            }
        };
        loadSettings();
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">
                    <h1>{siteName}</h1>
                </Link>
                <nav className="nav">
                    <Link to="/">首页</Link>
                    <Link to="/search">搜索</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/admin/articles">文章管理</Link>
                            <Link to="/admin/new">写文章</Link>
                            <Link to="/admin/settings">设置</Link>
                            <button onClick={handleLogout} className="logout-btn">退出</button>
                        </>
                    ) : (
                        <Link to="/login">登录</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
