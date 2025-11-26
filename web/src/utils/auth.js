// 获取当前用户
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// 获取token
export const getToken = () => {
    return localStorage.getItem('token');
};

// 设置用户信息和token
export const setAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

// 清除认证信息
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// 检查是否已登录
export const isAuthenticated = () => {
    return !!getToken();
};

// 检查是否是作者
export const isAuthor = () => {
    const user = getCurrentUser();
    return user && user.role === 'author';
};

// 别名导出，供 AuthContext 使用
export const getUser = getCurrentUser;
