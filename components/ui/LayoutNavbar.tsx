import Navbar from "./Navbar";

export default function LayoutNavbar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-hidden bg-background-secondary">
      <Navbar />
      <div className="pt-12 min-w-full bg-background-secondary">{children}</div>
    </div>
  );
}
