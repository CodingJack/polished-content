/**
 * External dependencies.
 */

import React from 'react';

const CheckRadios = ( {
  namespace,
  items,
  list,
  prop,
  data,
  type,
  callback,
} ) => {
  return Object.keys( items ).map( ( key, i ) => {
    const name = items[ key ];

    const checked = data.indexOf( name ) !== -1 ? 'checked' : null;
    const fieldName = type === 'checkbox' ? null : prop;

    const onChange = ( e ) => {
      callback( prop, data, name, type, e.target.checked );
    };

    return (
      <div
        key={ `${ name }-${ i }` }
        className={ `${ namespace }-input` }
      >
        { ! checked && (
          <input
            type={ type }
            value={ name }
            name={ fieldName }
            onChange={ onChange }
          />
        ) }
        { checked && (
          <input
            type={ type }
            value={ name }
            name={ fieldName }
            onChange={ onChange }
            checked
          />
        ) }
        { list[ name ] }
      </div>
    );
  } );
};

export default CheckRadios;
