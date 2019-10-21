
/**
 * Internal dependencies.
 */
import {
	threeD,
	reversable,
	defaultValues,
} from '../../../shared/js/data';

import { formatValue } from './utils';

/*
 * @desc converts class names into animation properties
 * @param HTMLElement el - the animated element
 * @returns object||boolean - animation properties object or false if none exist
 * @since 1.0.0
*/
export const getProps = ( el ) => {
	const props = {};
	let valueFound;

	el.classList.forEach( ( className ) => {
		if ( className.search( 'pcx' ) !== -1 ) {
			const clas = className.split( '_' );
			if ( clas.length === 2 ) {
				const prop = clas[ 0 ];
				const value = formatValue( prop, clas[ 1 ] );

				if ( value !== 'pcx' ) {
					props[ prop ] = value;
					valueFound = true;
				}
			}
		}
	} );

	return valueFound ? props : false;
};

/*
 * @desc gets the reversed values for reversable animation properties (movements, clips, etc.)
 * @param object props - the original animation properties
 * @returns boolean - if any animation properties were reversed
 * @since 1.0.0
*/
export const getReversable = ( props ) => {
	let reversed;
	reversable.forEach( ( prop ) => {
		if ( props[ prop ] !== undefined && props[ prop ] !== defaultValues[ prop ] ) {
			props[ prop ] *= -1;
			reversed = true;
		}
	} );

	const {
		clipX,
		clipY,
		pcxTransformOrigin,
	} = props;

	const originReverse = pcxTransformOrigin.split( ' ' );
	let originX = originReverse[ 0 ];
	let originY = originReverse[ 1 ];
	let originReversed;

	if ( clipX !== 'center' ) {
		props.clipX = clipX === 'left' ? 'right' : 'left';
		reversed = true;
	}
	if ( clipY !== 'center' ) {
		props.clipY = clipY === 'top' ? 'bottom' : 'top';
		reversed = true;
	}
	if ( originX !== 'center' ) {
		originX = originX === 'left' ? 'right' : 'left';
		originReversed = true;
	}
	if ( originY !== 'center' ) {
		originY = originY === 'top' ? 'bottom' : 'top';
		originReversed = true;
	}
	if ( originReversed ) {
		props.pcxTransformOrigin = `${ originX } ${ originY }`;
		reversed = true;
	}

	return reversed;
};

/*
 * @desc helps determine if a CSS perspective needs to be added to the element or not
 * @param object props - the animation's properties
 * @returns boolean - if the animation has 3D properties
 * @since 1.0.0
*/
export const getHas3D = ( props ) => {
	const len = threeD.length;

	for ( let i = 0; i < len; i++ ) {
		if ( props[ threeD[ i ] ] !== defaultValues[ threeD[ i ] ] ) {
			return true;
		}
	}

	return false;
};

/*
 * @desc calculates the translateX/Y values for the animation based on the user's "strength" selection
 * @param object rect - the element's getBoundingClientRect()
 * @param string curPosX - "left", "right" or "center"
 * @param string curPosY - "top", "bottom" or "center"
 * @param string strength - "max" = full screen, "full" = content size, "short" = half content size
 * @returns object - the animation's translateX/Y values
 * @since 1.0.0
*/
export const getMovements = ( rect, curPosX, curPosY, strength ) => {
	const pos = {
		x: 0,
		y: 0,
	};

	if ( strength !== 'max' ) {
		let x, y;

		if ( curPosX === 'left' ) {
			x = -100;
		} else if ( curPosX === 'right' ) {
			x = 100;
		}
		if ( curPosY === 'top' ) {
			y = -100;
		} else if ( curPosY === 'bottom' ) {
			y = 100;
		}

		if ( strength === 'short' ) {
			x *= 0.5;
			y *= 0.5;
		}
		pos.x = `${ x }%`;
		pos.y = `${ y }%`;
	} else {
		const {
			innerWidth: winWidth,
			innerHeight: winHeight,
		} = window;

		const {
			left,
			top,
			width,
			height,
		} = rect;

		if ( curPosX === 'left' || curPosX === 'right' ) {
			pos.x = curPosX === 'right' ? winWidth - left : -( width + left );
		}

		if ( curPosY === 'top' || curPosY === 'bottom' ) {
			pos.y = curPosY === 'bottom' ? winHeight - top : -( height + top );
		}
	}

	return pos;
};

/*
 * @desc determines if the element is above or below the center of the screen
 * @param object rect - the element's getBoundingClientRect()
 * @returns boolean - true: it's below, false: it's above
 * @since 1.0.0
*/
export const getAnimeDirection = ( rect ) => {
	const {
		top: elTop,
		height: elHeight,
	} = rect;

	const {
		innerHeight: winHeight,
	} = window;

	return elTop + ( elHeight * 0.5 ) > winHeight * 0.5;
};

/*
 * @desc ensures that content will always be animated regardless of its position on the page
 * @param number observerMargin - the user settings original "percentage in view"
 * @param object wrapRect - the animated wrapper's getBoundingClientRect()
 * @returns boolean - the margin to apply to the IntersectionObserver
 * @since 1.0.0
*/
export const getMaxObserverMargin = ( observerMargin, wrapRect ) => {
	const {
		pageYOffset: scrollY,
		innerHeight: winHeight,
	} = window;

	const {
		top: wrapRectTop,
		height: wrapRectHeight,
	} = wrapRect;

	const { body } = document;
	const { clientHeight: pageHeight } = body;

	const wrapTop = wrapRectTop + scrollY;
	const wrapBottom = pageHeight - wrapTop;

	const minimumTop = Math.round( ( wrapTop / winHeight ) * 100 );
	const minimumBottom = Math.round( ( wrapBottom / winHeight ) * 100 );

	const minimumMargin = Math.min( minimumTop, minimumBottom );
	const maximumMargin = Math.max( ( wrapRectHeight / winHeight ) * 100, minimumMargin );

	return Math.min( observerMargin, maximumMargin );
};

/*
 * @desc we have to manually apply margins in cases when the IE/Edge "clip" fallback is used
 *       this is because "clip" only works with position absolute and once that's applied the spacing needs correcting
 * @param HTMLElement el - the original block element
 * @param HTMLElement wrap - the animated element's wrapper
 * @returns object - the new margins to apply to the wrapper
 * @since 1.0.0
*/
export const getIeStyle = ( el, wrap ) => {
	const computedEl = window.getComputedStyle( el, null );
	const computedWrap = window.getComputedStyle( wrap, null );

	const elMarginTop = parseInt( computedEl.getPropertyValue( 'margin-top' ), 10 );
	const elMarginBottom = parseInt( computedEl.getPropertyValue( 'margin-bottom' ), 10 );

	const wrapMarginTop = parseInt( computedWrap.getPropertyValue( 'margin-top' ), 10 );
	const wrapMarginBottom = parseInt( computedWrap.getPropertyValue( 'margin-bottom' ), 10 );

	return {
		marginTop: elMarginTop + wrapMarginTop,
		marginBottom: elMarginBottom + wrapMarginBottom,
	};
};

