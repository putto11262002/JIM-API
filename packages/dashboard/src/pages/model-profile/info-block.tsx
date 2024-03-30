
export function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: undefined | null | string;
}) {
  return (
    <div>
      <p className="font-medium text-sm">{label}</p>
      <p className="text-sm mt-0.5 text-muted-foreground">{value ? value : "-"}</p>
    </div>
  );
}