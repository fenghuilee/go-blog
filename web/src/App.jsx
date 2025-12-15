import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import ArticleEdit from './pages/ArticleEdit';
import ArticleManage from './pages/ArticleManage';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { ToastProvider } from './utils/ToastContext';
import { ConfirmProvider } from './utils/ConfirmContext';

// 受保护的路由组件
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="article/:id" element={<ArticleDetail />} />
                <Route path="search" element={<Search />} />
                <Route path="login" element={<Login />} />

                {/* 受保护的路由 */}
                <Route
                  path="admin/articles"
                  element={
                    <ProtectedRoute>
                      <ArticleManage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/new"
                  element={
                    <ProtectedRoute>
                      <ArticleEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/edit/:id"
                  element={
                    <ProtectedRoute>
                      <ArticleEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>

  );
}

export default App;
