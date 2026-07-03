"use client";

import { login } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect } from "react";

const initialState = { error: "", success: false } as const;

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  // 登录成功 → 客户端跳转（确保 Cookie 先到达浏览器）
  useEffect(() => {
    if (state?.success) {
      window.location.href = "/dashboard";
    }
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="text-xl font-bold mb-2 block">
            🎧 English Learning
          </Link>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>登录后继续你的学习之旅</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
              </div>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "登录中..." : "登录"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            还没有账号？{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
