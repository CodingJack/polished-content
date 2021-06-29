/**
 * External dependencies.
 */

import React from 'react';

/**
 * Internal dependencies.
 */
import GroupedText from './grouped-text';
import ParseHTML from './parse-html';

const { screenshotsDirectory } = polishedContentGlobals; // eslint-disable-line no-undef

const ParagraphContent = ( {
  namespace,
  paragraph,
  isText,
  changePage,
  menuIndex,
} ) => {
  if ( isText ) {
    if ( typeof paragraph === 'object' ) {
      return (
        <GroupedText
          namespace={ namespace }
          paragraph={ paragraph }
          changePage={ changePage }
          menuIndex={ menuIndex }
        />
      );
    }

    return (
      <ParseHTML
        namespace={ namespace }
        text={ paragraph }
        changePage={ changePage }
        menuIndex={ menuIndex }
      />
    );
  }

  // content is an array of images
  return paragraph.map( ( contentImage, index ) => {
    const { alt, file } = contentImage;

    return (
      <img
        key={ `${ namespace }-image-${ index }` }
        alt={ alt }
        src={ `${ screenshotsDirectory }/img/${ file }` }
      />
    );
  } );
};

export default ParagraphContent;
