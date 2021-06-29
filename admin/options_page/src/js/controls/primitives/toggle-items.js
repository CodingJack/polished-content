/**
 * External dependencies.
 */

import React from 'react';

const { __ } = wp.i18n;

const ToggleItems = ( { namespace, list, callback, prop, data } ) => {
  const items = Object.keys( list );

  const len = items.length;
  let checked = false;

  for ( let i = 0; i < len; i++ ) {
    if ( data.indexOf( items[ i ] ) !== -1 ) {
      checked = true;
      break;
    }
  }

  const onClick = () => {
    callback( prop, data, items.join( ' ' ), 'checkbox', ! checked );
  };

  return (
    <button
      type="button"
      className={ `button ${ namespace }-toggle` }
      onClick={ onClick }
    >
      { __( 'toggle', 'polished-content' ) }
    </button>
  );
};

export default ToggleItems;
