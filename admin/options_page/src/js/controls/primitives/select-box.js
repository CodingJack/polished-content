/* eslint jsx-a11y/no-onchange: 0 */

/**
 * External dependencies.
 */

import React from 'react';

const SelectBox = ( { namespace, list, type, prop, data, callback } ) => {
  const onChange = ( e ) => {
    callback( prop, data, e.target.value, type );
  };

  return (
    <select
      className={ `${ namespace }-input components-select-control__input` }
      value={ data }
      onChange={ onChange }
    >
      { Object.keys( list ).map( ( key ) => {
        const name = list[ key ];
        return (
          <option key={ `${ namespace }-${ key }` } value={ key }>
            { name }
          </option>
        );
      } ) }
    </select>
  );
};

export default SelectBox;
