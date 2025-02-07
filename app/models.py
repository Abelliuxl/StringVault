import json
import os
from datetime import datetime
from typing import Dict, Optional, List
import logging
from app.config.config import Config

class StringStore:
    ITEMS_PER_PAGE = Config.ITEMS_PER_PAGE
    
    def __init__(self):
        self.data_file = Config.DATA_FILE
        self.backup_dir = Config.BACKUP_DIR
        os.makedirs(self.backup_dir, exist_ok=True)
        self._data: Dict[str, dict] = self._load_data()
        
    def _load_data(self) -> dict:
        """加载数据文件"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # 转换旧数据格式
                    if not all(isinstance(v, dict) for v in data.values()):
                        return {k: {'value': v, 'created_at': datetime.now().isoformat(), 
                                  'updated_at': datetime.now().isoformat()} 
                                for k, v in data.items()}
                    return data
            except json.JSONDecodeError:
                logging.error("数据文件损坏，创建备份并返回空数据")
                self._backup_data()
                return {}
        return {}
    
    def _save_data(self) -> None:
        """保存数据到文件"""
        self._backup_data()
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self._data, f, ensure_ascii=False, indent=2)
            
    def _backup_data(self) -> None:
        """备份数据文件"""
        if os.path.exists(self.data_file):
            backup_name = f"data_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            backup_path = os.path.join(self.backup_dir, backup_name)
            os.makedirs(self.backup_dir, exist_ok=True)
            try:
                import shutil
                shutil.copy2(self.data_file, backup_path)
                # 保留最近10个备份
                backups = sorted([f for f in os.listdir(self.backup_dir) if f.startswith('data_backup_')])
                if len(backups) > 10:
                    os.remove(os.path.join(self.backup_dir, backups[0]))
            except Exception as e:
                logging.error(f"备份失败: {str(e)}")
    
    def add_string(self, key: str, value: str) -> bool:
        """添加或更新字符串"""
        if not self._validate_key(key) or not self._validate_value(value):
            return False
            
        now = datetime.now().isoformat()
        if key in self._data:
            self._data[key].update({
                'value': value,
                'updated_at': now
            })
        else:
            self._data[key] = {
                'value': value,
                'created_at': now,
                'updated_at': now
            }
        self._save_data()
        return True
    
    def get_string(self, key: str) -> Optional[dict]:
        """获取字符串及其元数据"""
        return self._data.get(key)
    
    def delete_string(self, key: str) -> bool:
        """删除字符串"""
        if key in self._data:
            del self._data[key]
            self._save_data()
            return True
        return False
    
    def get_all_strings(self, page: int = 1, per_page: int = None) -> tuple:
        """获取所有字符串，支持分页"""
        if per_page is None:
            per_page = self.ITEMS_PER_PAGE
            
        items = sorted(
            [{'key': k, **v} for k, v in self._data.items()],
            key=lambda x: x['updated_at'],
            reverse=True
        )
        total = len(items)
        start = (page - 1) * per_page
        end = start + per_page
        return items[start:end], total
    
    def search_strings(self, query: str) -> List[dict]:
        """搜索字符串"""
        query = query.lower()
        return [
            {'key': k, **v} 
            for k, v in self._data.items() 
            if query in k.lower() or query in v['value'].lower()
        ]
    
    def _validate_key(self, key: str) -> bool:
        """验证键名"""
        return (isinstance(key, str) and 
                0 < len(key) <= Config.MAX_KEY_LENGTH and 
                key.strip() == key)
    
    def _validate_value(self, value: str) -> bool:
        """验证值"""
        return (isinstance(value, str) and 
                0 < len(value) <= Config.MAX_STRING_LENGTH) 