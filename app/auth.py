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
        # 移除时间戳和超时逻辑，实现一次登录只能用一次会话
    
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
    
    def verify_admin_password_on_demand(self, password):
        """按需验证管理员密码"""
        return self.verify_password(password)

    # 移除登录和登出方法，因为不再维持登录状态
    # def login_admin(self, password):
    #     """管理员登录（仅密码验证）"""
    #     if self.verify_password(password):
    #         session[self.session_key] = True
    #         session.permanent = False  # 确保会话在浏览器关闭时过期
            
    #         # 立即标记会话为已修改，确保cookie被正确设置
    #         session.modified = True
    #         return True
    #     return False
    
    # def logout_admin(self):
    #     """管理员登出"""
    #     session.pop(self.session_key, None)
    
    def is_admin_authenticated(self):
        """检查管理员是否已认证 (始终返回 False，因为不再维持登录状态)"""
        return False
    
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
        """管理员认证装饰器 (不再检查会话，因为验证逻辑已转移到前端和按需验证)"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # 暂时不进行任何会话检查，因为验证逻辑将转移到前端和新的后端接口
            return f(*args, **kwargs)
        return decorated_function

# 创建全局认证管理器实例
auth_manager = AuthManager()
