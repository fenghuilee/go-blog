import { useState, useEffect } from 'react';
import { getSettings } from '../../services/api';
import './Footer.css';

function Footer() {
    const [siteName, setSiteName] = useState('我的博客');
    const [icpBeian, setIcpBeian] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings.site_name) {
                    setSiteName(settings.site_name);
                }
                if (settings.icp_beian) {
                    setIcpBeian(settings.icp_beian);
                }
            } catch (error) {
                console.error('获取Footer设置失败:', error);
            }
        };
        loadSettings();
    }, []);

    return (
        <footer className="footer">
            <p>
                © 2025 {siteName}. Powered by Go + React.
                {icpBeian && (
                    <>
                        {' | '}
                        <a
                            href="https://beian.miit.gov.cn/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {icpBeian}
                        </a>
                    </>
                )}
            </p>
        </footer>
    );
}

export default Footer;
