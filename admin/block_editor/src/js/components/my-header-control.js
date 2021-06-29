/**
 * External dependencies.
 */
import React from 'react';

/**
 * WordPress dependencies.
 */
const { forwardRef } = wp.element;

/**
 * Internal dependencies.
 */
import MyPreviewControl from './my-preview-control';
import MyPresetsControl from './my-presets-control';

const MyHeaderControl = forwardRef( ( { block }, animatedElements ) => {
  return (
    <>
      <MyPreviewControl block={ block } ref={ animatedElements } />
      <MyPresetsControl block={ block } />
    </>
  );
} );

export default MyHeaderControl;
