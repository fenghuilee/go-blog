.PHONY: all build run clean web-install web-dev web-build web-build-dev web-build-prod web-env help

# 项目变量
BINARY_NAME=go-blog
WEB_DIR=web
BUILD_DIR=bin
ENV ?= production

all: web-install web-build build

# 后端相关命令
build:
	@echo "正在构建后端..."
	@mkdir -p $(BUILD_DIR)
	go build -o $(BUILD_DIR)/$(BINARY_NAME) cmd/server/main.go
	@echo "构建完成: $(BUILD_DIR)/$(BINARY_NAME)"

run:
	@echo "正在启动后端..."
	go run cmd/server/main.go

# 前端相关命令
web-install:
	@echo "正在安装前端依赖..."
	cd $(WEB_DIR) && npm install

web-dev:
	@echo "正在启动前端开发服务器..."
	cd $(WEB_DIR) && npm run dev

# 构建前端（默认使用 production 环境）
web-build:
	@echo "正在构建前端（$(ENV) 环境）..."
	cd $(WEB_DIR) && npm run build -- --mode $(ENV)
	@echo "前端构建完成，环境: $(ENV)"

# 构建前端（开发环境）
web-build-dev:
	@echo "正在构建前端（开发环境）..."
	cd $(WEB_DIR) && npm run build -- --mode development
	@echo "前端构建完成（开发环境）"

# 构建前端（生产环境）
web-build-prod:
	@echo "正在构建前端（生产环境）..."
	cd $(WEB_DIR) && npm run build -- --mode production
	@echo "前端构建完成（生产环境）"

# 设置环境变量（从 .env.example 复制）
web-env:
	@if [ ! -f $(WEB_DIR)/.env ]; then \
		echo "正在创建 .env 文件..."; \
		cp $(WEB_DIR)/.env.example $(WEB_DIR)/.env 2>/dev/null || \
		cp $(WEB_DIR)/.env.$(ENV) $(WEB_DIR)/.env 2>/dev/null || \
		echo "请手动创建 $(WEB_DIR)/.env 文件"; \
	else \
		echo ".env 文件已存在，跳过创建"; \
	fi

# 清理
clean:
	@echo "正在清理..."
	rm -rf $(BUILD_DIR)
	rm -rf $(WEB_DIR)/dist
	@echo "清理完成"

# 帮助信息
help:
	@echo "使用方法: make [target] [ENV=environment]"
	@echo ""
	@echo "Targets:"
	@echo "  all             安装依赖、构建前端和后端"
	@echo "  build           构建后端二进制文件"
	@echo "  run             直接运行后端"
	@echo "  web-install     安装前端依赖"
	@echo "  web-dev         启动前端开发服务器"
	@echo "  web-build       构建前端（默认 production，可通过 ENV=development 指定）"
	@echo "  web-build-dev   构建前端（开发环境）"
	@echo "  web-build-prod  构建前端（生产环境）"
	@echo "  web-env         从 .env.example 创建 .env 文件"
	@echo "  clean           清理构建产物"
	@echo "  help            显示此帮助信息"
	@echo ""
	@echo "示例:"
	@echo "  make web-build ENV=development  # 使用开发环境构建"
	@echo "  make web-build ENV=production   # 使用生产环境构建（默认）"
