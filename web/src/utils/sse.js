/**
 * 发送流式请求 (Server-Sent Events)
 * @param {string} url - 请求URL
 * @param {object} options - fetch 选项 (body, headers, etc)
 * @param {function} onMessage - 接收到消息的回调 (content) => void
 * @param {function} onError - 错误回调 (error) => void
 * @param {function} onFinish - 完成回调 () => void
 */
export const fetchStream = async (url, options = {}, onMessage, onError, onFinish) => {
    try {
        // 合并 Headers，自动添加 token
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        // 处理 API Base URL
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

        const response = await fetch(fullUrl, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.error) errorMessage = errorJson.error;
            } catch (e) {
                // ignore
            }
            throw new Error(errorMessage);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const lines = buffer.split('\n');
            // 保留最后一个可能不完整的行
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

                const dataStr = trimmedLine.slice(6);
                if (dataStr === '[DONE]') {
                    if (onFinish) onFinish();
                    return;
                }

                try {
                    const data = JSON.parse(dataStr);
                    // 兼容后端格式 {"content": "..."}
                    if (data.content) {
                        onMessage(data.content);
                    } else if (data.error) {
                        throw new Error(data.error);
                    }
                } catch (e) {
                    console.error('Error parsing stream data:', e);
                }
            }
        }

        // 处理最后可能剩余的数据
        if (buffer.trim().startsWith('data: ')) {
            // ... logic same as above if needed, but usually ends with newline
        }

        if (onFinish) onFinish();

    } catch (err) {
        console.error('Stream request failed:', err);
        if (onError) onError(err);
    }
};
