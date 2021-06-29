/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import {
  selectOptions,
  mainDefaults,
  defaultValues,
  animatable,
  customPreset,
  animationCore,
  transformable,
} from '../../../../shared/js/data';

/*
 * @desc verifies objects for block hooks just in case
 * @param object args - the array of arguments to verify
 * @returns boolean - if the arguments are what we expected
 * @since 1.0.0
 */
const verifyObjects = ( objects ) => {
  const len = objects.length;

  for ( let i = 0; i < len; i++ ) {
    if (
      typeof objects[ i ] !== 'object' &&
      typeof objects[ i ] !== 'function'
    ) {
      return false;
    }
  }

  return true;
};

/*
 * @desc figures out what classes need to be added to the block for the animation
 * @param object attrs - the block's current attributes
 * @returns object - if classes should be added and the list of classes to add
 * @since 1.0.0
 */
export const getClasses = ( attrs ) => {
  let classes = '';

  const {
    pcxDelay,
    pcxInline,
    pcxClass,
    pcxPosition,
    pcxScrollType,
    pcxScrollStagger,
    pcxTransformOrigin,
    pcxPercentageInStagger,
  } = attrs;

  if ( pcxScrollStagger ) {
    attrs.pcxPercentageIn = pcxPercentageInStagger;
  }
  if ( pcxPosition === 'center-center' ) {
    delete attrs.pcxStrength;
  }
  if ( ! pcxInline ) {
    delete attrs.pcxAlign;
  }
  if ( pcxScrollType === 'in' ) {
    delete attrs.pcxReverse;
    delete attrs.pcxDelayReverse;
  }
  if ( ! pcxDelay && ! attrs.pcxDelayReverse ) {
    delete attrs.pcxDelayBreak;
  }
  if ( pcxClass ) {
    attrs.pcxClass = pcxClass.replace( ' ', '-pcx-' ).trim();
  }

  const len = transformable.length;
  let hasTransform;

  for ( let i = 0; i < len; i++ ) {
    const prop = transformable[ i ];
    if (
      attrs[ prop ] !== undefined &&
      attrs[ prop ] !== defaultValues[ prop ]
    ) {
      hasTransform = true;
      break;
    }
  }

  if ( hasTransform ) {
    const { pcxTransformOrigin: defTransformOrigin } = defaultValues;

    if ( pcxTransformOrigin === defTransformOrigin ) {
      delete attrs.pcxTransformReset;
    }
  } else {
    delete attrs.pcxPerspective;
    delete attrs.pcxTransformOrigin;
    delete attrs.pcxTransformReset;
  }

  delete attrs.pcxEnabled;
  delete attrs.pcxPercentageInStagger;

  let animate;
  for ( const [ key, defValue ] of Object.entries( defaultValues ) ) {
    if ( attrs[ key ] !== undefined && attrs[ key ] !== defValue ) {
      if ( ! animate ) {
        animate = animationCore.indexOf( key ) !== -1;
      }
      classes += ` ${ key }_${ attrs[ key ] }`;
    }
  }

  return { animate, classes };
};

/*
 * @desc calculates the translateX/Y values for the animation based on the user's "strength" selection
 * @param HTMLElement el - the animated element
 * @param HTMLElement container - the animated element's parent container
 * @param string curPosX - "left", "right" or "center"
 * @param string curPosY - "top", "bottom" or "center"
 * @param string strength - "max" = full screen, "full" = content size, "short" = half content size
 * @returns object - the animation's translateX/Y values
 * @since 1.0.0
 */
const getPositions = ( el, container, curPosX, curPosY, strength ) => {
  const pos = { x: 0, y: 0 };
  const { clientWidth, clientHeight } = el;

  if ( strength !== 'max' ) {
    if ( curPosX === 'left' ) {
      pos.x = -clientWidth;
    } else if ( curPosX === 'right' ) {
      pos.x = clientWidth;
    }

    if ( curPosY === 'top' ) {
      pos.y = -clientHeight;
    } else if ( curPosY === 'bottom' ) {
      pos.y = clientHeight;
    }

    if ( strength === 'short' ) {
      pos.x *= 0.5;
      pos.y *= 0.5;
    }
  } else {
    const rect = container.getBoundingClientRect();
    const { width, height } = rect;

    const bottom = Math.ceil( height * 0.5 + clientHeight * 0.5 );
    const right = Math.ceil( width * 0.5 + clientWidth * 0.5 );

    if ( curPosX === 'left' ) {
      pos.x = -right;
    } else if ( curPosX === 'right' ) {
      pos.x = right;
    }

    if ( curPosY === 'top' ) {
      pos.y = -bottom;
    } else if ( curPosY === 'bottom' ) {
      pos.y = bottom;
    }
  }

  return pos;
};

/*
 * @desc determines if the preview should animate
 * @param object props - the current animation's properties
 * @returns - whether the user changed an animatable property or not
 * @since 1.0.0
 */
const shouldAnimate = ( props ) => {
  const len = animationCore.length;
  let animate;

  for ( let i = 0; i < len; i++ ) {
    const key = animationCore[ i ];
    if ( props[ key ] !== defaultValues[ key ] ) {
      animate = true;
      break;
    }
  }

  return animate;
};

/*
 * @desc checks if any prop in a set of props is animatable
 * @param object props - the current animation's properties
 * @returns - whether or not the new set of props should be animated
 * @since 1.0.0
 */
const animatableProps = ( props ) => {
  const keys = Object.keys( props );
  const len = keys.length;

  for ( let i = 0; i < len; i++ ) {
    if ( animatable.indexOf( keys[ i ] ) !== -1 ) {
      return true;
    }
  }

  return false;
};

/*
 * @desc compare props from the componentDidUpdate() event for the animation preview
 * @param object prevProps - the component's previous props
 * @param object nextProps - the component's current props
 * @returns - whether or not the preview should animate
 * @since 1.0.0
 */
const compareProps = ( prevProps, nextProps ) => {
  const len = animatable.length;

  for ( let i = 0; i < len; i++ ) {
    const key = animatable[ i ];

    if ( prevProps[ key ] !== nextProps[ key ] ) {
      return shouldAnimate( nextProps );
    }
  }

  return false;
};

/*
 * @desc compares two generic objects with the same props to see if they match
 * @param object objectA - first object to compare
 * @param object objectB - second object to compare
 * @returns - whether or not the objects are equal
 * @since 1.0.0
 */
const objectValuesEqual = ( objectA, objectB, objectKeys ) => {
  const keys = objectKeys || Object.keys( objectA );
  const len = keys.length;

  for ( let i = 0; i < len; i++ ) {
    const key = keys[ i ];

    if ( objectA[ key ] !== objectB[ key ] ) {
      return false;
    }
  }

  return true;
};

/*
 * @desc cycles the select dropdowns when the mini arrows are clicked
 * @param HTMLOptionsCollection options - options belonging to the select dropdown
 * @param array values - an Array containing all values from the select dropdown
 * @param string value - the select dropdown's current value
 * @param boolean next - whether the next or back button was clicked
 * @returns string - the new value to apply to the select dropdown
 * @since 1.0.0
 */
const getPrevNextSelection = ( options, values, value, next ) => {
  const index = values.indexOf( value );
  const len = values.length;
  let selection;

  if ( next ) {
    selection = index < len - 1 ? index + 1 : 0;
    while ( options[ selection ].disabled ) {
      selection = selection < len - 1 ? selection + 1 : 0;
    }
  } else {
    selection = index > 0 ? index - 1 : len - 1;
    while ( options[ selection ].disabled ) {
      selection = selection > 0 ? selection - 1 : len - 1;
    }
  }

  return values[ selection ];
};

/*
 * @desc resets the initial tab when adding an animation for the first time
 * @since 1.0.0
 */
const checkInitialTab = ( enabled, selectedPreset ) => {
  if ( ! enabled && selectedPreset === 'PcxDefaults' ) {
    const { initialTab } = polishedContentGlobals; // eslint-disable-line no-undef
    polishedContentGlobals.currentTab = initialTab; // eslint-disable-line no-undef
  }
};

/*
 * @desc resets the custom preset selection when editing a new block
 * @since 1.0.0
 */
const resetCustomPreset = () => {
  const { pcxPresets, pcxAnimations } = selectOptions;
  const { PcxCustom } = pcxAnimations;

  if ( PcxCustom ) {
    pcxPresets.splice( 1, 1 );
    delete pcxAnimations.PcxCustom;
  }
};

/*
 * @desc sets the current preset selection to "Custom Values" and defines its values
 * @param object current - the current set of settings the user has applied
 * @since 1.0.0
 */
const setCustomPreset = ( current ) => {
  const { pcxPresets, pcxAnimations } = selectOptions;
  const { PcxCustom } = pcxAnimations;

  if ( ! PcxCustom ) {
    pcxPresets.splice( 1, 0, customPreset );
  }

  const obj = {};
  Object.keys( defaultValues ).forEach( ( key ) => {
    if (
      current[ key ] !== undefined &&
      current[ key ] !== defaultValues[ key ]
    ) {
      obj[ key ] = current[ key ];
    }
  } );

  pcxAnimations.PcxCustom = obj;
};

/*
 * @desc tries to match the current settings against the existing presets and then sets the correct preset selection based on the results
 * @param object current - the current set of settings the user has applied
 * @returns object - {selectedPreset:String, hideCreatePresetBtn:Boolean, hideDeleteBtn:Boolean}
 * @since 1.0.0
 */
const getPresetSelection = ( props, resetCustom ) => {
  if ( resetCustom ) {
    resetCustomPreset();
  }

  const current = { ...props };
  delete current.pcxEnabled;

  const defs = { ...mainDefaults };
  const { pcxAnimations } = selectOptions;
  const animations = { ...defs, ...pcxAnimations };

  let hideCreatePresetBtn = true;
  let hideDeleteBtn = true;
  let selectedPreset;
  let presetFound;

  delete animations.PcxCustom;

  for ( const [ key, preset ] of Object.entries( animations ) ) {
    const thePreset = { ...defaultValues, ...preset };
    delete thePreset.pcxEnabled;

    let isDefault = true;
    const keys = Object.keys( thePreset );
    const len = keys.length;

    for ( let i = 0; i < len; i++ ) {
      if ( current[ keys[ i ] ] !== thePreset[ keys[ i ] ] ) {
        isDefault = false;
        break;
      }
    }

    if ( isDefault ) {
      if ( key === 'PcxDefaults' ) {
        selectedPreset = 'PcxDefaults';
      } else {
        hideDeleteBtn = /^[A-Z]/.test( key );
        selectedPreset = key;
      }
      presetFound = true;
      break;
    }
  }

  if ( ! presetFound ) {
    setCustomPreset( current );
    selectedPreset = 'PcxCustom';
    hideCreatePresetBtn = false;
  }

  return {
    selectedPreset,
    hideCreatePresetBtn,
    hideDeleteBtn,
  };
};

/*
 * @desc add or remove the "Custom Presets" label depending on if custom presets exist or not
 * @param add boolean - whether the Custom Presets label should be added or removed
 * @returns boolean - if additional custom presets still exist after a removal
 * @since 1.0.0
 */
const addRemoveCustomLabel = ( add ) => {
  const { pcxPresets } = selectOptions;
  const len = pcxPresets.length - 1;

  let hasLabel;
  let index;

  for ( let i = len; i > 0; i-- ) {
    if ( pcxPresets[ i ].value === 'PcxCustomPresets' ) {
      hasLabel = true;
      index = i;
      break;
    }
  }

  if ( add ) {
    if ( ! hasLabel ) {
      pcxPresets.push( {
        label: `*** ${ __(
          'Custom Presets',
          'polished-content'
        ) } ***`,
        value: 'PcxCustomPresets',
        disabled: true,
      } );
    }
  } else {
    let hasCustom;
    for ( let i = len; i > 0; i-- ) {
      if ( /^[A-Z]/.test( pcxPresets[ i ].value ) === false ) {
        hasCustom = true;
        break;
      }
    }

    if ( ! hasCustom ) {
      pcxPresets.splice( index, 1 );
      return true;
    }

    return false;
  }
};

/*
 * @desc adds a new preset on Ajax save
 * @param string title - the title of the preset to add
 * @param object settings - the settings belonging to the new custom preset
 * @returns string - the sanitized title for the preset
 * @since 1.0.0
 */
const addPreset = ( title, settings ) => {
  const { pcxPresets, pcxAnimations } = selectOptions;
  const key = title.trim();

  addRemoveCustomLabel( true );
  pcxAnimations[ key ] = settings;

  pcxPresets.push( {
    label: title,
    value: key,
  } );

  delete pcxAnimations.PcxCustom;
  const len = pcxPresets.length;

  for ( let i = 0; i < len; i++ ) {
    const preset = pcxPresets[ i ];
    const { value } = preset;

    if ( value === 'PcxCustom' ) {
      pcxPresets.splice( i, 1 );
      break;
    }
  }

  return key;
};

/*
 * @desc helps determine which of the reset buttons dhouls be shown
 * @param object original - the settings when the user first selected the block
 * @param object current - the user's current settings after making a change
 * @param object defaults - the original defaalts to get the keys from
 * @returns boolean - whether or not the current settings match the defaalts
 * @since 1.0.0
 */
const checkChanges = ( original, current, defaults ) => {
  const keys = Object.keys( defaults || original );
  const len = keys.length;

  for ( let i = 0; i < len; i++ ) {
    const key = keys[ i ];
    if ( original[ key ] !== current[ key ] ) {
      return true;
    }
  }
  return false;
};

/*
 * @desc makes a copy of the settings each time the user edits the animation
         for the unbo button, copying only the animation properties
 * @param object attributes - the block's attributes
 * @returns object - the copied settings
 * @since 1.0.0
*/
const getOriginalSettings = ( attributes ) => {
  const original = {};
  Object.keys( defaultValues ).forEach( ( key ) => {
    original[ key ] = attributes[ key ];
  } );

  delete original.pcxEnabled;
  return original;
};

/*
 * @desc removes a preset on Ajax delete
 * @param string key - the presets unique key
 * @param object settings - the current user settings
 * @returns object - {selectedPreset:String, hideCreatePresetBtn:Boolean, hideDeleteBtn:Boolean}
 * @since 1.0.0
 */
const removePreset = ( key, settings ) => {
  const { pcxPresets, pcxAnimations } = selectOptions;
  const total = pcxPresets.length - 1;

  delete pcxAnimations[ key ];

  for ( let i = total; i > 0; i-- ) {
    if ( pcxPresets[ i ].value === key ) {
      pcxPresets.splice( i, 1 );
      break;
    }
  }

  addRemoveCustomLabel();

  const nextPreset = getPresetSelection( settings );
  const { selectedPreset } = nextPreset;

  return selectedPreset;
};

/*
 * @desc converts normal property name to post meta name
 * @param string prop - the prop name to convert
 * @returns string - the converted name
 * @since 1.0.0
 */
const toConvertedProp = ( prop ) => {
  const name = prop
    .replace( /^\w/, ( c ) => c.toUpperCase() )
    .replace( /_([a-z])/g, ( c ) => c[ 1 ].toUpperCase() );
  return `pcx${ name }`;
};

export {
  getPositions,
  getPresetSelection,
  getPrevNextSelection,
  getOriginalSettings,
  objectValuesEqual,
  checkInitialTab,
  toConvertedProp,
  addPreset,
  removePreset,
  shouldAnimate,
  compareProps,
  checkChanges,
  verifyObjects,
  animatableProps,
};
