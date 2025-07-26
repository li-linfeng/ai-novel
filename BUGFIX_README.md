# 修复说明

## 问题分析
原始错误 `response.data.map is not a function` 的原因是：
1. 后端返回格式为 `{code: 200, data: [...]}` 而不是预期的 `{success: true, data: [...]}`
2. 项目配置接口返回的字段名是 `genr` 而不是 `genres`

## 修复内容

### 1. API响应格式适配 (`lib/api.ts`)
- 添加了 `BackendResponse` 接口来定义后端实际响应格式
- 修改 `request` 函数将后端 `{code: 200, data: [...]}` 格式转换为前端统一的 `{success: true, data: [...]}` 格式
- 更新 `Project` 接口，将 `id` 类型改为 `number` 以匹配后端返回

### 2. 项目配置接口修复 (`components/create-project-dialog.tsx`)
- 修改题材字段从 `genres` 改为 `genr`
- 更新默认题材列表为后端提供的新题材：
  ```
  ["玄幻", "仙侠", "武侠", "都市", "现实", "军事", "历史", "游戏", "体育", "科幻", "悬疑", "轻小说", "同人"]
  ```

### 3. 数据转换优化 (`app/page.tsx`)
- 在 `fetchProjects` 函数中正确转换后端数据格式到前端格式
- 将数字 `id` 转换为字符串便于前端使用
- 转换字段名：`current_step` → `currentStep`, `word_count` → `wordCount` 等

### 4. 文档更新 (`API_README.md`)
- 更新所有接口文档以反映实际的后端响应格式
- 修正项目配置接口的响应格式

## 测试要点

1. **项目列表加载**：确保页面初始化时能正确从API获取并显示项目列表
2. **创建项目弹窗**：确保点击"新建项目"时能正确获取题材选项
3. **项目创建**：确保填写表单后能成功创建项目并刷新列表
4. **错误处理**：确保API调用失败时使用默认数据作为后备

## 主要改动文件
- `lib/api.ts` - API工具函数和类型定义
- `components/create-project-dialog.tsx` - 创建项目弹窗组件  
- `app/page.tsx` - 主页面数据处理
- `API_README.md` - API文档更新
