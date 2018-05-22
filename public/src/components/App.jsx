import React from 'react';
import CropCluster from './CropCluster.jsx';
import Crop from './Crop.jsx';

const styles = {
	width: 500,
	height: 500,
	padding: 60,
};

//number of data points in the chart.
const numDataPoints = 50;

//function that returns random number from 0 to 1000
const randomNum = () => Math.floor(Math.random() * 1000);

//function to create an array of 50 elements of (x, y) coordinates
const randomDataSet = () => {
  return Array.apply(null, {length: numDataPoints}).map(() => [randomNum(), randomNum()]);
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: randomDataSet()
		};
		const randomizeData = () => {
			this.setState({
				data: randomDataSet()
			});
		}
	}

	render() {
		return (
			<div className="app-container">
				<h2>How many bees?</h2>
				<CropCluster {...this.state} {...styles} />
				<div className="controls">
					<button className="btn randomize outline" onClick={() => this.randomizeData()}> Randomize Data 
					</button>
				</div>
				<div id="chart"></div>
			</div>
		);
	}
}

export default App;