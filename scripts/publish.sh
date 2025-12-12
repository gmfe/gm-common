#!/bin/bash

# gm-common 发布脚本
# 使用方法: ./scripts/publish.sh [patch|minor|major|beta]

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印错误信息
error() {
    echo -e "${RED}❌ 错误: $1${NC}" >&2
}

# 打印成功信息
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 打印警告信息
warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 打印信息
info() {
    echo -e "ℹ️  $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        error "$1 未安装，请先安装"
        exit 1
    fi
}

# 检查 NPM_TOKEN
check_npm_token() {
    if [ -z "$NPM_TOKEN" ]; then
        error "NPM_TOKEN 环境变量未设置"
        echo ""
        info "请设置 NPM_TOKEN："
        echo "  export NPM_TOKEN=your_token_here"
        echo ""
        info "或者临时设置："
        echo "  NPM_TOKEN=your_token_here $0"
        exit 1
    fi
}

# 验证 npm token
verify_token() {
    info "验证 npm token..."
    if npm whoami &> /dev/null; then
        local username=$(npm whoami)
        success "Token 验证成功，当前用户: $username"
    else
        error "Token 验证失败，请检查 NPM_TOKEN 是否正确"
        exit 1
    fi
}

# 设置代理（如果需要）
setup_proxy() {
    if [ -n "$https_proxy" ] || [ -n "$http_proxy" ]; then
        info "检测到代理设置，将使用代理发布"
    else
        warn "未设置代理，如果网络有问题可能需要设置代理"
        echo "  设置代理: export https_proxy=http://127.0.0.1:7890"
    fi
}

# 清理函数
cleanup() {
    if [ -f .npmrc ]; then
        rm -f .npmrc
        info "已清理临时 .npmrc 文件"
    fi
}

# 注册清理函数
trap cleanup EXIT

# 主函数
main() {
    echo ""
    info "=========================================="
    info "  gm-common 发布工具"
    info "=========================================="
    echo ""

    # 检查必要的命令
    check_command npm
    check_command lerna

    # 检查 NPM_TOKEN
    check_npm_token

    # 验证 token
    verify_token

    # 检查代理设置
    setup_proxy

    # 获取发布类型
    PUBLISH_TYPE=${1:-patch}

    case $PUBLISH_TYPE in
        patch|minor|major)
            info "准备发布 $PUBLISH_TYPE 版本..."
            ;;
        beta)
            info "准备发布 beta 版本..."
            ;;
        *)
            error "未知的发布类型: $PUBLISH_TYPE"
            echo ""
            echo "使用方法: $0 [patch|minor|major|beta]"
            echo ""
            echo "  patch  - 补丁版本 (默认, 如 2.15.8 → 2.15.9)"
            echo "  minor  - 次版本 (如 2.15.8 → 2.16.0)"
            echo "  major  - 主版本 (如 2.15.8 → 3.0.0)"
            echo "  beta   - Beta 版本"
            exit 1
            ;;
    esac

    # 显示当前版本
    CURRENT_VERSION=$(node -p "require('./lerna.json').version")
    info "当前版本: $CURRENT_VERSION"
    echo ""

    # 确认发布
    read -p "确认发布? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warn "已取消发布"
        exit 0
    fi

    # 生成临时 .npmrc
    info "生成临时认证文件..."
    echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

    # 执行发布
    echo ""
    info "开始发布..."
    echo ""

    if [ "$PUBLISH_TYPE" = "beta" ]; then
        lerna publish --force-publish --dist-tag beta --yes --registry https://registry.npmjs.org/
    else
        lerna publish $PUBLISH_TYPE --force-publish --yes --registry https://registry.npmjs.org/
    fi

    echo ""
    success "发布完成！"
    echo ""
    info "所有包已成功发布到 npm registry"
}

# 执行主函数
main "$@"

