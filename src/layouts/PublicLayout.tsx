import React from "react";
import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface PublicLayoutProps {
  transparentHeader?: boolean;
  showSearch?: boolean;
  hideFooter?: boolean;
  children?: React.ReactNode;
}

export function PublicLayout({
  transparentHeader = false,
  showSearch = false,
  hideFooter = false,
  children,
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader transparentHeader={transparentHeader} showSearch={showSearch} />
      <main className="flex-1">
        {children ?? <Outlet />}
      </main>
      {!hideFooter && <SiteFooter />}
    </div>
  );
}

