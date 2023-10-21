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

      <div className="container py-8 px-4 w-full">{children}</div>
    </>
  );
};

export default Layout;
