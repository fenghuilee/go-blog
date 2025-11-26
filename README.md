# Go Blog - 轻量级博客系统

一个基于 Golang + Gin + React + Vite 的前后端分离博客系统，轻量级设计，适合个人使用。

## 技术栈

### 后端
- **Go 1.21+** - 编程语言
- **Gin** - Web 框架
- **GORM** - ORM 库
- **MySQL** - 数据库
- **JWT** - 用户认证
- **Viper** - 配置管理

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **React Markdown** - Markdown 渲染
- **SimpleMDE** - Markdown 编辑器

## 功能特性

✅ 文章 CRUD（创建、查看、编辑、删除）  
✅ Markdown 编辑器和渲染  
✅ 文章分类和标签管理  
✅ 文章搜索功能  
✅ 评论系统（访客无需登录）  
✅ 用户认证（JWT）  
✅ 响应式设计  

## 项目结构

```
go-blog/
├── cmd/server/          # 应用入口
├── internal/            # 内部包
│   ├── config/         # 配置管理
│   ├── models/         # 数据模型
│   ├── database/       # 数据库连接
│   ├── middleware/     # 中间件
│   ├── handlers/       # HTTP 处理器
│   ├── services/       # 业务逻辑
│   └── router/         # 路由配置
├── pkg/utils/          # 工具函数
├── configs/            # 配置文件
├── web/                # 前端源码
├── go.mod
└── go.sum
```

## 快速开始

### 环境要求

- Go 1.21+
- Node.js 18+
- MySQL 8.0+

### 1. 数据库准备

创建数据库：

```sql
CREATE DATABASE go_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 配置修改

编辑 `configs/config.yaml`，配置数据库连接信息：

```yaml
database:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: go_blog
```

### 3. 启动后端

```bash
# 安装依赖（已完成可跳过）
go mod tidy

# 启动后端服务
go run cmd/server/main.go
```

后端将在 `http://localhost:8080` 启动。

首次运行会自动：
- 创建数据库表
- 初始化默认管理员账号（admin / admin123）
- 创建示例分类和标签

### 4. 启动前端

```bash
# 进入前端目录
cd web

# 安装依赖（已完成可跳过）
npm install

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 5. 访问系统

打开浏览器访问：`http://localhost:5173`

**默认管理员账号：**
- 用户名：`admin`
- 密码：`admin123`

## 使用说明

### 访客功能
- 浏览文章列表
- 查看文章详情
- 搜索文章
- 发表评论（无需登录）

### 管理员功能
- 创建/编辑/删除文章
- 管理分类和标签
- 删除评论
- Markdown 实时预览编辑

## 生产构建

### 前端构建

```bash
cd web
npm run build
```

构建产物将输出到 `../html` 目录。

### 后端编译

```bash
go build -o go-blog cmd/server/main.go
```

## API 接口

### 公开接口
- `GET /api/articles` - 文章列表
- `GET /api/articles/:id` - 文章详情
- `GET /api/articles/search` - 搜索文章
- `GET /api/categories` - 分类列表
- `GET /api/tags` - 标签列表
- `GET /api/comments/:articleId` - 文章评论
- `POST /api/comments` - 发表评论
- `POST /api/auth/login` - 登录

### 需要认证的接口
- `POST /api/articles` - 创建文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章
- `POST /api/categories` - 创建分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类
- `POST /api/tags` - 创建标签
- `DELETE /api/tags/:id` - 删除标签
- `DELETE /api/comments/:id` - 删除评论

## 注意事项

1. **安全性**：请在生产环境中修改 `configs/config.yaml` 中的 JWT 密钥和管理员密码
2. **CORS**：如需修改允许的来源，请编辑 `configs/config.yaml` 中的 CORS 配置
3. **数据备份**：建议定期备份 MySQL 数据库

## 开发计划

- [ ] 文章草稿自动保存
- [ ] 图片上传功能
- [ ] 深色模式
- [ ] RSS 订阅
- [ ] 站点统计

## License

MIT

## 作者

开发于 2025 年
