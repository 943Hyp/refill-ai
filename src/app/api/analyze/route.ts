import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// 正确初始化 Replicate，如果没有环境变量则使用空字符串
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Replicate 上的图像分析模型
const IMAGE_ANALYSIS_MODELS = {
  // BLIP - 最受欢迎的图像标题生成模型 (161M+ runs)
  blip: 'salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
  
  // CLIP Interrogator - 专门用于生成 AI 绘画提示词
  clipInterrogator: 'pharmapsychotic/clip-interrogator:a4a8bafd6089e1716b06057c42b19378250d008b80fe87caa5cd36d40c1eda90',
};

function getAnalysisPrompt(analysisType: string): string {
  const prompts = {
    'detailed': 'Describe this image in detail, including colors, composition, style, mood, and any notable elements.',
    'simple': 'What do you see in this image?',
    'artistic': 'Analyze this image from an artistic perspective, describing the style, technique, composition, and aesthetic qualities.',
    'creative': 'Create a detailed, creative description of this image that could be used as a prompt for AI art generation.',
    'technical': 'Provide a technical analysis of this image, including composition, lighting, color palette, and techniques used.'
  };
  
  return prompts[analysisType as keyof typeof prompts] || prompts.detailed;
}

export async function POST(request: NextRequest) {
  try {
    const { imageData, analysisType = 'detailed' } = await request.json();

    // 验证必需字段
    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // 检查 API token 是否配置
    if (!process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN.trim() === '' || process.env.REPLICATE_API_TOKEN === 'XXXXXXXX') {
      console.error('Replicate API token not configured:', process.env.REPLICATE_API_TOKEN ? 'Token exists but invalid' : 'Token missing');
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 503 }
      );
    }

    console.log('Analyzing image with Replicate:', { analysisType });

    try {
      let output: unknown;
      let model: string;

      if (analysisType === 'creative' || analysisType === 'artistic') {
        // 使用 CLIP Interrogator 生成艺术风格的提示词
        model = 'CLIP Interrogator';
        output = await replicate.run(IMAGE_ANALYSIS_MODELS.clipInterrogator as `${string}/${string}`, {
          input: {
            image: imageData,
            mode: 'best',
          }
        });
      } else {
        // 使用 BLIP 进行基础图像描述 - 按照官方示例的简化方式
        model = 'BLIP';
        output = await replicate.run(IMAGE_ANALYSIS_MODELS.blip as `${string}/${string}`, {
          input: {
            image: imageData,
            // BLIP 模型的简化调用，不需要 task 和 question 参数
          }
        });
      }

      // 处理不同模型的输出格式
      let prompt: string;
      if (typeof output === 'string') {
        prompt = output;
      } else if (Array.isArray(output) && output.length > 0) {
        // BLIP 返回格式: [{"text": "Caption: ..."}]
        const firstResult = output[0];
        if (typeof firstResult === 'object' && firstResult && 'text' in firstResult) {
          prompt = (firstResult as { text: string }).text;
          // 移除 "Caption: " 前缀
          prompt = prompt.replace(/^Caption:\s*/i, '');
        } else {
          prompt = firstResult as string;
        }
      } else if (output && typeof output === 'object' && 'text' in output) {
        prompt = (output as { text: string }).text.replace(/^Caption:\s*/i, '');
      } else {
        prompt = 'Unable to analyze image - unexpected output format';
      }

      // 根据分析类型增强描述
      if (analysisType === 'creative' && !prompt.includes('masterpiece')) {
        prompt += ', high quality, detailed, masterpiece';
      }

      return NextResponse.json({ 
        prompt,
        model,
        analysisType 
      });

    } catch (primaryError) {
      console.warn('Primary model failed, trying BLIP as fallback:', primaryError);
      
      // 回退到 BLIP 模型的最简单调用
      try {
        const output = await replicate.run(IMAGE_ANALYSIS_MODELS.blip as `${string}/${string}`, {
          input: {
            image: imageData
          }
        });

        let prompt: string;
        if (Array.isArray(output) && output.length > 0) {
          const result = output[0];
          if (typeof result === 'object' && result && 'text' in result) {
            prompt = (result as { text: string }).text.replace(/^Caption:\s*/i, '');
          } else {
            prompt = String(result);
          }
        } else if (typeof output === 'string') {
          prompt = output;
        } else {
          prompt = 'Basic image analysis completed';
        }

        return NextResponse.json({ 
          prompt,
          model: 'BLIP (fallback)',
          analysisType 
        });

      } catch (fallbackError) {
        throw new Error(`Both primary and fallback models failed: ${fallbackError}`);
      }
    }

  } catch (error) {
    console.error('Image analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Image analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 