import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

async function SiteHeader() {
  const session = await auth();
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          🎧 English Learning
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user ? (
            <Link href="/dashboard"><Button>进入学习中心</Button></Link>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost">登录</Button></Link>
              <Link href="/register"><Button>免费注册</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <>
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          用阅读学英语
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          分级文章阅读，提升英语听力与阅读能力。从今天开始，每天进步一点点。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register"><Button size="lg" className="text-lg px-8">免费开始学习</Button></Link>
          <Link href="/login"><Button size="lg" variant="outline" className="text-lg px-8">我已有账号</Button></Link>
        </div>
      </section>

      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="rounded-xl border p-6 text-center">
              <div className="text-4xl mb-4" aria-hidden="true">👂</div>
              <h3 className="text-lg font-semibold">分级阅读</h3>
              <p className="mt-2 text-sm text-muted-foreground">A1-C2 分级文章，逐步提升阅读能力</p>
            </div>
            <div className="rounded-xl border p-6 text-center">
              <div className="text-4xl mb-4" aria-hidden="true">📖</div>
              <h3 className="text-lg font-semibold">实战试卷</h3>
              <p className="mt-2 text-sm text-muted-foreground">多年级模拟试卷，检验学习成果</p>
            </div>
            <div className="rounded-xl border p-6 text-center">
              <div className="text-4xl mb-4" aria-hidden="true">🔥</div>
              <h3 className="text-lg font-semibold">每日打卡</h3>
              <p className="mt-2 text-sm text-muted-foreground">坚持学习，养成好习惯</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        English Learning &copy; {new Date().getFullYear()}
      </footer>
    </>
  );
}

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<header className="border-b"><div className="container mx-auto flex h-16 items-center justify-between px-4"><div className="h-6 w-48 rounded bg-muted animate-pulse" /><div className="flex gap-2"><div className="h-9 w-16 rounded bg-muted animate-pulse" /><div className="h-9 w-24 rounded bg-muted animate-pulse" /></div></div></header>}>
        <SiteHeader />
      </Suspense>
      <HeroSection />
    </div>
  );
}
