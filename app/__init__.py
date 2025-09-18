from flask import Flask, session
from app.config.config import config
from app.utils.i18n import i18n, t, get_current_language, get_language_name
import os
from datetime import datetime, timedelta

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object(config[config_name])
    
    # 配置会话为临时会话（浏览器关闭时过期）
    # 移除重复的会话设置，已经在init_i18n中处理
    
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
    
    # 注册国际化模板过滤器
    @app.template_filter('t')
    def translate_filter(key, **kwargs):
        """翻译过滤器"""
        return t(key, **kwargs)
    
    @app.context_processor
    def inject_i18n():
        """注入国际化变量到模板上下文"""
        return dict(
            t=t,
            get_current_language=get_current_language,
            get_language_name=get_language_name,
            i18n=i18n
        )
    
    # 初始化国际化
    @app.before_request
    def init_i18n():
        """初始化国际化"""
        # 确保会话在浏览器关闭时过期
        session.permanent = False
        # 加载当前语言
        i18n.get_language()
    
    return app
