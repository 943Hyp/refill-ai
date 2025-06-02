# Refill AI - AI图像生成器

基于raphael.app克隆的AI图像生成网站，支持文本转图像和图像转提示词功能。

## 🌟 功能特性

- ✨ **AI图像生成**: 基于Stability AI的Stable Diffusion XL模型
- 🖼️ **图像分析**: 使用OpenAI GPT-4 Vision分析图像并生成提示词
- 🎨 **多样式选项**: 支持多种艺术风格、色彩、光照和构图选项
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 💾 **本地历史**: 自动保存生成历史记录
- 🎯 **一键生成**: 点击示例图片自动填充提示词

## 🚀 快速开始

### 本地运行

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd raphael-clone
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   bun install
   ```

3. **配置环境变量**
   ```bash
   cp .env .env.local
   ```

   编辑 `.env.local` 文件：
   ```env
   STABILITY_API_KEY=你的Stability AI密钥
   OPENAI_API_KEY=你的OpenAI密钥
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

   访问 http://localhost:3000

### 生产部署

详细部署指南请查看 [deployment-guide.md](./deployment-guide.md)

#### 快速部署到Netlify
1. 将项目推送到GitHub
2. 在Netlify连接GitHub仓库
3. 配置环境变量
4. 自动部署完成

## 🛠️ 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **UI库**: Tailwind CSS, shadcn/ui
- **构建工具**: Bun
- **部署**: Netlify Functions
- **AI服务**: Stability AI, OpenAI

## 📁 项目结构

```
raphael-clone/
├── src/
│   ├── app/                 # Next.js应用目录
│   ├── components/          # React组件
│   │   ├── hero/           # 主要功能组件
│   │   ├── gallery/        # 图库组件
│   │   ├── ui/             # UI基础组件
│   │   └── ...
│   └── lib/                # 工具函数和API
├── public/                 # 静态资源
├── netlify/               # Netlify函数
│   └── functions/         # API端点
├── deployment-guide.md    # 部署指南
└── ...配置文件
```

## 🔧 API配置

### 获取Stability AI密钥
1. 访问 https://platform.stability.ai/
2. 注册并创建API密钥
3. 充值账户（按使用量付费）

### 获取OpenAI密钥
1. 访问 https://platform.openai.com/
2. 注册并创建API密钥
3. 确保有GPT-4 Vision的访问权限

## 💰 成本估算

- **图像生成**: ~$0.02/张
- **图像分析**: ~$0.01/次
- **托管**: Netlify免费tier（100GB/月）
- **域名**: $10-15/年（可选）

## 🎨 自定义配置

### 修改网站信息
编辑 `src/components/` 下的相关组件文件修改：
- 网站标题和描述
- Logo和品牌颜色
- 示例图片和提示词

### 添加新功能
- 用户账户系统
- 云端存储
- 社区分享功能
- 高级编辑工具

## 📄 许可证

本项目仅供学习和参考使用。请遵守：
- Stability AI使用条款
- OpenAI使用条款
- 相关版权法律法规

## 🆘 故障排除

### 常见问题
1. **API调用失败**: 检查API密钥和网络连接
2. **构建错误**: 确保Node.js版本 >= 16
3. **样式问题**: 清除浏览器缓存并重新加载

### 获取帮助
- 查看deployment-guide.md获取详细部署说明
- 检查浏览器控制台的错误信息
- 确认API服务状态和余额

---

🚀 **开始创建您的AI艺术作品吧！**
