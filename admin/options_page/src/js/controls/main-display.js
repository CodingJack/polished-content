/**
 * External dependencies.
 */

import React from 'react';

const { useState } = React;

/**
 * Internal dependencies.
 */
import TabButtons from './tab-buttons';
import DisplayPage from './display-page';

const { subMenus } = polishedContentGlobals; // eslint-disable-line no-undef

/*
 * used for top level pages and also sub level pages.
 */
const MainDisplay = ( { props, pages, changePage: onChanges, menuIndex } ) => {
  let currentIndex;

  if ( menuIndex === undefined ) {
    currentIndex = 0;
  } else {
    currentIndex = menuIndex + 1;
  }

  const [ currentPage, changePage ] = useState(
    subMenus[ currentIndex ] !== undefined ? subMenus[ currentIndex ] : 0
  );

  const { namespace, activateScreenshots } = props;

  let changePages = [ changePage ];
  if ( onChanges ) {
    changePages = onChanges.concat( changePages );
  }

  return (
    <>
      <TabButtons
        namespace={ namespace }
        pages={ pages }
        activateScreenshots={ activateScreenshots }
        currentPage={ currentPage }
        changePage={ changePages }
        menuIndex={ currentIndex }
      />
      <DisplayPage
        props={ props }
        page={ pages[ currentPage ] }
        changePage={ changePages }
        menuIndex={ currentIndex }
      />
    </>
  );
};

export default MainDisplay;
