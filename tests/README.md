# 🧪 StringVault Testing Directory | 测试目录

![Testing](https://img.shields.io/badge/Testing-Automated-green.svg)
![Security](https://img.shields.io/badge/Security-Tested-blue.svg)

**English:** This directory contains automated test files and test data for the StringVault project, used to verify system security and functionality.

**中文:** 这个目录包含 StringVault 项目的自动化测试文件和测试数据，用于验证系统的安全性和功能性。

## 📋 Test File Descriptions | 测试文件说明

### 🔒 `test_session_security.py` - Session Security Configuration Test | 会话安全配置测试
**Purpose | 用途**: Verify that the system's session security mechanism is correctly configured | 验证系统的会话安全机制是否正确配置

**Test Content | 测试内容**:
- ✅ **Cache Control Header Validation | 缓存控制头验证** - Ensure responses contain correct cache control headers | 确保响应包含正确的缓存控制头
- ✅ **Login Function Test | 登录功能测试** - Verify administrator login process | 验证管理员登录流程
- ✅ **Session Configuration Check | 会话配置检查** - Verify session timeout and expiration mechanism | 验证会话超时和过期机制
- ✅ **Permission Control Verification | 权限控制验证** - Test permission restrictions after logout | 测试登出后的权限限制
- ✅ **Cookie Security Verification | Cookie安全验证** - Check non-persistent cookie settings | 检查cookies的非持久化设置

**Test Items | 测试项目**:
- Homepage access without login | 未登录状态下的首页访问
- Administrator login process verification | 管理员登录流程验证
- Permission page access after login | 登录后的权限页面访问
- Session configuration parameter verification | 会话配置参数验证
- Administrator logout function | 管理员登出功能
- Permission restriction check after logout | 登出后的权限限制检查

### 📄 `test_update.json` - Test Data File | 测试数据文件
**Purpose | 用途**: Provide simulated data needed during testing | 提供测试过程中需要的模拟数据

**Content | 内容**: Contains JSON format data for testing data processing and storage functions | 包含测试用的JSON格式数据，用于验证数据处理和存储功能

## 🚀 Usage Instructions | 使用方法

### Prerequisites | 前提条件
Ensure StringVault application is running | 确保 StringVault 应用正在运行：
```bash
# Start application in project root directory | 在项目根目录启动应用
python run.py
```

### Run Session Security Test | 运行会话安全测试
```bash
# Enter test directory | 进入测试目录
cd tests

# Run security configuration test | 运行安全配置测试
python test_session_security.py
```

### Expected Output | 预期输出
```
=== Session Security Configuration Test | 会话安全配置测试 ===

1. Test homepage access (not logged in) | 测试访问首页（未登录）...
Status Code | 状态码: 200
Cache-Control | 缓存控制: no-store, no-cache, must-revalidate, private
Pragma | 编译指示: no-cache
Expires | 过期时间: 0
✅ Cache control headers correctly set - prevent caching sensitive data | 缓存控制头正确设置 - 防止缓存敏感数据

2. Test administrator login | 测试管理员登录...
Login status code | 登录状态码: 200

3. Test access to permission-required pages | 测试访问需要权限的页面...
Access status code | 访问状态码: 200

4. Session configuration verification | 会话配置验证...
✅ Session configuration updated | 会话配置已更新:
  - session.permanent = False (expires when browser closes) | 浏览器关闭时过期
  - 30 minutes of inactivity auto-logout | 30分钟无操作自动登出
  - Cache control headers prevent sensitive data caching | 缓存控制头防止敏感数据缓存
  - HTTPOnly cookies prevent XSS attacks | HTTPOnly cookies防止XSS攻击

5. Test administrator logout | 测试管理员登出...
Logout status code | 登出状态码: 200

6. Verify permissions after logout | 验证登出后权限...
Access status code after logout | 登出后访问状态码: 403

=== Test Completed | 测试完成 ===
Session security configuration is active | 会话安全配置已生效:
1. Cookies set to non-persistent (expire when browser closes) | Cookies设置为非持久化（浏览器关闭时过期）
2. 30 minutes of inactivity auto-logout | 30分钟无操作自动登出
3. Response headers add cache control to prevent sensitive data caching | 响应头添加缓存控制防止敏感数据缓存
4. Session timestamp tracking and expiration check | 会话时间戳跟踪和过期检查

## 🔍 Security Verification Points | 安全验证要点

### ✅ Security Configuration Verification | 安全配置验证
- **Non-persistent Cookies | 非持久化Cookies**: Verify `session.permanent = False` setting | 验证 `session.permanent = False` 设置
- **Cache Control | 缓存控制**: Check response headers contain complete security directives | 检查响应头包含完整的安全指令
- **Session Timeout | 会话超时**: Confirm 30 minutes of inactivity auto-logout mechanism | 确认30分钟无操作自动登出机制
- **Permission Control | 权限控制**: Verify unauthorized access is correctly blocked | 验证未授权访问被正确阻止

### ✅ Function Test Verification | 功能测试验证
- **Login Process | 登录流程**: Administrator can normally login to system | 管理员能够正常登录系统
- **Permission Management | 权限管理**: Can access management functions after login | 登录后可以访问管理功能
- **Logout Function | 登出功能**: Permissions are correctly revoked after logout | 登出后权限被正确撤销
- **Data Protection | 数据保护**: Sensitive data will not be cached | 敏感数据不会被缓存

## 🧪 Extended Testing | 扩展测试

### Add New Test Cases | 添加新的测试用例
If you need to add new tests, you can refer to the following template | 如果需要添加新的测试，可以参考以下模板：

```python
def test_new_feature():
    """Test new feature | 测试新功能"""
    base_url = "http://127.0.0.1:5000"
    session = requests.Session()
    
    # Test steps | 测试步骤
    response = session.get(f"{base_url}/your-endpoint")
    
    # Verify results | 验证结果
    assert response.status_code == 200
    print("✅ New feature test passed | 新功能测试通过")
```

### Custom Test Data | 自定义测试数据
Modify `test_update.json` file to test different data scenarios | 修改 `test_update.json` 文件来测试不同的数据场景：

```json
{
  "test_scenario": "custom_test",
  "test_data": {
    "key": "value",
    "expected_result": "success"
  }
}
```

## ⚠️ Notes and Warnings | 注意事项

### Test Environment Requirements | 测试环境要求
- Ensure Flask application runs on default port (5000) | 确保 Flask 应用运行在默认端口 (5000)
- Use default admin password `admin123` for testing | 使用默认管理员密码 `admin123` 进行测试
- Do not close application during testing | 测试过程中不要关闭应用

### Security Warnings | 安全警告
- Test scripts are for development environment only | 测试脚本仅用于开发环境
- Do not run tests in production environment | 不要在生产环境运行测试
- Change default password promptly after testing | 测试完成后及时修改默认密码

### Troubleshooting | 故障排除

#### Connection Failed | 连接失败
If test script cannot connect to application | 如果测试脚本无法连接到应用：
```bash
# Check if application is running | 检查应用是否运行
curl http://127.0.0.1:5000/

# Check if port is occupied | 检查端口是否被占用
netstat -an | grep 5000

# Restart application | 重启应用
python run.py
```

#### Login Failed | 登录失败
If admin login test fails | 如果管理员登录测试失败：
```bash
# Check if default password is correct | 检查默认密码是否正确
python admin_password_tool.py --list

# Reset to default password (if needed) | 重置为默认密码（如果需要）
# Delete admin_passwords.json file, system will automatically recreate | 删除 admin_passwords.json 文件，系统会自动重新创建
```

#### Permission Test Failed | 权限测试失败
If permission control test fails | 如果权限控制测试不通过：
```bash
# Clear browser cache and cookies | 清除浏览器缓存和cookies
# Rerun test script | 重新运行测试脚本
python test_session_security.py
```

## 📊 Test Result Analysis | 测试结果分析

### Success Indicators | 成功指标
- ✅ All test steps show green checkmarks | 所有测试步骤显示绿色勾选
- ✅ Status codes meet expectations (200 for success, 403 for forbidden) | 状态码符合预期（200表示成功，403表示禁止）
- ✅ Cache control headers correctly set | 缓存控制头正确设置
- ✅ Session timeout mechanism working properly | 会话超时机制正常工作
- ✅ Permission control effectively blocking unauthorized access | 权限控制有效阻止未授权访问

### Failure Indicators | 失败指标
- ❌ Red error prompts | 红色错误提示
- ❌ Unexpected status codes | 意外的状态码
- ❌ Missing necessary response headers | 缺少必要的响应头
- ❌ Permission control failure | 权限控制失效

## 🎯 Best Practices | 最佳实践

### Regular Testing | 定期测试
Recommended to run tests in the following situations | 建议在以下情况下运行测试：
- After code modifications | 代码修改后
- After configuration changes | 配置变更后
- Before deploying new versions | 部署新版本前
- After security updates | 安全更新后

### Test Reports | 测试报告
Save test results for tracking | 保存测试结果用于追踪：
```bash
# Save test output | 保存测试输出
python test_session_security.py > security_test_report.txt

# Record test time | 记录测试时间
echo "Test Time | 测试时间: $(date)" >> security_test_report.txt
```

---

**🔒 English:** Security Reminder: Regularly run tests to ensure system security configuration remains effective!

**🔒 中文:** 安全提醒：定期运行测试确保系统安全配置始终有效！

**📞 English:** Technical Support: If tests fail, please check the troubleshooting section or submit an Issue!

**📞 中文:** 技术支持：如果测试失败，请检查故障排除部分或提交Issue！
