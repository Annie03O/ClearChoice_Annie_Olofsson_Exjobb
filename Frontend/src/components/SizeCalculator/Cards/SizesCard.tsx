import type { Category } from "../../../models/Types/sizeCalculator/Category";

type Row    = readonly [string, number | null];
type RowNum = readonly [string, number];


export const SizeCard = ({ title, size }: { title: string; size: Category }) => {
  // Bygg rader (visa bara de som finns)
  const allRows = [
    ["Shoulders", size.shoulder] as const,
    ["Chest", size.chest] as const,
    ["Waist", size.waist] as const,
  ] as const;

const rows = (allRows as readonly Row[]).filter(
  (t): t is RowNum => t[1] != null
);
  const fmt = (v: number) =>
    `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(v)} cm`;

  if (rows.length === 0) return null;

  return (
    <section>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
        {rows.map(([label, val]) => (
          <ul key={label}>
            <li>{label}</li>
            <li>{fmt(val)}</li>
          </ul>
        ))}
    </section>
  );
}
