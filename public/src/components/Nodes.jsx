import React from 'react';
import * as d3 from 'd3';
import { forceCluster } from 'd3-force-cluster';

export default class Nodes extends React.Component {
	constructor(props) {
		super (props);
	}

	componentDidMount() {
		const data = this.props.data;

		console.log('data is', data);
		console.log('this is', this);
		
		const width = 900,
					height = 700,
					padding = 1.5, //separation between same-colorScale nodes
					clusterPadding = 4, // separation between different-color nodes
					radiusMultiplier = 6,
					maxRadius = radiusMultiplier * (data.reduce((max, crop) => {
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

		var colorScale = d3.scaleOrdinal().range(["#FDEB73", "#F6C15B", "#ED9445", "#E66632", "#B84A29", "#6A3A2D"]);

		var clusters = new Array(m); //The largest node for each cluster

		var nodes = d3.range(n).map(function() {
		  let i = Math.floor(Math.random() * m),
		      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
		      d = {cluster: i, 
		      		radius: r,
		      		x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
        			y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random(),
        			name: "almond"
		      	};
		  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
		  console.log('d is', d)
		  return d;
		});

		var svg = d3.select('body').append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class","bubble")

		// var node = svg.selectAll("circle")
	 //    	.data(nodes)
	 //    	.enter().append("circle")
	 //      	.attr("fill", function(d) { return colorScale(d.cluster); })
	 //      	.call(d3.drag())

		var node = svg.selectAll("circle")
	    	.data(nodes)
	    	.enter().append("g")
	    	.call(d3.drag())

  	node.append("circle")
    	.attr("fill", function(d) { return colorScale(d.cluster); })
    	.attr("r", function(d) { return d.radius })

//perhaps make this appear on hover
		node.append("text")
    	.attr("dx", -10)
    	.attr("dy", ".35em")
    	.text((d) => d.name )
    	.attr("class", "node-text")
    	.attr("fill", (d) => colorScale(d.cluster))
    	// .style("stroke", "black")

    // node.append('text')
    // 	.text((d) => data[d.index].name )
    // 	.attr("dx", -10)
    // 	.text((d) => nodes[d.index].name)
    // 	.style("stroke", "white")

	  node.transition()
	  	.duration(1500)
	  	.delay((d, i) => i * 5)
    	.attrTween("r", (d) => {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

    	console.log(nodes)
//first force collision function only works if strength > 0
//second force collision function is necessary to get the circles to not render on top of each other
		var simulation = d3.forceSimulation(nodes)
		    .force("x", d3.forceX().strength(.0005))
		    .force("y", d3.forceY().strength(.0005))
				.force('collide', d3.forceCollide(function (d) { return d.radius + padding; })
				    .strength(0.3))
		    // .force("collide", d3.forceCollide().radius(function(d) {return d.radius + 0.5}).iterations(1.5))
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
		  node.attr("transform", function (d) {
        var k = "translate(" + d.x + "," + d.y + ")";
        return k;
    	})
		}

		function collide(alpha) {
		  var quadtree = d3.quadtree()
		      .x((d) => d.x)
		      .y((d) => d.y)
		      .addAll(nodes);

		  nodes.forEach(function(d) {
		    var r = d.radius + Math.max(padding, clusterPadding),
		        nx1 = d.x - r,
		        nx2 = d.x + r,
		        ny1 = d.y - r,
		        ny2 = d.y + r;
		    console.log()
		    quadtree.visit(function(quad, x1, y1, x2, y2) {
		    	if (quad.data === undefined) {
		    		return;
		    	}
		      if (quad.data && (quad.data !== d)) {
		        var x = d.x - quad.data.x,
		            y = d.y - quad.data.y,
		            l = Math.sqrt(x * x + y * y),
		            r = d.radius + quad.data.r + (d.cluster === quad.data.cluster ? padding : clusterPadding);
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

		function mouseOver(d) {
			this.parentNode.appendChild(this);
		  d3.select(this)
		      .style("pointer-events", "none")
		    .transition()
		      .duration(750)
		      .attr("transform", "translate(480,480)scale(23)rotate(180)")
		    .transition()
		      .delay(1500)
		      .attr("transform", "translate(240,240)scale(0)")
		      .style("fill-opacity", 0)
		      .remove();		
    }
	};

	render() {
		return (
		<div></div>
		);
	}
}