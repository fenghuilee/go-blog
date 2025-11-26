import { createContext, useContext, useState, useEffect } from 'react';
import { isAuthor as checkIsAuthor, getUser } from './auth';

// 创建认证上下文
const AuthContext = createContext();

// 自定义 Hook，方便组件使用
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// 认证提供者组件
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(checkIsAuthor());
    const [user, setUser] = useState(getUser());

    // 登录函数
    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
    };

    // 登出函数
    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
    };

    // 页面刷新时同步状态
    useEffect(() => {
        setIsLoggedIn(checkIsAuthor());
        setUser(getUser());
    }, []);

    const value = {
        isLoggedIn,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
