# AI小说创作平台 - 项目文档

## 项目概述

AI小说创作平台是一个基于Web技术的智能小说创作工具，采用现代化的设计理念和AI辅助技术，为作者提供从创意构思到成品输出的完整创作流程支持。

## 核心功能

### 1. 项目管理系统

- **项目仪表板**：直观展示所有创作项目
- **项目状态跟踪**：草稿、进行中、已完成、已暂停
- **进度可视化**：字数统计、完成度展示
- **搜索与筛选**：快速定位目标项目


### 2. 五步创作流程

#### 创意输入

- **基本设定**：题材类型、写作风格、目标字数、目标读者
- **创作想法**：核心概念、主要角色、故事背景、灵感来源
- **创作助手**：灵感生成器、题材推荐、角色生成器
- **热门标签**：快速选择流行元素


#### 故事梗概

- **AI生成梗概**：基于创意输入生成多个故事梗概
- **梗概对比**：并排展示不同版本供选择
- **生成控制**：调整创意程度、复杂程度、生成数量
- **自定义编辑**：手动修改和完善梗概


#### 大纲制作

- **三幕式结构**：经典的故事结构框架
- **情节点规划**：关键剧情节点的详细规划
- **角色关系图**：主要角色及其关系展示
- **世界设定**：故事背景和设定管理


#### 卷纲规划

- **章节管理**：添加、编辑、排序章节
- **详细卷纲**：每章的场景、角色、情节、伏笔
- **进度跟踪**：章节完成状态和字数统计
- **批量操作**：批量生成和管理章节


#### ️ 章节创作

- **富文本编辑器**：专业的文本编辑功能
- **AI写作助手**：续写建议、改写润色
- **版本控制**：章节历史版本管理
- **实时统计**：字数、段落、写作时长统计


### 3. 辅助功能模块

#### 灵感管理系统

- **灵感收集**：记录创作灵感和想法
- **分类管理**：按类型、标签组织灵感
- **搜索功能**：快速查找相关灵感
- **项目关联**：将灵感与具体项目关联


#### 写作分析

- **数据统计**：总字数、写作时长、效率分析
- **目标管理**：日、周、月写作目标设定
- **习惯分析**：写作时间、心情状态统计
- **成就系统**：写作里程碑和成就解锁


#### 快速笔记

- **便签式笔记**：快速记录想法
- **颜色分类**：不同颜色区分笔记类型
- **置顶功能**：重要笔记置顶显示
- **项目关联**：笔记与项目的关联管理


#### 专注模式

- **番茄钟计时**：专注时间管理
- **字数目标**：设定写作字数目标
- **干扰屏蔽**：专注写作环境
- **进度提醒**：实时进度反馈


#### 导出功能

- **多格式导出**：支持多种文件格式
- **进度显示**：导出进度实时反馈
- **批量导出**：支持批量导出操作
- **自定义设置**：导出参数自定义


#### 版本历史

- **自动保存**：定时自动保存版本
- **版本对比**：不同版本内容对比
- **一键恢复**：快速恢复到历史版本
- **版本标注**：为版本添加说明标记


## ️ 技术架构

### 前端技术栈

```plaintext
├── Next.js 14 (App Router)     # React全栈框架
├── TypeScript                  # 类型安全
├── Tailwind CSS               # 样式框架
├── shadcn/ui                  # UI组件库
├── Lucide React               # 图标库
└── React Hooks                # 状态管理
```

### 组件架构

```plaintext
src/
├── app/                       # Next.js App Router
│   ├── page.tsx              # 主页面
│   ├── layout.tsx            # 布局组件
│   └── loading.tsx           # 加载组件
├── components/               # 可复用组件
│   ├── ui/                   # shadcn/ui基础组件
│   ├── inspiration-manager.tsx
│   ├── writing-analytics.tsx
│   ├── quick-notes.tsx
│   ├── focus-mode.tsx
│   ├── export-dialog.tsx
│   ├── version-history.tsx
│   └── rich-text-editor.tsx
└── lib/                      # 工具函数
    └── utils.ts
```

### 数据结构

```typescript
// 项目数据模型
interface Project {
  id: string
  title: string
  genre: string
  status: ProjectStatus
  currentStep: Step
  progress: number
  wordCount: number
  targetWords: number
  lastModified: string
  createdAt: string
  completedSteps: Step[]
}

// 创作步骤
type Step = "creative" | "synopsis" | "outline" | "chapters" | "writing"

// 项目状态
type ProjectStatus = "draft" | "in-progress" | "completed" | "paused"
```

## 设计风格

### 视觉设计原则

- **简洁现代**：采用现代扁平化设计风格
- **专业优雅**：适合专业创作者使用的界面
- **功能导向**：界面设计服务于功能需求
- **一致性**：统一的视觉语言和交互模式


### 色彩系统

```css
/* 主色调 */
--primary: 蓝色系 (#2563eb, #1d4ed8, #1e40af)
--secondary: 灰色系 (#6b7280, #4b5563, #374151)

/* 状态色彩 */
--success: 绿色 (#10b981, #059669)
--warning: 黄色 (#f59e0b, #d97706)
--error: 红色 (#ef4444, #dc2626)

/* 背景色彩 */
--background: 渐变背景 (slate-50 to blue-50)
--surface: 白色 (#ffffff)
--muted: 浅灰 (#f8fafc, #f1f5f9)
```

### 字体系统

```css
/* 中文字体栈 */
font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif

/* 字体大小层级 */
--text-xs: 0.75rem     /* 12px */
--text-sm: 0.875rem    /* 14px */
--text-base: 1rem      /* 16px */
--text-lg: 1.125rem    /* 18px */
--text-xl: 1.25rem     /* 20px */
--text-2xl: 1.5rem     /* 24px */
--text-3xl: 1.875rem   /* 30px */
```

### 间距系统

```css
/* Tailwind CSS 间距标准 */
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
```

## ️ UI标准

### 组件规范

#### 按钮 (Button)

```typescript
// 主要按钮
<Button className="bg-blue-600 hover:bg-blue-700">
  主要操作
</Button>

// 次要按钮
<Button variant="outline">
  次要操作
</Button>

// 图标按钮
<Button variant="ghost" size="sm">
  <Icon className="h-4 w-4" />
</Button>
```

#### 卡片 (Card)

```typescript
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述</CardDescription>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
</Card>
```

#### 表单控件

```typescript
// 输入框
<Input placeholder="请输入..." className="focus:ring-2 focus:ring-blue-500" />

// 选择器
<Select>
  <SelectTrigger>
    <SelectValue placeholder="请选择..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">选项1</SelectItem>
  </SelectContent>
</Select>

// 文本域
<Textarea placeholder="请输入..." className="min-h-[100px]" />
```

### 布局规范

#### 页面布局

```typescript
// 标准页面结构
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    {/* 页面头部 */}
  </header>
  <main className="flex-1 p-6">
    <div className="max-w-6xl mx-auto">
      {/* 主要内容 */}
    </div>
  </main>
</div>
```

#### 网格系统

```typescript
// 响应式网格
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 网格项目 */}
</div>

// 侧边栏布局
<div className="flex h-screen">
  <aside className="w-72 bg-white border-r">
    {/* 侧边栏 */}
  </aside>
  <main className="flex-1">
    {/* 主内容 */}
  </main>
</div>
```

### 交互规范

#### 悬停效果

```css
/* 卡片悬停 */
.card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 按钮悬停 */
.button:hover {
  background-color: var(--primary-dark);
  transition: background-color 0.2s ease;
}
```

#### 状态反馈

```typescript
// 加载状态
<Button disabled={isLoading}>
  {isLoading ? "处理中..." : "提交"}
</Button>

// 成功状态
<Badge className="bg-green-100 text-green-800">
  已完成
</Badge>

// 进度指示
<Progress value={progress} className="w-full h-2" />
```

## 响应式设计

### 断点系统

```css
/* Tailwind CSS 断点 */
sm: 640px   /* 小屏幕 */
md: 768px   /* 中等屏幕 */
lg: 1024px  /* 大屏幕 */
xl: 1280px  /* 超大屏幕 */
2xl: 1536px /* 超超大屏幕 */
```

### 适配策略

- **移动优先**：从小屏幕开始设计，逐步适配大屏幕
- **弹性布局**：使用Flexbox和Grid实现自适应布局
- **内容优先**：确保核心功能在所有设备上可用
- **触摸友好**：按钮和交互区域适合触摸操作


## 开发环境

### 环境要求

```json
{
  "node": ">=18.0.0",
  "npm": ">=8.0.0"
}
```

### 安装依赖

```shellscript
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发命令

```shellscript
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 项目配置

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['placeholder.svg'],
  },
}

module.exports = nextConfig
```

## 部署说明

### Vercel部署 (推荐)

1. 连接GitHub仓库
2. 自动检测Next.js项目
3. 一键部署到生产环境


### 桌面应用打包

```shellscript
# 使用Electron打包
npm install -g electron-builder
npm run build
npm run electron:build

# 支持平台
- Windows (exe)
- macOS (dmg)
- Linux (AppImage)
```

## 功能清单

### 已完成功能

- 项目管理系统
- 五步创作流程
- 富文本编辑器
- 版本历史管理
- 灵感管理系统
- 写作分析统计
- 快速笔记功能
- 专注模式
- 响应式设计


### 开发中功能

- AI写作助手集成
- 云端数据同步
- 多人协作功能
- 高级导出选项


### 计划功能

- 移动端应用
- 语音输入功能
- 智能推荐系统
- 社区分享功能


## 贡献指南

### 代码规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier配置
- 组件命名采用PascalCase
- 文件命名采用kebab-case


### 提交规范

```plaintext
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目地址：[GitHub Repository]
- 问题反馈：[Issues]
- 功能建议：[Discussions]


---

**AI小说创作平台** - 让创作更智能，让故事更精彩 ✨