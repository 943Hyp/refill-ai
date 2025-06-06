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

// 限制配置 - 渐进式限制
const RATE_LIMITS: RateLimitConfig[] = [
  // 第1-8次：无限制
  { maxRequests: 8, timeWindow: 60 * 1000, cooldownTime: 0 },
  // 第9-12次：30秒冷却
  { maxRequests: 12, timeWindow: 5 * 60 * 1000, cooldownTime: 30 * 1000 },
  // 第13-18次：1分钟冷却
  { maxRequests: 18, timeWindow: 10 * 60 * 1000, cooldownTime: 60 * 1000 },
  // 第19-25次：30分钟冷却
  { maxRequests: 25, timeWindow: 30 * 60 * 1000, cooldownTime: 30 * 60 * 1000 },
  // 第26-35次：45分钟冷却
  { maxRequests: 35, timeWindow: 60 * 60 * 1000, cooldownTime: 45 * 60 * 1000 },
  // 超过35次：60分钟冷却
  { maxRequests: Infinity, timeWindow: 120 * 60 * 1000, cooldownTime: 60 * 60 * 1000 },
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

    // 获取当前限制配置
    const currentLimit = this.getCurrentLimit(usage.count);
    
    // 检查时间窗口
    if (now - usage.lastUsed > currentLimit.timeWindow) {
      // 重置计数器
      usage.count = 0;
      usage.waitUntil = undefined;
    }

    // 增加使用次数
    usage.count++;
    usage.lastUsed = now;

    // 检查是否需要冷却
    if (usage.count > currentLimit.maxRequests && currentLimit.cooldownTime > 0) {
      usage.waitUntil = now + currentLimit.cooldownTime;
      this.storage.set(userId, usage);
      this.saveToStorage();
      
      const waitTime = Math.ceil(currentLimit.cooldownTime / 1000);
      return {
        allowed: false,
        waitTime,
        message: `使用次数过多，请等待 ${this.formatTime(waitTime)} 后再试`,
        usage
      };
    }

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

  getUsageInfo(): { count: number; nextCooldown?: string } {
    const userId = this.getUserId();
    const usage = this.storage.get(userId);
    
    if (!usage) {
      return { count: 0 };
    }

    const nextLimit = this.getCurrentLimit(usage.count + 1);
    const nextCooldown = nextLimit.cooldownTime > 0 
      ? this.formatTime(nextLimit.cooldownTime / 1000)
      : undefined;

    return {
      count: usage.count,
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