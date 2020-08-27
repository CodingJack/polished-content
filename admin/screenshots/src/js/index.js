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

class MainImage extends Component {
	constructor() {
		super( ...arguments );
		this.ref = createRef();
	}
	
	onLoad = () => {
		const { current } = this.ref;
		const { preloaderRef } = this.props;
		const { current: preloader } = preloaderRef;
		
		preloader.classList.remove( 'active' );
		current.classList.add( 'fade-in' );
	}

	render() {
		const {
			index,
			imgPath,
			preloaderRef,
		} = this.props;
		
		const { current } = this.ref;
		const { current: preloader } = preloaderRef;
		
		if ( preloader ) {
			preloader.classList.add( 'active' );
		}
		if ( current ) {
			current.classList.remove( 'fade-in' );
			void current.offsetWidth;
		}
		
		return (
			<div className="inner">
				<img onLoad={ this.onLoad } src={ `${ imgPath }${ index }.jpg` } ref={ this.ref } />
			</div>
		);
	}
}

const getPoint = ( e ) => {
	return e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
}

class Screenshots extends Component {
	constructor() {
		super( ...arguments );
		
		this.state = { index: 1 };
		this.preloaderRef = createRef();
		
		if ( window.PointerEvent ) {
			this.touchEvents = {
				onPointerDown: this.start,
				onPointerMove: this.move,
				onPointerUp: this.end,
			};
		} else {
			this.touchEvents = {
				onTouchStart: this.start,
				onTouchMove: this.move,
				onTouchEnd: this.end,
			};
		}
		
	}
	
	changeImage( next ) {
		const { index } = this.state;
		const { numImages } = this.props;
		
		let newIndex;
		if ( next ) {
			newIndex = index < numImages ? index + 1 : 1;
		} else {
			newIndex = index > 1 ? index - 1 : numImages;
		}
		
		this.setState( { index: newIndex } );
	}
	
	start = ( e ) => {
		e.preventDefault();
		if ( e.touches && e.touches.length > 1 ) {
			return;
		}
		
		if (window.PointerEvent) {
			e.target.setPointerCapture( e.pointerId );
		}
		this.initialPoint = getPoint( e );
	}
	
	move = ( e ) => {
		e.preventDefault();
		if ( ! this.initialPoint ) {
			return;
		}
		
		this.difX = this.initialPoint - getPoint( e );
	}
	
	end = ( e ) => {
		e.preventDefault();
		if (e.touches && e.touches.length > 0) {
			return;
		}
		
		if (window.PointerEvent) {
			e.target.releasePointerCapture( e.pointerId );
		}

		const { swipeThreshold } = this.props;
		if ( Math.abs( this.difX ) > swipeThreshold ) {
			this.changeImage( this.difX > 0 );
		}
		
		this.difX = 0;
		this.initialPoint = null;
	}

	render() {
		const {
			imgPath,
		} = this.props;
		
		const {
			index,
		} = this.state;
		
		return (
			<>
				<div className="wrap" { ...this.touchEvents } >	
					<MainImage imgPath={ imgPath } index={ index } preloaderRef={ this.preloaderRef } />
				</div>
				<div className="elements">
					<a className="icon logo" target="_blank" href="https://github.com/CodingJack/polished-content/blob/master/polished-content.zip">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
							<path fill="none" d="M0 0h20v20H0z"/>
							<path d="M18 3v2H2V3h16zm-6 4v2H2V7h10zm6 0v2h-4V7h4zM8 11v2H2v-2h6zm10 0v2h-8v-2h8zm-4 4v2H2v-2h12z"/>
						</svg>
					</a>
					<a className="icon git" target="_blank" href="https://github.com/CodingJack/polished-content"><i className="fab fa-github"></i></a>
					<span className="icon arrow prev" onClick={ () => this.changeImage() }>
						<span className="material-icons">navigate_before</span>
					</span>
					<span className="icon arrow next" onClick={ () => this.changeImage( true ) }>
						<span className="material-icons">navigate_next</span>
					</span>
					<span className="preloader active" ref={ this.preloaderRef }></span>
				</div>
			</>
		);
	}
}

ReactDOM.render(
	<Screenshots numImages={ 18 } swipeThreshold={ 30 } minSwipeMovement={ 10 } imgPath="img/screen_" />,
	document.getElementById( 'app' )
);
