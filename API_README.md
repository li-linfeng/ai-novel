# AI小说创作平台 - API配置

## 后端接口配置

### 基本信息
- 后端服务地址：`http://127.0.0.1:9502`
- 前端代理配置：开发环境使用 `/api` 路径代理到后端服务

### API接口列表

#### 1. 获取项目列表
- **接口地址**: `GET /projects`
- **描述**: 获取用户的所有项目列表
- **响应格式**:
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "时空守护者",
      "genre": "科幻",
      "status": "in-progress",
      "current_step": "writing",
      "progress": 65,
      "word_count": 45000,
      "target_words": 250000,
      "description": "一个人穿越回过去呀",
      "completed_steps": [
        "creative",
        "synopsis",
        "outline",
        "chapters"
      ],
      "created_at": "2025-07-26 22:04:36",
      "updated_at": "2025-07-26 22:19:27",
      "last_modified": "2025-07-26 22:19:27"
    }
  ]
}
```

#### 2. 获取项目配置
- **接口地址**: `GET /projects/create`
- **描述**: 获取创建项目时需要的配置选项（如题材列表）
- **响应格式**:
```json
{
  "code": 200,
  "data": {
    "genr": [
      "玄幻",
      "仙侠", 
      "武侠",
      "都市",
      "现实",
      "军事",
      "历史",
      "游戏",
      "体育",
      "科幻",
      "悬疑",
      "轻小说",
      "同人"
    ]
  }
}
```

#### 3. 创建项目
- **接口地址**: `POST /projects`
- **描述**: 创建新的项目
- **请求参数**:
```json
{
  "title": "string",
  "genre": "string", 
  "target_words": "number",
  "description": "string (optional)"
}
```
- **响应格式**:
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "择天记",
    "genre": "重生",
    "status": "draft",
    "current_step": "creative",
    "progress": 0,
    "word_count": 0,
    "target_words": 1000000,
    "description": null,
    "completed_steps": [],
    "created_at": "2025-07-26 14:21:21",
    "updated_at": "2025-07-26 14:21:21",
    "last_modified": "2025-07-26 14:21:21"
  }
}
```

### 代理配置

在 `next.config.mjs` 中配置了开发环境的API代理：

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://127.0.0.1:9502/:path*',
    },
  ]
}
```

### 使用方法

1. 启动后端服务在 `http://127.0.0.1:9502`
2. 启动前端开发服务 `npm run dev`
3. 前端会自动通过 `/api` 路径代理请求到后端服务
4. API请求会自动处理跨域问题

### 文件结构

- `lib/config.ts` - API配置文件
- `lib/api.ts` - API请求工具函数
- `components/create-project-dialog.tsx` - 创建项目弹窗组件
- `app/page.tsx` - 主页面，包含项目列表和创建功能
