/**
 * External dependencies.
 */
import gsap from 'gsap';

/**
 * Internal dependencies.
 */
import { easeLookup } from '../../../../shared/js/migration';

import {
  defaultValues,
  clipPoints,
  tweenables,
} from '../../../../shared/js/data';

import { getPositions } from './utils';

/*
 * only animating this on the front-end
 */
delete tweenables.pcxLetterSpacing;

/*
 * @desc kills an animation and possibly resets its styles
 * @param HTMLElement el - the animated element
 * @param boolean resetStyle - reset the element's styles or not
 * @since 1.0.0
 */
export const resetAnimation = ( el, resetStyle ) => {
  const { globalTimeline, set: setStyles } = gsap;
  globalTimeline.clear();

  if ( resetStyle ) {
    setStyles( el, {
      opacity: 1,
      transform: 'none',
      '-webkit-filter': 'none',
      filter: 'none',
      'clip-path': 'none',
    } );
  }
};

/*
 * @desc animates special properties blur, grayscale and clip-path
 * @param HTMLElement el - the animated element
 * @param object obj - the generic object being animated
 * @param boolean animateFilter - true if we should animate the blur or grayscale filters
 * @param array clips - an array of booleans that determine which clip points should be animated
 * @param string clip - the clip-path setting for the animation
 * @since 1.0.0
 */
const onUpdateTween = ( el, obj, animateFilter, clips, clip ) => {
  if ( animateFilter ) {
    const filters = `blur(${ obj.blur }px) grayscale(${ obj.grayscale })`;

    el.style[ '-webkit-filter' ] = filters;
    el.style.filter = filters;
  }
  if ( clip !== 'center-center' ) {
    let st = 'inset(';
    for ( let i = 0; i < 4; i++ ) {
      st += ! clips[ i ] ? '0 ' : `${ obj.clip }% `;
    }

    el.style.clipPath = `${ st.slice( 0, -1 ) })`;
  }
};

/*
 * @desc animates special properties blur, grayscale and clip-path
 * @param HTMLElement el - the animated element
 * @param HTMLElement container - the animated element's parent container
 * @param object props - the current animation settings
 * @since 1.0.0
 */
export const playAnimation = ( el, container, props ) => {
  resetAnimation( el, true );

  const currentValues = { ...props };
  currentValues.pcxDelay *= 0.001;
  currentValues.pcxDuration *= 0.001;
  currentValues.pcxEasing = easeLookup(
    `${ currentValues.pcxEasing }.${ currentValues.pcxEaseDirection }`
  );
  el.style.transformOrigin = currentValues.pcxTransformOrigin.replace(
    '-',
    ' '
  );

  const animeObj = {};
  const tweenObj = { delay: currentValues.pcxDelay };

  const twObj = {
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.75,
    delay: 0.2,
    ease: currentValues.pcxEasing,
    duration: currentValues.pcxDuration,
  };
  const elObj = {
    x: 0,
    y: 0,
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.75,
    delay: 0.2,
    ease: currentValues.pcxEasing,
    duration: currentValues.pcxDuration,
  };

  let filter;
  let clips;
  const clip = currentValues.pcxClip;

  // push simple values that don't require any calculation
  for ( const [ key, value ] of Object.entries( tweenables ) ) {
    const prop = value.prop;
    const times = value.times;

    elObj[ prop ] = currentValues[ key ] * times;
  }

  // caluclate x and y
  if ( currentValues.pcxPosition !== defaultValues.pcxPosition ) {
    const curPos = currentValues.pcxPosition.split( '-' );
    const defPos = defaultValues.pcxPosition.split( '-' );

    if ( curPos[ 0 ] !== defPos[ 0 ] || curPos[ 1 ] !== defPos[ 1 ] ) {
      const position = getPositions(
        el,
        container,
        curPos[ 0 ],
        curPos[ 1 ],
        currentValues.pcxStrength
      );
      elObj.x = position.x;
      elObj.y = position.y;
    }
  }

  // calculate filters
  if (
    currentValues.pcxBlur !== defaultValues.pcxBlur ||
    currentValues.pcxGrayscale !== defaultValues.pcxGrayscale
  ) {
    filter = true;

    twObj.blur = currentValues.pcxBlur;
    animeObj.blur = 0;

    twObj.grayscale = currentValues.pcxGrayscale * 0.01;
    animeObj.grayscale = 0;

    tweenObj.onUpdateParams = [ el, animeObj, filter, clips, clip ];
    tweenObj.onUpdate = onUpdateTween;
  }

  if ( clip !== 'center-center' ) {
    clips = clipPoints[ clip ];
    twObj.clip = 100;
    animeObj.clip = 0;

    tweenObj.onUpdateParams = [ el, animeObj, filter, clips, clip ];
    tweenObj.onUpdate = onUpdateTween;
  }

  const { timeline } = gsap;
  const tl = new timeline( tweenObj );

  tl.from( el, elObj );
  tl.from( animeObj, twObj, 0 );
};
