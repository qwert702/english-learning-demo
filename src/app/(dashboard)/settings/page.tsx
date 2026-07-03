import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true, level: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">设置</h1>
        <p className="text-muted-foreground mt-1">管理你的账户</p>
      </div>
      <SettingsForm
        name={session.user.name || ""}
        email={session.user.email || ""}
        level={user?.level || "A1"}
        hasPassword={!!user?.password}
      />
    </div>
  );
}
