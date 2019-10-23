/**
 * External dependencies.
 */

require( 'intersection-observer' );
require( 'requestidlecallback' );

// sandboxing gsap
import { gsap, gsapReset } from '../../../shared/js/sandbox-gsap';
require( 'gsap/umd/TweenMax' );
gsapReset();

/**
 * Internal dependencies.
 */

import {
	namespace,
	defaultValues,
} from '../../../shared/js/data';

import {
	addClasses,
	resetElement,
	checkOverflow,
	createCssReset,
	removeClasses,
	newPositions,
	checkScreens,
	checkClipPath,
	checkScreenBreak,
} from './utils';

import {
	buildAnimation,
	onUpdateTween,
} from './animation';

import {
	setIeClip,
	setOverrides,
	setScrollState,
	setAdjustProps,
	setTransformOrigin,
} from './setters';

import {
	getProps,
	getHas3D,
	getIeStyle,
	getAnimeDirection,
	getMaxObserverMargin,
} from './getters';

let pcxs;
let ioObservers;
let resizeAdded;
let overflowAdded;
let cachedWindowWidth;

const {
	supportsClipPath,
	webkitClipPath,
} = checkClipPath();

/*
 * @desc global window resize event
 * @since 1.0.0
*/
const onResizeEvent = () => {
	// solves issue where resize can be triggered from scrolling on mobile
	const winWidth = window.innerWidth;
	if ( winWidth === cachedWindowWidth ) {
		return;
	}

	pcxs.forEach( ( pcx ) => {
		if ( pcx ) {
			pcx.onResize();
		}
	} );

	cachedWindowWidth = winWidth;
};

/*
 * @desc adds global resize events after initial init
 * @since 1.0.0
*/
const addResizeEvents = () => {
	cachedWindowWidth = window.innerWidth;
	window.addEventListener( 'resize', onResizeEvent );
	resizeAdded = true;
};

/*
 * @desc loop function for the IntersectionObserver entries
 * @param object entry - IntersectionObserver entry
 * @since 1.0.0
*/
const observeForEach = ( entry ) => {
	const pcx = pcxs[ entry.target.dataset.pcx ];
	if ( pcx ) {
		pcx.observeEvt( entry );
	}
};

/*
 * @desc loop function for the IntersectionObserver "reverse" entries
 * @param object entry - IntersectionObserver entry
 * @since 1.0.0
*/
const observeForEachReverse = ( entry ) => {
	const pcx = pcxs[ entry.target.dataset.pcx ];
	if ( pcx ) {
		pcx.observeReverse( entry );
	}
};

/*
 * @desc the core observer event used for all animations
 * @param array entries - IntersectionObserver event entries
 * @since 1.0.0
*/
const observerEvent = ( entries ) => {
	entries.forEach( observeForEach );
};

/*
 * Thresholds will always be the same for the main animation observer but margins can vary
 * so observers will be reused if possible and only created if a new margin is needed
*/
const threshold = [ ...Array( 101 ).keys() ].map( ( x ) => x * 0.01 );

/*
 * @desc the initial observer used to lazy-load the real animation init for all animations
 * @since 1.0.0
*/
const rootObserver = new window.IntersectionObserver( observerEvent, {
	rootMargin: '100% 0% 100% 0%',
	threshold: 0.01,
} );

/*
 * @desc global observer listening for when elements are truly off the screen
 *       used for elements that should only animate in, but also repeat
 * @since 1.0.0
*/
let reverseObserver;
const createReverseObserver = () => {
	if ( ! reverseObserver ) {
		reverseObserver = new window.IntersectionObserver( ( entries ) => {
			entries.forEach( observeForEachReverse );
		}, { threshold: 0.01 } );
	}
};

/*
 * @desc clean up observers after an instance has been destroyed
 * @param string observerKey - the ioObserver key in the global ioObservers Object
 * @param object ioObserver - the IntersectionObserver being used by the PolishedContent class instance
 * @since 1.0.0
*/
const cleanupObservers = ( observerKey, ioObserver ) => {
	let observerNeeded;
	const len = pcxs.length;

	for ( let i = 0; i < len; i++ ) {
		const pcx = pcxs[ i ];
		if ( pcx && pcx.observerKey === observerKey ) {
			observerNeeded = true;
			break;
		}
	}

	// if the ioObserver is no longer needed we can get rid of it
	if ( ! observerNeeded ) {
		if ( ioObserver ) {
			ioObserver.disconnect();
		}
		delete ioObservers[ observerKey ];
	}
};

/*
 * @desc cleans up all animation instances
 * @since 1.0.0
*/
const cleanUpPcxs = () => {
	window.removeEventListener( 'resize', onResizeEvent );

	resizeAdded = false;
	rootObserver.disconnect();

	if ( reverseObserver ) {
		reverseObserver.disconnect();
	}

	pcxs.forEach( ( pcx ) => {
		if ( pcx ) {
			pcx.destroy( true );
		}
	} );
};

/*
 * @desc checks if the animation has already been added to the element
 * @param HTMLElement el - the block element to animate
 * @since 1.0.0
*/
const hasPcx = ( el ) => {
	const len = pcxs.length;

	for ( let i = 0; i < len; i++ ) {
		const pcx = pcxs[ i ];
		if ( pcx && pcx.el === el ) {
			return true;
		}
	}

	return false;
};

/*
 * @desc will be exposed as window.polishedContent
 * @since 1.0.0
*/
const polishedContent = {
	/*
	 * @desc optional API method that attaches animations to elements at run time
	 * @param string/HTMLElement/NodeList/Object settings - selector or elements to add animation classes to
	 * @param object classes - animation classes to add copied from the block editor
	 * @since 1.0.0
	*/
	add: ( selector, classes ) => {
		if ( typeof classes !== 'string' ) {
			return;
		}
		if ( typeof jQuery !== 'undefined' && selector instanceof jQuery ) { // eslint-disable-line no-undef
			selector.addClass( `${ namespace } ${ classes }` );
		} else {
			const classNames = classes.replace( /  +/g, ' ' ).trim().split( ' ' );
			classNames.unshift( namespace );

			if ( typeof selector === 'string' ) {
				document.querySelectorAll( selector ).forEach( ( el ) => addClasses( el, classNames ) );
			} else if ( 'length' in selector ) {
				selector.forEach( ( el ) => addClasses( el, classNames ) );
			} else {
				addClasses( selector, classNames );
			}
		}
	},
	/*
	 * @desc called once from inline script when WP "the_content()" hits the page
	 * @param object settings - global settings data {allowedBlocks:String}
	 * @since 1.0.0
	*/
	run: ( settings ) => {
		/*
		 * if "pcxs" exists here it means the page's content was replaced
		*/
		if ( pcxs ) {
			cleanUpPcxs();
		}

		pcxs = [];
		ioObservers = {};
		reverseObserver = null;

		// loop through all blocks that should be animated
		document.querySelectorAll( `[class*=${ namespace }]` ).forEach( ( el ) => {
			// only create a new instance if it didn't previously exist
			if ( ! hasPcx( el ) ) {
				pcxs.push( new PolishedContentInit( el, pcxs.length, settings ) );
			}
		} );
	},
};

/*
 * @desc essentially lazy-loads the PolishedContent class allowing us to only
         make the initial DOM manipulation when we're actually going to animate
 * @param HTMLElement el - the element to animate
 * @param number index - the animations index in the global "pcxs" Array
 * @param object settings - global settings data {allowedBlocks:String, viewportWidths:Array}
 * @since 1.0.0
*/
class PolishedContentInit {
	constructor( el, index, settings ) {
		const props = getProps( el );

		if ( ! props ) {
			removeClasses( el );
			return;
		}

		// override props from global admin options
		setOverrides( props, settings );

		// merge props with defaults
		const mergedProps = { ...defaultValues, ...props };

		const {
			pcxDesktop,
			pcxLaptop,
			pcxTablet,
			pcxSmartphone,
		} = mergedProps;

		const {
			viewportWidths,
		} = settings;

		const enabledViews = [
			pcxDesktop,
			pcxLaptop,
			pcxTablet,
			pcxSmartphone,
		];

		this.el = el;
		this.index = index;
		this.props = mergedProps;
		this.attributes = props;
		this.settings = settings;
		this.enabledViews = enabledViews;
		this.viewportWidths = viewportWidths;

		el.dataset.pcx = index;
		const enabledView = checkScreens( enabledViews, viewportWidths );

		if ( enabledView ) {
			this.observing = true;
			rootObserver.observe( this.el );
		}
		if ( ! resizeAdded ) {
			addResizeEvents();
		}
	}

	onResize() {
		const enabledView = checkScreens( this.enabledViews, this.viewportWidths );

		if ( enabledView ) {
			if ( ! this.observing ) {
				this.observing = true;
				rootObserver.observe( this.el );
			}
		} else {
			this.observing = false;
			rootObserver.unobserve( this.el );
		}
	}

	observeEvt( entry ) {
		const { isIntersecting } = entry;

		if ( isIntersecting ) {
			rootObserver.unobserve( this.el );
			this.ready();
		}
	}

	ready() {
		pcxs[ this.index ] = null;
		pcxs.push(
			new PolishedContentAnimation(
				this.el,
				pcxs.length,
				this.props,
				this.attributes,
				this.settings,
				this.enabledViews,
				this.viewportWidths,
			)
		);

		this.el = null;
		this.props = null;
		this.settings = null;
		this.enabledViews = null;
	}
}

/*
 * @desc class that handles a single animated block
 * @param HTMLElement el - the element to animate
 * @param number index - the animations index in the global "pcxs" Array
 * @param object settings - global settings data {allowedBlocks:String, viewportWidths:Array}
 * @since 1.0.0
*/
class PolishedContentAnimation {
	constructor( el, index, props, attributes, settings, enabledViews, viewportWidths ) {
		const wrap = document.createElement( `${ namespace }` );
		const inner = document.createElement( `${ namespace }` );

		const {
			addOverflow,
			inheritMargins,
		} = settings;

		const {
			pcxMask,
			pcxFloat,
			pcxAlign,
			pcxClass,
			pcxInherit,
			pcxLetterSpacing,
		} = props;

		let {
			pcxInline,
		} = props;

		const inheritClass = inheritMargins || pcxInherit ? ' pcx-inherit' : '';
		inner.className = `${ namespace } pcx-inner${ inheritClass }`;

		let wrapClass = 'pcx-wrap';
		if ( pcxClass ) {
			wrapClass += ` ${ pcxClass.replace( '-pcx-', ' ' ) }`;
		}
		if ( pcxMask ) {
			wrapClass += ' pcx-mask';
		}
		if ( pcxFloat !== 'none' ) {
			wrapClass += ` pcx-float-${ pcxFloat }`;
		}
		if ( pcxLetterSpacing ) {
			pcxInline = true;
			wrapClass += ' pcx-chars';
		}
		if ( pcxInline ) {
			wrapClass += ' pcx-inline';
			if ( pcxAlign !== 'left' ) {
				wrapClass += ' pcx-align';
				wrapClass += pcxAlign === 'center' ? ' pcx-center' : '';
			}
		}

		wrap.className = wrapClass;
		wrap.appendChild( inner );
		wrap.dataset.pcx = index;

		el.parentNode.insertBefore( wrap, el );
		inner.appendChild( el );

		removeClasses( el );
		setAdjustProps( props );

		let ieClip;
		if ( ! supportsClipPath ) {
			const {
				clipX,
				clipY,
			} = props;

			ieClip = clipX !== 'center' || clipY !== 'center';
		}

		// setup what CSS should be reset on concurrent animations
		this.resetProps = createCssReset( attributes, ieClip );

		// check if overflow-x should be added to the body element
		if ( addOverflow && ! overflowAdded ) {
			overflowAdded = checkOverflow( props );
		}

		const {
			posX,
			posY,
			pcxReverse,
			pcxStrength,
			pcxScrollStagger,
			pcxScrollType,
			pcxEasing,
			pcxDelay,
			pcxDelayReverse,
			pcxPercentageIn,
			pcxDuration,
			pcxDelayBreak,
			pcxTransformReset,
			easingStagger,
			easeReverse,
		} = props;

		this.el = el;
		this.inner = inner;
		this.wrap = wrap;
		this.index = index;
		this.props = props;

		// if animation has a 3D property we will need
		// to add a CSS perspective when the timeline is created
		this.has3D = getHas3D( props );

		this.stagger = pcxScrollStagger;
		this.reverseProps = pcxReverse;

		this.enabledViews = enabledViews;
		this.viewportWidths = viewportWidths;

		const repeat = pcxScrollType === 'each';
		const reverse = pcxScrollType === 'both';

		const reverseDelay = reverse ? pcxDelayReverse : null;
		const hasDelay = pcxDelay || reverseDelay;

		const {
			pcxDelayBreak: defDelayBreak,
			pcxTransformReset: defTransformReset,
		} = defaultValues;

		if ( pcxDelayBreak !== defDelayBreak ) {
			this.delayBreak = pcxDelayBreak;
			this.breakDelay = checkScreenBreak( viewportWidths, pcxDelayBreak );
		}

		if ( pcxTransformReset !== defTransformReset ) {
			this.transOriginReset = pcxTransformReset;
		}

		this.repeat = repeat;
		this.delay = pcxDelay;
		this.reverse = reverse;
		this.reverseDelay = reverseDelay;
		this.reverseObserverNeeded = reverse && hasDelay;

		const hasPosition = posX || posY || ieClip;
		this.hasPixelPosition = ( hasPosition && pcxStrength === 'max' ) || ieClip;

		// the margin can't be "50%" or "0%" because then the observer event might not fire
		this.originalMargin = Math.max( Math.min( pcxPercentageIn, 49 ), 1 );

		this.duration = pcxDuration;
		this.endTime = pcxDuration * 2;

		this.easing = pcxEasing;
		this.easeReverse = easeReverse;
		this.easingStagger = easingStagger;

		this.ieClip = ieClip;
		this.hasPositionSetting = hasPosition;
		this.animeParams = { ease: pcxEasing, overwrite: 'all' };

		this.initScroll();
		this.initTween();
		this.initObserve();
	}

	isIdle = true;
	point = 'start';
	prevScrollY = 0;
	prevScrollRatio = 0;
	scrollState = {};

	/*
	 * @desc create an IntersectionObserver if needed and start observing the element
	 * @since 1.0.0
	*/
	initObserve() {
		// observerKey is equal to the user's "percentage in view" margin
		// then we have one observer per unique margin
		const {
			observerKey,
		} = this;

		if ( ioObservers[ observerKey ] === undefined ) {
			ioObservers[ observerKey ] = new window.IntersectionObserver( observerEvent, {
				threshold,
				rootMargin: `-${ observerKey }% 0% -${ observerKey }% 0%`,
			} );
		}

		ioObservers[ observerKey ].observe( this.wrap );

		if ( this.repeat || this.reverseObserverNeeded ) {
			createReverseObserver();
			reverseObserver.observe( this.wrap );
		}
	}

	/*
	 * @desc observe event for elements are only supposed to animate in but also repeat
	 * @since 1.0.0
	*/
	observeReverse( entry ) {
		const {
			rootBounds,
			isIntersecting,
		} = entry;

		// element has been removed from the DOM if rootBounds is null
		if ( ! rootBounds ) {
			this.destroy();
			return;
		}

		if ( ! isIntersecting ) {
			if ( this.repeat ) {
				this.updateTimeline( this.point );
				this.started = false;
			} else if ( this.animeParams.delay && this.tween && ! this.tween.isActive() ) {
				this.updateTimeline( this.point );
			}
		}
	}

	/*
	 * @desc prepare initial scroll values for the observe event
	 * @since 1.0.0
	*/
	initScroll() {
		this.started = false;
		this.scrolled = false;
		this.observed = false;
		this.elRect = this.el.getBoundingClientRect();
		this.wrapRect = this.wrap.getBoundingClientRect();
		this.scrollDown = getAnimeDirection( this.elRect );
		this.observerKey = getMaxObserverMargin( this.originalMargin, this.wrapRect );

		if ( this.transOriginReset ) {
			setTransformOrigin( this.inner, this.viewportWidths, this.transOriginReset );
		}
	}

	/*
	 * @desc create a new TimelineMax and set its initial position
	 * @since 1.0.0
	*/
	initTween() {
		this.createTimeline();

		if ( this.observed ) {
			this.timeline.seek( this.point );
		} else if ( ! this.scrollDown && this.propsReversed ) {
			this.point = 'end';
			this.timeline.seek( 'end' );
		}
	}

	/*
	 * @desc cancel window resize throttle timers
	 * @since 1.0.0
	*/
	cancelTimers() {
		window.cancelIdleCallback( this.idleCallback );
		window.cancelAnimationFrame( this.requestCallback );
	}

	/*
	 * @desc window resize timer second throttle cycle
	 * @since 1.0.0
	*/
	onSecondRequestAnime = () => {
		this.killTimeline();
		// we have a new "point" from the observe event now so we can recreate the timeline
		this.initTween();
	}

	/*
	 * @desc window resize timer second throttle cycle
	 * @since 1.0.0
	*/
	onSecondIdleRequest = () => {
		this.cancelTimers();

		// a second throttle initiated from "onRequestAnime"
		this.requestCallback = window.requestAnimationFrame( this.onSecondRequestAnime );
	}

	/*
	 * @desc window resize timer throttling is complete or we may need a second cycle
	 * @since 1.0.0
	*/
	onRequestAnime = () => {
		this.cancelTimers();
		this.initScroll();

		const enabledView = checkScreens( this.enabledViews, this.viewportWidths );

		if ( enabledView ) {
			const observer = ioObservers[ this.observerKey ];

			if ( this.delayBreak ) {
				this.breakDelay = checkScreenBreak( this.viewportWidths, this.delayBreak );
			}

			if ( observer ) {
				ioObservers[ this.observerKey ].observe( this.wrap );
			} else {
				this.initObserve();
			}

			// we only need to recreate the timline if the animation has a pixel based translateX/Y
			// as those numbers need to be recalculated after resizing
			if ( this.timeline && this.hasPixelPosition ) {
				// a second round of throttling allows us to get a new observe event record before we recreate the timeline again
				// as we need an accurate "point" (where the timline should be positioned)
				this.idleCallback = window.requestIdleCallback( this.onSecondIdleRequest );
			}
		} else if ( this.timeline ) {
			this.timeline.seek( 'middle' );
		}
	}

	/*
	 * @desc window resize timer throttling
	 * @since 1.0.0
	*/
	onIdleRequest = () => {
		this.cancelTimers();
		this.requestCallback = window.requestAnimationFrame( this.onRequestAnime );
	}

	/*
	 * @desc called from global window resize event handler,
	         needed for calculating animations with translateX/Y is pixel based
	 * @since 1.0.0
	*/
	onResize() {
		// if "this.observerKey" is undefined here it means the instance was destroyed
		if ( this.observerKey === undefined ) {
			return;
		}
		const {
			onComplete,
		} = this.animeParams;

		if ( onComplete ) {
			this.destroy();
			return;
		}

		this.isIdle = false;
		this.cancelTimers();
		const observer = ioObservers[ this.observerKey ];

		if ( observer ) {
			observer.unobserve( this.wrap );
		}

		if ( this.timeline && this.hasPixelPosition ) {
			this.timeline.pause();

			if ( this.ieClip ) {
				setIeClip( this.wrap, this.inner, this.el, false );
			}
		}

		// start the throttling before we begin to observe and animate again
		this.idleCallback = window.requestIdleCallback( this.onIdleRequest );
	}

	/*
	 * @desc create a new TimelineMax for the animation
	 * @since 1.0.0
	*/
	createTimeline() {
		if ( this.has3D ) {
			const { pcxPerspective } = this.props;
			const isDefault = isNaN( pcxPerspective );
			this.wrap.style.perspective = isDefault ? pcxPerspective : `${ pcxPerspective }px`;
		}

		// reset CSS on element
		resetElement( this.inner, this.resetProps );
		const positions = newPositions( this.wrapRect, this.props, this.reverseProps );

		let clipRect;
		if ( this.ieClip ) {
			clipRect = this.elRect;
			setIeClip( this.wrap, this.inner, this.el, clipRect, getIeStyle( this.el, this.wrap ) );
		}

		const animeProps = { ...positions, ...this.props };
		const animation = buildAnimation( this.inner, animeProps, this.reverseProps, this.observed, clipRect, webkitClipPath );

		const {
			render,
			timeline,
			twObjects,
			propsReversed,
		} = animation;

		this.render = render;
		this.timeline = timeline;
		this.twObjects = twObjects;
		this.propsReversed = propsReversed || this.hasPositionSetting;

		if ( ! this.classRemoved ) {
			this.classRemoved = true;
			this.inner.classList.remove( `${ namespace }` );
		}
	}

	/*
	 * @desc animation is no longer needed so kill the timeline and tweens
	 * @since 1.0.0
	*/
	killTimeline() {
		if ( this.timeline ) {
			this.timeline.kill();
			gsap.TweenMax.killTweensOf( this.twObjects.concat( [ this.inner, this.timeline ] ) );
		}
	}

	/*
	 * @desc animation is no longer needed to stop observing
	 * @since 1.0.0
	*/
	instanceEnd() {
		const observer = ioObservers[ this.observerKey ];

		if ( observer ) {
			observer.unobserve( this.wrap );
		}
		pcxs[ this.index ] = null;

		// delete IntersectionObservers if they aren't being used by other elements
		cleanupObservers( this.observerKey, observer );
	}

	/*
	 * @desc kills running tweens and seeks the timeline to the pre-calculated point
	         and also calls a "render" on the timeline in case we need to manually
			 trigger the timeline.onUpdate function (blurs, clips, etc.)
	 * @param number/string point - the point in the timeline to seek to
	 * @since 1.0.0
	*/
	updateTimeline( point ) {
		this.seekTimeline( point );

		if ( this.render ) {
			onUpdateTween( this.render );
		}
	}

	/*
	 * @desc kills running tweens and seeks the timeline to the pre-calculated point
	 * @param number/string point - the point in the timeline to seek to
	 * @since 1.0.0
	*/
	seekTimeline( point ) {
		gsap.TweenMax.killTweensOf( this.timeline );
		this.timeline.seek( point );
	}

	/*
	 * @desc sets the correct delay before a tween begins
	 * @param number point - the point the timeline will be heading toward
	 * @since 1.0.0
	*/
	setEaseDelay( point, reverse ) {
		let delay;

		if ( this.delayBreak && this.breakDelay ) {
			delay = 0;
		} else if ( this.point === 'start' || point === 'end' ) {
			delay = this.delay;
		} else {
			delay = this.reverseDelay !== null ? this.reverseDelay : this.delay;
		}

		if ( this.easeReverse ) {
			if ( ! reverse ) {
				this.animeParams.ease = this.easing;
			} else {
				this.animeParams.ease = this.easeReverse;
			}
		}

		this.animeParams.delay = delay;
	}

	/*
	 * @desc called from the core IntersectionObserver event
	 * @param object entry - IntersectionObserver event entry
	 * @since 1.0.0
	*/
	observeEvt( entry ) {
		const {
			rootBounds,
			isIntersecting,
			intersectionRect,
			boundingClientRect,
		} = entry;

		// element has been removed from the DOM if rootBounds is null
		if ( ! rootBounds ) {
			this.destroy();
			return;
		}

		const curScrollY = boundingClientRect.top;
		let intersectRatio = entry.intersectionRatio;

		// normalize % for elements that are taller than the window
		if ( boundingClientRect.height > rootBounds.height ) {
			intersectRatio = intersectionRect.height / rootBounds.height;
		}

		// tells us if the user is scrolling down or up
		// and if the element should be animating in or out
		setScrollState(
			this.scrollState,
			isIntersecting,
			curScrollY,
			intersectRatio,
			this.prevScrollY,
			this.prevScrollRatio
		);

		const {
			scrollingDown,
			headedIn,
		} = this.scrollState;

		let scrollDown;
		let point;

		/*
		 * In cases when the page hasn't been scrolled yet our "setScrollState" data
		 * will be useless, as we have no previous scroll data to compare to.
		 * In those cases we need to fall back to our pre-calculated value
		 * which is manually calculated from how the element fits inside the window
		*/
		if ( this.scrolled ) {
			scrollDown = scrollingDown;
		} else {
			scrollDown = this.scrollDown;
		}

		// "stagger" is if the animation should be based on the scroll position or not
		if ( ! this.stagger ) {
			if ( isIntersecting ) {
				// make sure this only executes once when in view
				if ( ! this.started ) {
					// stop observing if we're only supposed to animate once
					if ( ! this.repeat && ! this.reverse ) {
						this.animeParams.onComplete = this.destroy;
						this.instanceEnd();
					}

					this.started = true;
					point = 'middle';

					// "isIdle" will be false if the user is resizing the window
					if ( this.isIdle ) {
						this.setEaseDelay( point );
						this.tween = this.timeline.tweenTo( point, { ...this.animeParams } );
					} else {
						this.seekTimeline( point );
					}
				}
			} else if ( this.timeline && this.started ) {
				// "scrollDown" from "setScrollState" is unreliable here so we have to manually calculate it
				scrollDown = getAnimeDirection( boundingClientRect );
				point = ! this.propsReversed || scrollDown ? 'start' : 'end';

				if ( this.reverse ) {
					// "isIdle" will be false if the user is resizing the window so we will only animate when idle
					if ( this.isIdle ) {
						this.setEaseDelay( point, true );
						this.tween = this.timeline.tweenTo( point, { ...this.animeParams } );
					} else {
						this.updateTimeline( point );
					}

					this.started = false;
				}
			}
		} else {
			if ( isIntersecting ) {
				if ( headedIn || ! this.repeat ) {
					const minRatio = Math.min( intersectRatio, 1 );
					const forwardPoint = minRatio * this.duration;
					const reversePoint = ! this.propsReversed ? forwardPoint : this.endTime - forwardPoint;

					// if the user has scrolled at least once we can safely use our "setScrollState" data
					// otherwise we use the precalculated data from "getAnimeDirection"
					if ( this.scrolled ) {
						if ( scrollDown ) {
							point = headedIn ? forwardPoint : reversePoint;
						} else {
							point = headedIn ? reversePoint : forwardPoint;
						}
					} else if ( scrollDown ) {
						point = forwardPoint;
					} else {
						point = reversePoint;
					}

					// stop observing if we're only supposed to animate once
					if ( ! this.reverse && ! this.repeat && point === this.duration ) {
						this.animeParams.onComplete = this.destroy;
						this.instanceEnd();
					}

					// "isIdle" will be false if the user is resizing the window so we will only animate when idle
					if ( this.isIdle ) {
						this.timeline.tweenTo( point, { ...this.animeParams } );
					} else {
						this.seekTimeline( point );
					}
				}
			} else {
				// "scrollDown" from "setScrollState" is unreliable here so we have to manually calculate it
				scrollDown = getAnimeDirection( boundingClientRect );

				if ( scrollDown ) {
					point = 0;
				} else {
					point = ! this.propsReversed ? 0 : this.endTime;
				}
				if ( this.reverse ) {
					// "isIdle" will be false if the user is resizing the window so we will only animate when idle
					if ( this.isIdle ) {
						this.timeline.tweenTo( point, { ...this.animeParams } );
					} else {
						this.seekTimeline( point );
					}
				}
			}
			// allow easeIn and easeInOut on very first tween when the content might be idle and in view
			// then always reset to easeOut after the first tween so the animations always appear to "respond" to scrolling
			this.animeParams.ease = this.easingStagger;
		}

		// store the point so we know where to position the content in case the user is resizing the window
		if ( point !== undefined ) {
			this.point = point;
			this.observed = true;
		}

		this.isIdle = true;
		this.scrolled = true;
		this.prevScrollY = curScrollY;
		this.prevScrollRatio = intersectRatio;
	}

	/*
	 * @desc animation is no longer needed so do some garbage collection
	 * @param boolean complete - cleanup coming from a page content refresh
	 * @since 1.0.0
	*/
	destroy = ( complete ) => {
		this.cancelTimers();
		const observer = ioObservers[ this.observerKey ];

		if ( observer ) {
			if ( ! complete ) {
				observer.unobserve( this.wrap );
			} else {
				observer.disconnect();
			}
		}

		if ( reverseObserver && this.repeat ) {
			if ( ! complete ) {
				reverseObserver.unobserve( this.wrap );
			} else {
				reverseObserver.disconnect();
			}
		}

		this.killTimeline();

		if ( this.ieClip ) {
			setIeClip( this.wrap, this.inner, this.el );
		}

		// delete all objects attached to this class on destroy
		this.el = null;
		this.wrap = null;
		this.inner = null;
		this.props = null;
		this.resetProps = null;
		this.scrollState = null;
		this.animeParams = null;
		this.timeline = null;
		this.twObjects = null;
		this.observerKey = null;
		this.tween = null;
	}
}

// exposing global variable to be called from inline WP script
window.polishedContent = polishedContent;
