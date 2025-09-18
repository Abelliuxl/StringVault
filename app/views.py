from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, session
from app.models import StringStore
from app.auth import auth_manager
from app.utils.i18n import i18n
import json
import math

main = Blueprint('main', __name__)
store = StringStore()

@main.route('/', methods=['GET'])
def index():
    page = request.args.get('page', 1, type=int)
    search_query = request.args.get('search', '').strip()
    current_tag = request.args.get('tag', '').strip()

    if search_query:
        items = store.search_strings(search_query)
        total = len(items)
        items = items[(page - 1) * store.ITEMS_PER_PAGE:page * store.ITEMS_PER_PAGE]
    else:
        items, total = store.get_all_strings(page, tag=current_tag if current_tag else None)

    total_pages = math.ceil(total / store.ITEMS_PER_PAGE)
    all_tags = store.get_all_tags()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return render_template('_string_list.html',
                             items=items,
                             page=page,
                             total_pages=total_pages,
                             search_query=search_query,
                             current_tag=current_tag,
                             all_tags=all_tags)

    # 加载翻译数据
    translations = i18n.translations
    
    return render_template('index.html',
                         items=items,
                         page=page,
                         total_pages=total_pages,
                         search_query=search_query,
                         is_admin=auth_manager.is_admin_authenticated(),
                         current_tag=current_tag,
                         all_tags=all_tags,
                         translations=translations)

@main.route('/api/verify_password', methods=['POST'])
def api_verify_password():
    data = request.get_json()
    password = data.get('password')
    if auth_manager.verify_admin_password_on_demand(password):
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': '密码错误'}), 401

@main.route('/add', methods=['POST'])
def add_string():
    key = request.form.get('key', '').strip()
    value = request.form.get('value', '').strip()
    tags_string = request.form.get('tags', '').strip()
    
    if not key or not value:
        flash('键名和值都不能为空', 'error')
        return redirect(url_for('main.index'))
    
    # 将逗号分隔的标签字符串转换为列表
    tags_list = [tag.strip() for tag in tags_string.split(',') if tag.strip()]
    
    if store.add_string(key, value, tags=tags_list):
        flash('字符串添加成功', 'success')
    else:
        flash('字符串添加失败，请检查输入是否合法', 'error')
    
    return redirect(url_for('main.index'))

@main.route('/delete/<key>', methods=['POST'])
def delete_string(key):
    if store.delete_string(key):
        flash('字符串删除成功', 'success')
    else:
        flash('字符串删除失败', 'error')
    return redirect(url_for('main.index'))

# 移除 admin_login, admin_logout, admin_auto_logout 路由，因为不再维持登录状态

@main.route('/api/strings', methods=['GET'])
def api_get_strings():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '').strip()
    
    if search:
        items = store.search_strings(search)
        total = len(items)
        items = items[(page-1)*store.ITEMS_PER_PAGE:page*store.ITEMS_PER_PAGE]
    else:
        items, total = store.get_all_strings(page)
    
    return jsonify({
        'items': items,
        'total': total,
        'page': page,
        'total_pages': math.ceil(total / store.ITEMS_PER_PAGE)
    })

@main.route('/api/string/<key>', methods=['GET'])
def api_get_string(key):
    item = store.get_string(key)
    if item:
        return jsonify({'success': True, 'data': item})
    return jsonify({'success': False, 'error': '字符串不存在'}), 404

@main.route('/api/string', methods=['POST'])
def api_add_string():
    data = request.get_json()
    if not data or 'key' not in data or 'value' not in data:
        return jsonify({'success': False, 'error': '缺少必要参数'}), 400
    
    key = data['key'].strip()
    value = data['value'].strip()
    
    if store.add_string(key, value):
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': '添加失败'}), 400

@main.route('/api/string/<key>', methods=['DELETE'])
def api_delete_string(key):
    if store.delete_string(key):
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': '删除失败'}), 404

@main.route('/api/strings/<string:key>/tags', methods=['POST'])
def add_tag(key):
    data = request.get_json()
    tag = data.get('tag', '').strip()
    if not tag:
        return jsonify({'success': False, 'error': '标签不能为空'}), 400
    
    if store.add_tag(key, tag):
        return jsonify({'success': True, 'message': '标签添加成功'})
    return jsonify({'success': False, 'error': '添加失败或标签已存在'}), 400

@main.route('/api/strings/<string:key>/tags/<string:tag>', methods=['DELETE'])
def delete_tag(key, tag):
    if store.delete_tag(key, tag):
        return jsonify({'success': True, 'message': i18n.translate('tag_delete_success')})
    return jsonify({'success': False, 'error': i18n.translate('tag_delete_failed')}), 404

@main.route('/set_language/<language>')
def set_language(language):
    """设置语言"""
    if i18n.set_language(language):
        flash(i18n.translate('language_switch_success'), 'success')
    else:
        flash(i18n.translate('language_switch_failed'), 'error')
    
    # 返回到之前的页面
    return redirect(request.referrer or url_for('main.index'))
