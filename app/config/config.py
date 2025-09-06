import os
from datetime import timedelta

class Config:
    # 基础配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    DEBUG = False
    
    # 会话配置 - 禁用持久化cookies
    SESSION_COOKIE_HTTPONLY = True  # 防止XSS攻击
    SESSION_COOKIE_SECURE = False   # 开发环境设为False，生产环境建议设为True（需要HTTPS）
    SESSION_COOKIE_SAMESITE = 'Lax'  # CSRF保护
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)  # 会话最长1小时
    SESSION_REFRESH_EACH_REQUEST = True  # 每次请求刷新会话时间
    
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
    ITEMS_PER_PAGE = 10       # 每页显示的项目数
    
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
