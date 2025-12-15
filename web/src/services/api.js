import request from '../utils/request';
import { fetchStream } from '../utils/sse';

// 登录
export const login = (username, password) => {
    return request.post('/auth/login', { username, password });
};

// 获取文章列表
export const getArticles = (params) => {
    return request.get('/articles', { params });
};

// 获取文章详情
export const getArticle = (id) => {
    return request.get(`/articles/${id}`);
};

// 创建文章
export const createArticle = (data) => {
    return request.post('/articles', data);
};

// 更新文章
export const updateArticle = (id, data) => {
    return request.put(`/articles/${id}`, data);
};

// 删除文章
export const deleteArticle = (id) => {
    return request.delete(`/articles/${id}`);
};

// 搜索文章
export const searchArticles = (keyword, page = 1, pageSize = 10) => {
    return request.get('/articles/search', { params: { keyword, page, page_size: pageSize } });
};

// 获取分类列表
export const getCategories = () => {
    return request.get('/categories');
};

// 创建分类
export const createCategory = (data) => {
    return request.post('/categories', data);
};

// 更新分类
export const updateCategory = (id, data) => {
    return request.put(`/categories/${id}`, data);
};

// 删除分类
export const deleteCategory = (id) => {
    return request.delete(`/categories/${id}`);
};

// 获取标签列表
export const getTags = () => {
    return request.get('/tags');
};

// 创建标签
export const createTag = (data) => {
    return request.post('/tags', data);
};

// 删除标签
export const deleteTag = (id) => {
    return request.delete(`/tags/${id}`);
};

// 获取评论列表
export const getComments = (articleId) => {
    return request.get(`/comments/${articleId}`);
};

// 发表评论
export const createComment = (data) => {
    return request.post('/comments', data);
};

// 删除评论
export const deleteComment = (id) => {
    return request.delete(`/comments/${id}`);
};

// 获取系统设置
export const getSettings = () => {
    return request.get('/settings');
};

// 更新系统设置
export const updateSettings = (settings) => {
    return request.put('/settings', settings);
};

// 修改密码
export const changePassword = (oldPassword, newPassword) => {
    return request.post('/user/password', {
        old_password: oldPassword,
        new_password: newPassword
    });
};

// AI写作辅助 (流式)

export const generateArticle = (data, onMessage, onError, onFinish, signal) => {
    return fetchStream('/ai/generate', {
        method: 'POST',
        body: JSON.stringify(data),
        signal
    }, onMessage, onError, onFinish);
};

export const continueWriting = (data, onMessage, onError, onFinish, signal) => {
    return fetchStream('/ai/continue', {
        method: 'POST',
        body: JSON.stringify(data),
        signal
    }, onMessage, onError, onFinish);
};

export const polishArticle = (data, onMessage, onError, onFinish, signal) => {
    return fetchStream('/ai/polish', {
        method: 'POST',
        body: JSON.stringify(data),
        signal
    }, onMessage, onError, onFinish);
};

export const expandOutline = (data, onMessage, onError, onFinish, signal) => {
    return fetchStream('/ai/expand', {
        method: 'POST',
        body: JSON.stringify(data),
        signal
    }, onMessage, onError, onFinish);
};
