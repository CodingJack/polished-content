/**
 * External dependencies.
 */

require('../scss/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';

const {
	createRef,
	Component,
} = React;

const imgPath = 'dist/img/screen_';

class MainImage extends Component {
	constructor() {
		super( ...arguments );
		this.ref = createRef();
	}
	componentDidUpdate() {
		this.ref.current.classList.add( 'fade-in' );
	}
	render() {
		const { active } = this.props;
		const { current } = this.ref;
		
		if( current ) {
			current.classList.remove( 'fade-in' );
			void current.offsetWidth;
		}
		
		return (
			<div className="wrap"><img src={ `${ imgPath }${ active }.jpg` } ref={ this.ref } /></div>
		);
	}
}

class Screenshots extends Component {
	constructor() {
		super( ...arguments );
		this.numImages = 18;
		this.state = { index: 1 };
	}
	
	prev = () => {
		const { index } = this.state;
		const newIndex = index > 1 ? index - 1 : this.numImages;
		this.setState( { index: newIndex } );
	}
	
	next = () => {
		const { index } = this.state;
		const newIndex = index < this.numImages ? index + 1 : 1;
		this.setState( { index: newIndex } );
	}

	render() {
		const { index } = this.state;
		return (
			<>	
				<MainImage active={ index } />
				<a className="icon logo" target="_blank" href="http://www.codingjack.com/polished-content/">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path fill="none" d="M0 0h20v20H0z"/>
						<path d="M18 3v2H2V3h16zm-6 4v2H2V7h10zm6 0v2h-4V7h4zM8 11v2H2v-2h6zm10 0v2h-8v-2h8zm-4 4v2H2v-2h12z"/>
					</svg>
				</a>
				<a className="icon git" target="_blank" href="https://github.com/CodingJack"><i className="fab fa-github"></i></a>
				<span className="icon arrow prev" onClick={ this.prev }>
					<span className="material-icons">navigate_before</span>
				</span>
				<span className="icon arrow next" onClick={ this.next }>
					<span className="material-icons">navigate_next</span>
				</span>
			</>
		);
	}
}

ReactDOM.render(
	<Screenshots />,
	document.getElementById( 'app' )
);
