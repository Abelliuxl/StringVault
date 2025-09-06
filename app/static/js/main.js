// 复制到剪贴板功能
function fallbackCopyTextToClipboard(text) {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 避免滚动到底部
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('📋 复制成功！', 'success');
    } catch (err) {
        showNotification('❌ 复制失败，请手动复制。', 'error');
        console.error('复制失败:', err);
    }
    
    document.body.removeChild(textArea);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 JavaScript已加载，开始初始化...');
    
    // 添加加载动画
    const stringItems = document.querySelectorAll('.string-item');
    console.log(`📋 找到 ${stringItems.length} 个字符串项目`);
    
    stringItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // 复制到剪贴板功能
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const valueElement = this.closest('.string-item').querySelector('.string-value');
            const text = valueElement.textContent;
            
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            if (navigator.clipboard && window.isSecureContext) {
                // 如果支持现代API且在安全上下文中
                try {
                    await navigator.clipboard.writeText(text);
                    showNotification('📋 复制成功！', 'success');
                } catch (err) {
                    fallbackCopyTextToClipboard(text);
                }
            } else {
                // 使用后备方案
                fallbackCopyTextToClipboard(text);
            }
        });
    });

    // 删除确认
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('确定要删除这个字符串吗？')) {
                e.preventDefault();
            }
        });
    });

    // 搜索功能
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        let timeout = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const searchForm = document.querySelector('#search-form');
                searchForm.submit();
            }, 500);
        });
    }

    // 表单验证
    const addForm = document.querySelector('#add-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            const keyInput = this.querySelector('input[name="key"]');
            const valueInput = this.querySelector('input[name="value"]');
            
            if (!validateInput(keyInput, 100)) {
                e.preventDefault();
                showNotification('键名不能为空且长度不能超过100个字符', 'error');
            }
            
            if (!validateInput(valueInput, 10000)) {
                e.preventDefault();
                showNotification('值不能为空且长度不能超过10000个字符', 'error');
            }
        });
    }

    // 初始化所有字符串为收起状态并设置按钮文本 - 彻底修复版本
    document.querySelectorAll('.string-item').forEach((item, index) => {
        const valueElement = item.querySelector('.string-value');
        const previewButton = item.querySelector('.preview-btn');
        
        console.log(`🔍 初始化按钮 ${index}:`, {
            innerHTML: previewButton.innerHTML,
            textContent: previewButton.textContent,
            classList: previewButton.classList.toString()
        });
        
        // 添加truncate类
        valueElement.classList.add('truncate');
        
        // 检查按钮当前状态
        const buttonIcon = previewButton.querySelector('span:first-child');
        const buttonTextNode = previewButton.childNodes; // 获取所有子节点，包括文本节点
        
        console.log(`按钮 ${index} 的子节点:`, buttonTextNode);
        
        // 如果按钮已经有正确的结构，不要重写innerHTML
        if (buttonIcon) {
            console.log(`按钮 ${index} 有图标span，内容: "${buttonIcon.textContent}"`);
            // 确保图标是正确的
            if (buttonIcon.textContent !== '👁️') {
                buttonIcon.textContent = '👁️';
            }
            
            // 查找文本内容（可能在span之后）
            let textContent = '';
            for (let node of buttonTextNode) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    textContent = node.textContent.trim();
                    break;
                }
            }
            
            // 如果没有找到文本，查找其他span
            if (!textContent) {
                const textSpan = previewButton.querySelector('span:last-child');
                if (textSpan && textSpan !== buttonIcon) {
                    textContent = textSpan.textContent;
                }
            }
            
            console.log(`按钮 ${index} 文本内容: "${textContent}"`);
            
            // 修复文本内容
            if (textContent !== '展开') {
                // 清除所有文本节点，然后添加正确的文本
                for (let node of buttonTextNode) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = '展开';
                        break;
                    }
                }
                // 如果没有文本节点，添加一个
                if (!Array.from(buttonTextNode).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())) {
                    previewButton.appendChild(document.createTextNode('展开'));
                }
            }
            
            previewButton.setAttribute('title', '展开完整内容');
        } else {
            // 没有图标span，需要重新构建
            console.log(`按钮 ${index} 没有图标span，重新构建结构`);
            previewButton.innerHTML = '<span>👁️</span>展开';
            previewButton.setAttribute('title', '展开完整内容');
        }
        
        // 确保按钮有正确的初始样式（移除expanded类）
        previewButton.classList.remove('expanded');
        
        // 如果内容不需要截断（内容高度小于等于3行），隐藏展开按钮
        if (valueElement.scrollHeight <= valueElement.clientHeight) {
            previewButton.style.display = 'none';
        }
    });

    // 展开/收起按钮事件监听 - 简化版本用于测试
    const previewButtons = document.querySelectorAll('.preview-btn');
    console.log(`🔍 找到 ${previewButtons.length} 个预览按钮`);
    
    previewButtons.forEach((button, index) => {
        console.log(`按钮 ${index}:`, button.innerHTML);
        
        button.addEventListener('click', function(e) {
            console.log('🎯 预览按钮被点击！');
            
            const stringItem = this.closest('.string-item');
            const valueElement = stringItem.querySelector('.string-value');
            
            // 简单切换逻辑
            if (valueElement.classList.contains('truncate')) {
                // 展开
                valueElement.classList.remove('truncate');
                this.innerHTML = '<span>👁️‍🗨️</span><span>收起</span>';
                this.classList.add('expanded');
                this.setAttribute('title', '收起完整内容');
                console.log('✅ 已展开');
            } else {
                // 收起
                valueElement.classList.add('truncate');
                this.innerHTML = '<span>👁️</span><span>展开</span>';
                this.classList.remove('expanded');
                this.setAttribute('title', '展开完整内容');
                console.log('✅ 已收起');
            }
        });
    });
});

// 输入验证
function validateInput(input, maxLength) {
    const value = input.value.trim();
    return value.length > 0 && value.length <= maxLength;
}

// 通知提示 - 改进版本
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `flash-message flash-${type} show`;
    
    // 添加图标和更好的结构
    const iconMap = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    
    notification.innerHTML = `
        <div style="font-size: 1.5rem; flex-shrink: 0;">${iconMap[type] || '💬'}</div>
        <div style="flex: 1; line-height: 1.5;">${message}</div>
        <button class="flash-close" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;" onclick="this.parentElement.classList.add('removing')">✕</button>
    `;
    
    const container = document.querySelector('.flash-messages');
    if (container) {
        container.appendChild(notification);
        
        // 6秒后开始消失动画（延长显示时间）
        const hideTimer = setTimeout(() => {
            notification.classList.add('removing');
        }, 6000);
        
        // 等待动画完成后删除元素
        notification.addEventListener('animationend', (e) => {
            if (e.animationName === 'slideOut') {
                notification.remove();
            }
        });
        
        // 点击关闭按钮时清除定时器
        const closeBtn = notification.querySelector('.flash-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(hideTimer);
                notification.classList.add('removing');
            });
        }
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 字符串预览
function togglePreview(element) {
    const value = element.querySelector('.string-value');
    if (value.classList.contains('truncate')) {
        value.classList.remove('truncate');
        element.querySelector('.preview-btn').textContent = '收起';
    } else {
        value.classList.add('truncate');
        element.querySelector('.preview-btn').textContent = '展开';
    }
}
