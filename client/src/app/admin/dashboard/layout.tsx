import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  );
}
