// 用户限制系统
interface UserUsage {
  count: number;
  lastUsed: number;
  waitUntil?: number;
}

interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // 时间窗口（毫秒）
  cooldownTime: number; // 冷却时间（毫秒）
}

// 新的限制配置 - 基于生成次数（每次生成4张图片）
const RATE_LIMITS: RateLimitConfig[] = [
  // 前10次生成（40张图片）：无限制
  { maxRequests: 10, timeWindow: 24 * 60 * 60 * 1000, cooldownTime: 0 },
  // 第11-15次生成：5分钟冷却
  { maxRequests: 15, timeWindow: 24 * 60 * 60 * 1000, cooldownTime: 5 * 60 * 1000 },
  // 第16次及以后：30分钟冷却
  { maxRequests: Infinity, timeWindow: 24 * 60 * 60 * 1000, cooldownTime: 30 * 60 * 1000 },
];

class RateLimiter {
  private storage: Map<string, UserUsage> = new Map();
  private readonly STORAGE_KEY = 'refill-ai-usage';

  constructor() {
    this.loadFromStorage();
    // 定期清理过期数据
    setInterval(() => this.cleanup(), 5 * 60 * 1000); // 每5分钟清理一次
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.storage = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load rate limit data:', error);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const data = Object.fromEntries(this.storage);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save rate limit data:', error);
    }
  }

  private cleanup() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    for (const [key, usage] of this.storage.entries()) {
      // 清理1小时前的数据
      if (now - usage.lastUsed > oneHour) {
        this.storage.delete(key);
      }
    }
    
    this.saveToStorage();
  }

  private getUserId(): string {
    // 使用多种方式生成用户标识
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
    ].join('|');
    
    // 简单哈希
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    return Math.abs(hash).toString(36);
  }

  private getCurrentLimit(count: number): RateLimitConfig {
    for (const limit of RATE_LIMITS) {
      if (count <= limit.maxRequests) {
        return limit;
      }
    }
    return RATE_LIMITS[RATE_LIMITS.length - 1];
  }

  checkLimit(): { allowed: boolean; waitTime?: number; message?: string; usage?: UserUsage } {
    const userId = this.getUserId();
    const now = Date.now();
    
    const usage = this.storage.get(userId) || { count: 0, lastUsed: now };
    
    // 检查是否还在冷却期
    if (usage.waitUntil && now < usage.waitUntil) {
      const waitTime = Math.ceil((usage.waitUntil - now) / 1000);
      return {
        allowed: false,
        waitTime,
        message: `请等待 ${this.formatTime(waitTime)} 后再试`,
        usage
      };
    }

    // 检查24小时时间窗口，如果超过24小时则重置
    if (now - usage.lastUsed > 24 * 60 * 60 * 1000) {
      usage.count = 0;
      usage.waitUntil = undefined;
    }

    // 检查当前使用次数并应用相应的限制
    let needsCooldown = false;
    let cooldownTime = 0;
    let message = '';

    if (usage.count >= 10 && usage.count < 15) {
      // 第11-15次：5分钟冷却
      needsCooldown = true;
      cooldownTime = 5 * 60 * 1000;
      message = `您已使用${usage.count}次（每次4张图），需要等待5分钟`;
    } else if (usage.count >= 15) {
      // 第16次及以后：30分钟冷却
      needsCooldown = true;
      cooldownTime = 30 * 60 * 1000;
      message = `您已使用${usage.count}次（每次4张图），需要等待30分钟`;
    }

    // 如果需要冷却且不在冷却期，设置冷却
    if (needsCooldown && (!usage.waitUntil || now >= usage.waitUntil)) {
      usage.waitUntil = now + cooldownTime;
      this.storage.set(userId, usage);
      this.saveToStorage();
      
      const waitTime = Math.ceil(cooldownTime / 1000);
      return {
        allowed: false,
        waitTime,
        message,
        usage
      };
    }

    // 增加使用次数
    usage.count++;
    usage.lastUsed = now;

    // 更新存储
    this.storage.set(userId, usage);
    this.saveToStorage();

    return {
      allowed: true,
      usage
    };
  }

  private formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}秒`;
    } else if (seconds < 3600) {
      const minutes = Math.ceil(seconds / 60);
      return `${minutes}分钟`;
    } else {
      const hours = Math.ceil(seconds / 3600);
      return `${hours}小时`;
    }
  }

  getUsageInfo(): { count: number; nextCooldown?: string; totalImages?: number } {
    const userId = this.getUserId();
    const usage = this.storage.get(userId);
    
    if (!usage) {
      return { count: 0, totalImages: 0 };
    }

    let nextCooldown: string | undefined;
    if (usage.count >= 10 && usage.count < 15) {
      nextCooldown = '5分钟';
    } else if (usage.count >= 15) {
      nextCooldown = '30分钟';
    }

    return {
      count: usage.count,
      totalImages: usage.count * 4, // 每次生成4张图片
      nextCooldown
    };
  }

  // 重置用户限制（管理员功能）
  resetUser(userId?: string): void {
    const targetId = userId || this.getUserId();
    this.storage.delete(targetId);
    this.saveToStorage();
  }
}

// 导出单例实例
export const rateLimiter = new RateLimiter();

// 导出类型
export type { UserUsage, RateLimitConfig }; 