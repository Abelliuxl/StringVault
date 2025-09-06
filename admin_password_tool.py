#!/usr/bin/env python3
"""
管理员密码管理工具 - 密码哈希版本
仅支持密码管理，不支持用户名
"""

import hashlib
import sys
import getpass
import secrets
import string
import argparse
import json
import os
from datetime import datetime

DEFAULT_PASSWORDS_FILE = 'admin_passwords.json'

def hash_password(password):
    """生成密码的SHA256哈希"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def generate_secure_password(length=12):
    """生成随机安全密码"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def load_password_hashes(passwords_file):
    """加载密码哈希列表"""
    try:
        if os.path.exists(passwords_file):
            with open(passwords_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('password_hashes', [])
        return []
    except (json.JSONDecodeError, IOError) as e:
        print(f"警告：无法加载密码文件 {passwords_file}: {e}")
        return []

def save_password_hashes(password_hashes, passwords_file):
    """保存密码哈希列表"""
    try:
        data = {
            'password_hashes': password_hashes,
            'system_info': {
                'last_updated': datetime.now().isoformat(),
                'version': '1.0'
            }
        }
        with open(passwords_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except IOError as e:
        print(f"错误：无法保存密码文件 {passwords_file}: {e}")
        return False

def list_passwords(passwords_file):
    """列出所有密码哈希（不显示实际密码）"""
    password_hashes = load_password_hashes(passwords_file)
    
    if not password_hashes:
        print("❌ 没有找到管理员密码")
        return
    
    print("\n🔑 管理员密码哈希列表:")
    print("=" * 60)
    for i, password_hash in enumerate(password_hashes, 1):
        print(f"{i}. {password_hash[:16]}...{password_hash[-16:]}")
    print(f"\n总计: {len(password_hashes)} 个密码")

def add_password(passwords_file):
    """添加新管理员密码"""
    password_hashes = load_password_hashes(passwords_file)
    
    # 选择密码设置方式
    print("\n密码设置方式:")
    print("1. 手动输入密码")
    print("2. 生成随机密码")
    
    choice = input("请选择 (1-2): ").strip()
    
    if choice == '1':
        while True:
            password = getpass.getpass("请输入新密码: ")
            if len(password) < 6:
                print("❌ 密码长度至少为6位")
                continue
            
            confirm_password = getpass.getpass("请再次输入密码确认: ")
            if password != confirm_password:
                print("❌ 两次输入的密码不一致")
                continue
            
            break
    elif choice == '2':
        password = generate_secure_password()
        print(f"🎲 生成的随机密码: {password}")
        print("⚠️  请妥善保存此密码！")
    else:
        print("❌ 无效选择")
        return
    
    # 检查密码是否已存在
    password_hash = hash_password(password)
    if password_hash in password_hashes:
        print("❌ 该密码已存在")
        return
    
    # 添加到密码列表
    password_hashes.append(password_hash)
    
    if save_password_hashes(password_hashes, passwords_file):
        print("✅ 密码添加成功")
    else:
        print("❌ 保存失败")

def delete_password(passwords_file):
    """删除管理员密码"""
    password_hashes = load_password_hashes(passwords_file)
    
    if not password_hashes:
        print("❌ 没有找到管理员密码")
        return
    
    if len(password_hashes) <= 1:
        print("❌ 至少需要保留一个管理员密码")
        return
    
    # 显示密码哈希列表
    print("\n当前密码哈希:")
    for i, password_hash in enumerate(password_hashes, 1):
        print(f"{i}. {password_hash[:16]}...{password_hash[-16:]}")
    
    # 输入要删除的密码进行验证
    password = getpass.getpass("\n请输入要删除的密码: ")
    password_hash = hash_password(password)
    
    if password_hash not in password_hashes:
        print("❌ 密码不存在")
        return
    
    # 确认删除
    confirm = input("确定要删除此密码吗? (y/N): ").strip().lower()
    
    if confirm != 'y':
        print("❌ 操作已取消")
        return
    
    password_hashes.remove(password_hash)
    
    if save_password_hashes(password_hashes, passwords_file):
        print("✅ 密码删除成功")
    else:
        print("❌ 保存失败")

def interactive_mode(passwords_file):
    """交互式模式"""
    print("🔐 字符串托管系统 - 管理员密码管理工具")
    print("=" * 50)
    
    while True:
        print("\n选项:")
        print("1. 列出所有密码哈希")
        print("2. 添加新密码")
        print("3. 删除密码")
        print("4. 退出")
        
        choice = input("\n请选择 (1-4): ").strip()
        
        if choice == '1':
            list_passwords(passwords_file)
        elif choice == '2':
            add_password(passwords_file)
        elif choice == '3':
            delete_password(passwords_file)
        elif choice == '4':
            print("👋 再见！")
            break
        else:
            print("❌ 无效选择，请重试。")

def main():
    parser = argparse.ArgumentParser(description='管理员密码管理工具 - 密码哈希版本')
    parser.add_argument('-f', '--file', default=DEFAULT_PASSWORDS_FILE, 
                       help=f'密码文件路径 (默认: {DEFAULT_PASSWORDS_FILE})')
    parser.add_argument('-l', '--list', action='store_true', help='列出所有密码哈希')
    parser.add_argument('-a', '--add', action='store_true', help='添加新密码')
    parser.add_argument('-d', '--delete', action='store_true', help='删除密码')
    
    args = parser.parse_args()
    
    # 如果指定了某个操作，执行该操作
    if args.list:
        list_passwords(args.file)
    elif args.add:
        add_password(args.file)
    elif args.delete:
        delete_password(args.file)
    else:
        # 默认进入交互模式
        interactive_mode(args.file)

if __name__ == '__main__':
    main()
