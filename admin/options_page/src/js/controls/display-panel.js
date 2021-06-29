/**
 * External dependencies.
 */

import React from 'react';

/**
 * Internal dependencies.
 */
import MainDisplay from './main-display';
import OptionsComponent from './options-component';

const DisplayPanel = ( { props, panel, type, changePage, menuIndex } ) => {
  const { namespace } = props;

  const { title, icon, pages, options, suffix, subtype } = panel;

  const sufx = suffix || '';
  const extraClass = subtype ? ` ${ namespace }-${ subtype }` : '';

  return (
    <div className={ `${ namespace }${ extraClass }` } data-type={ type }>
      { title && (
        <h2 className={ `${ namespace }-colors` }>
          { `${ title.charAt( 0 ).toUpperCase() }${ title.slice(
            1
          ) }${ sufx }` }
          <span className={ `dashicons dashicons-${ icon }` }></span>
        </h2>
      ) }
      <div className={ `${ namespace }-wrap` }>
        { type === 'options' && (
          <OptionsComponent
            props={ props }
            options={ options }
            title={ title }
          />
        ) }
        { type === 'html' && (
          <MainDisplay
            props={ props }
            pages={ pages }
            changePage={ changePage }
            menuIndex={ menuIndex }
          />
        ) }
      </div>
    </div>
  );
};

export default DisplayPanel;
