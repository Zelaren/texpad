# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React + TypeScript + Vite 的图文图表制作工具，提供富文本编辑和图表插入功能。

## 核心架构

### 技术栈
- **前端框架**: React 19.1.1 + TypeScript 5.8.3
- **构建工具**: Vite 7.1.6
- **样式**: Tailwind CSS 4.1.13
- **编辑器**: Quill 2.0.3
- **图表库**: AntV G2 4.2.12
- **状态管理**: Zustand 5.0.3
- **国际化**: i18next 25.5.2
- **路由**: React Router DOM 7.5.0
- **AI 集成**: OpenAI 5.21.0 (预留)

### 项目结构
```
src/
├── components/
│   ├── MainContent.tsx      # 主要编辑器组件，包含工具栏和编辑区域
│   └── G2ChartComponent.tsx # 图表渲染组件
├── utils/
│   └── ChartBlot.tsx        # Quill 自定义图表格式支持
├── App.tsx                  # 应用主入口，包含顶部导航栏
└── main.tsx                 # React 渲染入口
```

### 核心功能模块

1. **富文本编辑器** (MainContent.tsx)
   - 基于 Quill 的富文本编辑器
   - 自定义工具栏（标题、粗体、斜体、列表等）
   - 智能工具栏显示逻辑
   - 行高对齐系统（30px 间隔）
   - 图片上传和插入功能

2. **图表系统** (ChartBlot.tsx + G2ChartComponent.tsx)
   - 自定义 Quill Blot 格式支持图表插入
   - AntV G2 图表渲染组件
   - 支持多种图表类型和配置

3. **文档管理** (App.tsx)
   - 新建文档功能
   - HTML 格式导出功能
   - 响应式界面布局

## 开发命令

### 常用命令
```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

### 开发流程
1. 启动开发服务器：`npm run dev`
2. 代码修改后自动热重载
3. 提交前运行 `npm run lint` 检查代码
4. 构建前会自动执行 TypeScript 编译检查

## 代码风格和约定

### TypeScript 配置
- 严格模式启用（strict: true）
- 未使用变量和参数检查
- ES2022 目标版本
- React JSX 转换

### ESLint 配置
- TypeScript ESLint 规则
- React Hooks 规则
- React Refresh 规则（用于开发时热重载）

### 样式约定
- 使用 Tailwind CSS 进行样式管理
- 组件类名使用 kebab-case
- 响应式设计优先

### 组件约定
- 使用 TypeScript 函数组件
- Props 接口命名：`ComponentNameProps`
- 使用 React.FC 类型注解
- 自定义 Hook 使用 `use` 前缀

## 关键实现细节

### 编辑器初始化
- 在 `MainContent` 组件中管理 Quill 实例
- 禁用默认工具栏，使用自定义工具栏
- 注册自定义图表格式 (ChartBlot)

### 工具栏逻辑
- 根据光标位置智能显示/隐藏工具栏
- 支持行首检测和空行检测
- 格式化按钮切换状态管理

### 图表插入
- 通过 Quill 的 insertEmbed 方法插入图表
- 图表配置作为 embed data 传递
- 使用 AntV G2 进行图表渲染

### 行高对齐系统
- 30px 固定行高
- 动态生成对齐线
- 鼠标位置跟踪和行号计算

## 开发注意事项

1. **Quill 集成**：所有 Quill 相关的操作都需要检查实例是否存在
2. **状态管理**：使用 useRef 管理 Quill 实例，避免重复创建
3. **性能优化**：大文档内容需要考虑虚拟化渲染（已配置 react-virtuoso）
4. **国际化**：项目预留了 i18next 配置，当前为中文界面
5. **AI 功能**：OpenAI 集成已配置但功能未实现，预留扩展点

## 文件修改模式

- **主要编辑器逻辑**：`src/components/MainContent.tsx`
- **图表相关**：`src/utils/ChartBlot.tsx` 和 `src/components/G2ChartComponent.tsx`
- **应用结构**：`src/App.tsx`
- **样式和主题**：通过 Tailwind CSS 类管理，无需额外 CSS 文件