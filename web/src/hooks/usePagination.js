import { useState, useCallback } from 'react';

/**
 * 通用分页Hook
 * @param {Function} fetchFn - 获取数据的函数，需要接受 { page, pageSize } 参数
 * @param {Object} options - 配置选项
 * @param {number} options.initialPage - 初始页码，默认1
 * @param {number} options.pageSize - 每页数量，默认10
 */
export function usePagination(fetchFn, options = {}) {
    const { initialPage = 1, pageSize: initialPageSize = 10 } = options;

    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const totalPages = Math.ceil(total / pageSize);

    const fetchData = useCallback(async (targetPage = page) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFn({ page: targetPage, pageSize });
            setData(result.list || result.data || []);
            setTotal(result.total || 0);
        } catch (err) {
            setError(err.message || '加载失败');
            console.error('分页数据加载失败:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, page, pageSize]);

    const goToPage = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }, [totalPages]);

    const nextPage = useCallback(() => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    }, [page, totalPages]);

    const prevPage = useCallback(() => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    }, [page]);

    const refresh = useCallback(() => {
        fetchData(page);
    }, [fetchData, page]);

    return {
        // 数据
        data,
        total,
        loading,
        error,

        // 分页状态
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,

        // 操作方法
        setPage,
        setPageSize,
        goToPage,
        nextPage,
        prevPage,
        refresh,
        fetchData,
    };
}

export default usePagination;
