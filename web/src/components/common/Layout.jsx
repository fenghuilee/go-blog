import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import './Layout.css';

function Layout() {
    return (
        <div className="app-layout">
            <SEO />
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
