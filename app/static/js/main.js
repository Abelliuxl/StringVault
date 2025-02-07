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
        showNotification('复制成功！', 'success');
    } catch (err) {
        showNotification('复制失败，请手动复制。', 'error');
        console.error('复制失败:', err);
    }
    
    document.body.removeChild(textArea);
}

document.addEventListener('DOMContentLoaded', function() {
    // 复制到剪贴板功能
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const valueElement = this.closest('.string-item').querySelector('.string-value');
            const text = valueElement.textContent;
            
            if (navigator.clipboard && window.isSecureContext) {
                // 如果支持现代API且在安全上下文中
                try {
                    await navigator.clipboard.writeText(text);
                    showNotification('复制成功！', 'success');
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

    // 初始化所有字符串为收起状态并设置按钮文本
    document.querySelectorAll('.string-item').forEach(item => {
        const valueElement = item.querySelector('.string-value');
        const previewButton = item.querySelector('.preview-btn');
        
        // 添加truncate类
        valueElement.classList.add('truncate');
        previewButton.textContent = '展开';
        
        // 如果内容不需要截断（内容高度小于等于3行），隐藏展开按钮
        if (valueElement.scrollHeight <= valueElement.clientHeight) {
            previewButton.style.display = 'none';
        }
    });

    // 展开/收起按钮事件监听
    document.querySelectorAll('.preview-btn').forEach(button => {
        button.addEventListener('click', function() {
            const stringItem = this.closest('.string-item');
            const valueElement = stringItem.querySelector('.string-value');
            
            if (valueElement.classList.contains('truncate')) {
                valueElement.classList.remove('truncate');
                this.textContent = '收起';
            } else {
                valueElement.classList.add('truncate');
                this.textContent = '展开';
            }
        });
    });
});

// 输入验证
function validateInput(input, maxLength) {
    const value = input.value.trim();
    return value.length > 0 && value.length <= maxLength;
}

// 通知提示
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `flash-message flash-${type}`;
    notification.textContent = message;
    
    const container = document.querySelector('.flash-messages');
    if (container) {
        container.appendChild(notification);
        
        // 3秒后开始消失动画
        setTimeout(() => {
            notification.classList.add('removing');
            // 等待动画完成后删除元素
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }, 3000);
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