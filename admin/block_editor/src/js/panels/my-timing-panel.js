/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { PanelRow } = wp.components;

/**
 * Internal dependencies.
 */
import MyTextControl from '../components/my-text-control';
import MySelectControl from '../components/my-select-control';
import MyToggleControl from '../components/my-toggle-control';
import MySelectWrapper from '../components/my-select-wrapper';

import { HelpSettingsLink } from '../components/my-tab-title-labels';

import { namespace } from '../../../../../shared/js/data';

const MyTimingPanel = ( { block } ) => {
  const { props, updateProp } = block;

  const {
    pcxReverse,
    pcxDuration,
    pcxDelay,
    pcxDelayReverse,
    pcxDelayBreak,
    pcxEasing,
    pcxEaseDirection,
    pcxEaseReverse,
    pcxScrollType,
  } = props;

  let easingMessage;
  const easeCheck = pcxEasing === 'Back' || pcxEasing === 'Elastic';

  if ( easeCheck && pcxReverse && pcxScrollType !== 'in' ) {
    easingMessage = __(
      'This easing function can be visually glitchy when combined with the "Auto Reverse" option',
      'polished-content'
    );
  }

  return (
    <>
      <MySelectControl
        prop="pcxEasing"
        label={ __( 'Easing Function', 'polished-content' ) }
        value={ pcxEasing }
        callback={ updateProp }
        help={ easingMessage }
      />
      <MyTextControl
        prop="pcxDuration"
        label={ __( 'Animation Duration (ms)', 'polished-content' ) }
        value={ pcxDuration }
        callback={ updateProp }
        min={ 200 }
        max={ 50000 }
        step={ 50 }
      />
      <MySelectControl
        prop="pcxEaseDirection"
        label={ __( 'Easing Type', 'polished-content' ) }
        value={ pcxEaseDirection }
        callback={ updateProp }
      />
      <div className={ `${ namespace }-spacer` }>
        <PanelRow>
          <MyTextControl
            prop="pcxDelay"
            label={ __( 'Timing Delay', 'polished-content' ) }
            value={ pcxDelay }
            callback={ updateProp }
            min={ 0 }
            max={ 10000 }
            step={ 50 }
          />
          <MyTextControl
            prop="pcxDelayReverse"
            label={ __( 'Reverse Delay', 'polished-content' ) }
            value={ pcxDelayReverse }
            callback={ updateProp }
            min={ 0 }
            max={ 10000 }
            step={ 50 }
          />
        </PanelRow>
      </div>
      <MySelectWrapper
        prop="pcxDelayBreak"
        label={ __( 'Disable Delays at...', 'polished-content' ) }
        customLabel={ __( 'Disable Delay Width', 'polished-content' ) }
        value={ pcxDelayBreak }
        callback={ updateProp }
        component="text"
        custom="custom"
        help={
          <HelpSettingsLink
            text={ __(
              "Remove delays at a certain viewport width set in the plugin's",
              'polished-content'
            ) }
          />
        }
      />
      { pcxEaseDirection !== 'easeInOut' && (
        <MyToggleControl
          prop="pcxEaseReverse"
          label={ __( 'Reverse Easing', 'polished-content' ) }
          checked={ pcxEaseReverse }
          callback={ updateProp }
          help={ __(
            'easeOut will become easeIn when animating out and vice versa',
            'polished-content'
          ) }
        />
      ) }
    </>
  );
};

export default MyTimingPanel;
