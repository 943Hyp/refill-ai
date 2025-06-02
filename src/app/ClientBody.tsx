"use client";

import { createContext, useState, type ReactNode } from "react";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

// 创建全局Context
export const PromptContext = createContext<{
  prompt: string;
  setPrompt: (prompt: string) => void;
}>({
  prompt: "",
  setPrompt: () => {},
});

export default function ClientBody({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState("");

  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </PromptContext.Provider>
  );
}
