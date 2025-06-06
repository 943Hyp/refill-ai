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

// 基本动物翻译词典，确保中文关键词被识别
const animalKeywords: Record<string, string> = {
  '猫': 'cat',
  '小猫': 'kitten',
  '狗': 'dog',
  '小狗': 'puppy',
  '鱼': 'fish',
  '鸟': 'bird',
  '熊': 'bear',
  '老虎': 'tiger',
  '狮子': 'lion',
  '大象': 'elephant',
  '长颈鹿': 'giraffe',
  '兔子': 'rabbit',
  '松鼠': 'squirrel',
  '猴子': 'monkey',
  '熊猫': 'panda',
  '鹿': 'deer',
  '蝴蝶': 'butterfly',
  '鲸鱼': 'whale',
  '海豚': 'dolphin',
  '鲨鱼': 'shark',
  '青蛙': 'frog',
  '蛇': 'snake',
  '龙': 'dragon'
};

// 翻译常见的中文描述词
const attributeKeywords: Record<string, string> = {
  '可爱': 'cute',
  '美丽': 'beautiful',
  '漂亮': 'pretty',
  '帅气': 'handsome',
  '可怕': 'scary',
  '恐怖': 'terrifying',
  '大': 'big',
  '小': 'small',
  '高': 'tall',
  '矮': 'short',
  '胖': 'fat',
  '瘦': 'thin',
  '年轻': 'young',
  '老': 'old',
  '快乐': 'happy',
  '悲伤': 'sad',
  '生气': 'angry',
  '惊讶': 'surprised',
  '害怕': 'scared',
  '勇敢': 'brave',
  '强壮': 'strong',
  '弱': 'weak',
  '聪明': 'smart',
  '愚蠢': 'stupid',
  '红色': 'red',
  '蓝色': 'blue',
  '绿色': 'green',
  '黄色': 'yellow',
  '紫色': 'purple',
  '粉色': 'pink',
  '黑色': 'black',
  '白色': 'white',
  '吃': 'eating',
  '喝': 'drinking',
  '睡觉': 'sleeping',
  '跑': 'running',
  '跳': 'jumping',
  '玩': 'playing',
  '游泳': 'swimming',
  '飞': 'flying'
};

// 动作描述词典
const actionKeywords: Record<string, string> = {
  '在吃': 'eating',
  '在喝': 'drinking',
  '在睡': 'sleeping',
  '在跑': 'running',
  '在跳': 'jumping',
  '在玩': 'playing',
  '在游泳': 'swimming',
  '在飞': 'flying'
};

function enhancePromptForStyle(prompt: string, style?: string): string {
  const styleEnhancements = {
    'digital-art': ', digital art style',
    'watercolor': ', watercolor painting style',
    'oil-painting': ', oil painting style',
    'sketch': ', pencil sketch style',
    'anime': ', anime style',
    'photorealistic': ', photorealistic style',
    '3d-render': ', 3D render style',
    'cyberpunk': ', cyberpunk style',
    'fantasy': ', fantasy art style',
  };

  // 添加中文关键词识别和翻译
  // 例如："一只可爱的小猫在吃鱼" -> "a cute kitten eating fish"
  let translatedPrompt = prompt;
  
  // 检查是否是中文提示词
  const hasChinese = /[\u4e00-\u9fa5]/.test(prompt);
  
  if (hasChinese) {
    console.log('🇨🇳 检测到中文提示词，进行关键词强化...');
    
    // 应用中文关键词翻译
    let enhancedChinese = prompt;
    
    // 添加英文前缀以确保模型理解
    let englishPrompt = "";
    
    // 检查是否包含动物关键词
    Object.entries(animalKeywords).forEach(([chinese, english]) => {
      if (prompt.includes(chinese)) {
        englishPrompt += english + " ";
      }
    });
    
    // 检查是否包含描述词
    Object.entries(attributeKeywords).forEach(([chinese, english]) => {
      if (prompt.includes(chinese)) {
        englishPrompt += english + " ";
      }
    });
    
    // 检查是否包含动作词
    Object.entries(actionKeywords).forEach(([chinese, english]) => {
      if (prompt.includes(chinese)) {
        englishPrompt += english + " ";
      }
    });
    
    // 如果发现了关键词，添加到原始提示词
    if (englishPrompt.length > 0) {
      translatedPrompt = `${prompt} (${englishPrompt.trim()})`;
      console.log('🔄 增强后的提示词:', translatedPrompt);
    }
  }
  
  // 只在有明确风格选择时才添加风格词
  if (style && style !== 'none' && styleEnhancements[style as keyof typeof styleEnhancements]) {
    translatedPrompt += styleEnhancements[style as keyof typeof styleEnhancements];
  }
  
  // 只添加基本的质量词，避免过度影响内容
  translatedPrompt += ', high quality';
  
  return translatedPrompt;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Route called - checking environment...');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔑 All env keys:', Object.keys(process.env).filter(key => key.includes('REPLICATE')));
    
    // 检查API密钥
    const apiToken = process.env.REPLICATE_API_TOKEN;
    console.log('API Token check:', {
      hasEnvToken: !!process.env.REPLICATE_API_TOKEN,
      tokenLength: apiToken?.length,
      tokenPrefix: apiToken?.substring(0, 8),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });

    if (!apiToken) {
      console.log('❌ Replicate API token not configured');
      console.log('Available env vars:', Object.keys(process.env).slice(0, 10));
      return NextResponse.json(
        { error: 'Replicate API token not configured: Token missing' },
        { status: 503 }
      );
    }

    const { prompt, style, quality, aspectRatio } = await request.json();

    // 验证必需字段
    if (!prompt) {
      console.log('❌ Missing prompt');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('🎨 Starting image generation with FLUX SCHNELL:', { prompt, style, quality, aspectRatio });
    console.log('📥 Original prompt received:', prompt);

    // 增强提示词
    const enhancedPrompt = enhancePromptForStyle(prompt, style);
    console.log('📝 Enhanced prompt to be sent:', enhancedPrompt);

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
      console.log('🚀 Calling Replicate API with model:', FLUX_SCHNELL_MODEL);
      console.log('📝 Enhanced prompt:', enhancedPrompt);
      console.log('⚙️ Parameters:', { fluxAspectRatio, quality });
      
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
    console.error('❌ Image generation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error type:', typeof error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    return NextResponse.json(
      { 
        error: 'Image generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: typeof error,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 