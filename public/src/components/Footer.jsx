import React from 'react';
import App from './App.jsx';

export default (props) => {
  return (
    <footer>
        <div className="footer-icons">
            <a href="http://github.com/jesrah" target="_blank" className="social-icons"><i className="fab fa-github"></i></a>
            <a href="http://linkedin.com/in/jessicarahman" target="_blank" className="social-icons"><i className="fab fa-linkedin"></i></a>
            <a href="http://twitter.com/therawjess" target="_blank" className="social-icons"><i className="fab fa-twitter"></i></a>
        </div>
        <div>
            <p className="footer-text">Made with &hearts; by Jessica Rahman</p>
            <p className="footer-text-tiny"></p>
        </div>
    </footer>
    );
}
