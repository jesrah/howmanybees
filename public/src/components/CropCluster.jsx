// unfinished/src/components/scatter-plot.jsx
import React from 'react';
import * as d3 from 'd3';
import DataCircles from './DataCircles.jsx';

// Returns the largest X coordinate from the data set
const xMax = (data) => d3.max(data, (d) => d[0]);

// Returns the highest Y coordinate from the data set
const yMax = (data) => d3.max(data, (d) => d[1]);

// Returns a function that "scales" X coordinates from the data to fit the chart

//in d3 v4 it's not scale.linear but scaleLinear
const xScale = (props) => {
  return d3.scaleLinear()
    .domain([0, xMax(props.data)])
    .range([props.padding, props.width - props.padding * 2]);
};

// Returns a function that "scales" Y coordinates from the data to fit the chart
const yScale = (props) => {
  return d3.scaleLinear()
    .domain([0, yMax(props.data)])
    .range([props.height - props.padding, props.padding]);
};

export default (props) => {
  const scales = { xScale: xScale(props), yScale: yScale(props) };
  return <svg width={props.width} height={props.height}>
    <DataCircles {...props} {...scales} />
  </svg>
}