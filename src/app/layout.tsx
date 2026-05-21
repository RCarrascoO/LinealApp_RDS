import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { SidebarProvider } from "@/components/SidebarContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Analizador de Cónicas",
  description: "Clasificación y visualización de cónicas - Cálculo I",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopNavbar />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
