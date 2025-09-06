from functools import wraps
from flask import session, request, redirect, url_for, flash
import hashlib
import secrets
import json
import os
from datetime import datetime, timedelta

class AuthManager:
    def __init__(self, passwords_file='admin_passwords.json'):
        self.passwords_file = passwords_file
        self.password_hashes = self.load_password_hashes()
        self.session_key = 'admin_authenticated'
        self.session_timestamp_key = 'admin_session_timestamp'
        self.session_timeout = timedelta(minutes=30)  # 30分钟无操作自动登出
    
    def load_password_hashes(self):
        """从JSON文件加载密码哈希列表"""
        try:
            if os.path.exists(self.passwords_file):
                with open(self.passwords_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get('password_hashes', [])
            else:
                # 如果文件不存在，创建默认密码
                default_password = 'admin123'
                default_hash = self.hash_password(default_password)
                default_hashes = [default_hash]
                self.save_password_hashes(default_hashes)
                return default_hashes
        except (json.JSONDecodeError, IOError) as e:
            print(f"警告：无法加载密码文件 {self.passwords_file}: {e}")
            # 返回空列表，确保系统能正常运行
            return []
    
    def save_password_hashes(self, password_hashes):
        """保存密码哈希列表到JSON文件"""
        try:
            data = {
                'password_hashes': password_hashes,
                'system_info': {
                    'last_updated': datetime.now().isoformat(),
                    'version': '1.0'
                }
            }
            with open(self.passwords_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except IOError as e:
            print(f"错误：无法保存密码文件 {self.passwords_file}: {e}")
            return False
    
    def hash_password(self, password):
        """哈希密码"""
        return hashlib.sha256(password.encode('utf-8')).hexdigest()
    
    def verify_password(self, password):
        """验证密码是否存在"""
        password_hash = self.hash_password(password)
        return password_hash in self.password_hashes
    
    def login_admin(self, password):
        """管理员登录（仅密码验证）"""
        if self.verify_password(password):
            session[self.session_key] = True
            session[self.session_timestamp_key] = datetime.now().isoformat()
            session.permanent = False  # 确保会话在浏览器关闭时过期
            return True
        return False
    
    def logout_admin(self):
        """管理员登出"""
        session.pop(self.session_key, None)
        session.pop(self.session_timestamp_key, None)
    
    def is_session_expired(self):
        """检查会话是否过期"""
        timestamp_str = session.get(self.session_timestamp_key)
        if not timestamp_str:
            return True
        
        try:
            last_activity = datetime.fromisoformat(timestamp_str)
            return datetime.now() - last_activity > self.session_timeout
        except (ValueError, AttributeError):
            return True
    
    def update_session_timestamp(self):
        """更新会话时间戳"""
        session[self.session_timestamp_key] = datetime.now().isoformat()
    
    def is_admin_authenticated(self):
        """检查管理员是否已认证"""
        if not session.get(self.session_key, False):
            return False
        
        # 检查会话是否过期
        if self.is_session_expired():
            self.logout_admin()
            return False
        
        # 更新最后活动时间
        self.update_session_timestamp()
        return True
    
    def add_password(self, password):
        """添加新的管理员密码"""
        if len(password) < 6:
            return False, "密码长度至少为6位"
        
        password_hash = self.hash_password(password)
        
        # 检查密码是否已存在
        if password_hash in self.password_hashes:
            return False, "密码已存在"
        
        self.password_hashes.append(password_hash)
        
        # 保存到文件
        if self.save_password_hashes(self.password_hashes):
            return True, "密码添加成功"
        else:
            return False, "保存失败"
    
    def remove_password(self, password):
        """删除管理员密码"""
        password_hash = self.hash_password(password)
        
        if password_hash not in self.password_hashes:
            return False, "密码不存在"
        
        if len(self.password_hashes) <= 1:
            return False, "至少需要保留一个管理员密码"
        
        self.password_hashes.remove(password_hash)
        
        # 保存到文件
        if self.save_password_hashes(self.password_hashes):
            return True, "密码删除成功"
        else:
            return False, "保存失败"
    
    def list_passwords(self):
        """列出所有密码哈希（不包含实际密码）"""
        return self.password_hashes.copy()

    def require_admin(self, f):
        """管理员认证装饰器"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not self.is_admin_authenticated():
                if request.is_json:
                    return {'success': False, 'error': '需要管理员权限'}, 403
                flash('需要管理员权限', 'error')
                return redirect(url_for('main.admin_login'))
            return f(*args, **kwargs)
        return decorated_function

# 创建全局认证管理器实例
auth_manager = AuthManager()
