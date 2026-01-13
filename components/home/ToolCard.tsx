import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Tool } from "@/lib/tools";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link
      href={tool.path}
      className={cn(
        "group relative flex flex-col p-6 rounded-lg border bg-card",
        "hover:border-primary/50 hover:shadow-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "p-2 rounded-md bg-primary/10 text-primary",
            "group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold">{tool.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{tool.description}</p>
    </Link>
  );
}
