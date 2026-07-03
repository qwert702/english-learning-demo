"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateName, changePassword } from "@/actions/settings.actions";

interface SettingsFormProps {
  name: string;
  email: string;
  level: string;
  hasPassword: boolean;
}

export function SettingsForm({ name: initialName, email, level: initialLevel, hasPassword }: SettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveName = async () => {
    setSavingName(true);
    const result = await updateName(name);
    if (result.success) {
      toast.success("昵称已更新");
    } else {
      toast.error(result.error || "更新失败");
    }
    setSavingName(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("两次密码输入不一致");
      return;
    }
    setSavingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      toast.success("密码已修改");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "密码修改失败");
    }
    setSavingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* 账户信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">账户信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">邮箱</span>
            <span className="text-sm">{email}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">昵称</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-xs"
                aria-label="昵称"
              />
              <Button onClick={handleSaveName} disabled={savingName || name === initialName}>
                {savingName ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-16">等级</span>
            <Badge variant="secondary">{initialLevel}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 修改密码 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">修改密码</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPassword ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="current-password">当前密码</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="max-w-xs"
                  aria-label="当前密码"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="max-w-xs"
                  aria-label="新密码"
                  placeholder="8-128 个字符"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="max-w-xs"
                  aria-label="确认新密码"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {savingPassword ? "修改中..." : "修改密码"}
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              当前账户使用第三方登录，无需修改密码。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
