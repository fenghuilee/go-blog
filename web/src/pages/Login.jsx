import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { setAuth } from '../utils/auth';
import { useAuth } from '../utils/AuthContext';
import { useToast } from '../utils/ToastContext';
import SEO from '../components/common/SEO';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.warning('请输入用户名和密码');
            return;
        }

        setLoading(true);
        try {
            const data = await apiLogin(username, password);
            // 保存到 localStorage
            setAuth(data.token, data.user);
            // 更新全局 Context 状态
            login(data.user);
            toast.success('登录成功');
            // 使用 navigate 进行 SPA 路由跳转
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            toast.error('登录失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <SEO title="登录" />
            <div className="login-container">
                <h2>登录</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                        />
                    </div>
                    <div className="form-group">
                        <label>密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? '登录中...' : '登录'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
