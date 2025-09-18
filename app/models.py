import json
import os
from datetime import datetime
from typing import Dict, Optional, List, Set
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
                        data = {k: {'value': v, 'created_at': datetime.now().isoformat(), 
                                  'updated_at': datetime.now().isoformat()} 
                                for k, v in data.items()}
                    # 为没有标签的数据添加 'tags' 字段
                    for k, v in data.items():
                        if 'tags' not in v:
                            v['tags'] = []
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
    
    def add_string(self, key: str, value: str, tags: Optional[List[str]] = None) -> bool:
        """添加或更新字符串，支持在创建时添加标签"""
        if not self._validate_key(key) or not self._validate_value(value):
            return False
            
        now = datetime.now().isoformat()
        if key in self._data:
            # 更新现有字符串时，不处理标签，标签操作由 add_tag/delete_tag 负责
            self._data[key].update({
                'value': value,
                'updated_at': now
            })
        else:
            # 创建新字符串
            new_tags = []
            if tags:
                # 清理、去重并排序
                new_tags = sorted(list(set([tag.strip() for tag in tags if tag.strip()])))

            self._data[key] = {
                'value': value,
                'created_at': now,
                'updated_at': now,
                'tags': new_tags
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
    
    def get_all_strings(self, page: int = 1, per_page: int = None, tag: Optional[str] = None) -> tuple:
        """获取所有字符串，支持分页和按标签筛选"""
        if per_page is None:
            per_page = self.ITEMS_PER_PAGE
        
        if tag:
            filtered_items = [
                {'key': k, **v} for k, v in self._data.items() if tag in v.get('tags', [])
            ]
        else:
            filtered_items = [{'key': k, **v} for k, v in self._data.items()]
            
        items = sorted(
            filtered_items,
            key=lambda x: x['updated_at'],
            reverse=True
        )
        total = len(items)
        start = (page - 1) * per_page
        end = start + per_page
        return items[start:end], total
    
    def search_strings(self, query: str) -> List[dict]:
        """搜索字符串，包括在标签中搜索"""
        query = query.lower()
        return [
            {'key': k, **v} 
            for k, v in self._data.items() 
            if query in k.lower() or \
               query in v['value'].lower() or \
               any(query in tag.lower() for tag in v.get('tags', []))
        ]
    
    def add_tag(self, key: str, tag: str) -> bool:
        """为指定字符串添加标签"""
        if key in self._data and tag and tag.strip():
            tags = self._data[key].get('tags', [])
            if tag not in tags:
                tags.append(tag)
                self._data[key]['tags'] = sorted(tags)
                self._data[key]['updated_at'] = datetime.now().isoformat()
                self._save_data()
                return True
        return False

    def delete_tag(self, key: str, tag: str) -> bool:
        """删除指定字符串的标签"""
        if key in self._data and tag:
            tags = self._data[key].get('tags', [])
            if tag in tags:
                tags.remove(tag)
                self._data[key]['tags'] = sorted(tags)
                self._data[key]['updated_at'] = datetime.now().isoformat()
                self._save_data()
                return True
        return False

    def get_all_tags(self) -> List[str]:
        """获取所有唯一的标签"""
        all_tags: Set[str] = set()
        for item in self._data.values():
            all_tags.update(item.get('tags', []))
        return sorted(list(all_tags))

    def _validate_key(self, key: str) -> bool:
        """验证键名"""
        return (isinstance(key, str) and 
                0 < len(key) <= Config.MAX_KEY_LENGTH and 
                key.strip() == key)
    
    def _validate_value(self, value: str) -> bool:
        """验证值"""
        return (isinstance(value, str) and 
                0 < len(value) <= Config.MAX_STRING_LENGTH)
