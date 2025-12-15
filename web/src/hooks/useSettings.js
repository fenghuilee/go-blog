import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';

// 缓存设置数据
let settingsCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 系统设置Hook
 * @param {boolean} forceRefresh - 是否强制刷新缓存
 */
export function useSettings(forceRefresh = false) {
    const [settings, setSettings] = useState(settingsCache || {});
    const [loading, setLoading] = useState(!settingsCache);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            // 检查缓存是否有效
            const now = Date.now();
            if (!forceRefresh && settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
                setSettings(settingsCache);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const data = await getSettings();
                settingsCache = data;
                cacheTimestamp = now;
                setSettings(data);
            } catch (err) {
                setError(err.message || '获取设置失败');
                console.error('获取设置失败:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [forceRefresh]);

    // 获取单个设置值
    const getSetting = (key, defaultValue = '') => {
        return settings[key] || defaultValue;
    };

    // 获取数字类型的设置
    const getNumberSetting = (key, defaultValue = 0) => {
        const value = settings[key];
        return value ? parseInt(value, 10) : defaultValue;
    };

    // 获取布尔类型的设置
    const getBoolSetting = (key, defaultValue = false) => {
        const value = settings[key];
        if (value === undefined || value === null) return defaultValue;
        return value === 'true' || value === true;
    };

    // 清除缓存
    const clearCache = () => {
        settingsCache = null;
        cacheTimestamp = 0;
    };

    return {
        settings,
        loading,
        error,
        getSetting,
        getNumberSetting,
        getBoolSetting,
        clearCache,
    };
}

export default useSettings;
