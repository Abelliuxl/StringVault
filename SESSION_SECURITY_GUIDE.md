# 🔒 StringVault Session Security Configuration Guide | 会话安全配置指南

![Security](https://img.shields.io/badge/Security-Enhanced-red.svg)
![Session](https://img.shields.io/badge/Session-Secure-blue.svg)
![HTTPS](https://img.shields.io/badge/HTTPS-SSL%20Enabled-green.svg)

**English:** StringVault implements enterprise-grade session security configuration to ensure admin logins don't remain permanently authenticated. The system uses multi-layered security strategies including non-persistent cookies, session timeout mechanisms, and comprehensive security header protection.

**中文:** StringVault 已实现企业级的会话安全配置，确保管理员登录后不会永久保持登录状态。系统采用多层安全策略，包括非持久化cookies、会话超时机制和全面的安全头部保护。

## 📋 Overview | 概述

**English:** StringVault has implemented enterprise-grade session security configuration, ensuring admin logins don't remain permanently authenticated. The system uses multi-layered security strategies including non-persistent cookies, session timeout mechanisms, and comprehensive security header protection.

**中文:** StringVault 已实现企业级的会话安全配置，确保管理员登录后不会永久保持登录状态。系统采用多层安全策略，包括非持久化cookies、会话超时机制和全面的安全头部保护。

## 🛡️ Security Features Overview | 安全特性总览

### 1. Non-persistent Cookies | 非持久化Cookies 🔐
- **Expires when browser closes | 浏览器关闭时过期**: Set `session.permanent = False` | 设置 `session.permanent = False`
- **Session Cookie Configuration | 会话Cookie配置**: Add secure cookie attributes | 添加安全的cookie属性
- **Cache Control | 缓存控制**: Response headers contain `no-store, no-cache, must-revalidate` | 响应头包含 `no-store, no-cache, must-revalidate`

### 2. Session Timeout Mechanism | 会话超时机制 ⏰
- **30-minute auto-logout | 30分钟无操作自动登出**: Intelligent session timeout detection | 智能会话超时检测
- **Timestamp Tracking | 时间戳跟踪**: Precisely record last activity time | 精确记录最后活动时间
- **Automatic Cleanup | 自动清理**: Expired sessions automatically logout and clean data | 过期会话自动注销并清理数据

### 3. Security Header Protection | 安全头部保护 🛡️
- **HTTPOnly**: Prevent XSS cross-site scripting attacks | 防止XSS跨站脚本攻击
- **Secure**: Force HTTPS transmission in production | 生产环境强制HTTPS传输
- **SameSite**: CSRF cross-site request forgery protection | CSRF跨站请求伪造防护
- **Cache Control**: Prevent sensitive data from being cached | 防止敏感数据被缓存

## 🔧 Core Configuration Details | 核心配置详解

### Application Factory Configuration | 应用工厂配置 (`app/__init__.py`)
```python
# Configure session as temporary session (expires when browser closes) | 配置会话为临时会话（浏览器关闭时过期）
@app.before_request
def make_session_temp():
    # Ensure session expires when browser closes | 确保会话在浏览器关闭时过期
    session.permanent = False

# Add session security headers | 添加会话安全头
@app.after_request
def add_session_headers(response):
    # Ensure cookies won't persist in storage | 确保cookies不会持久化存储
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response
```

### Authentication Manager | 认证管理器 (`app/auth.py`)
```python
# 30-minute auto-logout | 30分钟无操作自动登出
self.session_timeout = timedelta(minutes=30)

def is_admin_authenticated(self):
    """Check if admin is authenticated | 检查管理员是否已认证"""
    if not session.get(self.session_key, False):
        return False
    
    # Check if session has expired | 检查会话是否过期
    if self.is_session_expired():
        self.logout_admin()
        return
