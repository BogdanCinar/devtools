import { ToolGrid } from "@/components/home/ToolGrid";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Developer Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Essential developer tools, fast, no bullshit. Free, privacy-first,
          and works offline.
        </p>
      </section>

      {/* Tools Grid */}
      <ToolGrid />
    </div>
  );
}
