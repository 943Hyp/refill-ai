"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Locale } from '@/lib/i18n';

interface KeyboardShortcutsProps {
  locale: Locale;
  onGenerate?: () => void;
  onClear?: () => void;
  onToggleHistory?: () => void;
}

const KeyboardShortcuts = ({ 
  locale, 
  onGenerate, 
  onClear, 
  onToggleHistory 
}: KeyboardShortcutsProps) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否在输入框中
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || 
                            document.activeElement?.tagName === 'TEXTAREA';

      // Ctrl/Cmd + Enter: 生成图像
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isInputFocused) {
        e.preventDefault();
        onGenerate?.();
      }

      // Ctrl/Cmd + K: 清空输入
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClear?.();
      }

      // Ctrl/Cmd + H: 切换历史记录
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        onToggleHistory?.();
      }

      // ? 键: 显示快捷键帮助
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        setShowHelp(true);
      }

      // Escape: 关闭帮助
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onGenerate, onClear, onToggleHistory]);

  const shortcuts = [
    {
      key: locale === 'zh' ? 'Ctrl + Enter' : 'Ctrl + Enter',
      desc: locale === 'zh' ? '生成图像' : 'Generate Image',
      mac: '⌘ + Enter'
    },
    {
      key: locale === 'zh' ? 'Ctrl + K' : 'Ctrl + K',
      desc: locale === 'zh' ? '清空输入' : 'Clear Input',
      mac: '⌘ + K'
    },
    {
      key: locale === 'zh' ? 'Ctrl + H' : 'Ctrl + H',
      desc: locale === 'zh' ? '切换历史记录' : 'Toggle History',
      mac: '⌘ + H'
    },
    {
      key: '?',
      desc: locale === 'zh' ? '显示快捷键' : 'Show Shortcuts',
      mac: '?'
    },
    {
      key: 'Esc',
      desc: locale === 'zh' ? '关闭弹窗' : 'Close Modal',
      mac: 'Esc'
    }
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  if (!showHelp) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-muted/50 transition-all duration-300"
        title={locale === 'zh' ? '键盘快捷键 (?)' : 'Keyboard Shortcuts (?)'}
      >
        <span className="text-lg">⌨️</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {locale === 'zh' ? '键盘快捷键' : 'Keyboard Shortcuts'}
          </h3>
          <Button
            onClick={() => setShowHelp(false)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">
                {shortcut.desc}
              </span>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">
                  {isMac ? shortcut.mac : shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-start gap-2 text-sm">
            <span>💡</span>
            <div>
              <div className="font-medium text-primary mb-1">
                {locale === 'zh' ? '提示' : 'Tip'}
              </div>
              <div className="text-muted-foreground">
                {locale === 'zh' 
                  ? '快捷键可以大大提高您的使用效率，建议多加练习。'
                  : 'Keyboard shortcuts can greatly improve your efficiency. Practice makes perfect!'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <Button
          onClick={() => setShowHelp(false)}
          className="w-full"
        >
          {locale === 'zh' ? '知道了' : 'Got it'}
        </Button>
      </div>
    </div>
  );
};

export default KeyboardShortcuts; 