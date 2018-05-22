import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';
import ForceLayout from './ForceLayout.jsx';
import Crop from './Crop.jsx';
import * as d3 from 'd3';

/******************************
CLUSTER FORCE LAYOUT III
*******************************/

class App extends React.Component {
	render() {
		return (
			<div>
			 	<div className="alert alert-ga text-center">
	          <a href="http://www.jessicarahman.com" target="_blank">
	              We're teaming up with the World Bee Project to save the bees! Learn more &#11041; </a>
	      </div>
	      <div className="title-container">
					<div className="title"><h2>How many bees?</h2></div>
					<img src="styles/assets/orangepathway.png" className="beeline"></img>
				</div>
				<div className="app-container">
				  <ForceLayout />
				  <Footer />
				</div>
			</div>
		);
	}
}

export default App;