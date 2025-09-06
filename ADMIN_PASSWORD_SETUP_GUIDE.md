# 🔐 StringVault Admin Password Setup Guide | 管理员密码设置指南

![Security](https://img.shields.io/badge/Security-Enhanced-red.svg)
![Password](https://img.shields.io/badge/Password-SHA256-blue.svg)
![Admin](https://img.shields.io/badge/Admin-Multi--User-green.svg)

**English:** StringVault uses an advanced JSON file storage system to manage admin passwords, supporting multi-user management, password hash storage, and session security control. This system no longer relies on environment variables or hard-coded hash values, providing a more flexible and secure management solution.

**中文:** StringVault 采用先进的 JSON 文件存储系统来管理管理员密码，支持**多用户管理**、**密码哈希存储**和**会话安全控制**。本系统不再依赖环境变量或硬编码的哈希值，提供了更加灵活和安全的管理方案。

## 🏗️ System Architecture | 系统架构

### Core Components | 核心组件
- **Authentication Module | 认证模块**: `app/auth.py` - Admin authentication system supporting JSON file storage | 支持JSON文件存储的管理员认证系统
- **Management Tool | 管理工具**: `admin_password_tool.py` - Feature-complete admin management tool | 功能完整的管理员管理工具
- **Password File | 密码文件**: `admin_passwords.json` - Stores admin password hashes (automatically excluded from version control) | 存储管理员密码哈希（自动排除在版本控制外）
- **Template File | 模板文件**: `admin_passwords.json.template` - Configuration file template | 配置文件模板

### Security Features | 安全特性
- ✅ **SHA256 Hash Encryption | SHA256哈希加密** - Passwords stored as hashes, plaintext never saved | 密码以哈希形式存储，永不保存明文
- ✅ **Multi-user Support | 多用户支持** - Support multiple admin accounts simultaneously | 支持多个管理员账户同时存在
- ✅ **Session Management | 会话管理** - 30 minutes of inactivity auto-logout, automatic clearance when browser closes | 30分钟无操作自动登出，浏览器关闭时自动清除
- ✅ **File Protection | 文件保护** - Password files automatically added to `.gitignore`, prevent accidental upload | 密码文件自动添加到 `.gitignore`，防止意外上传

## 🚀 Quick Start | 快速开始

### 1. System Initialization | 系统初始化
System automatically creates default admin account on first run | 系统首次运行时会自动创建默认管理员账户：

```json
{
  "password_hashes": [
    "fc2de1b9cb29250d4ef9afda3e7fffa949d4050e989ef3f7227c90ed0bca5120"
  ],
  "system_info": {
    "last_updated": "2025-09-06T12:00:00",
    "version": "1.0"
  }
}
```

**Default Password | 默认密码**: `admin123`

### 2. Management Tool Usage | 管理工具使用

#### 📋 View All Admin Password Hashes | 查看所有管理员密码哈希
```bash
python admin_password_tool.py --list
```

#### ➕ Add New Admin Password | 添加新管理员密码
```bash
# Interactive add | 交互式添加
python admin_password_tool.py --add

# Or enter full management menu | 或者进入完整管理菜单
python admin_password_tool.py
```

#### 🗑️ Delete Admin Password | 删除管理员密码
```bash
python admin_password_tool.py --delete
```

#### 🔧 Specify Password File | 指定密码文件
```bash
# Use custom password file | 使用自定义密码文件
python admin_password_tool.py -f /path/to/your/passwords.json --list
```

## 🎯 Detailed Operation Guide | 详细操作指南

### Interactive Management Menu | 交互式管理菜单
Run `python admin_password_tool.py` to enter feature-complete interactive menu | 运行 `python admin_password_tool.py` 进入功能完整的交互式菜单：

```
🔐 String Hosting System - Admin Password Management Tool | 字符串托管系统 - 管理员密码管理工具
==================================================

Options | 选项:
1. List all password hashes | 列出所有密码哈希
2. Add new password | 添加新密码
3. Delete password | 删除密码
4. Exit | 退出

Please select (1-4) | 请选择 (1-4): 
```

### Command Line Parameters | 命令行参数
```
usage: admin_password_tool.py [-h] [-f FILE] [-l] [-a] [-d]

Admin Password Management Tool - Password Hash Version | 管理员密码管理工具 - 密码哈希版本

options | 选项:
  -h, --help            Show help information | 显示帮助信息
  -f FILE, --file FILE  Password file path (default: admin_passwords.json) | 密码文件路径 (默认: admin_passwords.json)
  -l, --list            List all password hashes | 列出所有密码哈希
  -a, --add             Add new password | 添加新密码
  -d, --delete          Delete password | 删除密码
```

### Password Addition Process | 添加密码流程
1. **Choose addition method | 选择添加方式**: Manual input or generate random password | 手动输入或生成随机密码
2. **Password strength validation | 密码强度验证**: Minimum 6 characters | 最少6位字符
3. **Repeat password confirmation | 重复密码确认**: Ensure correct input | 确保输入正确
4. **Hash generation and storage | 哈希生成存储**: Automatic SHA256 hash processing | 自动SHA256哈希处理
5. **Secure file saving | 文件安全保存**: JSON format persistent storage | JSON格式持久化存储

### Password Deletion Process | 删除密码流程
1. **Display existing hashes | 显示现有哈希**: List all password hashes (partial display) | 列出所有密码哈希（部分显示）
2. **Input verification password | 输入验证密码**: Need to input correct password for verification | 需要输入正确的密码进行验证
3. **Security confirmation | 安全确认**: Secondary confirmation of deletion operation | 二次确认删除操作
4. **File update | 文件更新**: Remove from password list and save | 从密码列表中移除并保存

## 🛡️ Security Best Practices | 安全最佳实践

### Production Environment Deployment | 生产环境部署
```bash
# 1. First deployment - system automatically creates default password file | 首次部署 - 系统会自动创建默认密码文件
python run.py

# 2. Immediately change default password | 立即修改默认密码
python admin_password_tool.py
# Select option 2 to add new password | 选择选项2添加新密码
# Select option 3 to delete default password | 选择选项3删除默认密码

# 3. Set file permissions (Linux/Mac) | 设置文件权限（Linux/Mac）
chmod 600 admin_passwords.json

# 4. Verify password file permissions | 验证密码文件权限
ls -la admin_passwords.json
```

### Password Management Strategy | 密码管理策略
1. **Strong password requirements | 强密码要求**: Minimum 8 characters, include uppercase/lowercase letters, numbers and special characters | 最少8位，包含大小写字母、数字和特殊字符
2. **Regular changes | 定期更换**: Recommend changing every 3-6 months | 建议每3-6个月更换一次
3. **Multi-user management | 多用户管理**: Create independent accounts for different team members | 为不同团队成员创建独立账户
4. **Backup strategy | 备份策略**: Regularly backup password files to secure locations | 定期备份密码文件到安全位置

## 🔧 Advanced Configuration | 高级配置

### Custom Password File Location | 自定义密码文件位置
```python
# Modify in app/auth.py | 在 app/auth.py 中修改
auth_manager = AuthManager(passwords_file='custom_passwords.json')
```

### Session Timeout Configuration | 会话超时配置
```python
# Modify timeout time (default 30 minutes) | 修改超时时间（默认30分钟）
self.session_timeout = timedelta(minutes=60)  # Change to 60 minutes | 改为60分钟
```

### Password Complexity Requirements | 密码复杂度要求
```python
# Enhanced validation when adding password | 在添加密码时增强验证
if len(password) < 8:
    return False, "Password length must be at least 8 characters | 密码长度至少为8位"
if not any(c.isupper() for c in password):
    return False, "Password must contain uppercase letters | 密码必须包含大写字母"
if not any(c.isdigit() for c in password):
    return False, "Password must contain numbers | 密码必须包含数字"
```

## 🚨 Troubleshooting | 故障排除

### File Permission Issues | 文件权限问题
```bash
# Linux/Mac systems | Linux/Mac 系统
sudo chown $USER:$USER admin_passwords.json
chmod 600 admin_passwords.json

# Windows systems | Windows 系统
# Right-click file → Properties → Security → Edit permissions | 右键文件 → 属性 → 安全 → 编辑权限
```

### JSON File Corruption | JSON文件损坏
```bash
# Backup corrupted file | 备份损坏的文件
mv admin_passwords.json admin_passwords.json.backup

# System will automatically create new default file | 系统会自动创建新的默认文件
python run.py
```

### Forgot All Passwords | 忘记所有密码
```bash
# Delete password file (system will recreate) | 删除密码文件（系统会重新创建）
rm admin_passwords.json

# Or rename file | 或者重命名文件
mv admin_passwords.json admin_passwords.json.old
```

## 📋 FAQ | 常见问题

### Q: What to do if password file is uploaded to GitHub? | Q: 密码文件上传到GitHub怎么办？
**A**: Immediately execute the following steps | **A**: 立即执行以下步骤：
1. Delete files containing passwords from GitHub | 从GitHub删除包含密码的文件
2. Change all admin passwords | 修改所有管理员密码
3. Check if .gitignore is correctly configured | 检查.gitignore是否正确配置
4. Consider all passwords compromised and need replacement | 考虑所有密码已泄露，需要更换

### Q: How to backup password files? | Q: 如何备份密码文件？
**A**: 
```bash
# Create backup | 创建备份
cp admin_passwords.json admin_passwords.json.backup.$(date +%Y%m%d)

# Encrypt backup (recommended) | 加密备份（推荐）
gpg -c admin_passwords.json.backup.$(date +%Y%m%d)
```

### Q: How many admins are supported? | Q: 支持多少个管理员？
**A**: Theoretically unlimited, but recommend no more than 10 for management simplicity | **A**: 理论上支持无限数量，但建议不超过10个以保持管理简便性。

### Q: Is password hash secure? | Q: 密码哈希安全吗？
**A**: Uses SHA256 hash, currently considered secure. But recommend | **A**: 使用SHA256哈希，目前被认为是安全的。但建议：
- Use strong passwords | 使用强密码
- Change passwords regularly | 定期更换密码
- Consider more advanced hash algorithms for extremely high security requirements | 在极高安全要求环境下使用更高级的哈希算法

## 🎯 Best Practices Summary | 最佳实践总结

### ✅ Recommended Operations | 推荐操作
- [ ] Change default password immediately after first deployment | 首次部署立即修改默认密码
- [ ] Create independent accounts for each team member | 为每个团队成员创建独立账户
- [ ] Regularly backup password files | 定期备份密码文件
- [ ] Set appropriate file permissions | 设置适当的文件权限
- [ ] Run security tests regularly | 定期运行安全测试

### ❌ Operations to Avoid | 避免操作
- [ ] Don't upload password files to version control | 不要将密码文件上传到版本控制
- [ ] Don't use weak passwords (like 123456, password, etc.) | 不要使用弱密码（如123456、password等）
- [ ] Don't share admin accounts | 不要共享管理员账户
- [ ] Don't go long periods without changing passwords | 不要长期不更换密码

---

**🔐 English:** Security Reminder: Password security is the first line of defense for system security!

**🔐 中文:** 安全提醒：密码安全是系统安全的第一道防线！

**📞 English:** Technical Support: If you encounter problems, please check the troubleshooting section or submit an Issue!

**📞 中文:** 技术支持：遇到问题请查看故障排除部分或提交Issue！
