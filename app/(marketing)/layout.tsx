import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/sections/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}
