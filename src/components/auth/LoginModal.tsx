"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Locale, getTranslation } from '@/lib/i18n';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

const LoginModal = ({ isOpen, onClose, locale }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = (key: keyof typeof import('@/lib/i18n').translations.zh) => getTranslation(locale, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(locale === 'zh' ? '请填写所有必填字段' : 'Please fill in all required fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error(locale === 'zh' ? '密码不匹配' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        toast.success(locale === 'zh' ? '登录成功！' : 'Login successful!');
      } else {
        toast.success(locale === 'zh' ? '注册成功！' : 'Registration successful!');
      }
      
      onClose();
    } catch (error) {
      toast.error(locale === 'zh' ? '操作失败，请重试' : 'Operation failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(locale === 'zh' ? `${provider} 登录功能即将推出` : `${provider} login coming soon`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isLogin ? (locale === 'zh' ? '登录' : 'Login') : (locale === 'zh' ? '注册' : 'Sign Up')}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {locale === 'zh' ? '邮箱' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder={locale === 'zh' ? '请输入邮箱' : 'Enter your email'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {locale === 'zh' ? '密码' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder={locale === 'zh' ? '请输入密码' : 'Enter your password'}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'zh' ? '确认密码' : 'Confirm Password'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder={locale === 'zh' ? '请再次输入密码' : 'Confirm your password'}
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {locale === 'zh' ? '处理中...' : 'Processing...'}
              </>
            ) : (
              isLogin ? (locale === 'zh' ? '登录' : 'Login') : (locale === 'zh' ? '注册' : 'Sign Up')
            )}
          </Button>
        </form>

        {/* Social Login */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                {locale === 'zh' ? '或者' : 'Or'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('Google')}
              className="w-full"
            >
              <span className="mr-2">🔍</span>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full"
            >
              <span className="mr-2">🐙</span>
              GitHub
            </Button>
          </div>
        </div>

        {/* Switch Mode */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin 
              ? (locale === 'zh' ? '没有账号？立即注册' : "Don't have an account? Sign up")
              : (locale === 'zh' ? '已有账号？立即登录' : 'Already have an account? Login')
            }
          </button>
        </div>

        {/* Free Notice */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <span>🆓</span>
            <span className="text-green-400 font-medium">
              {locale === 'zh' ? '当前完全免费使用，无需登录！' : 'Currently completely free, no login required!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 