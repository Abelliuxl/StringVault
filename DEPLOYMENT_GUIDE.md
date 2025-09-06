# 🚀 StringVault Production Environment Deployment Guide | 生产环境部署指南

![Deployment](https://img.shields.io/badge/Deployment-Production-red.svg)
![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)
![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-green.svg)
![HTTPS](https://img.shields.io/badge/HTTPS-SSL%20Enabled-yellow.svg)

**English:** Comprehensive guide for deploying StringVault in production environments with enterprise-grade security, performance optimization, and monitoring.

**中文:** 完整的StringVault生产环境部署指南，包含企业级安全、性能优化和监控配置。

## 🔐 Security Features Overview | 安全特性总览

✅ **Admin Authentication System | 管理员认证系统** - Multi-user authentication based on SHA256 hashing | 基于SHA256哈希的多用户认证  
✅ **Session Security Management | 会话安全管理** - Non-persistent cookies, 30-minute auto-logout | 非持久化cookies，30分钟自动登出  
✅ **Password Encrypted Storage | 密码加密存储** - Admin passwords encrypted using SHA256 | 使用SHA256加密存储管理员密码  
✅ **Access Permission Control | 访问权限控制** - Regular users can only view and copy strings | 普通用户只能查看和复制字符串  
✅ **HTTPS Support | HTTPS支持** - SSL encryption can be enabled in production | 生产环境可启用SSL加密传输  
✅ **Data Backup Mechanism | 数据备份机制** - Automatic backup function prevents data loss | 自动备份功能，防止数据丢失  

## 🎯 Pre-deployment Preparation | 部署前准备

### System Requirements | 系统要求
- **Operating System | 操作系统**: Linux (Ubuntu 20.04+ / CentOS 8+)
- **Python Version | Python版本**: 3.7+
- **Memory Requirements | 内存要求**: Minimum 512MB, Recommended 1GB+ | 最低512MB，推荐1GB+
- **Storage Space | 存储空间**: Minimum 1GB available space | 最低1GB可用空间
- **Network | 网络**: Public IP and domain name (for HTTPS) | 公网IP和域名（用于HTTPS）

### Required Software | 必备软件
```bash
# Update system packages | 更新系统包
sudo apt update && sudo apt upgrade -y

# Install basic tools | 安装基础工具
sudo apt install -y git curl wget vim nginx python3-pip python3-venv

# Install production server | 安装生产服务器
sudo apt install -y gunicorn3
```

## 🚀 Quick Deployment Solutions | 快速部署方案

### Solution 1: Traditional Deployment (Recommended) | 方案一：传统部署（推荐）

#### 1. Project Deployment | 项目部署
```bash
# Create project directory | 创建项目目录
sudo mkdir -p /opt/stringvault
cd /opt/stringvault

# Clone project | 克隆项目
sudo git clone https://github.com/Abelliuxl/StringVault.git .
sudo chown -R $USER:$USER /opt/stringvault

# Create virtual environment | 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# Install dependencies | 安装依赖
pip install -r requirements.txt
```

#### 2. Production Environment Configuration | 生产环境配置
```bash
# Create production environment config file | 创建生产环境配置文件
cat > /opt/stringvault/production_config.py << 'EOF'
import os
from datetime import timedelta

class ProductionConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-very-secret-key-here'
    FLASK_CONFIG = 'production'
    
    # Session configuration | 会话配置
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True  # Requires HTTPS | 需要HTTPS
    SESSION_COOKIE_SAMESITE = 'Strict'
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)
    
    # Security headers | 安全头部
    SEND_FILE_MAX_AGE_DEFAULT = 0
    
    # Backup configuration | 备份配置
    BACKUP_DIR = 'backups'
    MAX_BACKUPS = 50
EOF
```

#### 3. Environment Variables Setup | 环境变量设置
```bash
# Create environment variables file | 创建环境变量文件
cat > /opt/stringvault/.env << 'EOF'
# Flask configuration | Flask配置
export FLASK_CONFIG=production
export SECRET_KEY='your-very-secret-key-here-change-this'

# Application configuration | 应用配置
export FLASK_APP=run.py
export PYTHONPATH=/
