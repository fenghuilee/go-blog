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

    return (
        <footer className="footer">
            <p>
                © 2025 {siteName}. Powered by Go + React.
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
            </p>
        </footer>
    );
}

export default Footer;

