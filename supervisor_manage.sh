#!/bin/bash
# StringVault Supervisor管理脚本

SUPERVISORD_CMD="/home/liuxl/miniconda3/bin/supervisord"
SUPERVISORCTL_CMD="/home/liuxl/miniconda3/bin/supervisorctl"
CONFIG_FILE="/home/liuxl/StringVault/stringvault_supervisor.conf"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}StringVault Supervisor管理脚本${NC}"
echo "================================"

case "$1" in
    start)
        echo "启动supervisor服务..."
        $SUPERVISORD_CMD -c $CONFIG_FILE
        echo -e "${GREEN}supervisor已启动${NC}"
        ;;
    stop)
        echo "停止supervisor服务..."
        $SUPERVISORCTL_CMD -c $CONFIG_FILE shutdown
        echo -e "${YELLOW}supervisor已停止${NC}"
        ;;
    restart)
        echo "重启supervisor服务..."
        $SUPERVISORCTL_CMD -c $CONFIG_FILE shutdown
        sleep 2
        $SUPERVISORD_CMD -c $CONFIG_FILE
        echo -e "${GREEN}supervisor已重启${NC}"
        ;;
    status)
        echo "检查服务状态..."
        $SUPERVISORCTL_CMD -c $CONFIG_FILE status
        ;;
    logs)
        echo "查看StringVault日志..."
        $SUPERVISORCTL_CMD -c $CONFIG_FILE tail stringvault
        ;;
    reload)
        echo "重新加载配置..."
        $SUPERVISORCTL_CMD -c $CONFIG_FILE reread
        $SUPERVISORCTL_CMD -c $CONFIG_FILE update
        echo -e "${GREEN}配置已重新加载${NC}"
        ;;
    *)
        echo "使用方法: $0 {start|stop|restart|status|logs|reload}"
        echo ""
        echo "命令说明:"
        echo "  start   - 启动supervisor服务"
        echo "  stop    - 停止supervisor服务"
        echo "  restart - 重启supervisor服务"
        echo "  status  - 查看服务状态"
        echo "  logs    - 查看StringVault日志"
        echo "  reload  - 重新加载配置"
        exit 1
        ;;
esac
