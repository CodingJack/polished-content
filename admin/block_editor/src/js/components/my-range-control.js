/**
 * External dependencies.
 */
 import React from 'react';

/**
 * Internal dependencies.
 */
import MyInputRange from './my-input-range';

import { namespace, defaultValues } from '../../../../../shared/js/data';

const MyRangeControl = ( {
  prop,
  label,
  value,
  help,
  metaProp,
  callback,
  defValue,
  min = 0,
  max = 100,
  step = 5,
} ) => {
  const onChange = ( val ) => {
    let newVal = parseInt( val, 10 );
    if ( isNaN( newVal ) ) {
      newVal = '';
    }
    callback( newVal, prop );
  };

  const onReset = () => {
    const def = defValue === undefined ? defaultValues[ prop ] : defValue;
    callback( def, prop );
  };

  const defProp = metaProp || prop;
  const isDisabled = parseInt( value, 10 ) === defaultValues[ defProp ];

  return (
    <MyInputRange
      className={ `${ namespace }-ranges` }
      label={ label }
      value={ value }
      onChange={ onChange }
      onReset={ onReset }
      max={ max }
      min={ min }
      step={ step }
      afterIcon="no-alt"
      allowReset={ true }
      disabled={ isDisabled }
      help={ help }
    />
  );
};

export default MyRangeControl;
