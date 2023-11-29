import { ScrollArea } from "@/collection/ui/scroll-area";
import { DocsSidebarNav } from "@/components/docs-sidebar-nav";
import { docsNavigationConfig } from "@/config/docs-navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pl-8 pr-6 lg:py-8">
            <DocsSidebarNav items={docsNavigationConfig} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </div>
  );
}
