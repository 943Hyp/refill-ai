# Refill AI - 免费AI图像生成平台

🎨 **完全免费** | 🚀 **无需注册** | ⚡ **即刻开始**

Refill AI 是一个现代化的AI图像生成平台，致力于为所有用户提供免费、便捷的AI创作工具。

## ✨ 主要特性

### 🎨 AI图像生成
- **文字转图像**: 输入描述，AI为您生成精美图像
- **多种风格**: 支持写实、动漫、油画、水彩等10+艺术风格
- **多种质量**: 标准、高质量、超高清三种质量选项
- **多种比例**: 正方形、宽屏、竖屏等5种画面比例

### 🔍 图像智能分析
- **图像转文字**: 上传图片，AI生成详细描述
- **多种分析模式**: 详细描述、简单描述、艺术风格、技术参数
- **支持多格式**: JPG、PNG、GIF、WebP等常见格式
- **文件大小限制**: 最大支持10MB文件

### 📝 提示词系统
- **丰富模板**: 精选提示词模板，快速上手
- **智能优化**: AI自动优化提示词，提升生成效果
- **分类管理**: 按风格、主题分类的模板库
- **一键应用**: 模板一键应用到生成器

### 📚 历史记录
- **本地存储**: 所有记录仅存储在浏览器本地
- **智能搜索**: 支持按提示词、风格搜索历史
- **批量操作**: 支持批量删除、导出功能
- **隐私保护**: 关闭页面自动清除所有数据

### 🌐 用户体验
- **响应式设计**: 完美适配桌面端和移动端
- **多语言支持**: 中文/英文双语界面
- **主题切换**: 明亮/暗黑/系统主题
- **键盘快捷键**: 提升操作效率
- **PWA支持**: 可安装为桌面应用

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/refill-ai.git
cd refill-ai
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 生产部署

1. **构建项目**
```bash
npm run build
# 或
yarn build
```

2. **启动生产服务器**
```bash
npm start
# 或
yarn start
```

## 🔧 技术栈

### 前端框架
- **Next.js 15**: React全栈框架
- **React 18**: 用户界面库
- **TypeScript**: 类型安全的JavaScript

### UI组件
- **Tailwind CSS**: 原子化CSS框架
- **Shadcn/ui**: 现代化组件库
- **Radix UI**: 无障碍组件基础库

### 状态管理
- **React Hooks**: 内置状态管理
- **Local Storage**: 本地数据持久化

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Turbopack**: 快速构建工具

## 📁 项目结构

```
refill-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React组件
│   │   ├── auth/              # 认证相关组件
│   │   ├── layout/            # 布局组件
│   │   ├── sections/          # 页面区块组件
│   │   ├── ui/                # UI基础组件
│   │   ├── ImageGenerator.tsx # 图像生成器
│   │   ├── ImageToPrompt.tsx  # 图像分析器
│   │   ├── HistoryView.tsx    # 历史记录
│   │   └── PromptTemplates.tsx# 提示词模板
│   ├── contexts/              # React上下文
│   ├── lib/                   # 工具库
│   │   ├── api.ts            # API接口
│   │   ├── i18n.ts           # 国际化
│   │   └── utils.ts          # 工具函数
│   └── types/                 # TypeScript类型定义
├── public/                    # 静态资源
│   ├── manifest.json         # PWA配置
│   ├── sw.js                 # Service Worker
│   └── icons/                # 应用图标
├── server.js                 # Express后端服务器
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 🔌 API集成

### 必需的API服务

1. **Stability AI** (推荐)
   - 用途: AI图像生成
   - 成本: ~$0.02-0.05/张
   - 申请: [stability.ai](https://stability.ai)

2. **OpenAI GPT-4 Vision**
   - 用途: 图像分析
   - 成本: ~$0.01-0.03/次
   - 申请: [openai.com](https://openai.com)

### 可选的API服务

3. **OpenAI GPT-4**
   - 用途: 提示词优化
   - 成本: ~$0.01/次

4. **Cloudinary**
   - 用途: 图像存储和处理
   - 免费额度: 25GB存储

### 环境变量配置

创建 `.env.local` 文件：

```env
# Stability AI
STABILITY_API_KEY=your_stability_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Cloudinary (可选)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 PWA支持

Refill AI 支持 Progressive Web App (PWA) 功能：

- **离线访问**: 基础功能离线可用
- **桌面安装**: 可安装为桌面应用
- **推送通知**: 支持浏览器推送
- **自动更新**: 应用自动更新

### 安装为桌面应用

1. 在支持的浏览器中访问网站
2. 点击地址栏的"安装"图标
3. 确认安装到桌面

## 🎯 核心功能

### 免费使用策略
- **完全免费**: 所有核心功能永久免费
- **无需注册**: 直接使用，无需创建账号
- **无限制**: 不限制生成次数和使用时间
- **隐私保护**: 数据仅存储在用户本地

### 用户体验优化
- **快速响应**: 优化的加载和生成速度
- **错误处理**: 完善的错误提示和重试机制
- **进度反馈**: 实时显示生成进度
- **批量操作**: 支持批量下载和管理

## 🔒 隐私与安全

### 数据保护
- **本地存储**: 所有用户数据仅存储在浏览器本地
- **自动清除**: 关闭页面时自动清除所有数据
- **无追踪**: 不收集用户个人信息
- **HTTPS**: 全站HTTPS加密传输

### 内容安全
- **内容过滤**: 自动过滤不当内容
- **使用条款**: 明确的使用规范
- **举报机制**: 用户可举报不当内容

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. **Fork项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

### 开发规范
- 遵循TypeScript类型安全
- 使用ESLint和Prettier格式化代码
- 编写清晰的提交信息
- 添加必要的测试用例

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持与反馈

### 获取帮助
- **GitHub Issues**: [提交问题](https://github.com/your-username/refill-ai/issues)
- **邮件联系**: contact@refill-ai.com
- **社区讨论**: [GitHub Discussions](https://github.com/your-username/refill-ai/discussions)

### 常见问题
查看我们的 [FAQ页面](https://refill-ai.com/#faq) 获取常见问题解答。

## 🎉 致谢

感谢以下开源项目和服务：
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Shadcn/ui](https://ui.shadcn.com/) - 组件库
- [Stability AI](https://stability.ai/) - AI图像生成
- [OpenAI](https://openai.com/) - AI语言模型

---

<div align="center">
  <p>🎨 让创意无限绽放 | Made with ❤️ by Refill AI Team</p>
  <p>
    <a href="https://refill-ai.com">官网</a> •
    <a href="https://github.com/your-username/refill-ai">GitHub</a> •
    <a href="https://twitter.com/refill_ai">Twitter</a>
  </p>
</div>
