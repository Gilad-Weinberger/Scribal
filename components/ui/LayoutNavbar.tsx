import Navbar from "./Navbar";

export default function LayoutNavbar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen min-w-screen overflow-hidden bg-background-secondary">
      <Navbar />
      <div className="flex-1 pt-12 imnmw-full bg-background-secondary">
        {children}
      </div>
    </div>
  );
}
