/**
 * External dependencies.
 */
import gsap from 'gsap';

/**
 * Internal dependencies.
 */
import { defaultValues, tweenables, clipPoints } from '../../../shared/js/data';

import { getReversable } from './getters';

/*
 * @desc the "onUpdate" event for the TimelineMax.  Handles blur/grayscale/clip-path animations
 * @param object obj - the generic object being tweened that contains the animated values
 * @param HTMLElement el - the animated element
 * @param boolean updateBlur - if the blur filter should be animated
 * @param boolean updateGrayscale - if the grayscale filter should be animated
 * @param boolean updateClip - if the clip-path should be animated
 * @param array clips - an array of booleans that determine which clip points need to be animated
 * @since 1.0.0
 */
export const onUpdateTween = (
	obj,
	el,
	updateBlur,
	updateGrayscale,
	updateChars,
	updateClip,
	clips,
	clipRect
) => {
	if ( updateBlur || updateGrayscale ) {
		let filter = '';
		if ( updateBlur ) {
			filter += `blur(${ obj.blur }px)`;
		}

		if ( updateGrayscale ) {
			if ( filter ) {
				filter += ' ';
			}
			filter += `grayscale(${ obj.grayscale })`;
		}

		el.style[ '-webkit-filter' ] = filter;
		el.style.filter = filter;
	}

	if ( updateChars ) {
		el.style.letterSpacing = `${ obj.letterSpacing }px`;
	}

	if ( updateClip ) {
		if ( ! clipRect ) {
			let st = 'inset(';

			for ( let i = 0; i < 4; i++ ) {
				st += ! clips[ i ] ? '0 ' : `${ obj.clip }% `;
			}
			el.style.webkitClipPath = `${ st.slice( 0, -1 ) })`;
			el.style.clipPath = `${ st.slice( 0, -1 ) })`;
		} else {
			/*
			 * IE/Edge Fallback
			 */
			const { width, height } = clipRect;

			const neg = obj.clip * 0.01;
			const pos = 1 - neg;

			const ieCalc = [
				clips[ 0 ] ? height * neg : 0,
				clips[ 1 ] ? width * pos : width,
				clips[ 2 ] ? height * pos : height,
				clips[ 3 ] ? width * neg : 0,
			];

			let st = 'rect(';
			for ( let i = 0; i < 4; i++ ) {
				st += `${ ieCalc[ i ] }px,`;
			}

			el.style.clip = `${ st.slice( 0, -1 ) })`;
		}
	}
};

/*
 * @desc creates objects with animatable values to be added to the timeline
 * @param HTMLElement el - the animated element
 * @param object props - the animation's properties
 * @param boolean reverse - if the timeline should be prepared for reverse animations
 * @returns boolean - true: it's below, false: it's above
 * @since 1.0.0
 */
const buildTweenObjects = ( el, props, reverse, clipRect, webkitClipPath ) => {
	const {
		clipX,
		clipY,
		pcxBlur,
		pcxGrayscale,
		pcxLetterSpacing,
		pcxTransformOrigin,
	} = props;

	const twObj = { ease: 'none', overwrite: 'auto' };
	const elObj = { ease: 'none', overwrite: 'auto' };

	if ( ! reverse || ! props.reversePos ) {
		elObj.x = props.forwardPos.x;
		elObj.y = props.forwardPos.y;
	} else {
		elObj.x = props.reversePos.x;
		elObj.y = props.reversePos.y;
	}

	let clips;
	let specialObj = {};
	let render;

	const hasBlur = pcxBlur !== defaultValues.pcxBlur;
	const hasGrayscale = pcxGrayscale !== defaultValues.pcxGrayscale;
	const hasClip = clipX !== 'center' || clipY !== 'center';

	for ( const [ key, value ] of Object.entries( tweenables ) ) {
		const { prop, times } = value;
		elObj[ prop ] = props[ key ] * times;
	}

	if ( pcxTransformOrigin ) {
		elObj.transformOrigin = pcxTransformOrigin;
	}

	if ( hasBlur ) {
		twObj.blur = pcxBlur;
		specialObj.blur = 0;
	}

	if ( hasGrayscale ) {
		twObj.grayscale = pcxGrayscale * 0.01;
		specialObj.grayscale = 0;
	}

	if ( pcxLetterSpacing ) {
		twObj.letterSpacing = pcxLetterSpacing;
		specialObj.letterSpacing = 0;
	}

	if ( hasClip ) {
		clips = clipPoints[ `${ clipX }-${ clipY }` ];
		twObj.clip = 100;
		specialObj.clip = 0;
	}

	// safari hack
	if ( webkitClipPath ) {
		elObj.z = 0.00001;
	}

	if ( ! hasBlur && ! hasGrayscale && ! hasClip && ! pcxLetterSpacing ) {
		specialObj = false;
	} else {
		render = [
			twObj,
			el,
			hasBlur,
			hasGrayscale,
			pcxLetterSpacing,
			hasClip,
			clips,
			clipRect,
		];
		twObj.onUpdateParams = [
			specialObj,
			el,
			hasBlur,
			hasGrayscale,
			pcxLetterSpacing,
			hasClip,
			clips,
			clipRect,
		];
		twObj.onUpdate = onUpdateTween;
	}

	return {
		elObj,
		twObj,
		render,
		specialObj,
	};
};

/*
 * @desc creates a new TimelineMax for the animation
 * @param HTMLElement el - the animated element
 * @param object props - the animation's properties
 * @param boolean reverse - if the timeline should be prepared for reverse animations
 *   If an element animates into view from the left,
 *   ... when the element eventaully animates out of view it will continue to animate in the same direction.
 *   To accomplish this the timeline is duplicated and then extended with the starting values reversed.
 * @returns object - {TimelineMax:Object, propsReversed:Boolean, twObjects:Array}
 * @since 1.0.0
 */
export const buildAnimation = (
	el,
	props,
	reverse,
	observed,
	clipRect,
	webkitClipPath
) => {
	const propsTwo = { ...props };

	let propsReversed;
	if ( reverse ) {
		propsReversed = getReversable( propsTwo );
	}

	const tween = buildTweenObjects(
		el,
		props,
		false,
		clipRect,
		webkitClipPath
	);
	const reverseTween = buildTweenObjects(
		el,
		propsTwo,
		reverse,
		clipRect,
		webkitClipPath
	);

	const timeline = new gsap.timeline( { paused: true } );
	const { pcxDuration: duration } = props;

	timeline.addLabel( 'start', 0 );
	timeline.from( el, duration, tween.elObj );

	if ( tween.specialObj ) {
		// call onUpdate function once to render blur/grayscale/clip-path
		if ( ! observed ) {
			onUpdateTween( ...tween.render );
		}
		timeline.from( tween.specialObj, duration, tween.twObj, 0 );
	}

	timeline.addLabel( 'middle', duration );
	timeline.to( el, duration, reverseTween.elObj );

	// extend the timeline if we should reverse
	if ( reverseTween.specialObj ) {
		timeline.to(
			reverseTween.specialObj,
			duration,
			reverseTween.twObj,
			duration
		);
	}
	timeline.addLabel( 'end', duration * 2 );

	return {
		timeline,
		propsReversed,
		render: tween.render,
		twObjects: [ tween.specialObj, reverseTween.specialObj ],
	};
};
