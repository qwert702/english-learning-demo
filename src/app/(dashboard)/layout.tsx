import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard-nav";
import { SessionProvider } from "@/components/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen flex-col">
        <DashboardNav user={session.user} />
        <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
