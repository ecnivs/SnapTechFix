import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AiAssistantFab from "@/components/ai/AiAssistantFab";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
  <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <AiAssistantFab />
    </div>
  );
}
