
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
      <p className="text-sm">{value ? value : "Unavailable"}</p>
    </div>
  );
}