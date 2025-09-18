# 国际化工具模块
import json
import os
from flask import request, session

class I18nManager:
    def __init__(self):
        self.translations = {}
        self.default_language = 'zh'
        self.supported_languages = ['zh', 'en']
        self.load_translations()
    
    def load_translations(self):
        """加载翻译文件"""
        translations_dir = os.path.join(os.path.dirname(__file__), '..', 'translations')
        
        for lang in self.supported_languages:
            translation_file = os.path.join(translations_dir, f'{lang}.json')
            if os.path.exists(translation_file):
                with open(translation_file, 'r', encoding='utf-8') as f:
                    self.translations[lang] = json.load(f)
            else:
                # 如果翻译文件不存在，创建空的翻译字典
                self.translations[lang] = {}
    
    def get_language(self):
        """获取当前语言"""
        # 优先级：session > URL参数 > 浏览器偏好 > 默认语言
        if 'language' in session:
            return session['language']
        
        lang_param = request.args.get('lang')
        if lang_param in self.supported_languages:
            session['language'] = lang_param
            return lang_param
        
        # 从浏览器Accept-Language头获取
        accept_language = request.headers.get('Accept-Language', '')
        if accept_language:
            for lang in accept_language.split(','):
                lang = lang.split(';')[0].strip().lower()
                if lang in self.supported_languages:
                    session['language'] = lang
                    return lang
                # 处理类似'en-US'的情况
                if '-' in lang:
                    lang = lang.split('-')[0]
                    if lang in self.supported_languages:
                        session['language'] = lang
                        return lang
        
        return self.default_language
    
    def set_language(self, language):
        """设置语言"""
        if language in self.supported_languages:
            session['language'] = language
            return True
        return False
    
    def translate(self, key, language=None, **kwargs):
        """翻译文本"""
        if language is None:
            language = self.get_language()
        
        # 获取翻译文本
        translation = self.translations.get(language, {}).get(key, key)
        
        # 如果在目标语言中找不到，尝试在默认语言中查找
        if translation == key and language != self.default_language:
            translation = self.translations.get(self.default_language, {}).get(key, key)
        
        # 格式化字符串
        try:
            return translation.format(**kwargs) if kwargs else translation
        except (KeyError, ValueError):
            return translation
    
    def get_language_name(self, language_code):
        """获取语言的本地化名称"""
        language_names = {
            'zh': {'zh': '中文', 'en': 'Chinese'},
            'en': {'zh': '英文', 'en': 'English'}
        }
        return language_names.get(language_code, {}).get(self.get_language(), language_code)

# 创建全局i18n管理器实例
i18n = I18nManager()

# 模板过滤器函数
def t(key, **kwargs):
    """翻译过滤器"""
    return i18n.translate(key, **kwargs)

def get_current_language():
    """获取当前语言"""
    return i18n.get_language()

def get_language_name(lang_code):
    """获取语言名称"""
    return i18n.get_language_name(lang_code)
