# 🔐 StringVault - Secure String Storage System | 安全字符串托管系统

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Security](https://img.shields.io/badge/Security-Enhanced-red.svg)

**English:** StringVault is a Flask-based secure web application designed for safe storage and management of string data, featuring a complete admin authentication system and session security protection.

**中文:** StringVault 是一个基于 Flask 的安全 Web 应用程序，专为安全存储和管理字符串数据而设计。具备完整的管理员认证系统和会话安全保护。

## ✨ Core Features | 核心功能

### 🔒 Security Management | 安全管理
- **Admin Authentication System | 管理员认证系统** - Multi-user authentication based on SHA256 hashing | 基于SHA256哈希的多用户认证
- **Session Security Protection | 会话安全保护** - Non-persistent cookies, automatic logout after 30 minutes of inactivity | 非持久化cookies，30分钟无操作自动登出
- **Access Control | 访问控制** - Regular users can only view, admins can manage data | 普通用户只能查看，管理员可以管理数据
- **Data Backup | 数据备份** - Automatic backup functionality to prevent data loss | 自动备份功能，防止数据丢失

### 📊 Data Management | 数据管理
- **String Storage | 字符串存储** - Secure key-value pair storage system | 安全的键值对存储系统
- **Search Functionality | 搜索功能** - Quick search for stored strings | 快速搜索存储的字符串
- **Pagination Display | 分页显示** - Elegant data pagination display | 优雅的数据分页展示
- **One-click Copy | 一键复制** - Convenient string copy functionality | 便捷的字符串复制功能

### 🛡️ Security Features | 安全特性
- **Password Hash Storage | 密码哈希存储** - Admin passwords encrypted using SHA256 | 使用SHA256加密存储管理员密码
- **Session Timeout | 会话超时** - Automatic logout after 30 minutes of inactivity | 30分钟无操作自动登出
- **Cache Control | 缓存控制** - Prevents sensitive data from being cached | 防止敏感数据被缓存
- **HTTPS Support | HTTPS支持** - HTTPS encryption can be enabled in production | 生产环境可启用HTTPS加密

## 🚀 Quick Start | 快速开始

### 1. Requirements | 环境要求
- Python 3.7+
- pip package manager | pip包管理器

### 2. Installation & Deployment | 安装部署
```bash
# Clone the project | 克隆项目
git clone https://github.com/Abelliuxl/StringVault.git
cd StringVault

# Install dependencies | 安装依赖
pip install -r requirements.txt

# Start the application | 启动应用
python run.py
```

### 3. Access the Application | 访问应用
- Application URL | 应用地址：http://localhost:5000
- Default admin password | 默认管理员密码：`admin123`
- Recommended to change default password immediately after first login | 建议首次登录后立即修改默认密码

## 📖 Usage Guide | 使用指南

### Admin Operations | 管理员操作
1. **Login Management | 登录管理** - Login to the system using admin password | 使用管理员密码登录系统
2. **Add Data | 添加数据** - Click the "Add New String" button | 点击"添加新字符串"按钮
3. **Delete Data | 删除数据** - Click the delete button on the right side of the string | 点击字符串右侧的删除按钮
4. **Secure Logout | 安全退出** - Use the "Admin Logout" function | 使用"管理员登出"功能

### Regular Users | 普通用户
1. **Browse Data | 浏览数据** - View all stored strings | 查看所有存储的字符串
2. **Search Content | 搜索内容** - Use the search box to quickly locate items | 使用搜索框快速定位
3. **Copy Data | 复制数据** - Click the copy button to get content | 点击复制按钮获取内容

## 🔧 Admin Tools | 管理员工具

### Password Management | 密码管理
```bash
# Enter interactive management menu | 进入交互式管理菜单
python admin_password_tool.py

# List all admins | 列出所有管理员
python admin_password_tool.py --list

# Add new admin | 添加新管理员
python admin_password_tool.py --add

# Delete admin | 删除管理员
python admin_password_tool.py --delete
```

### Security Configuration Testing | 安全配置测试
```bash
# Test session security configuration | 测试会话安全配置
cd tests
python test_session_security.py
```

## 📁 Project Structure | 项目结构

```
StringVault/
├── app/                          # Flask application main directory | Flask应用主目录
│   ├── __init__.py              # Application factory and session configuration | 应用工厂和会话配置
│   ├── auth.py                  # Admin authentication system | 管理员认证系统
│   ├── models.py                # Data models | 数据模型
│   ├── views.py                 # Routes and view functions | 路由和视图函数
│   ├── config/                  # Configuration files | 配置文件
│   ├── static/                  # Static resources | 静态资源
│   └── templates/               # HTML templates | HTML模板
├── tests/                       # Test directory | 测试目录
│   ├── test_session_security.py # Security test script | 安全测试脚本
│   └── README.md               # Test instructions | 测试说明
├── backups/                     # Data backup directory | 数据备份目录
├── admin_password_tool.py       # Password management tool | 密码管理工具
├── run.py                       # Application startup file | 应用启动文件
├── requirements.txt             # Project dependencies | 项目依赖
├── data.json                    # Data storage file | 数据存储文件
└── README.md                    # Project documentation | 项目说明
```

## 📚 Detailed Documentation | 详细文档

- [📋 Admin Password Setup Guide](ADMIN_PASSWORD_SETUP_GUIDE.md) - Complete password management tutorial | 完整的密码管理教程
- [🚀 Deployment Guide](DEPLOYMENT_GUIDE.md) - Production environment deployment configuration | 生产环境部署配置
- [🔒 Session Security Configuration](SESSION_SECURITY_GUIDE.md) - Detailed security features explanation | 安全特性详细说明
- [🧪 Testing Guide](tests/README.md) - Testing functionality usage instructions | 测试功能使用说明

## 🛠️ Technology Stack | 技术栈

### Backend Technologies | 后端技术
- **Flask 2.0+** - Lightweight web framework | 轻量级Web框架
- **Werkzeug** - WSGI toolkit | WSGI工具集
- **Jinja2** - Template engine | 模板引擎
- **Python 3.7+** - Programming language | 编程语言

### Frontend Technologies | 前端技术
- **HTML5 + CSS3** - Standard web technologies | 标准网页技术
- **JavaScript** - Interactive functionality | 交互功能
- **Bootstrap** - Responsive layout | 响应式布局
- **Font Awesome** - Icon library | 图标库

### Security Features | 安全特性
- **SHA256 Hash** - Password encryption storage | 密码加密存储
- **Session Management** - Secure session control | 安全的会话控制
- **CSRF Protection** - Cross-site request forgery protection | 跨站请求伪造防护
- **XSS Protection** - Cross-site scripting protection | 跨站脚本攻击防护

## 🔐 Security Notes | 安全说明

### Default Security Settings | 默认安全设置
- Admin passwords stored using SHA256 hash | 管理员密码使用SHA256哈希存储
- Sessions expire automatically after 30 minutes of inactivity | 会话30分钟无操作自动过期
- Login status automatically cleared when browser closes | 浏览器关闭时自动清除登录状态
- Sensitive data will not be cached | 敏感数据不会被缓存

### Production Environment Recommendations | 生产环境建议
- Enable HTTPS encrypted transmission | 启用HTTPS加密传输
- Set strong password policies | 设置强密码策略
- Regularly change admin passwords | 定期更换管理员密码
- Restrict server access IPs | 限制服务器访问IP
- Regularly backup data files | 定期备份数据文件

## 🤝 Contributing | 贡献指南

Contributions are welcome! Please submit Issues and Pull Requests to improve the project! | 欢迎提交Issue和Pull Request来改进项目！

### Development Environment Setup | 开发环境设置
```bash
# Clone the project | 克隆项目
git clone https://github.com/Abelliuxl/StringVault.git
cd StringVault

# Create virtual environment | 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac | Linux/Mac
# venv\Scripts\activate  # Windows | Windows

# Install dependencies | 安装依赖
pip install -r requirements.txt

# Start development server | 启动开发服务器
python run.py
```

## 📄 License | 许可证

This project uses the **MIT License** open source license. | 本项目采用 **MIT License** 开源许可证。

## 🙏 Acknowledgments | 致谢

- [Flask](https://flask.palletsprojects.com/) - Excellent web framework | 优秀的Web框架
- [Bootstrap](https://getbootstrap.com/) - Frontend framework | 前端框架
- [Font Awesome](https://fontawesome.com/) - Icon library | 图标库

---

**⭐ English:** If this project is helpful to you, please give it a Star for support!

**⭐ 中文:** 如果这个项目对您有帮助，请给个Star支持一下！

**🔧 English:** Encountering problems? Please check the detailed documentation or submit an Issue!

**🔧 中文:** 遇到问题？请查看详细文档或提交Issue！
