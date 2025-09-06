# 字符串托管系统 - 部署指南

## 🔐 安全特性

✅ **管理员认证系统** - 只有管理员可以添加/删除字符串
✅ **会话管理** - 安全的会话认证
✅ **密码哈希** - 使用SHA256加密存储密码
✅ **访问控制** - 普通用户只能查看和复制字符串

## 🚀 快速部署

### 1. 设置管理员密码

```bash
# 运行密码设置工具
python set_admin_password.py

# 或者手动设置环境变量
export ADMIN_PASSWORD_HASH='your_password_hash_here'
```

### 2. 生产环境配置

```bash
# 设置生产环境
export FLASK_CONFIG=production

# 设置安全的密钥
export SECRET_KEY='your_very_secret_key_here'

# 设置管理员密码哈希
export ADMIN_PASSWORD_HASH='ef92b778bafe771e89245b89ecbc08a4426a7280c6db9a51c9e0d7e327b0a6c8'
```

### 3. 使用生产服务器

```bash
# 安装gunicorn
pip install gunicorn

# 启动生产服务器
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

## 🔧 默认管理员密码

**默认密码**: `admin123`

⚠️ **重要**: 部署到公网后务必更改默认密码！

## 🌐 公网部署建议

### 1. 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. 使用 HTTPS

```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com
```

### 3. 防火墙配置

```bash
# 允许HTTP和HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable
```

## 📁 文件结构

```
StringVault/
├── app/
│   ├── __init__.py          # 应用初始化
│   ├── auth.py              # 认证管理
│   ├── models.py            # 数据模型
│   ├── views.py             # 视图路由
│   ├── config/              # 配置文件
│   ├── static/              # 静态文件
│   └── templates/           # HTML模板
├── data.json                # 数据文件
├── run.py                   # 启动文件
├── requirements.txt         # 依赖包
└── set_admin_password.py   # 密码设置工具
```

## 🔍 功能说明

### 管理员功能
- ✅ 添加新字符串
- ✅ 删除现有字符串
- ✅ 管理会话（登录/登出）

### 普通用户功能
- ✅ 查看所有字符串
- ✅ 搜索字符串
- ✅ 复制字符串到剪贴板
- ✅ 展开/收起长字符串内容

## 🛡️ 安全建议

1. **立即更改默认密码**
2. **使用强密码**（12位以上，包含大小写字母、数字和特殊字符）
3. **定期更换密码**
4. **使用HTTPS加密传输**
5. **限制服务器访问IP**（如可能）
6. **定期备份数据文件**（data.json）

## 📞 技术支持

如果遇到问题，请检查：
1. 管理员密码是否正确设置
2. 环境变量是否配置正确
3. 文件权限是否正确
4. 端口是否被防火墙阻止

## ⚡ 性能优化

- 使用生产服务器（gunicorn/uwsgi）
- 启用Nginx缓存
- 定期清理旧数据
- 监控服务器资源使用情况

---

**现在您的字符串托管系统已经安全部署！只有管理员可以添加/删除字符串，其他用户只能查看和复制。**
