// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// 允许来自指定域名的请求
const allowedOrigins = [
  'https://astounding-torrone-4d2305.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // 允许无 origin 的请求 (如 Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 使用率限制中间件
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 50, // 每个 IP 最多 50 个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(limiter);

// AI 图像生成端点
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, styleOptions } = req.body;

    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // 构建提示词
    let enhancedPrompt = prompt;

    // 添加风格选项
    if (styleOptions) {
      if (styleOptions.style && styleOptions.style !== 'none') {
        enhancedPrompt += `, ${styleOptions.style} style`;
      }

      if (styleOptions.color && styleOptions.color !== 'none') {
        enhancedPrompt += `, ${styleOptions.color} colors`;
      }

      if (styleOptions.lighting && styleOptions.lighting !== 'none') {
        enhancedPrompt += `, ${styleOptions.lighting} lighting`;
      }

      if (styleOptions.composition && styleOptions.composition !== 'none') {
        enhancedPrompt += `, ${styleOptions.composition} composition`;
      }

      if (styleOptions.quality) {
        enhancedPrompt += `, high quality, detailed, 8k resolution`;
      }
    }

    // 调用 Stability AI API
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: enhancedPrompt, weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      images: response.data.artifacts
    });
  } catch (error) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate image',
      message: error.response ? error.response.data.message : error.message
    });
  }
});

// 图像到提示词端点
app.post('/api/image-to-prompt', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image is required'
      });
    }

    // 调用 OpenAI GPT-4 Vision API 进行图像分析
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and create a detailed prompt that could be used to generate a similar image with an AI image generator. Focus on subject, style, composition, colors, and mood. Be specific but concise."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.json({
      success: true,
      prompt: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error analyzing image:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image',
      message: error.response ? error.response.data.message : error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
