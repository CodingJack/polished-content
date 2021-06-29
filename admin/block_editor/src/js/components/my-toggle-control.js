/**
 * External dependencies
 */
 import React from 'react';

/**
 * WordPress dependencies.
 */

const { ToggleControl } = wp.components;

/**
 * Internal dependencies.
 */
import { namespace } from '../../../../../shared/js/data';

const MyToggleControl = ( {
  prop,
  label,
  checked,
  callback,
  className: clas,
  help,
} ) => {
  const className = ! clas ? '' : ` ${ className }`;

  return (
    <ToggleControl
      label={ label }
      className={ `${ namespace }-toggle${ className }` }
      checked={ checked }
      onChange={ ( isChecked ) => callback( isChecked, prop ) }
      help={ help }
    />
  );
};

export default MyToggleControl;
