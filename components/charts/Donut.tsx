export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export default function Donut({ segments, centerLabel }: { segments: DonutSegment[]; centerLabel: string }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const stops = segments
    .reduce<{ text: string[]; cursor: number }>(
      (acc, s) => {
        const start = (acc.cursor / total) * 100;
        const cursor = acc.cursor + s.value;
        const end = (cursor / total) * 100;
        return { text: [...acc.text, `${s.color} ${start}% ${end}%`], cursor };
      },
      { text: [], cursor: 0 }
    )
    .text.join(", ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div className="donut" style={{ background: `conic-gradient(${stops})` }}>
        <div className="donut-center">{centerLabel}</div>
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {segments.map((s) => (
          <div key={s.label} className="chart-legend-row">
            <span className="chart-legend-dot" style={{ background: s.color }} />
            {s.label}
            <span className="muted" style={{ marginLeft: "auto" }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
