.PHONY: all build run clean web-install web-dev web-build help

# 项目变量
BINARY_NAME=go-blog
WEB_DIR=web
BUILD_DIR=bin

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

web-build:
	@echo "正在构建前端..."
	cd $(WEB_DIR) && npm run build

# 清理
clean:
	@echo "正在清理..."
	rm -rf $(BUILD_DIR)
	rm -rf html
	@echo "清理完成"

# 帮助信息
help:
	@echo "使用方法: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  all          安装依赖、构建前端和后端"
	@echo "  build        构建后端二进制文件"
	@echo "  run          直接运行后端"
	@echo "  web-install  安装前端依赖"
	@echo "  web-dev      启动前端开发服务器"
	@echo "  web-build    构建前端生产代码"
	@echo "  clean        清理构建产物"
	@echo "  help         显示此帮助信息"
