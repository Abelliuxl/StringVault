from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from app.models import StringStore
import math

main = Blueprint('main', __name__)
store = StringStore()

@main.route('/', methods=['GET'])
def index():
    page = request.args.get('page', 1, type=int)
    search_query = request.args.get('search', '').strip()
    
    if search_query:
        items = store.search_strings(search_query)
        total = len(items)
        items = items[(page-1)*store.ITEMS_PER_PAGE:page*store.ITEMS_PER_PAGE]
    else:
        items, total = store.get_all_strings(page)
    
    total_pages = math.ceil(total / store.ITEMS_PER_PAGE)
    
    return render_template('index.html',
                         items=items,
                         page=page,
                         total_pages=total_pages,
                         search_query=search_query)

@main.route('/add', methods=['POST'])
def add_string():
    key = request.form.get('key', '').strip()
    value = request.form.get('value', '').strip()
    
    if not key or not value:
        flash('键名和值都不能为空', 'error')
        return redirect(url_for('main.index'))
    
    if store.add_string(key, value):
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