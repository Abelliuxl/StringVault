document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 JavaScript已加载，开始初始化...');
    
    // 初始化静态和动态内容
    initializeStaticListeners();
    reinitializeDynamicContent();

    // 为动态内容容器设置事件委托
    const stringListContainer = document.querySelector('.string-list-container');
    if (stringListContainer) {
        setupDelegatedListeners(stringListContainer);
    }
});

/**
 * 设置不随内容动态改变的事件监听器
 */
function initializeStaticListeners() {
    // 搜索功能
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // 添加字符串按钮
    const addStringBtn = document.getElementById('addStringBtn');
    const addForm = document.getElementById('add-form');
    if (addStringBtn && addForm) {
        addStringBtn.addEventListener('click', handleAddString);
    }
    
    // 收起/展开添加字符串表单按钮
    const toggleAddFormBtn = document.getElementById('toggleAddFormBtn');
    if (toggleAddFormBtn) {
        toggleAddFormBtn.addEventListener('click', toggleAddForm);
    }
    
    // 密码验证模态框
    const passwordVerifyForm = document.getElementById('passwordVerifyForm');
    if (passwordVerifyForm) {
        passwordVerifyForm.addEventListener('submit', handlePasswordVerification);
    }
    const closeModalButton = document.querySelector('#passwordVerifyModal .close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closePasswordVerifyModal);
    }
}

/**
 * 为动态加载的内容（如字符串列表）设置事件委托
 * @param {HTMLElement} container 
 */
function setupDelegatedListeners(container) {
    container.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.closest('.delete-tag-btn')) {
            handleDeleteTag(target.closest('.delete-tag-btn'));
        } else if (target.closest('.delete-btn')) {
            handleDeleteString(target.closest('.delete-btn'));
        } else if (target.closest('.copy-btn')) {
            handleCopy(target.closest('.copy-btn'));
        } else if (target.closest('.preview-btn')) {
            togglePreview(target.closest('.preview-btn'));
        }
    });

    container.addEventListener('submit', function(e) {
        if (e.target.classList.contains('add-tag-form')) {
            e.preventDefault();
            handleAddTag(e.target);
        }
    });
}

/**
 * 初始化或重新初始化所有动态内容（字符串项目）的样式和动画
 */
function reinitializeDynamicContent() {
    const stringItems = document.querySelectorAll('.string-item');
    stringItems.forEach((item, index) => {
        // 1. 应用加载动画
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 50); // 加快动画

        // 2. 初始化预览状态和磨砂效果
        const valueElement = item.querySelector('.string-value');
        const previewButton = item.querySelector('.preview-btn');
        if (valueElement && previewButton) {
            valueElement.classList.add('truncate', 'frosted-glass', 'frosted-glass-active');
            previewButton.innerHTML = '<span>👁️</span>' + getTranslation('expand_btn');
            previewButton.setAttribute('title', getTranslation('expand_btn'));
        }
    });
}

// --- 事件处理器 ---

function toggleAddForm() {
    const addForm = document.getElementById('add-form');
    const toggleBtnText = document.getElementById('toggleBtnText');
    
    if (addForm.classList.contains('collapsed')) {
        // 展开表单
        addForm.classList.remove('collapsed');
        addForm.classList.add('expanded');
        toggleBtnText.textContent = getTranslation('collapse_form');
        
        // 聚焦到第一个输入框
        setTimeout(() => {
            const firstInput = addForm.querySelector('input[name="key"]');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    } else {
        // 收起表单
        addForm.classList.remove('expanded');
        addForm.classList.add('collapsed');
        toggleBtnText.textContent = getTranslation('add_string');
        
        // 清空表单
        addForm.reset();
    }
}

function handleAddString() {
    const addForm = document.getElementById('add-form');
    const keyInput = addForm.querySelector('input[name="key"]');
    const valueInput = addForm.querySelector('input[name="value"]');
    if (!validateInput(keyInput, 100) || !validateInput(valueInput, 10000)) {
        showNotification(getTranslation('input_required'), 'error');
        return;
    }
    showPasswordVerifyModal(() => {
        addForm.submit();
        // 添加成功后收起表单
        setTimeout(() => {
            toggleAddForm();
        }, 1000);
    });
}

function handleDeleteString(button) {
    const keyToDelete = button.dataset.key;
    if (confirm(getTranslation('delete_string_confirm'))) {
        showPasswordVerifyModal(function() {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/delete/${keyToDelete}`;
            document.body.appendChild(form);
            form.submit();
        });
    }
}

function handleAddTag(form) {
    const input = form.querySelector('.add-tag-input');
    const tag = input.value.trim();
    const stringItem = form.closest('.string-item');
    const key = stringItem.dataset.key;

    if (tag) {
        showPasswordVerifyModal(() => {
            fetch(`/api/strings/${key}/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ tag: tag })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification(getTranslation('tag_add_success'), 'success');
                    location.reload();
                } else {
                    showNotification(data.error || getTranslation('operation_failed'), 'error');
                }
            })
            .catch(err => {
                 console.error('添加标签失败:', err);
                 showNotification(getTranslation('request_failed'), 'error');
            });
        });
    }
}

function handleDeleteTag(button) {
    const stringItem = button.closest('.string-item');
    const key = stringItem.dataset.key;
    const tag = button.dataset.tag;

    if (confirm(getTranslation('delete_tag_confirm').replace('{key}', key).replace('{tag}', tag))) {
        showPasswordVerifyModal(() => {
            fetch(`/api/strings/${key}/tags/${tag}`, {
                method: 'DELETE',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification(getTranslation('tag_delete_success'), 'success');
                    location.reload();
                } else {
                    showNotification(data.error || getTranslation('operation_failed'), 'error');
                }
            })
            .catch(err => {
                console.error('删除标签失败:', err);
                showNotification(getTranslation('request_failed'), 'error');
            });
        });
    }
}

function handleCopy(button) {
    const valueElement = button.closest('.string-item').querySelector('.string-value');
    const text = valueElement.textContent;
    copyToClipboard(text, button);
}

function handleSearch(e) {
    const query = e.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set('search', query);
    url.searchParams.set('page', '1');

    fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    .then(response => response.text())
    .then(html => {
        const container = document.querySelector('.string-list-container');
        if (container) {
            container.innerHTML = html;
            reinitializeDynamicContent(); // 重新初始化新加载的内容
        }
        window.history.pushState({path: url.href}, '', url.href);
    })
    .catch(error => console.error('搜索失败:', error));
}

function handlePasswordVerification(e) {
    e.preventDefault();
    const form = e.target;
    const passwordInput = form.querySelector('input[name="password"]');
    const password = passwordInput.value.trim();
    if (!password) {
        showNotification(getTranslation('password_required'), 'error');
        return;
    }
    
    const submitBtn = form.querySelector('.login-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = getTranslation('verifying');
    submitBtn.disabled = true;

    fetch('/api/verify_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({ password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(getTranslation('password_success'), 'success');
            // 关键修复：先执行回调，再关闭模态框
            const callbackToExecute = currentVerifyCallback;
            closePasswordVerifyModal(); // closePasswordVerifyModal 会将 currentVerifyCallback 设为 null
            if (callbackToExecute) {
                callbackToExecute();
            }
        } else {
            showNotification(data.error || getTranslation('password_error'), 'error');
        }
    })
    .catch(error => {
        console.error('密码验证请求失败:', error);
        showNotification(getTranslation('password_request_failed'), 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        passwordInput.value = '';
    });
}


// --- 辅助函数 ---

function togglePreview(button) {
    const valueElement = button.closest('.string-item').querySelector('.string-value');
    const isTruncated = valueElement.classList.toggle('truncate');
    valueElement.classList.toggle('frosted-glass-active', isTruncated);
    
    if (isTruncated) {
        button.innerHTML = '<span>👁️</span>' + getTranslation('expand_btn');
        button.setAttribute('title', getTranslation('expand_btn'));
    } else {
        button.innerHTML = '<span>👁️‍🗨️</span>' + getTranslation('collapse_btn');
        button.setAttribute('title', getTranslation('collapse_btn'));
    }
}

async function copyToClipboard(text, button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = '', 150);

    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification(getTranslation('copy_success'), 'success');
        } catch (err) {
            fallbackCopyTextToClipboard(text);
        }
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification(getTranslation('copy_success'), 'success');
    } catch (err) {
        showNotification(getTranslation('copy_failed'), 'error');
    }
    document.body.removeChild(textArea);
}

function validateInput(input, maxLength) {
    const value = input.value.trim();
    return value.length > 0 && value.length <= maxLength;
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.flash-messages');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `flash-message flash-${type} show`;
    const iconMap = { 'success': '✅', 'error': '❌', 'warning': '⚠️', 'info': 'ℹ️' };
    notification.innerHTML = `
        <div style="font-size: 1.5rem; flex-shrink: 0;">${iconMap[type] || '💬'}</div>
        <div style="flex: 1; line-height: 1.5;">${message}</div>
        <button class="flash-close" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; opacity: 0.7;">✕</button>
    `;
    container.appendChild(notification);

    const removeNotif = () => {
        notification.classList.add('removing');
        notification.addEventListener('animationend', () => notification.remove());
    };

    const timer = setTimeout(removeNotif, 6000);
    notification.querySelector('.flash-close').addEventListener('click', () => {
        clearTimeout(timer);
        removeNotif();
    });
}

let currentVerifyCallback = null;
function showPasswordVerifyModal(callback) {
    const modal = document.getElementById('passwordVerifyModal');
    if (modal) {
        modal.classList.add('show');
        currentVerifyCallback = callback;
        const passwordInput = modal.querySelector('input[name="password"]');
        if (passwordInput) setTimeout(() => passwordInput.focus(), 100);
    }
}

function closePasswordVerifyModal() {
    const modal = document.getElementById('passwordVerifyModal');
    if (modal) {
        modal.classList.remove('show');
        const form = modal.querySelector('form');
        if (form) form.reset();
        const submitBtn = modal.querySelector('.login-btn');
        if (submitBtn) {
            submitBtn.textContent = getTranslation('verify_btn');
            submitBtn.disabled = false;
        }
    }
    currentVerifyCallback = null;
}

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
