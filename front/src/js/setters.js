/**
 * Internal dependencies.
 */
import { defaultValues } from '../../../shared/js/data';

import { easeLookup } from '../../../shared/js/migration';

import { checkScreenBreak } from './utils';

/*
 * @desc prepares and formats animation values to be used by gsap
 * @param object props - the animation properties and their values
 * @since 1.0.0
 */
export const setAdjustProps = ( props ) => {
  const {
    pcxPosition,
    pcxClip,
    pcxEasing,
    pcxEaseReverse,
    pcxEaseDirection,
    pcxTransformOrigin,
  } = props;

  const { pcxPosition: defaultPosition } = defaultValues;

  props.pcxDelay *= 0.001;
  props.pcxDuration *= 0.001;
  props.pcxDelayReverse *= 0.001;
  props.pcxTransformOrigin = pcxTransformOrigin.replace( '-', ' ' );
  props.pcxEasing = easeLookup( `${ pcxEasing }.${ pcxEaseDirection }` );
  props.easingStagger = easeLookup( `${ pcxEasing }.easeOut` );

  if ( pcxEaseReverse ) {
    const reverseEase =
      pcxEaseDirection === 'easeOut' ? 'easeIn' : 'easeOut';
    props.easeReverse = easeLookup( `${ pcxEasing }.${ reverseEase }` );
  }

  if ( pcxPosition !== defaultPosition ) {
    const curPos = pcxPosition.split( '-' );
    const defPos = defaultPosition.split( '-' );

    const [ curPosX, curPosY ] = curPos;
    const [ defPosX, defPosY ] = defPos;

    if ( curPosX !== defPosX ) {
      props.posX = curPosX;
    }
    if ( curPosY !== defPosY ) {
      props.posY = curPosY;
    }
  }

  if ( pcxClip ) {
    const clips = pcxClip.split( '-' );
    const [ clipX, clipY ] = clips;

    props.clipX = clipX;
    props.clipY = clipY;
  }
};

/*
 * @desc overrides default settings with custom values if initated from plugin options page
 * @param object props - animation default settings
 * @param object settings - global settings data {overrides:JSON String}
 * @since 1.0.0
 */
export const setOverrides = ( props, settings ) => {
  let { overrides } = settings;

  if ( overrides ) {
    try {
      overrides = JSON.parse( overrides );
    } catch ( e ) {
      overrides = null;
    }
    if ( overrides ) {
      for ( const [ key, value ] of Object.entries( overrides ) ) {
        props[ key ] = value;
      }
      const { pcxScrollStagger, pcxPercentageInStagger } = props;

      if ( pcxScrollStagger ) {
        props.pcxPercentageIn = pcxPercentageInStagger;
      }
    }
  }
};

/*
 * @desc check if the transform origin should be reset
 * @param el HTMLElement - the animated element
 * @param array viewportWidths - the list of viewport widths to check
 * @param number|string transOriginReset - the breakpoint for the reset
 * @since 1.0.0
 */
export const setTransformOrigin = ( el, viewportWidths, transOriginReset ) => {
  const resetOrigin = checkScreenBreak( viewportWidths, transOriginReset );

  if ( ! resetOrigin ) {
    el.classList.remove( 'pcx-transform' );
  } else {
    el.classList.add( 'pcx-transform' );
  }
};

/*
 * @desc calculates scrolling information based on the IntersectionObserver.observe() event entry

 * @param object scrollState - the generic object that stores our previous scroll information
 * @param object isIntersecting - whether the element is interseting or not, from the observe event entry
 * @param object curScrollY - boundingClientRect.top from the observe event entry
 * @param object curScrollRatio - normalized intersectionRatio from the the observe event entry
 * @param object prevScrollY - the last recorded "curScrollY"
 * @param object prevScrollRatio - the last recorded "curScrollRatio"

 * @writes to @param object scrollState:
 * - @param boolean scrollingDown - page is scrolling down if true, up if false
 * - @param boolean headedIn - content is scrolling into view if true, out of view if false
 * - @param boolean started - content first came into view if true
 * - @param boolean ended - content is fully in view if true

 * @note this function fires rapidly so we write over an Object instead of creating new ones for performance considerations
 * @since 1.0.0
*/
export const setScrollState = (
  scrollState,
  isIntersecting,
  curScrollY,
  curScrollRatio,
  prevScrollY,
  prevScrollRatio
) => {
  // when scrolling slowly on iOS the IntersectionObserver event can fire without the
  // new "boundingClientRect.y" being different than its previously recorded value
  if ( curScrollY === prevScrollY ) {
    return;
  }

  let { scrollingDown, headedIn, started, ended } = scrollState;

  if ( isIntersecting ) {
    scrollingDown = curScrollY < prevScrollY;
    started = false;
    ended = false;

    if ( scrollingDown ) {
      headedIn = curScrollRatio >= prevScrollRatio;
      if ( headedIn ) {
        if ( curScrollRatio < 1 ) {
          started = true;
        } else {
          ended = true;
        }
      } else {
        started = true;
      }
    } else if ( curScrollRatio < prevScrollRatio ) {
      headedIn = false;
      started = true;
    } else {
      headedIn = true;
      if ( curScrollRatio < 1 ) {
        started = true;
      } else {
        ended = true;
      }
    }
    scrollState.scrollingDown = scrollingDown;
  } else if ( started ) {
    started = false;
    ended = true;
    headedIn = false;
  }

  scrollState.headedIn = headedIn;
  scrollState.started = started;
  scrollState.ended = ended;
};

/*
 * @desc IE fallback stuff for using "clip" instead of clip-path
 * @param HTMLElement wrap - animation's outermost wrapper
 * @param HTMLElement inner - animation's inner wrapper
 * @param HTMLElement el - original block element
 * @param object rect - block element's getBoundingClientRect()
 * @param object margins - computed margins from the block element
 * @returns a great deal of pain
 * @since 1.0.0
 */
export const setIeClip = ( wrap, inner, el, rect, margins ) => {
  const { style: wrapStyle } = wrap;
  const { style: innerStyle } = inner;
  const { style: elStyle } = el;

  /*
   * if rect is true we're animating
   * if falsy, we're resetting on resize
   */
  if ( rect ) {
    const { width, height } = rect;
    const { marginTop, marginBottom } = margins;

    wrapStyle.position = 'relative';
    wrapStyle.width = `${ width }px`;
    wrapStyle.height = `${ height }px`;
    wrapStyle.marginTop = `${ marginTop }px`;
    wrapStyle.marginBottom = `${ marginBottom }px`;
    innerStyle.position = 'absolute';
    innerStyle.width = '100%';
    elStyle.position = 'static';
    elStyle.marginTop = '0';
    elStyle.marginBottom = '0';
  } else {
    wrapStyle.position = null;
    wrapStyle.width = null;
    wrapStyle.height = null;
    wrapStyle.marginTop = null;
    wrapStyle.marginBottom = null;
    innerStyle.position = null;
    elStyle.position = null;
    elStyle.marginTop = null;
    elStyle.marginBottom = null;
  }
};
