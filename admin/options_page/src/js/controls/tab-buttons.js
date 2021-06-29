/**
 * External dependencies.
 */

import React from 'react';

/**
 * Internal dependencies.
 */
const { subMenus } = polishedContentGlobals; // eslint-disable-line no-undef

const TabButtons = ( {
  namespace,
  pages,
  currentPage,
  changePage,
  activateScreenshots,
  menuIndex,
} ) => {
  return (
    <nav className="nav-tab-wrapper wp-clearfix">
      { pages.map( ( page, index ) => {
        const { title, type } = page;

        const active = currentPage === index ? ' nav-tab-active' : '';

        const onClick = ( e ) => {
          e.preventDefault();

          if ( type === 'screenshots' ) {
            activateScreenshots( false, true );
            return;
          }

          if ( menuIndex !== undefined && menuIndex > 0 ) {
            subMenus[ menuIndex ] = index;
          }
          changePage[ menuIndex ]( index );
        };

        return (
          <button
            type="button"
            className={ `nav-tab${ active }` }
            key={ `${ namespace }-page-${ index }` }
            onClick={ onClick }
          >
            { title }
          </button>
        );
      } ) }
    </nav>
  );
};

export default TabButtons;
