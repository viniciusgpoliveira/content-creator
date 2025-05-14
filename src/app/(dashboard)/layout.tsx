import { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { NotificationProvider } from "@/context/notification-context";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Content Creator Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="container mx-auto max-w-7xl flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <DashboardNav />
          </aside>
          <main className="flex w-full flex-col overflow-hidden p-4 md:py-8 mx-auto">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
