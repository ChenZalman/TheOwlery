import * as d3 from "d3";
import {useRef, useEffect} from "react";
/*
*************************************************************************************************************************
  When calling this function the call needs to be like this: <LinePlot data={[{x:'2024-05-25',y:1},{x:'2024-05-26',y:2},{x:'2024-05-27',y:2},{x:'2024-05-28',y:1}]}/>
  Need to check for month intervals instead of days
*************************************************************************************************************************
 */
export default function BarPlot({
  data,
  width = 640,
  height = 400,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40
}) {
     const gx = useRef();
  const gy = useRef();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const grouped = d3.rollups(
    data,
    v => d3.sum(v, d => d.y), // sum y values
    d => daysOfWeek[new Date(d.x).getDay()]
  );

  const valuesByDay = daysOfWeek.map(day => {
    const found = grouped.find(([k]) => k === day);
    return { day, value: found ? found[1] : 0 };
  });

  const x = d3.scaleBand()
    .domain(daysOfWeek)
    .range([marginLeft, width - marginRight])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(valuesByDay, d => d.value)])
    .nice()
    .range([height - marginBottom, marginTop]);

  useEffect(() => {
    d3.select(gx.current).call(d3.axisBottom(x));
  }, [gx, x]);

  useEffect(() => {
    d3.select(gy.current).call(d3.axisLeft(y));
  }, [gy, y]);


  return (
    <svg width={width} height={height}>
      <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
      <g ref={gy} transform={`translate(${marginLeft},0)`} />
      {valuesByDay.map((d, i) => (
        <rect
          key={i}
          x={x(d.day)}
          y={y(d.value)}
          width={x.bandwidth()}
          height={y(0) - y(d.value)}
          fill="steelblue"
        />
      ))}
    </svg>
  );
}