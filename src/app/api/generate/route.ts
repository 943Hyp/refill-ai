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
  '猫咪': 'kitty',
  '狗': 'dog',
  '小狗': 'puppy',
  '鱼': 'fish',
  '金鱼': 'goldfish',
  '鸟': 'bird',
  '小鸟': 'small bird',
  '熊': 'bear',
  '小熊': 'bear cub',
  '老虎': 'tiger',
  '狮子': 'lion',
  '大象': 'elephant',
  '长颈鹿': 'giraffe',
  '兔子': 'rabbit',
  '小兔子': 'bunny',
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
  '龙': 'dragon',
  '恐龙': 'dinosaur',
  '狐狸': 'fox',
  '浣熊': 'raccoon',
  '考拉': 'koala',
  '羊': 'sheep',
  '山羊': 'goat',
  '猫头鹰': 'owl',
  '企鹅': 'penguin',
  '老鼠': 'mouse',
  '仓鼠': 'hamster',
  '鸭子': 'duck',
  '鹅': 'goose',
  '鹦鹉': 'parrot',
  '蜘蛛': 'spider',
  '蚂蚁': 'ant',
  '蜜蜂': 'bee',
  '蝎子': 'scorpion',
  '蟹': 'crab',
  '虾': 'shrimp',
  '乌龟': 'turtle',
  '蜗牛': 'snail',
  '牛': 'cow',
  '马': 'horse',
  '驴': 'donkey',
  '河马': 'hippo',
  '大熊猫': 'giant panda',
  '孔雀': 'peacock',
  '斑马': 'zebra',
  '骆驼': 'camel',
  '袋鼠': 'kangaroo',
  '豹子': 'leopard',
  '猎豹': 'cheetah',
  '北极熊': 'polar bear',
  '犀牛': 'rhino',
  '海狮': 'sea lion',
  '水獭': 'otter',
  '海星': 'starfish',
  '章鱼': 'octopus',
  '鳄鱼': 'crocodile',
  '变色龙': 'chameleon',
  '壁虎': 'gecko',
  '蝙蝠': 'bat',
  '刺猬': 'hedgehog',
  '无尾熊': 'koala'
};

// 翻译常见的中文描述词
const attributeKeywords: Record<string, string> = {
  '可爱': 'cute',
  '萌': 'adorable',
  '美丽': 'beautiful',
  '漂亮': 'pretty',
  '帅气': 'handsome',
  '可怕': 'scary',
  '恐怖': 'terrifying',
  '大': 'big',
  '小': 'small',
  '巨大': 'huge',
  '微小': 'tiny',
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
  '灰色': 'gray',
  '橙色': 'orange',
  '棕色': 'brown',
  '金色': 'golden',
  '银色': 'silver',
  '毛茸茸': 'fluffy',
  '光滑': 'smooth',
  '圆': 'round',
  '方': 'square',
  '长': 'long',
  '短': 'short',
  '明亮': 'bright',
  '黑暗': 'dark',
  '透明': 'transparent',
  '模糊': 'blurry',
  '清晰': 'clear',
  '湿': 'wet',
  '干': 'dry',
  '热': 'hot',
  '冷': 'cold',
  '新': 'new',
  '旧': 'old',
  '干净': 'clean',
  '脏': 'dirty',
  '甜': 'sweet',
  '苦': 'bitter',
  '咸': 'salty',
  '酸': 'sour',
  '辣': 'spicy',
  '硬': 'hard',
  '软': 'soft',
  '华丽': 'gorgeous',
  '优雅': 'elegant',
  '神秘': 'mysterious',
  '奇幻': 'fantastic',
  '幻想': 'fantasy',
  '卡通': 'cartoon',
  '写实': 'realistic',
  '超现实': 'surreal',
  '梦幻': 'dreamy',
  '古典': 'classical',
  '现代': 'modern',
  '未来': 'futuristic',
  '科幻': 'sci-fi',
  '霓虹': 'neon',
  '复古': 'retro',
  '精致': 'delicate',
  '粗糙': 'rough',
  '闪亮': 'shiny',
  '朦胧': 'fuzzy',
  '锋利': 'sharp'
};

// 动作描述词典
const actionKeywords: Record<string, string> = {
  '在吃': 'eating',
  '吃': 'eating',
  '进食': 'eating',
  '在喝': 'drinking',
  '喝': 'drinking',
  '在睡': 'sleeping',
  '睡觉': 'sleeping',
  '休息': 'resting',
  '在跑': 'running',
  '跑': 'running',
  '在跳': 'jumping',
  '跳': 'jumping',
  '在玩': 'playing',
  '玩': 'playing',
  '在游泳': 'swimming',
  '游泳': 'swimming',
  '在飞': 'flying',
  '飞': 'flying',
  '站': 'standing',
  '站立': 'standing',
  '躺': 'lying',
  '躺着': 'lying down',
  '坐': 'sitting',
  '坐着': 'sitting down',
  '走': 'walking',
  '走路': 'walking',
  '看': 'looking',
  '看着': 'looking at',
  '聆听': 'listening',
  '听': 'listening',
  '舔': 'licking',
  '微笑': 'smiling',
  '大笑': 'laughing',
  '哭': 'crying',
  '跳舞': 'dancing',
  '唱歌': 'singing',
  '叫': 'calling',
  '冲': 'rushing',
  '打': 'hitting',
  '爬': 'climbing',
  '潜水': 'diving',
  '拥抱': 'hugging',
  '亲吻': 'kissing',
  '握手': 'shaking hands',
  '挥手': 'waving',
  '抓': 'grabbing',
  '推': 'pushing',
  '拉': 'pulling',
  '奔跑': 'running fast',
  '漂浮': 'floating',
  '滑行': 'gliding',
  '蹦跳': 'bouncing',
  '潜伏': 'lurking',
  '狩猎': 'hunting',
  '捕食': 'preying',
  '觅食': 'foraging',
  '嬉戏': 'frolicking',
  '战斗': 'fighting',
  '演奏': 'playing music',
  '绘画': 'painting',
  '阅读': 'reading',
  '写作': 'writing',
  '思考': 'thinking',
  '沉思': 'meditating',
  '祈祷': 'praying',
  '漫步': 'strolling',
  '奔驰': 'galloping'
};

// 场景关键词
const sceneKeywords: Record<string, string> = {
  '森林': 'forest',
  '山': 'mountain',
  '海': 'sea',
  '海洋': 'ocean',
  '沙滩': 'beach',
  '草地': 'grassland',
  '草原': 'prairie',
  '沙漠': 'desert',
  '湖': 'lake',
  '河': 'river',
  '瀑布': 'waterfall',
  '城市': 'city',
  '街道': 'street',
  '乡村': 'countryside',
  '公园': 'park',
  '花园': 'garden',
  '天空': 'sky',
  '云': 'cloud',
  '雨': 'rain',
  '雪': 'snow',
  '星空': 'starry sky',
  '日出': 'sunrise',
  '日落': 'sunset',
  '家': 'home',
  '房子': 'house',
  '学校': 'school',
  '办公室': 'office',
  '商店': 'store',
  '餐厅': 'restaurant',
  '医院': 'hospital',
  '机场': 'airport',
  '车站': 'station',
  '火车': 'train',
  '汽车': 'car',
  '船': 'boat',
  '飞机': 'plane',
  '桥': 'bridge',
  '窗户': 'window',
  '门': 'door',
  '树': 'tree',
  '花': 'flower',
  '草': 'grass',
  '果实': 'fruit',
  '阳光': 'sunshine',
  '月亮': 'moon',
  '星星': 'star',
  '峡谷': 'canyon',
  '悬崖': 'cliff',
  '洞穴': 'cave',
  '岛屿': 'island',
  '火山': 'volcano',
  '极光': 'aurora',
  '冰川': 'glacier',
  '雪山': 'snowy mountain',
  '热带雨林': 'tropical rainforest',
  '珊瑚礁': 'coral reef',
  '深海': 'deep sea',
  '太空': 'space',
  '银河': 'galaxy',
  '宇宙': 'universe',
  '古堡': 'ancient castle',
  '神殿': 'temple',
  '城堡': 'castle',
  '宫殿': 'palace',
  '庭院': 'courtyard',
  '温室': 'greenhouse',
  '市场': 'market',
  '广场': 'square',
  '码头': 'dock',
  '港口': 'harbor',
  '灯塔': 'lighthouse'
};

// 物体关键词
const objectKeywords: Record<string, string> = {
  '书': 'book',
  '桌子': 'table',
  '椅子': 'chair',
  '沙发': 'sofa',
  '电视': 'TV',
  '电脑': 'computer',
  '手机': 'phone',
  '相机': 'camera',
  '钟表': 'clock',
  '杯子': 'cup',
  '盘子': 'plate',
  '刀': 'knife',
  '叉子': 'fork',
  '勺子': 'spoon',
  '碗': 'bowl',
  '瓶子': 'bottle',
  '罐子': 'jar',
  '玩具': 'toy',
  '气球': 'balloon',
  '礼物': 'gift',
  '纸': 'paper',
  '笔': 'pen',
  '铅笔': 'pencil',
  '钥匙': 'key',
  '钱包': 'wallet',
  '包': 'bag',
  '箱子': 'box',
  '帽子': 'hat',
  '眼镜': 'glasses',
  '雨伞': 'umbrella',
  '手表': 'watch',
  '戒指': 'ring',
  '项链': 'necklace',
  '耳环': 'earrings',
  '衣服': 'clothes',
  '裙子': 'dress',
  '裤子': 'pants',
  '鞋子': 'shoes',
  '靴子': 'boots',
  '窗帘': 'curtain',
  '地毯': 'carpet',
  '床': 'bed',
  '枕头': 'pillow',
  '被子': 'blanket',
  '镜子': 'mirror',
  '灯': 'lamp',
  '画': 'painting',
  '雕塑': 'sculpture',
  '花瓶': 'vase',
  '门': 'door',
  '窗': 'window'
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
    
    // 添加英文前缀以确保模型理解
    const keywords: {[key: string]: string} = {};
    
    // 1. 先尝试识别场景词
    Object.entries(sceneKeywords).forEach(([chinese, english]) => {
      if (prompt.includes(chinese)) {
        keywords[chinese] = english;
      }
    });
    
    // 2. 识别动物关键词 - 优先匹配较长的短语
    const sortedAnimalKeys = Object.keys(animalKeywords).sort((a, b) => b.length - a.length);
    for (const chinese of sortedAnimalKeys) {
      if (prompt.includes(chinese)) {
        keywords[chinese] = animalKeywords[chinese];
        break; // 通常一个提示词只包含一个主要动物
      }
    }
    
    // 3. 识别物体关键词
    Object.entries(objectKeywords).forEach(([chinese, english]) => {
      if (prompt.includes(chinese)) {
        keywords[chinese] = english;
      }
    });
    
    // 4. 识别所有描述词
    Object.entries(attributeKeywords).forEach(([chinese, english]) => {
      if (prompt.includes(chinese)) {
        keywords[chinese] = english;
      }
    });
    
    // 5. 识别动作词 - 优先匹配较长的短语
    const sortedActionKeys = Object.keys(actionKeywords).sort((a, b) => b.length - a.length);
    for (const chinese of sortedActionKeys) {
      if (prompt.includes(chinese)) {
        keywords[chinese] = actionKeywords[chinese];
        break; // 通常一个提示词只包含一个主要动作
      }
    }
    
    // 构建更自然的英语描述
    if (Object.keys(keywords).length > 0) {
      // 确定是否包含主体(动物/人物/物体)
      const hasSubject = sortedAnimalKeys.some(key => prompt.includes(key)) || 
                        Object.keys(objectKeywords).some(key => prompt.includes(key));
      
      // 收集形容词、动作和场景
      const attributes: string[] = [];
      const actions: string[] = [];
      const scenes: string[] = [];
      const subjects: string[] = [];
      
      Object.entries(keywords).forEach(([chinese, english]) => {
        if (animalKeywords[chinese] || objectKeywords[chinese]) {
          subjects.push(english);
        } else if (attributeKeywords[chinese]) {
          attributes.push(english);
        } else if (actionKeywords[chinese]) {
          actions.push(english);
        } else if (sceneKeywords[chinese]) {
          scenes.push(english);
        }
      });
      
      // 构建更自然的英语句子
      let englishPrompt = "";
      
      // 添加冠词
      const articlePrefix = hasSubject ? "a " : "";
      
      // 形容词
      if (attributes.length > 0) {
        englishPrompt += attributes.join(" ") + " ";
      }
      
      // 主体
      if (subjects.length > 0) {
        englishPrompt += subjects[0] + " ";
      }
      
      // 动作
      if (actions.length > 0) {
        englishPrompt += actions[0] + " ";
      }
      
      // 场景
      if (scenes.length > 0) {
        englishPrompt += "in " + scenes.join(" ") + " ";
      }
      
      const trimmedEnglish = englishPrompt.trim();
      
      // 添加到原始提示词，但更突出英文部分
      if (trimmedEnglish) {
        translatedPrompt = `${prompt} (${articlePrefix}${trimmedEnglish})`;
        console.log('🔄 增强后的提示词:', translatedPrompt);
      }
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