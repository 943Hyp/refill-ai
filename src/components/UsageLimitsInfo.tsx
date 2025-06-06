"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Locale } from '@/lib/i18n';

interface UsageLimitsInfoProps {
  locale: Locale;
}

export default function UsageLimitsInfo({ locale }: UsageLimitsInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const limits = [
    {
      range: locale === 'zh' ? '前8次' : 'First 8 uses',
      cooldown: locale === 'zh' ? '无限制' : 'No limit',
      description: locale === 'zh' ? '免费体验，无需等待' : 'Free trial, no waiting'
    },
    {
      range: locale === 'zh' ? '第9-12次' : '9-12 uses',
      cooldown: locale === 'zh' ? '30秒' : '30 seconds',
      description: locale === 'zh' ? '轻度使用，短暂等待' : 'Light usage, brief wait'
    },
    {
      range: locale === 'zh' ? '第13-18次' : '13-18 uses',
      cooldown: locale === 'zh' ? '1分钟' : '1 minute',
      description: locale === 'zh' ? '中度使用，适度等待' : 'Moderate usage, reasonable wait'
    },
    {
      range: locale === 'zh' ? '第19-25次' : '19-25 uses',
      cooldown: locale === 'zh' ? '30分钟' : '30 minutes',
      description: locale === 'zh' ? '频繁使用，长时间等待' : 'Frequent usage, long wait'
    },
    {
      range: locale === 'zh' ? '第26-35次' : '26-35 uses',
      cooldown: locale === 'zh' ? '45分钟' : '45 minutes',
      description: locale === 'zh' ? '高频使用，更长等待' : 'High usage, extended wait'
    },
    {
      range: locale === 'zh' ? '超过35次' : 'Over 35 uses',
      cooldown: locale === 'zh' ? '60分钟' : '60 minutes',
      description: locale === 'zh' ? '超量使用，最长等待' : 'Excessive usage, maximum wait'
    }
  ];

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          <h3 className="font-medium text-sm">
            {locale === 'zh' ? '使用限制说明' : 'Usage Limits'}
          </h3>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          {isExpanded ? '收起' : '展开'}
          <span className={`ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="text-xs text-muted-foreground">
            {locale === 'zh' 
              ? '为了确保服务稳定性和公平使用，我们实施了渐进式限制政策：'
              : 'To ensure service stability and fair usage, we implement progressive rate limiting:'
            }
          </div>

          <div className="space-y-2">
            {limits.map((limit, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded-md">
                <div className="flex-1">
                  <div className="text-xs font-medium">{limit.range}</div>
                  <div className="text-[10px] text-muted-foreground">{limit.description}</div>
                </div>
                <div className="text-xs font-mono bg-primary/10 px-2 py-1 rounded">
                  {limit.cooldown}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="font-medium">
              {locale === 'zh' ? '💡 温馨提示：' : '💡 Tips:'}
            </div>
            <ul className="space-y-1 ml-4">
              <li>• {locale === 'zh' ? '限制基于浏览器指纹识别，清除缓存不会重置' : 'Limits are based on browser fingerprinting, clearing cache won\'t reset'}</li>
              <li>• {locale === 'zh' ? '等待时间过后自动解除限制' : 'Limits are automatically lifted after the wait time'}</li>
              <li>• {locale === 'zh' ? '合理使用有助于为所有用户提供更好的服务' : 'Reasonable usage helps provide better service for all users'}</li>
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
            <div className="text-xs font-medium text-primary mb-1">
              {locale === 'zh' ? '🎯 建议使用方式' : '🎯 Recommended Usage'}
            </div>
            <div className="text-xs text-muted-foreground">
              {locale === 'zh' 
                ? '建议在生成图像前仔细思考提示词，避免频繁重复生成。使用"优化提示词"功能可以提高生成质量，减少重试次数。'
                : 'We recommend thinking carefully about your prompts before generating. Use the "Enhance Prompt" feature to improve quality and reduce retries.'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 