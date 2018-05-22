import React from 'react';
import * as d3 from 'd3';
import data from '../../../data.json';
import { forceCluster } from 'd3-force-cluster';

export default class Nodes extends React.Component {
	constructor(props) {
		super (props);
	}

	componentDidMount() {
	// const data = this.props.data;
		const width = 900;
		const height = 900;
		const padding = 1.5; //separation between same-color nodes
		const clusterPadding = 6; // separation between different-color nodes
		const maxRadius = 3 * (data.reduce((max, crop) => {
	  	if (max < crop['hivesPerAcre']) {
	  		max = crop['hivesPerAcre'];
	  	}	
	  	return max;
	  }, 0));
	  var n = data.length //total number of nodes
		var m = data.reduce((uniqueGroups, crop) => {
		    	if (uniqueGroups.indexOf(crop['groupId']) === -1) {
		    		uniqueGroups.push(crop['groupId']);
		    	}
		    	return uniqueGroups;
		    }, []).length;

		var color = d3.scaleOrdinal().range(["#FDEB73", "#F6C15B", "#ED9445", "#E66632", "#B84A29", "#6A3A2D"]);

		var clusters = new Array(m); //The largest node for each cluster

		var nodes = d3.range(n).map(function() {
		  let i = Math.floor(Math.random() * m),
		      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
		      d = {cluster: i, 
		      		radius: r,
		      		x: Math.cos(i / m * 2 * Math.PI) * 200 + 960 / 2 + Math.random(),
        			y: Math.sin(i / m * 2 * Math.PI) * 200 + 500 / 2 + Math.random()
		      	};
		  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
		  console.log('i, r, d.x, d.y', i, r, d.x, d.y)
		  return d;
		});

		var svg = d3.select('body')
			.append("svg")
	    .attr("width", 1000)
	    .attr("height", 1000)
	    .attr("class","bubble")

		var node = svg.selectAll("circle")
	    	.data(nodes)
	    	.enter().append("circle")
	      	.attr("fill", function(d) { return color(d.cluster); })
	      	.call(d3.drag())
	      	// .append("text")
        // .attr("text-anchor", "middle")
        // .text(function(d){ return data.i; })
        // .style("fill","white")
        // .style("font-family", "Helvetica Neue, Helvetica, Arial, san-serif")
        // .style("font-size", "12px");

	  node.transition()
	  	.duration(750)
	  	.delay(function(d, i) { return i * 5; })
    	.attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

		var simulation = d3.forceSimulation(nodes)
		    .force("x", d3.forceX().strength(.0005))
		    .force("y", d3.forceY().strength(.0005))
		    .force("collide", collide)
		    .force("cluster", clustering)
		    .on("tick", ticked);

		//These are implementations of the custom forces.
		function clustering(alpha) {
		   return (function(d) {
		      var cluster = clusters[d.cluster];
		      if (cluster === d) return;
		      var x = d.x - cluster.x,
		          y = d.y - cluster.y,
		          l = Math.sqrt(x * x + y * y),
		          r = d.radius + cluster.radius;
		      if (l !== r) {
		        l = (l - r) / l * alpha;
		        d.x -= x *= l;
		        d.y -= y *= l;
		        cluster.x += x;
		        cluster.y += y;
		      }  
		    });
		}

		function ticked() {
			if (!node) { return; }
		  node.attr("cx", (d) => d.x)
		      .attr("cy", (d) => d.y);
		}

		function collide(alpha) {
		  var quadtree = d3.quadtree()
		      .x((d) => d.x)
		      .y((d) => d.y)
		      .addAll(nodes);

		  nodes.forEach(function(d) {
		    var r = d.r + maxRadius + Math.max(padding, clusterPadding),
		        nx1 = d.x - r,
		        nx2 = d.x + r,
		        ny1 = d.y - r,
		        ny2 = d.y + r;
		    quadtree.visit(function(quad, x1, y1, x2, y2) {

		      if (quad.data && (quad.data !== d)) {
		        var x = d.x - quad.data.x,
		            y = d.y - quad.data.y,
		            l = Math.sqrt(x * x + y * y),
		            r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? padding : clusterPadding);
		        if (l < r) {
		          l = (l - r) / l * alpha;
		          d.x -= x *= l;
		          d.y -= y *= l;
		          quad.data.x += x;
		          quad.data.y += y;
		        }
		      }
		      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		    });
		  });
		};
	}

	render() {
		return (
		<div>
			<div ref="hook" />
		</div>
		);
	}
}