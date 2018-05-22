// unfinished/src/components/scatter-plot.jsx
import React from 'react';
import * as d3 from 'd3';
import data from '../../../data.json';
import Nodes from './Nodes.jsx';

let n = data.length;

export default class ForceLayout extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			data: data,
		};
	};

	render() {
		return (
		<div>
			{this.state.data.length? <Nodes data={this.state.data} /> : null}
		</div>
		);
	}
}