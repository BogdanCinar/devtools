"use client";

import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className={cn("grid gap-4 lg:grid-cols-2 lg:gap-6")}>{children}</div>
    </div>
  );
}

interface ToolPanelProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ToolPanel({
  title,
  actions,
  children,
  className,
}: ToolPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
        <span className="text-sm font-medium">{title}</span>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
