import os
from datetime import timedelta

class Config:
    # 基础配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    DEBUG = False
    
    # 会话配置 - 确保会话在浏览器关闭时过期
    SESSION_COOKIE_HTTPONLY = True      # 防止XSS攻击
    SESSION_COOKIE_SECURE = False       # 开发环境设为False，生产环境建议设为True（需要HTTPS）
    SESSION_COOKIE_SAMESITE = 'Lax'     # CSRF保护
    SESSION_PERMANENT = False           # 确保会话cookie是会话级别的，不是持久化的
    
    # 数据存储配置
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    DATA_FILE = os.path.join(BASE_DIR, 'data.json')
    BACKUP_DIR = os.path.join(BASE_DIR, 'backups')
    
    # SSL配置
    SSL_CERT = os.path.join(BASE_DIR, 'ssl', 'cert.pem')
    SSL_KEY = os.path.join(BASE_DIR, 'ssl', 'key.pem')
    
    # 应用配置
    MAX_STRING_LENGTH = 10000  # 最大字符串长度
    MAX_KEY_LENGTH = 100      # 最大键名长度
    ITEMS_PER_PAGE = 12       # 每页显示的项目数
    
class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False
    
# 配置映射
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
