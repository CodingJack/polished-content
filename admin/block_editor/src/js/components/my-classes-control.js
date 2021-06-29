/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { TextControl, ToggleControl } = wp.components;

const { useState } = wp.element;

/**
 * Internal dependencies.
 */
import { namespace, defaultValues } from '../../../../../shared/js/data';

import { getClasses } from '../utils';
import { HelpSettingsLink } from './my-tab-title-labels';

const MyClassesControl = ( { block } ) => {
  const [ enabled, toggleEnabled ] = useState( false );

  let currentClasses;
  let enabledClass = '';
  let onChange;
  let onFocus;

  if ( enabled ) {
    const { props: attrs } = block;
    const curAnimation = {};

    Object.keys( defaultValues ).forEach( ( key ) => {
      curAnimation[ key ] = attrs[ key ];
    } );

    const settings = getClasses( curAnimation );
    const { classes, animate } = settings;

    currentClasses = animate ? `polished-content${ classes }` : '';
    enabledClass = ` ${ namespace }-classes-enabled`;

    onChange = () => {};
    onFocus = ( e ) => e.target.select();
  }

  return (
    <>
      <ToggleControl
        label={ __( 'Copy Animation Classes', 'polished-content' ) }
        className={ `${ namespace }-toggle-classes${ enabledClass }` }
        checked={ enabled }
        onChange={ ( checked ) => toggleEnabled( checked ) }
        help={ __(
          "Add these classes to any of your site's page/post content to animate it with the current settings",
          'polished-content'
        ) }
      />
      { enabled && (
        <TextControl
          label="Current Animation Classes"
          className={ `${ namespace }-text-input` }
          value={ currentClasses }
          onChange={ onChange }
          onFocus={ onFocus }
          help={
            <HelpSettingsLink
              text={ __(
                "When adding animation classes to non-Block content the plugin's script can be loaded manually from the ",
                'polished-content'
              ) }
            />
          }
        />
      ) }
    </>
  );
};

export default MyClassesControl;
