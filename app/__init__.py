from flask import Flask
from app.config.config import config
import os
from datetime import datetime

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object(config[config_name])
    
    # 确保必要的目录存在
    os.makedirs(app.config['BACKUP_DIR'], exist_ok=True)
    
    # 注册蓝图
    from app.views import main as main_blueprint
    app.register_blueprint(main_blueprint)
    
    # 注册模板过滤器
    @app.template_filter('datetime')
    def format_datetime(value):
        """格式化日期时间"""
        if isinstance(value, str):
            try:
                value = datetime.fromisoformat(value)
            except ValueError:
                return value
        return value.strftime('%Y-%m-%d %H:%M:%S')
    
    return app 