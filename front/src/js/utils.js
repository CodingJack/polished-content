/**
 * External dependencies.
 */

// sandboxing gsap ( greensock exposes globals by default )
// "umd" is needed because regular gsap import/exports fail with ESLint
import { gsap, gsapReset } from '../../../shared/js/sandbox-gsap';
require( 'gsap/umd/TweenMax' );
gsapReset();

/**
 * Internal dependencies.
 */
import {
	namespace,
	defaultData,
	defaultValues,
	transformable,
} from '../../../shared/js/data';

import {
	getMovements,
} from './getters';

/*
 * @desc converts property values taken from class names into primitive values
 * @param string prop - the animation property
 * @param string value - the animation property value
 * @returns string||number||boolean - animation value
 * @since 1.0.0
*/
export const formatValue = ( prop, value ) => {
	const defaultOption = defaultData[ prop ];

	if ( defaultOption ) {
		const { type } = defaultOption;

		if ( type === 'number' ) {
			return parseInt( value, 10 );
		} else if ( type === 'boolean' ) {
			return value === 'true' || value === '1';
		}

		return value;
	}

	return 'pcx';
};

/*
 * @desc creates an Object to be passed to gsap.set() which resets the CSS on an element
 * @param object props - current animation properties
 * @returns object - CSS reset object
 * @since 1.0.0
*/
export const createCssReset = ( props, ieClip ) => {
	const obj = {};

	const {
		pcxClip,
		pcxBlur,
		pcxOpacity,
		pcxGrayscale,
		pcxLetterSpacing,
		pcxTransformOrigin,
	} = props;

	if ( pcxOpacity !== undefined ) {
		obj.opacity = 1;
	}

	if ( pcxClip ) {
		if ( ! ieClip ) {
			obj[ 'clip-path' ] = 'none';
		} else {
			obj.clip = 'auto';
		}
	}

	if ( pcxLetterSpacing ) {
		obj.letterSpacing = 0;
	}

	if ( pcxBlur || pcxGrayscale ) {
		obj[ '-webkit-filter' ] = 'none';
		obj.filter = 'none';
	}

	const len = transformable.length;
	for ( let i = 0; i < len; i++ ) {
		const prop = transformable[ i ];

		if ( props[ prop ] !== undefined ) {
			obj.transform = 'none';
			if ( pcxTransformOrigin ) {
				obj.transformOrigin = pcxTransformOrigin.replace( '-', ' ' );
			}
			break;
		}
	}

	return obj;
};

/*
 * @desc removes all plugin classes from the element
 * @param HTMLElement el - the animated element
 * @since 1.0.0
*/
export const removeClasses = ( el ) => {
	const classes = el.className.split( ' ' ).filter( ( c ) => ! c.startsWith( 'pcx' ) && ! c.startsWith( namespace ) );
	const newClasses = classes.join( ' ' ).trim();

	if ( newClasses ) {
		el.className = classes.join( ' ' ).trim();
	} else {
		el.removeAttribute( 'class' );
	}
	el.style.visibility = 'visible';
};

/*
 * @desc resets CSS on an element
 * @param HTMLElement el - the animated element
 * @param object styles - CSS properties and values to reset
 * @since 1.0.0
*/
export const resetElement = ( el, styles ) => {
	const css = { ...styles };
	const {
		clip,
	} = css;

	// gsap sets "clip: auto" to "clip: rect(0,0,0,0)" (needed for IE fallback)
	if ( clip ) {
		el.style.clip = clip;
		delete css.clip;
	}

	gsap.TweenMax.set( el, css );
};

/*
 * @desc checks if we need to add "overflow-x: hidden" to the page's body element
 * @param object props - the animation object
 * @returns boolean - animation value
 * @since 1.0.0
*/
export const checkOverflow = ( props ) => {
	const len = transformable.length;

	for ( let i = 0; i < len; i++ ) {
		const prop = transformable[ i ];

		if ( props[ prop ] !== defaultValues[ prop ] ) {
			const root = document.getElementsByTagName( 'html' );
			if ( root.length ) {
				root[ 0 ].classList.add( 'pcx-overflow' );
			}

			return true;
		}
	}
	return false;
};

/*
 * @desc gets the x/y positions for animations with movements
 * @param object rect - animated element's wrapper getBoundingClientRect()
 * @param object props - animation properties and values
 * @param boolean reverse - if the animation is setup for reverse movements
 * @returns object - animation position x/y values
 * @since 1.0.0
*/
export const newPositions = ( rect, props, reverse ) => {
	const {
		posX,
		posY,
		pcxStrength,
	} = props;

	const positions = {};

	if ( ! posX && ! posY ) {
		positions.forwardPos = { x: 0, y: 0 };
		if ( reverse ) {
			positions.reversePos = { x: 0, y: 0 };
		}
	} else {
		positions.forwardPos = getMovements( rect, posX, posY, pcxStrength );

		if ( reverse ) {
			let revPosX;
			let revPosY;

			if ( posX && posX !== 'center' ) {
				revPosX = posX === 'left' ? 'right' : 'left';
			}
			if ( posY && posY !== 'center' ) {
				revPosY = posY === 'top' ? 'bottom' : 'top';
			}

			positions.reversePos = getMovements( rect, revPosX, revPosY, pcxStrength );
		}
	}

	return positions;
};

/*
 * @desc checks if an animation should take place based on the user's settings
 * @param array enabledViews - [desktop:Boolean, laptop:Boolean, tablet:Boolean, smartphone:Boolean]
 * @param array viewportWidths - screen widths that act as CSS breakpoints for the enabledViews
 * @returns boolean - if the animation should happen or not
 * @since 1.0.0
*/
export const checkScreens = ( enabledViews, viewportWidths ) => {
	const {
		length,
	} = viewportWidths;

	const {
		innerWidth: width,
	} = window;

	let shouldAnimate;

	for ( let i = 0; i < length; i++ ) {
		if ( i < 3 ) {
			if ( width >= viewportWidths[ i ] ) {
				shouldAnimate = enabledViews[ i ];
				break;
			}
		} else if ( width < viewportWidths[ i - 1 ] ) {
			shouldAnimate = enabledViews[ i ];
		}
	}

	return shouldAnimate;
};

/*
 * @desc checks if the window width is less than the chosen break value
 * @param array viewportWidths - screen widths that act as CSS breakpoints for the enabledViews
 * @param number breakValue - the screen width to break at
 * @returns boolean - if the animation props should be reset
 * @since 1.0.0
*/
export const checkScreenBreak = ( viewportWidths, breakValue ) => {
	const viewWidths = viewportWidths.slice();
	viewWidths.shift();

	const views = [ 'laptop', 'tablet', 'smartphone' ];
	const index = views.indexOf( breakValue );

	const viewWidth = index !== -1 ? viewWidths[ index ] : parseInt( breakValue, 10 );
	return window.innerWidth <= viewWidth;
};

/*
 * @desc see if we need to use the fall back "clip" for IE/Edge
 * @returns boolean - if CSS clip-path is supported
 * @since 1.0.0
*/
export const checkClipPath = () => {
	const div = document.createElement( 'div' );
	div.style.webkitClipPath = 'inset(25% 25% 25% 25%)';
	div.style.clipPath = 'inset(25% 25% 25% 25%)';

	const clipPath = div.style[ 'clip-path' ] && div.style[ 'clip-path' ] !== 'none';
	const webkitClipPath = div.style[ '-webkit-clip-path' ] && div.style[ '-webkit-clip-path' ] !== 'none';
	return {
		supportsClipPath: clipPath || webkitClipPath,
		webkitClipPath: ! clipPath && webkitClipPath,
	};
};

