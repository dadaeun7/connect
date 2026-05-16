import Sidebar from "@/components/share/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="custom-scrollbar flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </section>
  );
}
