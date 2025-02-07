# StringVault

StringVault 是一个基于 Flask 的 Web 应用程序，用于安全地存储和管理字符串数据。

## 功能特点

- 安全存储字符串数据
- Web 界面操作
- 数据备份功能
- JSON 格式数据存储

## 技术栈

- Python
- Flask Web 框架
- Werkzeug
- Jinja2 模板引擎

## 安装和运行

1. 克隆仓库：
```bash
git clone https://github.com/Abelliuxl/StringVault.git
cd StringVault
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 运行应用：
```bash
python run.py
```

应用将在 http://localhost:5000 启动

## 项目结构

```
StringVault/
├── app/                # 应用主目录
├── backups/           # 备份文件目录
├── data.json          # 数据存储文件
├── requirements.txt   # 项目依赖
└── run.py            # 应用入口文件
```

## 许可证

MIT License 