import { useSettings } from '../../hooks';
import './Footer.css';

function Footer() {
    const { getSetting, loading } = useSettings();
    const siteName = getSetting('site_name', '');
    const icpBeian = getSetting('icp_beian', '');

    // 加载中不显示内容
    if (loading) {
        return (
            <footer className="footer">
                <p>&nbsp;</p>
            </footer>
        );
    }

    const getRootDomain = (hostname) => {
        // 如果是 IP 地址，直接返回
        if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)) {
            return hostname;
        }
        const parts = hostname.split('.');
        if (parts.length > 2) {
            // 简单的 root domain 提取逻辑：取最后两段
            // 注意：这不一定适用于所有后缀（如 .com.cn），但对于大多数常规域名是够用的
            return parts.slice(-2).join('.');
        }
        return hostname;
    };

    const rootDomain = getRootDomain(window.location.hostname);

    return (
        <footer className="footer">
            <p>
                © 2012-{new Date().getFullYear()} {siteName}. Powered by Go + React.
                {icpBeian && (
                    <>
                        <br />
                        <a
                            href="https://beian.miit.gov.cn/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {icpBeian}
                        </a>
                    </>
                )}
                <br />
                <a href={`https://hopedomain.com/zh/age/${rootDomain}`} target="_blank">
                    <img src={`https://hopedomain.com/api/badge/domain-age/${rootDomain}?theme=purple&lang=zh`} alt="域名年龄" />
                </a>
                <br />
                <a href={`https://zssl.com/zh/ssl-cert-verify?domain=${rootDomain}`} target="_blank">
                    <img src={`https://zssl.com/api/badge/ssl-cert/${rootDomain}?style=full&lang=zh`} alt="SSL证书状态" />
                </a>
            </p>
        </footer>
    );
}

export default Footer;

