import React from 'react';
import * as d3 from 'd3';
import data from '../../../data.json';
	


export default class Nodes extends React.Component {
	constructor(props) {
		super (props);
	}

	componentDidMount() {
	// const data = this.props.data;
		const width = 1000;
		const height = 1000;
		const padding = 1.5; //separation between same-color nodes
		const clusterPadding = 6; // separation between different-color nodes
		const maxRadius = 2 * (data.reduce((max, crop) => {
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

		var nodes = d3.range(n).map(() => {
		  let i = Math.floor(Math.random() * m),
		      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
		      d = {cluster: i, radius: r};
		  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
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
	      	.attr("stroke-width", function(d) { return 10; })
	      	.attr("stroke", function(d) { return "#aaaaaa"; })

	console.log('nodes is', nodes)
	console.log('svg is', svg)

		var simulation = d3.forceSimulation(nodes)
		    .velocityDecay(0.2)
		    .force("x", d3.forceX().strength(.0005))
		    .force("y", d3.forceY().strength(.0005))
		    .force("collide", collide)
		    .force("cluster", clustering)
		    .on("tick", ticked);

		function ticked() {
		  circles
		      .attr("cx", (d) => d.x)
		      .attr("cy", (d) => d.y);
		}

	  var circles = svg.selectAll("circle")
	  .data(nodes)
		.enter()

	  console.log('circles', circles)

		//These are implementations of the custom forces.
		function clustering(alpha) {
		    nodes.forEach(function(d) {
		      var cluster = clusters[d.cluster];
		      if (cluster === d) return;
		      var x = d.x - cluster.x,
		          y = d.y - cluster.y,
		          l = Math.sqrt(x * x + y * y),
		          r = d.r + cluster.r;
		      if (l !== r) {
		        l = (l - r) / l * alpha;
		        d.x -= x *= l;
		        d.y -= y *= l;
		        cluster.x += x;
		        cluster.y += y;
		      }  
		    });
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