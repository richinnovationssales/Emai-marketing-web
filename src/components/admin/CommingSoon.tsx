import { Clock, Sparkles } from "lucide-react";

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export default function ComingSoon({
  title = "Coming Soon",
  description = "This feature is currently under development. Stay tuned!",
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-background p-8 shadow-lg">
        
        {/* Glow effects */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 space-y-6 text-center">
          
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Coming Soon
          </div>

          {/* Footer text */}
          <p className="text-xs text-muted-foreground">
            We’re actively building this feature 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
