import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "./admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏 — 桌面端 */}
      <aside className="hidden md:flex w-56 flex-col border-r bg-muted/30">
        <div className="p-4 border-b">
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            ⚙️ 管理后台
          </Link>
        </div>
        <AdminNav />
        <div className="p-3 border-t">
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            ← 返回前台
          </Link>
        </div>
      </aside>

      {/* 移动端顶部导航 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2 p-3 overflow-x-auto">
          <AdminNav mobile />
          <Link
            href="/dashboard"
            className="shrink-0 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            ← 前台
          </Link>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
