#!/usr/bin/env python3
"""
简单的密码设置工具 - 直接设置新密码
"""

import hashlib
import sys

def hash_password(password):
    """生成密码的SHA256哈希"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def main():
    if len(sys.argv) != 2:
        print("使用方法: python simple_password_setter.py <新密码>")
        print("示例: python simple_password_setter.py mynewpassword123")
        sys.exit(1)
    
    new_password = sys.argv[1]
    
    if len(new_password) < 6:
        print("❌ 密码长度至少为6位")
        sys.exit(1)
    
    # 生成新哈希
    new_hash = hash_password(new_password)
    
    print(f"✅ 新密码: {new_password}")
    print(f"✅ 密码哈希: {new_hash}")
    print("\n📋 使用方法:")
    print("1. 复制上面的密码哈希")
    print("2. 在Linux系统中执行:")
    print(f"   export ADMIN_PASSWORD_HASH='{new_hash}'")
    print("3. 然后重启您的Flask应用")
    print("\n或者修改 app/auth.py 文件第7行的默认值")

if __name__ == '__main__':
    main()
