/**
 * External dependencies.
 */

import React from 'react';

/**
 * Internal dependencies.
 */

import DisplayPanel from './display-panel';
import HTMLContent from './primitives/html-content';

const DisplayPage = ( { props, page, changePage, menuIndex } ) => {
  const { namespace } = props;

  const { type, content } = page;

  return (
    <div className={ `${ namespace }-pages` }>
      { content.map( ( panel, index ) => {
        if ( type !== 'content' ) {
          return (
            <DisplayPanel
              key={ `${ namespace }-panel-${ index }` }
              type={ type }
              props={ props }
              panel={ panel }
              changePage={ changePage }
              menuIndex={ menuIndex }
            />
          );
        }
        return (
          <HTMLContent
            key={ `${ namespace }-panel-${ index }` }
            namespace={ namespace }
            html={ panel }
            changePage={ changePage }
            menuIndex={ menuIndex }
          />
        );
      } ) }
    </div>
  );
};
export default DisplayPage;
