// JavaScript 国际化工具
class JSI18n {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'zh';
        this.defaultLanguage = 'zh';
        this.loadTranslations();
    }

    loadTranslations() {
        // 从HTML中获取翻译数据
        const scriptElement = document.getElementById('translations-data');
        if (scriptElement) {
            try {
                this.translations = JSON.parse(scriptElement.textContent);
            } catch (e) {
                console.error('Failed to parse translations:', e);
                this.translations = {};
            }
        }
        
        // 从当前URL或HTML lang属性获取当前语言
        this.currentLanguage = document.documentElement.lang || this.defaultLanguage;
    }

    translate(key, params = {}) {
        // 获取当前语言的翻译
        let translation = this.translations[this.currentLanguage]?.[key] || 
                        this.translations[this.defaultLanguage]?.[key] || 
                        key;

        // 参数替换
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(param => {
                translation = translation.replace(new RegExp(`{${param}}`, 'g'), params[param]);
            });
        }

        return translation;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setLanguage(language) {
        this.currentLanguage = language;
        document.documentElement.lang = language;
    }
}

// 创建全局实例
const jsI18n = new JSI18n();

// 全局函数
function getTranslation(key, params = {}) {
    return jsI18n.translate(key, params);
}

function getCurrentLanguage() {
    return jsI18n.getCurrentLanguage();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    jsI18n.loadTranslations();
});
