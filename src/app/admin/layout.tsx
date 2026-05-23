import { SessionProvider } from "@/components/providers/SessionProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Admin", noindex: true });

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider>
      <div className="min-h-dvh bg-ink-950">
        {session?.user ? <AdminShell user={session.user}>{children}</AdminShell> : children}
      </div>
    </SessionProvider>
  );
}
