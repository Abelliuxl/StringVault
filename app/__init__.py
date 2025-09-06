from flask import Flask, session
from app.config.config import config
import os
from datetime import datetime

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object(config[config_name])
    
    # 配置会话为临时会话（浏览器关闭时过期）
    @app.before_request
    def make_session_temp():
        # 确保会话在浏览器关闭时过期
        session.permanent = False
    
    # 添加会话安全头
    @app.after_request
    def add_session_headers(response):
        # 确保cookies不会持久化存储
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    
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
