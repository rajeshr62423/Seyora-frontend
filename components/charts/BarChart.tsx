export interface BarPoint {
  label: string;
  value: number;
}

export default function BarChart({ data }: { data: BarPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="chart">
      {data.map((d, i) => (
        <div key={`${d.label}-${i}`} className="bar" style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}>
          <span>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
