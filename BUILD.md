# 前端集成到Go二进制

## 说明

本项目使用Go 1.16+的embed特性将前端静态文件打包到Go二进制文件中，实现单一可执行文件部署。

## 构建步骤

### 1. 构建前端

```bash
cd web
npm install
npm run build
```

### 2. 构建Go程序

```bash
go build -o go-blog cmd/server/main.go
```

这会将`web/dist/`目录下的所有文件嵌入到二进制文件中。

### 3. 运行

```bash
./go-blog
```

访问 http://localhost:8080

## 开发模式

开发时建议分别运行前后端：

**后端**：
```bash
go run cmd/server/main.go
```

**前端**：
```bash
cd web
npm run dev
```

前端开发服务器会自动代理API请求到后端(localhost:8080)。

## 架构说明

### 路由设计

- `/api/*` - 所有API请求
- `/*` - 其他所有请求由前端SPA处理

### 文件结构

```
go-blog/
├── web/
│   ├── src/               # 前端源码
│   ├── dist/              # 前端构建输出
│   │   ├── index.html
│   │   └── assets/
│   ├── embed.go   # embed 指令（嵌入 dist 目录）
│   └── static.go  # 静态文件处理
├── internal/
│   └── router/
│       └── router.go  # 路由配置
└── cmd/server/
    └── main.go
```

### SPA路由处理

`web/static.go` 实现了SPA路由逻辑：
- 如果请求的文件存在，返回该文件
- 如果文件不存在，返回index.html（前端路由处理）

这样可以支持前端的React Router。

## 注意事项

1. **首次构建前必须先构建前端**，否则Go编译时找不到dist目录会报错
2. 开发模式下前端自动重载，生产模式下静态文件嵌入在二进制中
3. **建议创建构建脚本**来自动化复制步骤（见下方）

## 部署

部署时只需：
1. 上传单个`go-blog`二进制文件
2. 上传`configs/config.yaml`配置文件
3. 运行即可

不需要单独部署Nginx或前端文件！

## 自动化构建脚本

可以创建一个简单的构建脚本来自动化上述步骤：

**build.sh** (Linux/macOS):
```bash
#!/bin/bash
set -e

echo "构建前端..."
cd web
npm run build
cd ..

echo "构建 Go 程序..."
go build -o go-blog cmd/server/main.go

echo "构建完成！"
```

**build.bat** (Windows):
```batch
@echo off
echo 构建前端...
cd web
call npm run build
cd ..

echo 构建 Go 程序...
go build -o go-blog.exe cmd/server/main.go

echo 构建完成！
```
