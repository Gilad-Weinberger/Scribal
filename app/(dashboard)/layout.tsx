import { Navbar, Sidebar } from "@/components/ui";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen min-w-screen overflow-hidden bg-[#fcfcfc]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pt-12 pl-14 imnmw-full bg-[#fcfcfc]">
          {children}
        </div>
      </div>
    </div>
  );
}
