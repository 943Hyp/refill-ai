import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// 使用环境变量中的API密钥
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// FLUX SCHNELL 是目前最先进的开源文生图模型之一
const FLUX_SCHNELL_MODEL = "black-forest-labs/flux-schnell";

// 备用模型
const BACKUP_MODELS = {
  sdxl: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
  anime: 'cjwbw/anything-v3.0:09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65',
};

function enhancePromptForStyle(prompt: string, style?: string): string {
  const styleEnhancements = {
    'digital-art': ', digital art, concept art, trending on artstation',
    'watercolor': ', watercolor painting, soft brushstrokes, artistic',
    'oil-painting': ', oil painting, classical art style, rich textures',
    'sketch': ', pencil sketch, hand drawn, artistic sketch',
    'anime': ', anime style, manga art, japanese animation',
    'photorealistic': ', photorealistic, high detail, professional photography',
    '3d-render': ', 3D render, cinema 4d, octane render, high quality',
    'cyberpunk': ', cyberpunk style, neon lights, futuristic, sci-fi',
    'fantasy': ', fantasy art, magical, ethereal, mystical atmosphere',
  };

  let enhancedPrompt = prompt;
  
  if (style && style !== 'none' && styleEnhancements[style as keyof typeof styleEnhancements]) {
    enhancedPrompt += styleEnhancements[style as keyof typeof styleEnhancements];
  }
  
  // 添加质量提升词
  enhancedPrompt += ', high quality, detailed, masterpiece';
  
  return enhancedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, quality, aspectRatio } = await request.json();

    // 验证必需字段
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('🎨 Starting image generation with FLUX SCHNELL:', { prompt, style, quality, aspectRatio });

    console.log('Generating image with FLUX SCHNELL:', { prompt, style, quality, aspectRatio });

    // 增强提示词
    const enhancedPrompt = enhancePromptForStyle(prompt, style);

    // 映射前端的 aspectRatio 到 FLUX SCHNELL 支持的格式
    const aspectRatioMap: Record<string, string> = {
      'square': '1:1',
      'wide': '16:9',
      'vertical': '9:16',
      'portrait': '4:5',
      'landscape': '3:2'
    };

    const fluxAspectRatio = aspectRatioMap[aspectRatio] || aspectRatio || '1:1';

    try {
      // 首先尝试使用 FLUX SCHNELL 模型
      const output = await replicate.run(FLUX_SCHNELL_MODEL as `${string}/${string}`, {
        input: {
          prompt: enhancedPrompt,
          // FLUX SCHNELL 的参数相对简单，主要依靠 prompt 质量
          num_outputs: 1,
          aspect_ratio: fluxAspectRatio,
          output_format: "webp",
          output_quality: quality === 'ultra' ? 100 : quality === 'high' ? 90 : 80,
        }
      });

      // FLUX SCHNELL 返回的是数组格式
      let imageUrl: string;
      if (Array.isArray(output) && output.length > 0) {
        imageUrl = output[0] as string;
      } else {
        console.error('Unexpected FLUX SCHNELL output:', output);
        throw new Error('Unexpected output format from FLUX SCHNELL');
      }

      console.log('FLUX SCHNELL generation successful:', {
        imageUrl: imageUrl.substring(0, 100) + '...',
        model: 'FLUX SCHNELL',
        prompt: enhancedPrompt.substring(0, 100) + '...'
      });

      return NextResponse.json({ 
        imageUrl,
        model: 'FLUX SCHNELL',
        enhancedPrompt 
      });

    } catch (fluxError) {
      console.warn('FLUX SCHNELL failed, trying backup model:', fluxError);
      
      // 如果 FLUX SCHNELL 失败，回退到 SDXL
      const backupModel = style === 'anime' ? BACKUP_MODELS.anime : BACKUP_MODELS.sdxl;
      
      // 为备用模型计算尺寸
      const getDimensions = (ratio: string) => {
        switch (ratio) {
          case '16:9': return { width: 1344, height: 768 };
          case '9:16': return { width: 768, height: 1344 };
          case '4:5': return { width: 896, height: 1152 };
          case '3:2': return { width: 1216, height: 832 };
          default: return { width: 1024, height: 1024 };
        }
      };

      const dimensions = getDimensions(fluxAspectRatio);
      
      const output = await replicate.run(backupModel as `${string}/${string}`, {
        input: {
          prompt: enhancedPrompt,
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: quality === 'ultra' ? 50 : quality === 'high' ? 30 : 20,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000),
        }
      });

      let imageUrl: string;
      if (Array.isArray(output)) {
        imageUrl = output[0] as string;
      } else if (typeof output === 'string') {
        imageUrl = output;
      } else {
        throw new Error('Unexpected output format from backup model');
      }

      return NextResponse.json({ 
        imageUrl,
        model: 'SDXL (backup)',
        enhancedPrompt 
      });
    }

  } catch (error) {
    console.error('Image generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Image generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 