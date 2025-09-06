# 管理员密码设置指南 - JSON版本

## 概述

现在系统使用JSON文件来存储管理员密码，支持多个管理员用户，不再依赖环境变量或硬编码的哈希值。

## 文件结构

### 1. 密码文件
- **实际密码文件**: `admin_passwords.json` (已添加到.gitignore，不会上传到GitHub)
- **模板文件**: `admin_passwords.json.template` (可以作为参考)

### 2. 主要文件
- **认证模块**: `app/auth.py` - 支持JSON文件存储的管理员认证系统
- **管理工具**: `admin_password_tool.py` - 管理管理员用户的命令行工具

## 使用方法

### 1. 初始设置

系统会自动创建默认的管理员用户：
```json
{
  "admin_users": {
    "admin": {
      "username": "admin",
      "password_hash": "fc2de1b9cb29250d4ef9afda3e7fffa949d4050e989ef3f7227c90ed0bca5120",
      "created_at": "2025-09-06T12:00:00",
      "is_active": true
    }
  }
}
```

默认密码是: `admin123`

### 2. 管理工具使用

#### 列出所有管理员用户
```bash
python admin_password_tool.py --list
```

#### 添加新管理员用户
```bash
python admin_password_tool.py --add
```

#### 删除管理员用户
```bash
python admin_password_tool.py --delete
```

#### 修改管理员密码
```bash
python admin_password_tool.py --change
```

#### 进入交互式菜单
```bash
python admin_password_tool.py
```

### 3. 命令行参数

```
usage: admin_password_tool.py [-h] [-f FILE] [-l] [-a] [-d] [-c]

管理员密码管理工具 - JSON版本

options:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  密码文件路径 (默认: admin_passwords.json)
  -l, --list            列出所有管理员用户
  -a, --add             添加新管理员用户
  -d, --delete          删除管理员用户
  -c, --change          修改管理员密码
```

## 安全特性

### 1. 密码存储
- 密码以SHA256哈希形式存储，不会保存明文
- 支持多个管理员用户
- 用户可以设置为活跃/禁用状态

### 2. 文件保护
- `admin_passwords.json` 已添加到 `.gitignore`，不会上传到GitHub
- 建议设置文件权限，限制访问

### 3. 会话管理
- 30分钟无操作自动登出
- 浏览器关闭时会话自动过期
- 支持多用户同时登录

## 部署建议

### 1. 生产环境设置
```bash
# 1. 复制模板文件
cp admin_passwords.json.template admin_passwords.json

# 2. 修改默认密码
python admin_password_tool.py --change

# 3. 添加新的管理员用户
python admin_password_tool.py --add

# 4. 删除默认的admin用户（可选）
python admin_password_tool.py --delete

# 5. 设置文件权限（Linux/Mac）
chmod 600 admin_passwords.json
```

### 2. 备份策略
- 定期备份 `admin_passwords.json` 文件
- 建议将备份文件存储在安全的位置

### 3. 团队协作
- 每个团队成员可以有自己的管理员账户
- 可以追踪用户的创建时间
- 支持禁用/启用用户账户

## 故障排除

### 1. 文件权限问题
如果遇到文件读写错误，请检查：
```bash
# Linux/Mac
ls -la admin_passwords.json
chmod 644 admin_passwords.json  # 或者 600 更安全

# Windows
# 确保运行程序的用户有读写权限
```

### 2. JSON格式错误
如果文件损坏，可以：
1. 删除现有的 `admin_passwords.json`
2. 系统会自动创建包含默认管理员的新文件
3. 或者从 `admin_passwords.json.template` 复制

### 3. 忘记密码
如果所有管理员密码都忘记了：
1. 删除 `admin_passwords.json` 文件
2. 系统会重新创建默认的admin用户（密码：admin123）
3. 立即修改默认密码

## 注意事项

1. **不要上传密码文件**: `admin_passwords.json` 包含敏感信息，永远不要上传到版本控制系统
2. **定期更换密码**: 建议定期更换
