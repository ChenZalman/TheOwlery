import { useMemo } from "react";
import * as d3 from "d3";

export default function PieChart({
  data,
  width = 400,
  height = 400,
  innerRadius = 0, // >0 for donut chart
  outerRadius = 150
}) {
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const aggregated = useMemo(() => {
    const grouped = d3.rollups(
      data,
      v => ({
        name: v[0].name, // name is assumed to be consistent for each ID
        value: d3.sum(v, d => d.y)
      }),
      d => d.x
    );
    return grouped.map(([id, { name, value }]) => ({ id, name, value }));
  }, [data]);

  const total = d3.sum(aggregated, d => d.value);

  const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

  const arcs = pie(aggregated);

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${centerX},${centerY})`}>
        {arcs.map((d, i) => (
          <path
            key={i}
            d={arc(d)}
            fill={color(d.data.id)}
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
        {arcs.map((d, i) => {
          const [x, y] = arc.centroid(d);
          const percent = ((d.data.value / total) * 100).toFixed(1) + "%";
          return (
            <text
              key={`label-${i}`}
              transform={`translate(${x},${y})`}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize={10}
              fill="white"
            >
              <tspan x="0" dy="-0.4em">{d.data.name}</tspan>
              <tspan x="0" dy="1.2em">{percent}</tspan>
            </text>
          );
        })}
      </g>
    </svg>
  );
}