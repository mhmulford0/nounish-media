import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Toaster />
      <Navbar />

      <div className="container py-8 px-4 w-full">
        <section className="flex items-center justify-center flex-col">
          {children}
        </section>
      </div>
    </>
  );
};

export default Layout;
