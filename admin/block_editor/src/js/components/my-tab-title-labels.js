/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */

import { namespace } from '../../../../../shared/js/data';

const { defaultSettings } = polishedContentGlobals; // eslint-disable-line no-undef

let { viewportWidths } = defaultSettings;

// in case the data is corrupted
if ( ! Array.isArray( viewportWidths ) || viewportWidths.length !== 4 ) {
  viewportWidths = [ 1240, 1024, 768, 480 ];
}

export const HelpSettingsLink = ( { text } ) => {
  return (
    <>
      { `${ text } ` }
      <a
        href="options-general.php?page=polished-content%2Fadmin%2Fadmin.php"
        target="_blank"
      >
        { __( 'settings page', 'polished-content' ) }
      </a>
    </>
  );
};

export const LabelWithIcon = ( { title, icon } ) => {
  return (
    <>
      <span className={ `dashicons dashicons-${ icon }` }></span>
      { title }
    </>
  );
};

export const ViewportText = ( { title, index } ) => {
  const size = ` (${ viewportWidths[ index ] })`;

  return (
    <>
      <LabelWithIcon title={ title } icon={ title.toLowerCase() } />
      <span className={ `${ namespace }-viewsize` }>{ size }</span>
    </>
  );
};
