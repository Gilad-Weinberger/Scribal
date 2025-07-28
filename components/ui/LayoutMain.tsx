import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function LayoutMain({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-hidden bg-background-secondary">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pt-12 pl-14 min-w-full bg-background-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}
