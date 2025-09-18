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

function reinitializeEventListeners() {
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

    // 通用密码验证表单提交
    const passwordVerifyForm = document.getElementById('passwordVerifyForm');
    if (passwordVerifyForm) {
        passwordVerifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const passwordInput = this.querySelector('input[name="password"]');
            const password = passwordInput.value.trim();
            
            if (!password) {
                showNotification('请输入管理员密码', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('.login-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '验证中...';
            submitBtn.disabled = true;
            
            fetch('/api/verify_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ password: password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('密码验证成功！', 'success');
                    closePasswordVerifyModal();
                    if (currentVerifyCallback) {
                        currentVerifyCallback(); // 执行验证成功后的回调
                        currentVerifyCallback = null; // 清除回调
                    }
                } else {
                    showNotification(data.error || '密码错误', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            })
            .catch(error => {
                console.error('密码验证请求失败:', error);
                showNotification('密码验证请求失败，请重试', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // 添加字符串按钮点击事件
    const addStringBtn = document.getElementById('addStringBtn');
    const addForm = document.getElementById('add-form');
    if (addStringBtn && addForm) {
        addStringBtn.addEventListener('click', function() {
            // 验证输入
            const keyInput = addForm.querySelector('input[name="key"]');
            const valueInput = addForm.querySelector('input[name="value"]');
            
            if (!validateInput(keyInput, 100)) {
                showNotification('键名不能为空且长度不能超过100个字符', 'error');
                return;
            }
            
            if (!validateInput(valueInput, 10000)) {
                showNotification('值不能为空且长度不能超过10000个字符', 'error');
                return;
            }

            showPasswordVerifyModal(function() {
                addForm.submit(); // 验证成功后提交表单
            });
        });
    }

    // 删除按钮点击事件
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认的表单提交
            const keyToDelete = this.dataset.key; // 获取要删除的键

            if (!confirm('确定要删除这个字符串吗？')) {
                return; // 用户取消删除
            }

            showPasswordVerifyModal(function() {
                // 验证成功后，手动提交删除表单
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/delete/${keyToDelete}`;
                document.body.appendChild(form);
                form.submit();
            });
        });
    });

    // 初始化所有字符串为收起状态并设置按钮文本 - 彻底修复版本
    document.querySelectorAll('.string-item').forEach((item, index) => {
        const valueElement = item.querySelector('.string-value');
        const previewButton = item.querySelector('.preview-btn');
        
        console.log(`🔍 初始化按钮 ${index}:`, {
            innerHTML: previewButton.innerHTML,
            textContent: previewButton.textContent,
            classList: previewButton.classList.toString()
        });
        
        // 添加truncate类和frosted-glass类，并默认激活磨砂玻璃效果
        valueElement.classList.add('truncate', 'frosted-glass', 'frosted-glass-active');
        
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
        
        // 无论内容长度如何，展开按钮都始终显示
        previewButton.style.display = 'inline-flex'; // 确保按钮可见
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
            
            // 切换逻辑
            if (valueElement.classList.contains('truncate')) {
                // 展开
                valueElement.classList.remove('truncate');
                valueElement.classList.remove('frosted-glass-active'); // 移除磨砂玻璃效果
                this.innerHTML = '<span>👁️‍🗨️</span><span>收起</span>';
                this.classList.add('expanded'); // 保持expanded类用于按钮样式
                this.setAttribute('title', '收起完整内容');
                console.log('✅ 已展开');
            } else {
                // 收起
                valueElement.classList.add('truncate');
                valueElement.classList.add('frosted-glass-active'); // 恢复磨砂玻璃效果
                this.innerHTML = '<span>👁️</span><span>展开</span>';
                this.classList.remove('expanded'); // 移除expanded类用于按钮样式
                this.setAttribute('title', '展开完整内容');
                console.log('✅ 已收起');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 JavaScript已加载，开始初始化...');
    reinitializeEventListeners();

    // 搜索功能
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            const query = e.target.value;
            const url = new URL(window.location.href);
            url.searchParams.set('search', query);
            url.searchParams.set('page', '1'); // 每次搜索都回到第一页

            fetch(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(html => {
                const container = document.querySelector('.string-list-container');
                if (container) {
                    container.innerHTML = html;
                }
                
                // 更新URL，但不重新加载页面
                window.history.pushState({path: url.href}, '', url.href);

                // 重新初始化新加载项的事件监听器
                reinitializeEventListeners();
            })
            .catch(error => console.error('搜索失败:', error));
        }, 300));
    }
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

// 关闭通用密码验证弹窗
function closePasswordVerifyModal() {
    const modal = document.getElementById('passwordVerifyModal');
    if (modal) {
        modal.classList.remove('show');
        const passwordInput = modal.querySelector('input[name="password"]');
        if (passwordInput) {
            passwordInput.value = '';
        }
        const submitBtn = modal.querySelector('.login-btn');
        if (submitBtn) {
            submitBtn.textContent = '验证';
            submitBtn.disabled = false;
        }
    }
}

// 显示通用密码验证弹窗
let currentVerifyCallback = null; // 用于存储验证成功后的回调函数
function showPasswordVerifyModal(callback) {
    const modal = document.getElementById('passwordVerifyModal');
    if (modal) {
        modal.classList.add('show');
        currentVerifyCallback = callback; // 保存回调函数
        const passwordInput = modal.querySelector('input[name="password"]');
        if (passwordInput) {
            setTimeout(() => passwordInput.focus(), 100);
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

function reinitializeEventListeners() {
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

    // 通用密码验证表单提交
    const passwordVerifyForm = document.getElementById('passwordVerifyForm');
    if (passwordVerifyForm) {
        passwordVerifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const passwordInput = this.querySelector('input[name="password"]');
            const password = passwordInput.value.trim();
            
            if (!password) {
                showNotification('请输入管理员密码', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('.login-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '验证中...';
            submitBtn.disabled = true;
            
            fetch('/api/verify_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ password: password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('密码验证成功！', 'success');
                    closePasswordVerifyModal();
                    if (currentVerifyCallback) {
                        currentVerifyCallback(); // 执行验证成功后的回调
                        currentVerifyCallback = null; // 清除回调
                    }
                } else {
                    showNotification(data.error || '密码错误', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            })
            .catch(error => {
                console.error('密码验证请求失败:', error);
                showNotification('密码验证请求失败，请重试', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // 添加字符串按钮点击事件
    const addStringBtn = document.getElementById('addStringBtn');
    const addForm = document.getElementById('add-form');
    if (addStringBtn && addForm) {
        addStringBtn.addEventListener('click', function() {
            // 验证输入
            const keyInput = addForm.querySelector('input[name="key"]');
            const valueInput = addForm.querySelector('input[name="value"]');
            
            if (!validateInput(keyInput, 100)) {
                showNotification('键名不能为空且长度不能超过100个字符', 'error');
                return;
            }
            
            if (!validateInput(valueInput, 10000)) {
                showNotification('值不能为空且长度不能超过10000个字符', 'error');
                return;
            }

            showPasswordVerifyModal(function() {
                addForm.submit(); // 验证成功后提交表单
            });
        });
    }

    // 删除按钮点击事件
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // 阻止默认的表单提交
            const keyToDelete = this.dataset.key; // 获取要删除的键

            if (!confirm('确定要删除这个字符串吗？')) {
                return; // 用户取消删除
            }

            showPasswordVerifyModal(function() {
                // 验证成功后，手动提交删除表单
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/delete/${keyToDelete}`;
                document.body.appendChild(form);
                form.submit();
            });
        });
    });

    // 初始化所有字符串为收起状态并设置按钮文本 - 彻底修复版本
    document.querySelectorAll('.string-item').forEach((item, index) => {
        const valueElement = item.querySelector('.string-value');
        const previewButton = item.querySelector('.preview-btn');
        
        console.log(`🔍 初始化按钮 ${index}:`, {
            innerHTML: previewButton.innerHTML,
            textContent: previewButton.textContent,
            classList: previewButton.classList.toString()
        });
        
        // 添加truncate类和frosted-glass类，并默认激活磨砂玻璃效果
        valueElement.classList.add('truncate', 'frosted-glass', 'frosted-glass-active');
        
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
        
        // 无论内容长度如何，展开按钮都始终显示
        previewButton.style.display = 'inline-flex'; // 确保按钮可见
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
            
            // 切换逻辑
            if (valueElement.classList.contains('truncate')) {
                // 展开
                valueElement.classList.remove('truncate');
                valueElement.classList.remove('frosted-glass-active'); // 移除磨砂玻璃效果
                this.innerHTML = '<span>👁️‍🗨️</span><span>收起</span>';
                this.classList.add('expanded'); // 保持expanded类用于按钮样式
                this.setAttribute('title', '收起完整内容');
                console.log('✅ 已展开');
            } else {
                // 收起
                valueElement.classList.add('truncate');
                valueElement.classList.add('frosted-glass-active'); // 恢复磨砂玻璃效果
                this.innerHTML = '<span>👁️</span><span>展开</span>';
                this.classList.remove('expanded'); // 移除expanded类用于按钮样式
                this.setAttribute('title', '展开完整内容');
                console.log('✅ 已收起');
            }
        });
    });
}
