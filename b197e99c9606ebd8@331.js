// https://observablehq.com/@d3/line-with-tooltip@331
import define1 from "./7a9e12f9fb3d8e06@459.js";

export default function define(runtime, observer) {
  console.log("Hello!")
  const main = runtime.module();
  const fileAttachments = new Map([["aapl.csv",new URL("./anomalydetection_fixed.csv",import.meta.url)]]);
  const fileAttachments2 = new Map([["second.csv",new URL("./Combined---EQS-VAR3---09m-09d-20y_1s.csv",import.meta.url)]]);



  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.builtin("FileAttachment2", runtime.fileAttachments(name => fileAttachments2.get(name)));


  main.variable(observer()).define(["md"], function(md){return(md)});


  main.variable(observer("chart2")).define("chart2", ["LineChart","second","width"], function(LineChart,second,width){return(
    LineChart(second, {
      x: d => d.index,
      y: d => d.Current,
      xLabel: "Time (ms)",
      width,
      height: 500,
      color: "steelblue"
    })
)});

  main.variable(observer("second")).define("second", ["FileAttachment2"], function(FileAttachment2){return(
FileAttachment2("second.csv").csv({typed: true})
)});

main.variable(observer("chart1")).define("chart1", ["LineChart","aapl","width"], function(LineChart,aapl,width){return(
    LineChart(aapl, {
      x: d => d.time,
      y: d => d.anomaly_score,
      xLabel: "Time (ms)",
      width,
      height: 500,
      color: "steelblue"
    })
    )});
    
      main.variable(observer("aapl")).define("aapl", ["FileAttachment"], function(FileAttachment){return(
    FileAttachment("aapl.csv").csv({typed: true})
    )});

  main.variable(observer("LineChart")).define("LineChart", ["d3"], function(d3){return(
function LineChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  color = "currentColor", // stroke color of line
  strokeWidth = 1.5, // stroke width of line, in pixels
  strokeLinejoin = "round", // stroke line join of line
  strokeLinecap = "round", // stroke line cap of line
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const O = d3.map(data, d => d);
  const I = d3.map(data, (_, i) => i);

  // Compute which data points are considered defined.
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Compute titles.
  if (title === undefined) {
    //const formatDate = xScale.tickFormat(null, "%b %-d, %Y");
    const formatValue = yScale.tickFormat(100, yFormat);
    title = i => `${formatValue(Y[i])}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .style("-webkit-tap-highlight-color", "transparent")
      .style("overflow", "visible")
      .on("pointerenter pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-linecap", strokeLinecap)
      .attr("d", line(I));

  const tooltip = svg.append("g")
      .style("pointer-events", "none");

  function pointermoved(event) {
    const i = d3.bisectCenter(X, xScale.invert(d3.pointer(event)[0]));
    tooltip.style("display", null);
    tooltip.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);

    const path = tooltip.selectAll("path")
      .data([,])
      .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");

    const text = tooltip.selectAll("text")
      .data([,])
      .join("text")
      .call(text => text
        .selectAll("tspan")
        .data(`${title(i)}`.split(/\n/))
        .join("tspan")
          .attr("x", 0)
          .attr("y", (_, i) => `${i * 1.1}em`)
          .attr("font-weight", (_, i) => i ? null : "bold")
          .text(d => d));

    const {x, y, width: w, height: h} = text.node().getBBox();
    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
    svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerleft() {
    tooltip.style("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }

  return Object.assign(svg.node(), {value: null});
}
)});
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  return main;
}
