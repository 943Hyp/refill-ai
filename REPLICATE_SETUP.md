# Replicate AI 集成设置指南

## 🚀 快速开始

### 1. 获取 Replicate API Token

1. 访问 [Replicate.com](https://replicate.com)
2. 注册账户并登录
3. 前往 [API Tokens 页面](https://replicate.com/account/api-tokens)
4. 创建新的 API Token
5. 复制生成的 Token（格式类似：`r8_xxx...`）

### 2. 配置环境变量

在项目根目录的 `.env.local` 文件中，将 `XXXXXXXX` 替换为您的真实 API Token：

```env
# Replicate API Configuration
REPLICATE_API_TOKEN=r8_your_actual_token_here
```

### 3. 重启开发服务器

```bash
npm run dev
```

## 🎯 支持的模型

### 图像生成模型

#### 1. **FLUX SCHNELL** (主要模型) ⭐
- **模型**: `black-forest-labs/flux-schnell`
- **特点**: 最先进的开源文生图模型，速度快，质量高
- **优势**: 
  - 生成速度快
  - 图像质量优秀
  - 支持多种宽高比
  - 输出 WebP 格式，文件更小

#### 2. **SDXL** (备用模型)
- **模型**: `stability-ai/sdxl`
- **特点**: 稳定可靠的通用模型
- **适合**: 各种风格的图像生成

#### 3. **Anything v3.0** (动漫风格)
- **模型**: `cjwbw/anything-v3.0`
- **特点**: 专门优化的动漫风格模型
- **适合**: 动漫、卡通风格图像

### 图像分析模型

#### 1. **BLIP** (主要模型) ⭐
- **模型**: `salesforce/blip`
- **运行次数**: 161M+ (最受欢迎)
- **功能**: 图像标题生成和描述
- **适合**: 基础图像分析、内容识别

#### 2. **CLIP Interrogator** (艺术分析)
- **模型**: `pharmapsychotic/clip-interrogator`
- **功能**: 专门生成 AI 绘画提示词
- **适合**: 反向工程提示词、艺术风格分析

#### 3. **Moondream** (轻量级)
- **模型**: `vikhyatk/moondream2`
- **功能**: 快速图像理解
- **适合**: 实时分析、快速响应

## 🔄 智能回退机制

### 图像生成
1. **首选**: FLUX SCHNELL (最新最强)
2. **备用**: SDXL 或 Anything v3.0
3. **最终**: 模拟模式 (Unsplash 图片)

### 图像分析
1. **艺术/创意分析**: CLIP Interrogator
2. **基础分析**: BLIP
3. **备用**: BLIP (简化模式)
4. **最终**: 模拟模式

## 💰 费用说明

### Replicate 定价（参考）
- **FLUX SCHNELL**: 约 $0.003 每张图片 (快速高质量)
- **SDXL**: 约 $0.0023 每张图片
- **BLIP 分析**: 约 $0.0005 每次分析
- **CLIP Interrogator**: 约 $0.001 每次分析

### 预估月费用
- **1000 张图片生成**: $3-5
- **1000 次图像分析**: $0.5-1
- **总计**: 约 $3.5-6/月

## 🎨 功能特性

### 图像生成
- ✅ 多种艺术风格 (数字艺术、水彩、油画、素描等)
- ✅ 质量等级 (标准、高质量、超高清)
- ✅ 多种宽高比 (1:1, 16:9, 9:16, 4:3, 3:2)
- ✅ 智能提示词增强
- ✅ WebP 格式输出 (更小文件)

### 图像分析
- ✅ 多种分析类型 (详细、简单、艺术、创意、技术)
- ✅ 智能模型选择
- ✅ 提示词生成优化
- ✅ 支持多种图像格式

## 🚀 使用示例

### 图像生成
```javascript
const result = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "一只可爱的小猫在花园里",
    style: "anime",
    quality: "high",
    aspectRatio: "1:1"
  })
});
```

### 图像分析
```javascript
const result = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageData: "data:image/jpeg;base64,/9j/4AAQ...",
    analysisType: "creative"
  })
});
```

## 🔧 故障排除

### 常见问题
1. **API Token 无效**: 检查 `.env.local` 文件中的 Token 格式
2. **模型加载失败**: 网络问题，会自动回退到备用模型
3. **生成速度慢**: FLUX SCHNELL 通常很快，如果慢可能在使用备用模型

### 调试技巧
- 查看浏览器控制台的日志
- 检查 API 响应中的 `model` 字段，了解使用了哪个模型
- 使用 `enhancedPrompt` 字段查看实际发送给模型的提示词

## 📈 性能优化建议

1. **提示词优化**: 使用具体、详细的描述
2. **合理选择质量**: 标准质量通常足够，超高清仅在必要时使用
3. **批量处理**: 避免同时发送大量请求
4. **缓存利用**: 相同参数的请求会使用缓存结果

---

🎉 现在您可以享受最先进的 AI 图像生成和分析功能了！ 