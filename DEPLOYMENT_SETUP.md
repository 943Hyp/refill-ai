# 部署设置说明

## 环境变量配置

为了让图片生成功能正常工作，需要在部署平台设置以下环境变量：

```
REPLICATE_API_TOKEN=your-replicate-api-token-here
```

## 获取 Replicate API Token

1. 访问 [Replicate](https://replicate.com)
2. 注册/登录账户
3. 前往 [API Tokens](https://replicate.com/account/api-tokens)
4. 创建新的API Token
5. 复制Token并设置为环境变量

## 部署平台设置

### Vercel
1. 在项目设置中找到 "Environment Variables"
2. 添加 `REPLICATE_API_TOKEN` 变量
3. 重新部署项目

### Netlify
1. 在项目设置中找到 "Environment variables"
2. 添加 `REPLICATE_API_TOKEN` 变量
3. 重新部署项目

### 其他平台
请参考相应平台的环境变量设置文档。

## 功能说明

- 使用 FLUX SCHNELL 模型进行图像生成
- 支持多种艺术风格
- 支持不同质量和画面比例
- 自动回退到备用模型（如果主模型失败） 