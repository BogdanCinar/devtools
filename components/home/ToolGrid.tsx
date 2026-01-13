import { tools } from "@/lib/tools";
import { ToolCard } from "./ToolCard";

export function ToolGrid() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">All Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
