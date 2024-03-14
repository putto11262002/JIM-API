import { cn } from "../../../lib/utils";

export function FormGridSection({
    title,
    description,
    children,
    col = 2
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    col?: number
  }) {
    return (
      <div>
        <h2 className="font-bold pt-4 text-lg">{title}</h2>
        {description && <p className="text-slate-500">{description}</p>}
        <div className={cn("grid gap-y-5 gap-x-3 py-2", `grid-cols-${col}`)}>{children}</div>
      </div>
    );
}